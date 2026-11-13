import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
      <Loader2 size={32} className="animate-spin text-pink-500" />
      <p className="text-sm font-medium text-gray-500 font-poppins">
        Loading admin workspace...
      </p>
    </div>
  );
}
