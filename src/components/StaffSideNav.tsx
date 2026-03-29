"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/staff/orders", label: "Đơn hàng", icon: "receipt_long" },
  { href: "/staff/history", label: "Lịch sử", icon: "history" },
  { href: "/staff/settings", label: "Cài đặt", icon: "settings" },
];

export default function StaffSideNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-52 bg-stone-50/95 silk-blur shadow-[4px_0_24px_rgba(126,0,10,0.06)] z-50 border-r border-stone-200/60">
      {/* Brand */}
      <div className="px-5 pt-8 pb-6 safe-top mt-4">
        <Link href="/" className="block hover:opacity-80 transition-opacity active:scale-95">
          <p className="font-headline text-lg font-bold italic text-primary leading-tight">
            Hủ Tiếu
          </p>
          <p className="font-headline text-lg font-bold italic text-primary leading-tight">
            Ngọc Mai
          </p>
          <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mt-1">
            Bến Tre · Since 2015
          </p>
        </Link>
      </div>

      <div className="h-px bg-surface-container mx-4 mb-4" />

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all active:scale-95 duration-150 ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-stone-500 hover:bg-stone-100 hover:text-primary"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {icon}
              </span>
              <span className="font-label text-sm font-semibold tracking-wide">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Home link at bottom */}
      <div className="px-3 pb-6 safe-bottom">
        <div className="h-px bg-surface-container mb-3" />
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-primary transition-all active:scale-95 duration-150"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="font-label text-sm font-semibold tracking-wide">Trang chủ</span>
        </Link>
      </div>
    </aside>
  );
}
