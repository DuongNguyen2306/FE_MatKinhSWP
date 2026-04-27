import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { mapVariantApiError } from "@/utils/errorMapper";
import { useProductVariants } from "@/features/products/variants/useProductVariants";
import VariantList from "@/features/products/variants/VariantList";

/** Biến thể chỉ đọc + nút Nhập hàng (điều hướng phiếu nhập kho kèm variant_id). */
export default function OpsProductVariantsPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  if (!productId) {
    return <p className="text-slate-600">Thiếu productId.</p>;
  }

  const variantsQuery = useProductVariants(productId);
  const items = variantsQuery.data ?? [];
  const parsedListError = variantsQuery.error ? mapVariantApiError(variantsQuery.error).message : null;

  return (
    <div>
      <Link to="/admin/ops/catalog/products" className="text-sm text-teal-600 hover:underline">
        ← Sản phẩm
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Biến thể sản phẩm</h1>
      <p className="text-sm text-slate-500">Product ID: {productId}</p>

      <VariantList
        items={items}
        loading={variantsQuery.isPending}
        error={parsedListError}
        onRetry={() => variantsQuery.refetch()}
        onCreate={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        actionsMode="inbound_only"
        onInbound={(variant) => {
          const variantId = String(variant._id ?? variant.id ?? "").trim();
          if (!variantId) {
            toast.error("Thiếu thông tin variant để tạo phiếu nhập.");
            return;
          }
          navigate(`/admin/inventory/receipts?variant_id=${encodeURIComponent(variantId)}&open_create=1`);
        }}
      />
    </div>
  );
}
