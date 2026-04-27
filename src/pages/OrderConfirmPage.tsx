import { useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/services/shop.service";
import { getApiErrorMessage } from "@/lib/api-error";
import { cartItemsArrayFromResponse } from "@/lib/cart-utils";
import {
  cartLineImage,
  cartLineLensParams,
  cartLineProductName,
  cartLineQuantity,
  cartLineSelectionKey,
  cartLineUnitPrice,
  cartLineVariantLabel,
  cartRowRecord,
  formatPriceVnd,
  isComboItem,
} from "@/lib/cart-line-display";
import StoreHeader from "@/components/home/store-header";
import SiteFooter from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";

const LENS_FIELD_LABELS: Record<string, string> = {
  sph_right: "Sph mắt phải",
  sph_left: "Sph mắt trái",
  cyl_right: "Cyl mắt phải",
  cyl_left: "Cyl mắt trái",
  axis_right: "Trục mắt phải",
  axis_left: "Trục mắt trái",
  add_right: "Add mắt phải",
  add_left: "Add mắt trái",
  pd: "PD",
  pupillary_distance: "Khoảng cách đồng tử",
  note: "Ghi chú",
};

function LensParamsSummary({ params }: { params: Record<string, unknown> }) {
  const entries = Object.entries(params).filter(([, v]) => {
    if (v === undefined || v === null) return false;
    const s = String(v).trim();
    return s.length > 0;
  });
  if (entries.length === 0) {
    return <p className="text-xs text-slate-500">Chưa nhập thông số tròng kính.</p>;
  }
  return (
    <div className="mt-2 rounded-md border border-slate-100 bg-slate-50/80 px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Thông số tròng (lens params)</p>
      <dl className="mt-2 grid gap-1.5 text-xs text-slate-800 sm:grid-cols-2">
        {entries.map(([key, value]) => (
          <div key={key} className="flex flex-wrap gap-x-2 gap-y-0.5">
            <dt className="text-slate-600">{LENS_FIELD_LABELS[key] ?? key}</dt>
            <dd className="font-medium">{String(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function OrderConfirmPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const linesQueryValue = searchParams.get("lines");

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
  });

  const rows = cartItemsArrayFromResponse(cartQuery.data);

  const selectedLineKeySet = useMemo(() => {
    if (!linesQueryValue?.trim()) {
      return null as Set<string> | null;
    }
    return new Set(
      linesQueryValue
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }, [linesQueryValue]);

  /** Giữ index gốc trong giỏ để khóa ổn định và khớp `?lines=` */
  const confirmEntries = useMemo(() => {
    if (!selectedLineKeySet) {
      return rows.map((item, rowIndex) => ({ item, rowIndex }));
    }
    const out: { item: unknown; rowIndex: number }[] = [];
    rows.forEach((item, rowIndex) => {
      const row = cartRowRecord(item);
      if (selectedLineKeySet.has(cartLineSelectionKey(row, rowIndex))) {
        out.push({ item, rowIndex });
      }
    });
    return out;
  }, [rows, selectedLineKeySet]);

  const subtotal = useMemo(() => {
    return confirmEntries.reduce<number>((sum, { item }) => {
      const row = cartRowRecord(item);
      return sum + cartLineUnitPrice(row) * cartLineQuantity(row);
    }, 0);
  }, [confirmEntries]);

  const checkoutHref = useMemo(() => {
    if (linesQueryValue?.trim()) {
      return `/checkout?lines=${encodeURIComponent(linesQueryValue.trim())}`;
    }
    return "/checkout";
  }, [linesQueryValue]);

  const handleContinue = () => {
    navigate(checkoutHref);
  };

  return (
    <div className="min-h-screen bg-[#f4f1eb]">
      <StoreHeader />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/cart" className="text-sm text-[#2bb6a3] hover:underline">
          ← Quay lại giỏ hàng
        </Link>

        <h1 className="mt-6 text-2xl font-bold uppercase tracking-wide text-slate-900 sm:text-3xl">Xác nhận đơn hàng</h1>
        <p className="mt-2 text-sm text-slate-600">
          Vui lòng kiểm tra lại sản phẩm, số lượng, phiên bản (màu / size) và thông số tròng trước khi điền thông tin giao hàng.
        </p>

        {cartQuery.isPending ? (
          <p className="mt-10 text-slate-600">Đang tải giỏ hàng…</p>
        ) : cartQuery.isError ? (
          <p className="mt-10 text-red-600">{getApiErrorMessage(cartQuery.error, "Không tải được giỏ hàng.")}</p>
        ) : rows.length === 0 ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-700">Giỏ hàng đang trống.</p>
            <Link
              to="/"
              className="mt-4 inline-flex rounded-full bg-[#2bb6a3] px-6 py-2.5 text-sm font-semibold text-white hover:brightness-[0.98]"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : confirmEntries.length === 0 ? (
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50/60 p-6 text-sm text-amber-900">
            <p>Không có sản phẩm nào khớp với lựa chọn thanh toán.</p>
            <Link to="/cart" className="mt-2 inline-block font-semibold text-[#2bb6a3] underline">
              Quay lại giỏ hàng
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-8 space-y-6">
              {confirmEntries.map(({ item, rowIndex }) => {
                const row = cartRowRecord(item);
                const key = cartLineSelectionKey(row, rowIndex);
                const name = cartLineProductName(row);
                const variant = cartLineVariantLabel(row);
                const image = cartLineImage(row);
                const quantity = cartLineQuantity(row);
                const unit = cartLineUnitPrice(row);
                const lineTotal = unit * quantity;
                const lensParams = cartLineLensParams(row);
                const comboLine = isComboItem(row);

                return (
                  <li key={key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex gap-4">
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                        {image ? (
                          <img src={image} alt="" className="h-full w-full object-contain p-1" />
                        ) : (
                          <span className="grid h-full place-items-center text-[10px] text-slate-400">Ảnh</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold uppercase leading-snug text-slate-900">{name}</p>
                        {comboLine ? (
                          <p className="mt-1 text-xs font-medium text-[#2bb6a3]">Combo gọng + tròng</p>
                        ) : null}
                        {variant ? (
                          <p className="mt-1 text-sm text-slate-700">
                            <span className="text-slate-500">Phiên bản: </span>
                            {variant}
                          </p>
                        ) : null}
                        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-slate-100 pt-3">
                          <div className="text-sm text-slate-700">
                            <span className="text-slate-500">Số lượng: </span>
                            <span className="font-semibold text-slate-900">{quantity}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">Đơn giá {formatPriceVnd(unit)}</p>
                            <p className="text-lg font-bold text-slate-900">{formatPriceVnd(lineTotal)}</p>
                          </div>
                        </div>
                        <LensParamsSummary params={lensParams} />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold text-slate-800">Tạm tính ({confirmEntries.length} mặt hàng)</span>
                <span className="text-2xl font-bold text-slate-900">{formatPriceVnd(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">Phí vận chuyển và thanh toán sẽ chọn ở bước tiếp theo.</p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                className="h-12 rounded-full bg-[#2bb6a3] px-8 text-sm font-semibold uppercase tracking-wide text-white hover:brightness-[0.98]"
                onClick={() => handleContinue()}
              >
                Tôi xác nhận và tiếp tục
              </Button>
              <Link
                to="/cart"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Quay lại chỉnh sửa giỏ hàng
              </Link>
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
