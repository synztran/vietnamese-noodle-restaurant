"use client";

import { useRouter } from "next/navigation";

export default function StaffSettingsPage() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-surface pt-20 pb-32 px-6">
      <h1 className="font-headline text-2xl text-primary font-bold mb-8">
        Cài đặt
      </h1>

      <div className="space-y-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl">
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
            Tài khoản
          </p>
          <p className="font-headline text-on-surface font-bold">
            Quản lý
          </p>
          <p className="text-sm text-on-surface-variant">Đặc quyền Chủ quán</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl">
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-3">
            Thiết bị
          </p>
          <p className="text-sm text-on-surface">Trạm Bến Tre #1</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-xl border-2 border-error/30 text-error font-body font-semibold hover:bg-error-container/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
