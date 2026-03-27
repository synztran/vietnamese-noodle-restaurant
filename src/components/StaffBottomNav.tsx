"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/staff/orders", label: "Đơn hàng", icon: "receipt_long" },
  { href: "/staff/history", label: "Lịch sử", icon: "history" },
  { href: "/staff/settings", label: "Cài đặt", icon: "settings", isSettings: true },
];

export default function StaffBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-6 pb-6 pt-3 bg-stone-50/95 silk-blur shadow-[0_-4px_24px_rgba(126,0,10,0.06)] rounded-t-3xl z-50">
      <Link
        href="/"
        className="flex flex-col items-center justify-center text-stone-500 hover:text-primary transition-all active:scale-90 duration-150"
      >
        <span className="material-symbols-outlined">home</span>
        <span className="font-label text-[10px] uppercase tracking-widest font-medium mt-1">
          Trang chủ
        </span>
      </Link>

      {NAV_ITEMS.map(({ href, label, icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-all active:scale-90 duration-150 ${
              active
                ? "text-primary bg-amber-50"
                : "text-stone-500 hover:text-primary"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {icon}
            </span>
            <span className="font-label text-[10px] uppercase tracking-widest font-medium mt-1">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
