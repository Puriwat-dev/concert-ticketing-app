import { X } from "lucide-react";

interface DeleteConfirmModalProps {
  concertName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmModal({
  concertName,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  return (
    // Backdrop overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      {/* Modal Box */}
      <div className="w-full max-w-sm rounded-lg bg-white p-8 text-center shadow-xl">
        
        {/* Red X Circle */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#CD4B4B]">
          <X className="h-8 w-8 text-white" strokeWidth={3} />
        </div>

        {/* Text Area */}
        <h3 className="mb-2 text-2xl font-bold">Are you sure to delete?</h3>
        <h4 className="mb-8 text-2xl font-bold">&quot;{concertName}&quot;</h4>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 rounded-md border border-gray-300 bg-white py-3 font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-md bg-[#CD4B4B] py-3 font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
