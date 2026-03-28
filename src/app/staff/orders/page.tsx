"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { IOrder, ISettings } from "@/lib/types";
import { OrderStatus, MENU_TOPPINGS } from "@/lib/types";
import TakeOrderDrawer from "@/components/TakeOrderDrawer";

const TOPPING_MAP = new Map(MENU_TOPPINGS.map((t) => [t.id, t.name]));

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; classes: string; icon: string; borderClass: string; dot?: string }
> = {
  [OrderStatus.Pending]: {
    label: "Chờ xử lý",
    classes: "bg-amber-100/60 text-amber-800 border border-amber-200",
    icon: "hourglass_empty",
    borderClass: "border-l-amber-400",
    dot: "bg-amber-500",
  },
  [OrderStatus.Cooking]: {
    label: "Đang nấu",
    classes: "bg-blue-100/60 text-blue-800 border border-blue-200",
    icon: "outdoor_grill",
    borderClass: "border-l-blue-400",
    dot: "bg-blue-500",
  },
  [OrderStatus.Served]: {
    label: "Đã phục vụ",
    classes: "bg-emerald-100/60 text-emerald-800 border border-emerald-200",
    icon: "room_service",
    borderClass: "border-l-emerald-400",
    dot: "bg-emerald-500",
  },
  [OrderStatus.Paid]: {
    label: "Đã thanh toán",
    classes: "bg-green-100/60 text-green-800 border border-green-200",
    icon: "check_circle",
    borderClass: "border-l-green-400",
  },
  [OrderStatus.Cancelled]: {
    label: "Đã hủy",
    classes: "bg-stone-100/60 text-stone-500 border border-stone-200",
    icon: "cancel",
    borderClass: "border-l-stone-300",
  },
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  [OrderStatus.Pending]: OrderStatus.Cooking,
  [OrderStatus.Cooking]: OrderStatus.Served,
  [OrderStatus.Served]: OrderStatus.Paid,
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  [OrderStatus.Pending]: "Bắt đầu nấu",
  [OrderStatus.Cooking]: "Phục vụ",
  [OrderStatus.Served]: "Thanh toán",
};

function formatElapsed(createdAt: string): string {
  const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
  return `${diff} phút`;
}

function OrderCard({
  order,
  onStatusChange,
  holidayFee,
}: {
  order: IOrder;
  onStatusChange: (id: string, status: OrderStatus) => void;
  holidayFee: ISettings["holidayServiceFee"] | null;
}) {
  const cfg = STATUS_CONFIG[order.status];
  const next = NEXT_STATUS[order.status];
  const isCancelled = order.status === OrderStatus.Cancelled;
  const isPaid = order.status === OrderStatus.Paid;
  const [updating, setUpdating] = useState<OrderStatus | null>(null);

  async function handleChange(toStatus: OrderStatus) {
    setUpdating(toStatus);
    await onStatusChange(order._id!, toStatus);
    setUpdating(null);
  }

  const dishSubtotal = order.dishes.reduce((s, d) => s + d.totalDishPrice, 0);
  const feeAmount = holidayFee?.enabled
    ? holidayFee.feeType === "percent"
      ? Math.round(dishSubtotal * (holidayFee.amount / 100))
      : holidayFee.amount
    : 0;

  return (
    <div className={`bg-surface-container-lowest rounded-xl border-l-4 ${cfg.borderClass} shadow-sm overflow-hidden transition-opacity ${isCancelled ? "opacity-55" : ""}`}>

      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex justify-between items-start gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xl font-headline font-extrabold ${isCancelled ? "text-stone-400 line-through" : "text-on-surface"}`}>
            #{order.orderNumber}
          </span>
          {order.tableNumber && (
            <span className="text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full font-medium">
              {order.tableNumber}
            </span>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${cfg.classes}`}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}
            >
              {cfg.icon}
            </span>
            {cfg.label}
          </span>
          {!isPaid && (
            <span className="text-[10px] text-on-surface-variant tabular-nums">
              {formatElapsed(String(order.createdAt))}
            </span>
          )}
        </div>
      </div>

      {/* Dishes */}
      <div className="px-4 pb-3 space-y-2">
        {order.dishes.map((dish, idx) => (
          <div key={idx} className={`flex items-start gap-3 ${isPaid || isCancelled ? "opacity-60" : ""}`}>
            <span className="mt-0.5 text-on-surface-variant/40 font-mono text-xs tabular-nums shrink-0">{idx + 1}.</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface leading-snug">{dish.noodleTypes.join(" + ")}</p>
              {dish.toppings.length > 0 && (
                <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                  + {dish.toppings.map((id) => TOPPING_MAP.get(id) ?? id).join(", ")}
                </p>
              )}
              {dish.customerNote && (
                <p className="text-xs text-primary/60 italic mt-0.5">
                  <span className="not-italic font-semibold text-on-surface-variant">Ghi chú: </span>
                  &ldquo;{dish.customerNote}&rdquo;
                </p>
              )}
            </div>
            <span className="text-xs font-semibold text-on-surface-variant shrink-0 tabular-nums">
              {dish.totalDishPrice.toLocaleString()}đ
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-3 flex justify-between items-center border-t border-surface-container">
        <div>
          {feeAmount > 0 && (
            <p className="text-[10px] text-on-surface-variant flex items-center gap-0.5 mb-0.5">
              <span className="material-symbols-outlined" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}>celebration</span>
              Phí lễ/tết{holidayFee?.feeType === "percent" ? ` (${holidayFee.amount}%)` : ""}
              <span className="tabular-nums">&nbsp;+{feeAmount.toLocaleString()}đ</span>
            </p>
          )}
          <p className="font-headline font-bold text-on-surface">
            {order.totalAmount.toLocaleString()}đ
          </p>
        </div>
        <div className="flex gap-2">
          {next && (
            <button
              onClick={() => handleChange(next)}
              disabled={!!updating}
              className="px-4 py-1.5 rounded-lg font-label text-xs font-bold uppercase tracking-wider active:scale-95 transition-transform lacquer-gradient text-on-primary shadow-sm disabled:opacity-70 disabled:scale-100 flex items-center gap-1.5"
            >
              {updating === next ? (
                <span className="loading loading-spinner loading-xs" />
              ) : null}
              {NEXT_LABEL[order.status]}
            </button>
          )}
          {!isCancelled && !isPaid && (
            <button
              onClick={() => handleChange(OrderStatus.Cancelled)}
              disabled={!!updating}
              className="px-3 py-1.5 rounded-lg font-label text-xs font-bold uppercase tracking-wider text-error/50 border border-error/20 hover:text-error hover:border-error/40 transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
            >
              {updating === OrderStatus.Cancelled ? (
                <span className="loading loading-spinner loading-xs" />
              ) : null}
              Hủy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
const TABS = ["Tất cả", "Chờ xử lý", "Đang nấu", "Đã phục vụ"];

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dailyRevenue] = useState(0);
  const [dailyTarget, setDailyTarget] = useState(15_000_000);
  const [holidayFee, setHolidayFee] = useState<ISettings["holidayServiceFee"] | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const pullRef = useRef({ startY: 0, dist: 0, active: false });
  const PULL_THRESHOLD = 72;

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // Fetch settings once for daily target + holiday fee
    fetch("/api/settings")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.dailyTarget) setDailyTarget(data.dailyTarget);
        if (data?.holidayServiceFee) setHolidayFee(data.holidayServiceFee);
      })
      .catch(() => {});
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Pull-to-refresh (only when drawer is closed)
  useEffect(() => {
    if (drawerOpen) return;

    const pr = pullRef.current;

    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        pr.startY = e.touches[0].clientY;
        pr.dist = 0;
        pr.active = true;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pr.active) return;
      const dy = e.touches[0].clientY - pr.startY;
      if (dy > 0 && window.scrollY === 0) {
        pr.dist = dy;
        setPullDistance(Math.min(dy * 0.55, 56));
      } else if (dy <= 0) {
        pr.active = false;
        pr.dist = 0;
        setPullDistance(0);
      }
    };

    const onTouchEnd = async () => {
      if (!pr.active) return;
      const dist = pr.dist;
      pr.startY = 0;
      pr.dist = 0;
      pr.active = false;
      setPullDistance(0);
      if (dist >= PULL_THRESHOLD) {
        setIsPullRefreshing(true);
        await fetchOrders();
        setIsPullRefreshing(false);
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [drawerOpen, fetchOrders]);

  async function handleStatusChange(id: string, status: OrderStatus) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  }

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "Tất cả") return true;
    if (activeTab === "Chờ xử lý") return o.status === OrderStatus.Pending;
    if (activeTab === "Đang nấu") return o.status === OrderStatus.Cooking;
    if (activeTab === "Đã phục vụ") return o.status === OrderStatus.Served || o.status === OrderStatus.Paid;
    return true;
  });

  const ordering = orders.filter(
    (o) => o.status === OrderStatus.Pending || o.status === OrderStatus.Cooking,
  ).length;
  const serviced = orders.filter(
    (o) => o.status === OrderStatus.Served || o.status === OrderStatus.Paid,
  ).length;

  const tabCounts: Record<string, number> = {
    "Tất cả": orders.length,
    "Chờ xử lý": orders.filter((o) => o.status === OrderStatus.Pending).length,
    "Đang nấu": orders.filter((o) => o.status === OrderStatus.Cooking).length,
    "Đã phục vụ": orders.filter((o) => o.status === OrderStatus.Served || o.status === OrderStatus.Paid).length,
  };

  const targetPct = Math.min(Math.round((dailyRevenue / dailyTarget) * 100), 100);

  return (
    <>
      {/* ── Top App Bar ── */}
      <header className="fixed top-0 w-full z-50 bg-stone-50/90 silk-blur shadow-sm shadow-red-900/5 safe-top">
        <div className="h-16 flex justify-between items-center px-4">
        <div className="flex items-center gap-3">
          <h1 className="font-headline text-xl font-bold italic text-primary">
            Hủ Tiếu Ngọc Mai
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container-high ring-2 ring-primary/10 flex items-center justify-center overflow-hidden">
          <span className="material-symbols-outlined text-on-surface-variant">
            person
          </span>
        </div>
        </div>
      </header>

      {/* Pull-to-refresh indicator */}
      {(pullDistance > 0 || isPullRefreshing) && (
        <div
          className="fixed left-0 w-full flex justify-center pointer-events-none z-30"
          style={{ top: `calc(4rem + env(safe-area-inset-top, 0px) + ${isPullRefreshing ? 10 : Math.max(0, pullDistance - 6)}px)` }}
        >
          <div className="bg-surface-container-lowest shadow-md border border-surface-container rounded-full w-8 h-8 flex items-center justify-center">
            {isPullRefreshing ? (
              <span className="loading loading-spinner loading-xs text-primary" />
            ) : (
              <span
                className="material-symbols-outlined text-primary"
                style={{
                  fontSize: 18,
                  transform: `rotate(${Math.min((pullDistance / 56) * 180, 180)}deg)`,
                  transition: "transform 0.08s",
                }}
              >
                refresh
              </span>
            )}
          </div>
        </div>
      )}

      <main className="pb-32 px-4 max-w-2xl mx-auto space-y-6" style={{ paddingTop: 'calc(4rem + env(safe-area-inset-top, 0px) + 1rem)' }}>
        {/* ── Daily Revenue Bento ── */}
        <section className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden border-l-4 border-primary">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-medium">
                  Doanh thu {new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                </p>
                <h2 className="text-3xl font-headline font-bold text-primary">
                  {dailyRevenue.toLocaleString()}đ
                </h2>
              </div>
              <div className="bg-secondary-fixed px-3 py-1 rounded-full text-[10px] font-bold text-on-secondary-fixed uppercase tracking-tighter">
                Mục tiêu: {targetPct}%
              </div>
            </div>
            <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${targetPct}%` }}
              />
            </div>
            <p className="mt-3 text-[11px] font-body text-on-surface-variant italic">
              Trạm Bến Tre #1
            </p>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-primary/5 text-8xl pointer-events-none">
              receipt_long
            </span>
          </div>

          <div className="bg-gray-200 p-2 rounded-xl flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-secondary">
                restaurant_menu
              </span>
            </div>
            <div>
              <p className="font-bold text-sm uppercase tracking-widest text-on-surface-variant">
                Đợi xử lý
              </p>
              <p className="text-2xl font-headline font-bold text-on-surface">
                {ordering}
              </p>
            </div>
          </div>

          <div className="bg-gray-200 p-2 rounded-xl flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-green-600">
                check_circle
              </span>
            </div>
            <div>
              <p className="font-bold text-sm uppercase tracking-widest text-on-surface-variant">
                Hoàn thành
              </p>
              <p className="text-2xl font-headline font-bold text-on-surface">
                {serviced}
              </p>
            </div>
          </div>
        </section>

        <hr />

        {/* ── Tab Navigation ── */}
        <nav className="flex gap-2 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-label font-semibold transition-all ${
                activeTab === tab
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              {tab}
              {tabCounts[tab] > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                  activeTab === tab
                    ? "bg-white/20 text-on-primary"
                    : "bg-surface-container-high text-on-surface-variant"
                }`}>
                  {tabCounts[tab]}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* ── Order Feed ── */}
        <section className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-md text-primary" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl opacity-30 block mb-3">
                inbox
              </span>
              <p className="font-body text-sm">Chưa có đơn trong mục này</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onStatusChange={handleStatusChange}
                holidayFee={holidayFee}
              />
            ))
          )}
        </section>
      </main>

      {/* ── FAB ── */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed right-6 bottom-28 w-14 h-14 rounded-full lacquer-gradient text-on-primary shadow-xl shadow-primary/20 flex items-center justify-center active:scale-90 transition-transform z-40"
        aria-label="Đơn mới"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {/* ── Take Order Drawer ── */}
      {drawerOpen && (
        <TakeOrderDrawer
          onClose={() => setDrawerOpen(false)}
          onOrderCreated={fetchOrders}
        />
      )}
    </>
  );
}
