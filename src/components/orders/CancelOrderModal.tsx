import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CancelOrderModalProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function CancelOrderModal({ open, loading = false, onClose, onConfirm }: CancelOrderModalProps) {
  const [reason, setReason] = useState("");

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Xác nhận hủy đơn hàng</h3>
            <p className="mt-1 text-sm text-slate-500">Bạn có chắc chắn muốn hủy đơn này không?</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100"
            aria-label="Đóng"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">
          <label htmlFor="cancel-order-reason" className="mb-1.5 block text-sm font-medium text-slate-700">
            Lý do hủy đơn
          </label>
          <textarea
            id="cancel-order-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do hủy đơn..."
            maxLength={500}
            className="min-h-[96px] w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#2bb6a3]"
          />
          <p className="mt-1 text-right text-xs text-slate-400">{reason.length}/500</p>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Đóng
          </Button>
          <Button
            type="button"
            className="bg-red-600 text-white hover:bg-red-700"
            disabled={loading}
            onClick={() => onConfirm(reason.trim())}
          >
            {loading ? "Đang hủy..." : "Xác nhận hủy đơn"}
          </Button>
        </div>
      </div>
    </div>
  );
}
