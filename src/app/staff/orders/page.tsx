"use client";

import { useEffect, useState, useCallback, useRef, memo } from "react";
import type { IOrder } from "@/lib/types";
import { OrderStatus, MENU_TOPPINGS } from "@/lib/types";
import TakeOrderDrawer from "@/components/TakeOrderDrawer";

const TOPPING_MAP = new Map(MENU_TOPPINGS.map((t) => [t.id, t.name]));
const URGET_MINUTE = 2

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
  [OrderStatus.Scheduled]: {
    label: "Đặt trước",
    classes: "bg-purple-100/60 text-purple-800 border border-purple-200",
    icon: "event",
    borderClass: "border-l-purple-400",
    dot: "bg-purple-500",
  },
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  [OrderStatus.Pending]: OrderStatus.Cooking,
  [OrderStatus.Cooking]: OrderStatus.Served,
  [OrderStatus.Served]: OrderStatus.Paid,
  [OrderStatus.Scheduled]: OrderStatus.Pending,
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  [OrderStatus.Pending]: "Bắt đầu nấu",
  [OrderStatus.Cooking]: "Phục vụ",
  [OrderStatus.Served]: "Thanh toán",
  [OrderStatus.Scheduled]: "Kích hoạt",
};

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s} giây`;
  return `${m} phút ${s.toString().padStart(2, "0")} giây`;
}

// Isolated leaf — only this tiny component re-renders every second
function ElapsedBadge({ createdAt, isActive }: { createdAt: string | Date; isActive: boolean }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(() =>
    Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000))
  );
  useEffect(() => {
    if (!isActive) return;
    const tick = setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000)));
    }, 1_000);
    return () => clearInterval(tick);
  }, [isActive, createdAt]);

  const m = Math.floor(elapsedSeconds / 60);
  const isUrgent = isActive && m >= 5;

  return (
    <span className={`text-[10px] tabular-nums flex items-center gap-0.5 ${
      isUrgent ? "text-red-500 font-bold" : "text-on-surface-variant"
    }`}>
      {isUrgent && (
        <span className="material-symbols-outlined" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}>warning</span>
      )}
      {formatElapsed(elapsedSeconds)}
    </span>
  );
}

const OrderCard = memo(function OrderCard({
  order,
  onStatusChange,
  isAllowForcePaid,
}: {
  order: IOrder;
  onStatusChange: (id: string, status: OrderStatus, realPaidPrice?: number) => void;
  isAllowForcePaid: boolean;
}) {
  const cfg = STATUS_CONFIG[order.status];
  const next = NEXT_STATUS[order.status];
  const isCancelled = order.status === OrderStatus.Cancelled;
  const isPaid = order.status === OrderStatus.Paid;
  const isScheduled = order.status === OrderStatus.Scheduled;
  const [updating, setUpdating] = useState<OrderStatus | null>(null);
  const forcePaidDialogRef = useRef<HTMLDialogElement>(null);
  const [forcePaidAmount, setForcePaidAmount] = useState(0);
  const [forcePaidRaw, setForcePaidRaw] = useState("");

  async function handleChange(toStatus: OrderStatus, realPaidPrice?: number) {
    setUpdating(toStatus);
    await onStatusChange(order._id!, toStatus, realPaidPrice);
    setUpdating(null);
  }

  const feeAmount = order.fees?.holidayServiceFee ?? 0;

  const isActive = order.status === OrderStatus.Pending || order.status === OrderStatus.Cooking;
  // Only tracks threshold crossings (0=normal, 1=warning ≥5min, 2=urgent ≥10min)
  // Updates at most twice per order lifetime — card does NOT re-render every second
  const [isUrgent, setUrgent] = useState(() => {
    const m = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
    const stausUrget = [OrderStatus.Pending, OrderStatus.Cooking].includes(order.status) ;
    return stausUrget && m >= URGET_MINUTE;
  });
  useEffect(() => {
    if (!isActive) {
      setUrgent(false);
      return;
    };
    const tick = setInterval(() => {
      const m = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
      const stausUrget = [OrderStatus.Pending, OrderStatus.Cooking].includes(order.status) ;
      setUrgent(stausUrget && m >= URGET_MINUTE);
    }, 5 * 1000);
    return () => clearInterval(tick);
  }, [isActive, order.createdAt, order.status]);

  return (
    <div className={`rounded-xl border-l-4 ${cfg.borderClass} shadow-sm overflow-hidden transition-opacity ${isCancelled ? "opacity-55 bg-surface-container-lowest" : isUrgent ? "bg-red-50/60 order-shake"  : "bg-surface-container-lowest"}`}>

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
          {isScheduled && order.scheduleOrder?.scheduledAt ? (
            <span className="text-[10px] text-purple-700 font-semibold flex items-center gap-0.5">
              <span className="material-symbols-outlined" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}>event</span>
              {new Date(order.scheduleOrder.scheduledAt).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
            </span>
          ) : !isPaid ? (
            <ElapsedBadge createdAt={order.createdAt} isActive={isActive} />
          ) : null}
        </div>
      </div>

      {/* Scheduled customer info */}
      {isScheduled && (order.scheduleOrder?.customerName ?? order.scheduleOrder?.customerPhone) && (
        <div className="px-4 pb-2 flex gap-4">
          {order.scheduleOrder?.customerName && (
            <span className="text-xs text-purple-700 flex items-center gap-0.5">
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>person</span>
              {order.scheduleOrder.customerName}
            </span>
          )}
          {order.scheduleOrder?.customerPhone && (
            <span className="text-xs text-purple-700 flex items-center gap-0.5">
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>phone</span>
              {order.scheduleOrder.customerPhone}
            </span>
          )}
        </div>
      )}

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
              Phí lễ/tết
              <span className="tabular-nums">&nbsp;+{feeAmount.toLocaleString()}đ</span>
            </p>
          )}
          {order.realPaidPrice != null && order.realPaidPrice !== order.totalAmount && (
            <p className="text-[10px] text-on-surface-variant line-through tabular-nums">
              {order.totalAmount.toLocaleString()}đ
            </p>
          )}
          <p className={`font-headline font-bold ${order.realPaidPrice != null ? "text-emerald-700" : "text-on-surface"}`}>
            {(order.realPaidPrice ?? order.totalAmount).toLocaleString()}đ
            {/* {order.realPaidPrice != null && (
              <span className="ml-1 text-[10px] font-label font-normal text-emerald-600 uppercase tracking-wide">thực thu</span>
            )} */}
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
              ) : NEXT_LABEL[order.status]}
            </button>
          )}
          {isAllowForcePaid && [OrderStatus.Served].includes(order.status) && (
            <button
              onClick={() => {
                setForcePaidAmount(order.totalAmount);
                setForcePaidRaw(String(order.totalAmount));
                forcePaidDialogRef.current?.showModal();
              }}
              disabled={!!updating}
              className="px-3 py-1.5 rounded-lg font-label text-xs font-bold uppercase tracking-wider active:scale-95 transition-transform bg-yellow-400 text-yellow-900 shadow-sm disabled:opacity-70 disabled:scale-100 flex items-center gap-1"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>payments</span>
              Thu tiền
            </button>
          )}
          {[OrderStatus.Pending, OrderStatus.Cooking].includes(order.status) && (
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

      {/* Force Paid Modal */}
      <dialog ref={forcePaidDialogRef} className="modal">
        <div className="modal-box max-w-sm mb-36">
          <h3 className="font-headline font-bold text-lg text-on-surface mb-1">Thu tiền đơn #{order.orderNumber}</h3>
          <p className="text-xs text-on-surface-variant mb-4">Nhập số tiền thực tế khách trả. Để trống giá trị mặc định nếu khách trả đúng.</p>
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-on-surface-variant">Số tiền thực thu (đ)</legend>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="input input-bordered w-full focus:outline-none font-mono text-base"
              value={forcePaidRaw}
              onChange={(e) => {
                const digits = e.target.value.replace(/[^0-9]/g, "");
                setForcePaidRaw(digits);
                const n = parseInt(digits, 10);
                setForcePaidAmount(isNaN(n) ? 0 : n);
              }}
              onBlur={() => setForcePaidRaw(String(forcePaidAmount))}
            />
            <p className="fieldset-label">{forcePaidAmount.toLocaleString()}đ • Giá gốc: {order.totalAmount.toLocaleString()}đ</p>
          </fieldset>
          <div className="modal-action mt-4">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm">Huỷ</button>
            </form>
            <button
              className="btn btn-sm bg-yellow-400 text-yellow-900 border-0 hover:bg-yellow-500 font-bold"
              onClick={() => {
                forcePaidDialogRef.current?.close();
                handleChange(OrderStatus.Paid, forcePaidAmount);
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Xác nhận thu tiền
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </div>
  );
});
const TABS = ["Tất cả", "Đặt trước", "Chờ xử lý", "Đang nấu", "Đã phục vụ"];

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [dailyTarget, setDailyTarget] = useState(15_000_000);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const [isAllowForcePaid, setAllowForcePaid] = useState(false);
  const pullRef = useRef({ startY: 0, dist: 0, active: false });
  const PULL_THRESHOLD = 72;

  const fetchRevenue = useCallback(async () => {
    try {
      const res = await fetch("/api/orders/revenue");
      if (res.ok) {
        const data = await res.json();
        setDailyRevenue(data.revenue ?? 0);
      }
    } catch {
      // non-blocking
    }
  }, []);

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
    fetchRevenue();
    // Fetch settings once for daily target
    fetch("/api/settings")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.dailyTarget) setDailyTarget(data.dailyTarget);
        if (data?.applyForcePaid) setAllowForcePaid(data.applyForcePaid);
      })
      .catch(() => {});
    const interval = setInterval(() => {
      fetchOrders();
      fetchRevenue();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders, fetchRevenue]);

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

  const handleStatusChange = useCallback(async (id: string, status: OrderStatus, realPaidPrice?: number) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...(typeof realPaidPrice === "number" && { realPaidPrice }) }),
    });
    fetchOrders();
    if (status === OrderStatus.Paid) fetchRevenue();
  }, [fetchOrders, fetchRevenue]);

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "Tất cả") return true;
    if (activeTab === "Chờ xử lý") return o.status === OrderStatus.Pending;
    if (activeTab === "Đang nấu") return o.status === OrderStatus.Cooking;
    if (activeTab === "Đã phục vụ") return o.status === OrderStatus.Served || o.status === OrderStatus.Paid;
    if (activeTab === "Đặt trước") return o.status === OrderStatus.Scheduled;
    return true;
  });

  const ordering = orders.filter(
    (o) => o.status === OrderStatus.Pending || o.status === OrderStatus.Cooking || o.status === OrderStatus.Scheduled,
  ).length;
  const serviced = orders.filter(
    (o) => o.status === OrderStatus.Served || o.status === OrderStatus.Paid,
  ).length;

  const tabCounts: Record<string, number> = {
    "Tất cả": orders.length,
    "Chờ xử lý": orders.filter((o) => o.status === OrderStatus.Pending).length,
    "Đang nấu": orders.filter((o) => o.status === OrderStatus.Cooking).length,
    "Đã phục vụ": orders.filter((o) => o.status === OrderStatus.Served || o.status === OrderStatus.Paid).length,
    "Đặt trước": orders.filter((o) => o.status === OrderStatus.Scheduled).length,
  };

  const targetPct = Math.min(Math.round((dailyRevenue / dailyTarget) * 100), 100);

  return (
    <>
      {/* ── Top App Bar ── */}
      <header className="fixed top-0 left-0 md:left-52 right-0 z-50 bg-stone-50/90 silk-blur shadow-sm shadow-red-900/5 safe-top">
        <div className="h-16 flex justify-between items-center px-4">
          <div className="flex items-center gap-3">
            <h1 className="font-headline text-lg font-bold italic text-primary">
              Hủ Tiếu Ngọc Mai
            </h1>
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="max-w-max rounded-md lacquer-gradient text-on-primary shadow-xl shadow-primary/20 flex items-center justify-center active:scale-90 transition-transform z-40"
            aria-label="Đơn mới"
          >
            <span className="text-sm px-2 py-1 font-bold">
              + Tạo đơn mới
              </span>
          </button>
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

      <main className="pb-32 md:pb-10 px-4 max-w-2xl mx-auto space-y-4" style={{ paddingTop: 'calc(4rem + env(safe-area-inset-top, 0px) + 1rem)' }}>
        {/* ── Daily Revenue Bento ── */}
        <section className="grid grid-cols-2 gap-y-4 gap-x-4">
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

          <div className="bg-gray-200 p-2 rounded-xl flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-secondary">
                restaurant_menu
              </span>
            </div>
            <div>
              <p className="font-bold text-[10px] uppercase tracking-widest text-on-surface-variant">
                Đợi xử lý
              </p>
              <p className="text-2xl font-headline font-bold text-on-surface">
                {ordering}
              </p>
            </div>
          </div>

          <div className="bg-gray-200 p-2 rounded-xl flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-green-600">
                check_circle
              </span>
            </div>
            <div>
              <p className="font-bold text-[10px] uppercase tracking-widest text-on-surface-variant">
                Đã Hoàn tất
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
                isAllowForcePaid={isAllowForcePaid}
              />
            ))
          )}
        </section>
      </main>

      {/* ── FAB ── */}
      {/* <button
        onClick={() => setDrawerOpen(true)}
        className="fixed right-6 bottom-28 w-10 h-10 rounded-full lacquer-gradient text-on-primary shadow-xl shadow-primary/20 flex items-center justify-center active:scale-90 transition-transform z-40"
        aria-label="Đơn mới"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button> */}

      {/* ── Take Order Drawer ── */}
      <TakeOrderDrawer
        onClose={() => setDrawerOpen(false)}
        onOrderCreated={fetchOrders}
        isOpen={drawerOpen}
      />
    </>
  );
}
