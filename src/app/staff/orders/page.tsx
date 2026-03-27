"use client";

import { useEffect, useState, useCallback } from "react";
import type { IOrder } from "@/lib/types";
import { OrderStatus, MENU_TOPPINGS } from "@/lib/types";
import TakeOrderDrawer from "@/components/TakeOrderDrawer";

const TOPPING_MAP = new Map(MENU_TOPPINGS.map((t) => [t.id, t.name]));

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; classes: string; dot?: string }
> = {
  [OrderStatus.Pending]: {
    label: "Chờ xử lý",
    classes: "bg-amber-100/50 text-amber-800 border border-amber-200",
    dot: "bg-amber-500",
  },
  [OrderStatus.Cooking]: {
    label: "Đang nấu",
    classes: "bg-blue-100/50 text-blue-800 border border-blue-200",
    dot: "bg-blue-500",
  },
  [OrderStatus.Served]: {
    label: "Đã phục vụ",
    classes: "bg-emerald-100/50 text-emerald-800 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  [OrderStatus.Paid]: {
    label: "Đã thanh toán",
    classes: "bg-tertiary-container/20 text-tertiary-container",
  },
  [OrderStatus.Cancelled]: {
    label: "Đã hủy",
    classes: "bg-stone-200/50 text-stone-500",
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
}: {
  order: IOrder;
  onStatusChange: (id: string, status: OrderStatus) => void;
}) {
  const cfg = STATUS_CONFIG[order.status];
  const next = NEXT_STATUS[order.status];
  const isCancelled = order.status === OrderStatus.Cancelled;
  const isPaid = order.status === OrderStatus.Paid;

  return (
    <div
      className={`p-5 rounded-xl transition-all bg-gray-300 ${
        isPaid ? "border-2 border-emerald-400" : ""
      } ${isCancelled ? "border-2 border-red-400" : ""}`}
    >
      {/* Row 1: ID + status + time */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <span
            className={`text-2xl font-headline font-extrabold ${
              isCancelled
                ? "text-stone-400 line-through"
                : "text-on-surface"
            }`}
          >
            #{order.orderNumber}
          </span>
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${cfg.classes}`}
          >
            {cfg.dot && <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />}
            {cfg.label}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-medium text-xs text-on-surface-variant">
            {formatElapsed(String(order.createdAt))}
          </span>
          {(isPaid || order.status === OrderStatus.Served) && (
            <span className="material-symbols-outlined text-emerald-600 text-sm">done_all</span>
          )}
        </div>
      </div>

      {/* Table */}
      {order.tableNumber && (
        <p className="text-xs text-on-surface-variant mt-1">Bàn: {order.tableNumber}</p>
      )}

      {/* Dishes */}
      {!isPaid && !isCancelled && (
        <div className="mt-4 space-y-1">
          {order.dishes.map((dish, idx) => (
            <div key={idx}>
              <p className="text-on-surface-variant text-sm">
                {dish.noodleTypes.join(" + ")}
              </p>
              {dish.toppings.length > 0 && (
                <p className="text-on-surface-variant text-xs opacity-70">
                  + {dish.toppings.map((id) => TOPPING_MAP.get(id) ?? id).join(", ")}
                </p>
              )}
              {dish.customerNote && (
                <p className="text-primary/70 text-xs italic">&ldquo;{dish.customerNote}&rdquo;</p>
              )}
            </div>
          ))}
        </div>
      )}

      {isPaid && (
        <div className="mt-4">
          <p className="font-body text-on-surface-variant text-sm italic">
            {order.dishes.length} tô &bull; Đã thanh toán
          </p>
        </div>
      )}

      {/* Footer: total + action */}
      <div className="mt-4 flex justify-between items-center">
        <p className="font-headline font-bold text-on-surface">
          {order.totalAmount.toLocaleString()}đ
        </p>
        <div className="flex gap-2">
          {next && (
            <button
              onClick={() => onStatusChange(order._id!, next)}
              className="px-4 py-2 rounded-lg font-label text-xs font-bold uppercase tracking-wider active:scale-95 transition-transform bg-surface-container-high text-primary hover:bg-surface-container-highest"
            >
              {NEXT_LABEL[order.status]}
            </button>
          )}
          {!isCancelled && !isPaid && (
            <button
              onClick={() => onStatusChange(order._id!, OrderStatus.Cancelled)}
              className="px-3 py-2 rounded-lg font-label text-xs font-bold uppercase tracking-wider text-error/60 hover:text-error transition-colors"
            >
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
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

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

  const targetPct = Math.min(Math.round((dailyRevenue / 15_000_000) * 100), 100);

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
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                Đang gọi
              </p>
              <p className="text-2xl font-headline font-bold text-on-surface">
                {ordering}
              </p>
            </div>
          </div>

          <div className="bg-gray-200 p-2 rounded-xl flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-tertiary">
                check_circle
              </span>
            </div>
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                Phục vụ xong
              </p>
              <p className="text-2xl font-headline font-bold text-on-surface">
                {serviced}
              </p>
            </div>
          </div>
        </section>

        {/* ── Tab Navigation ── */}
        <nav className="flex gap-2 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-label font-semibold transition-all ${
                activeTab === tab
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              {tab}
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
              />
            ))
          )}
        </section>
      </main>

      {/* ── FAB ── */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed right-6 bottom-24 w-14 h-14 rounded-full lacquer-gradient text-on-primary shadow-xl shadow-primary/20 flex items-center justify-center active:scale-90 transition-transform z-40"
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
