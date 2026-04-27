import StoreHeader from "@/components/home/store-header";
import SiteFooter from "@/components/layout/site-footer";

export default function ProductIntroPage() {
  return (
    <div className="min-h-screen bg-[#f4f1eb]">
      <StoreHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7b4f]">OptiLens</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Giới thiệu sản phẩm bán</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            OptiLens cung cấp các dòng sản phẩm mắt kính dành cho nhu cầu hằng ngày và thời trang, tập trung vào trải
            nghiệm đeo thoải mái, độ bền và mức giá phù hợp. Danh mục được phân loại rõ theo từng nhóm để dễ tư vấn
            và lựa chọn khi mua online hoặc tại cửa hàng.
          </p>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Gọng kính</h2>
            <p className="mt-2 text-sm text-slate-600">Đa dạng kiểu dáng kim loại và nhựa, phù hợp nhiều khuôn mặt.</p>
          </article>
          <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Tròng kính</h2>
            <p className="mt-2 text-sm text-slate-600">Tùy chọn chống chói, chống ánh sáng xanh và tròng theo toa.</p>
          </article>
          <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Phụ kiện</h2>
            <p className="mt-2 text-sm text-slate-600">Các sản phẩm đi kèm giúp bảo quản và sử dụng kính thuận tiện hơn.</p>
          </article>
          <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Combo</h2>
            <p className="mt-2 text-sm text-slate-600">Gói gọng + tròng tối ưu theo nhu cầu với mức giá ưu đãi.</p>
          </article>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
