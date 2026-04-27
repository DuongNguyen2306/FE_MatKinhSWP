import { useQuery } from "@tanstack/react-query";
import StoreHeader from "@/components/home/store-header";
import ShopShowcaseCard from "@/components/shop/shop-showcase-card";
import SiteFooter from "@/components/layout/site-footer";
import { getApiErrorMessage } from "@/lib/api-error";
import { comboPreviewImage } from "@/lib/combo-display";
import { fetchCombos } from "@/services/combo.service";
import PageSectionHeading from "@/components/layout/page-section-heading";

function formatMoney(v: unknown): string {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  if (!Number.isFinite(n)) {
    return "—";
  }
  return `${Math.round(n).toLocaleString("vi-VN")}đ`;
}

export default function CombosPage() {
  const combosQuery = useQuery({
    queryKey: ["combos", "list"],
    queryFn: () => fetchCombos({ page: 1, limit: 50 }),
  });
  const combos = combosQuery.data?.items ?? [];
  const pagination = combosQuery.data?.pagination;
  const currentPage = typeof pagination?.page === "number" ? pagination.page : 1;
  const totalPages = typeof pagination?.total_pages === "number" ? pagination.total_pages : 1;
  const totalItems = typeof pagination?.total === "number" ? pagination.total : combos.length;

  return (
    <div className="min-h-screen bg-[#f4f1eb]">
      <StoreHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <PageSectionHeading
          kicker="Gói ưu đãi"
          description="Các combo được tối ưu sẵn gọng + tròng — phù hợp tư vấn nhanh tại cửa hàng và online."
        >
          Combo gọng + tròng
        </PageSectionHeading>

        {combosQuery.isPending ? (
          <p className="mt-8 text-center text-sm font-medium text-stone-500">Đang tải combos…</p>
        ) : combosQuery.isError ? (
          <p className="mt-8 rounded-lg border border-red-200/80 bg-red-50 p-4 text-sm text-red-800">
            {getApiErrorMessage(combosQuery.error, "Không tải được danh sách combo.")}
          </p>
        ) : combos.length === 0 ? (
          <div className="mt-8 rounded-sm border border-dashed border-stone-300/80 bg-stone-50/80 p-10 text-center text-sm text-stone-600">
            Chưa có combo nào.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {combos.map((combo) => {
              const id = String(combo._id ?? combo.id ?? combo.slug ?? "");
              const slug = String(combo.slug ?? "");
              const image = comboPreviewImage(combo);
              return (
                <ShopShowcaseCard
                  key={id}
                  variant="luxe"
                  to={`/combos/${encodeURIComponent(slug || id)}`}
                  title={combo.name ?? "Combo"}
                  priceText={formatMoney(combo.combo_price)}
                  imageUrl={image}
                  titleClassName="mt-3 line-clamp-2 !text-left !normal-case text-lg font-semibold text-stone-800"
                  priceClassName="mt-3 !text-left text-2xl font-bold text-[#6d4c41]"
                />
              );
            })}
          </div>
        )}

        <div className="mt-10 flex flex-col gap-4 border-t border-stone-200/60 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-stone-600">
            Tổng: <span className="font-semibold text-[#1a1d28]">{totalItems}</span> sản phẩm
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="min-w-[5.5rem] border border-stone-300/90 bg-white/90 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition duration-300 ease-in-out hover:border-[#2BBBAD]/45 hover:text-[#2BBBAD] disabled:opacity-45"
              disabled={currentPage <= 1 || combosQuery.isFetching}
            >
              Trước
            </button>
            <button
              type="button"
              className="min-w-[5.5rem] border border-stone-300/90 bg-white/90 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition duration-300 ease-in-out hover:border-[#2BBBAD]/45 hover:text-[#2BBBAD] disabled:opacity-45"
              disabled={currentPage >= totalPages || combosQuery.isFetching}
            >
              Sau
            </button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
