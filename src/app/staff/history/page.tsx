"use client";

import { useEffect, useState, useCallback } from "react";
import type { IOrder } from "@/lib/types";
import { MENU_TOPPINGS } from "@/lib/types";

const TOPPING_MAP = new Map(MENU_TOPPINGS.map((t) => [t.id, t.name]));

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toInputDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function StaffHistoryPage() {
  const today = toInputDate(new Date());
  const monthStart = toInputDate(new Date(new Date().setDate(1)));

  const [from, setFrom] = useState(monthStart);
  const [to, setTo] = useState(today);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ from, to });
      const res = await fetch(`/api/history?${params}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
        setTotal(data.total);
        setRevenue(data.revenue);
      }
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <>
      {/* ── Top App Bar ── */}
      <header className="w-full top-0 sticky z-50 bg-surface-container-lowest safe-top">
        <div className="flex items-center justify-between px-4 h-16 w-full max-w-2xl mx-auto">
          <a href="/staff/orders" className="active:scale-95 transition-transform hover:opacity-80">
            <span className="material-symbols-outlined text-primary">
              arrow_back
            </span>
          </a>
          <h1 className="font-headline font-bold tracking-tight text-xl text-primary">
            Lịch sử đơn hàng
          </h1>
          <button className="active:scale-95 transition-transform hover:opacity-80">
            <span className="material-symbols-outlined text-primary">
              more_vert
            </span>
          </button>
        </div>
        <div className="bg-surface-dim h-[1px] w-full opacity-20" />
      </header>

      <main className="pb-32 px-4 pt-4 max-w-2xl mx-auto space-y-6">
        {/* ── Date Range Filter ── */}
        <section>
          <div className="bg-surface-container-low p-4 rounded-full border-b-2 border-primary/20 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">
                calendar_today
              </span>
              <div>
                <p className="text-[10px] font-label font-medium uppercase tracking-[0.1em] text-on-surface-variant">
                  Khoảng thời gian
                </p>
                <p className="font-headline font-bold text-sm text-on-surface">
                  {new Date(from).toLocaleDateString("vi-VN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  &ndash;{" "}
                  {new Date(to).toLocaleDateString("vi-VN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                (
                  document.getElementById("date-filter-modal") as HTMLDialogElement
                )?.showModal()
              }
              className="p-2 rounded-full hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-secondary">
                tune
              </span>
            </button>
          </div>
        </section>

        {/* ── Summary Cards ── */}
        <section className="grid grid-cols-2 gap-3">
          <div className="lacquer-gradient p-5 rounded-xl flex flex-col justify-between aspect-square relative overflow-hidden">
            <span
              className="material-symbols-outlined text-on-primary/70"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shopping_bag
            </span>
            <div>
              <h3 className="text-on-primary/80 font-label text-[10px] uppercase tracking-widest">
                Tổng đơn
              </h3>
              <p className="text-on-primary font-headline text-2xl font-bold">
                {total.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-surface-container-highest p-5 rounded-xl flex flex-col justify-between aspect-square border-l-4 border-secondary">
            <span
              className="material-symbols-outlined text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              payments
            </span>
            <div>
              <h3 className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">
                Doanh thu
              </h3>
              <p className="text-primary font-headline text-2xl font-bold">
                {revenue >= 1_000_000
                  ? `${(revenue / 1_000_000).toFixed(1)}M`
                  : revenue.toLocaleString()}{" "}
                <span className="text-xs font-label">VND</span>
              </p>
            </div>
          </div>
        </section>

        {/* ── Order List ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline font-bold text-lg text-primary">
              Lưu trữ gần đây
            </h2>
            <span className="text-[10px] font-label font-bold text-secondary uppercase tracking-widest">
              Cập nhật
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-md text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl opacity-30 block mb-3">
                history
              </span>
              <p className="text-sm">Không có đơn hoàn thành trong kỳ này</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-surface-container-lowest p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] group active:scale-[0.98] transition-all border-b border-outline-variant/10"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-headline font-bold text-on-surface group-hover:text-primary transition-colors">
                        #{order.orderNumber}
                      </p>
                      <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                        {formatDate(String(order.createdAt))}
                      </p>
                    </div>
                    <span className="bg-tertiary-container/20 text-tertiary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Đã thanh toán
                    </span>
                  </div>

                  <div className="flex items-end justify-between pt-3 border-t border-surface-container-high">
                    <div className="flex flex-col gap-1 max-w-[60%]">
                      {order.dishes.slice(0, 2).map((dish, idx) => (
                        <div key={idx}>
                          <p className="font-body font-semibold text-sm text-on-surface">
                            {dish.noodleTypes.join(" + ")}
                          </p>
                          {dish.toppings.length > 0 && (
                            <p className="font-body text-[11px] text-on-surface-variant">
                              +{" "}
                              {dish.toppings
                                .map((id) => TOPPING_MAP.get(id) ?? id)
                                .join(", ")}
                            </p>
                          )}
                          {dish.customerNote && (
                            <p className="font-body italic text-[10px] text-primary/70">
                              &ldquo;{dish.customerNote}&rdquo;
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-label text-on-surface-variant uppercase mb-1">
                        {order.dishes.length} tô
                      </p>
                      <p className="font-headline font-bold text-secondary">
                        {order.totalAmount.toLocaleString()} VND
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Flourish */}
              <div className="flex justify-center py-6 opacity-20">
                <div className="h-[1px] w-12 bg-primary" />
                <span className="material-symbols-outlined text-xs mx-2">
                  auto_awesome
                </span>
                <div className="h-[1px] w-12 bg-primary" />
              </div>
            </div>
          )}
        </section>
      </main>

      {/* ── Date Filter Modal ── */}
      <dialog id="date-filter-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-headline text-xl text-primary font-bold mb-6">
            Lọc theo thời gian
          </h3>
          <div className="space-y-4">
            <div>
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-semibold block mb-2">
                Từ ngày
              </label>
              <input
                type="date"
                value={from}
                max={to}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 px-2 py-2 font-body text-on-surface outline-none"
              />
            </div>
            <div>
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-semibold block mb-2">
                Đến ngày
              </label>
              <input
                type="date"
                value={to}
                min={from}
                max={today}
                onChange={(e) => setTo(e.target.value)}
                className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 px-2 py-2 font-body text-on-surface outline-none"
              />
            </div>
          </div>
          <div className="modal-action mt-6">
            <form method="dialog">
              <button className="btn btn-ghost text-on-surface-variant">
                Đóng
              </button>
            </form>
            <form method="dialog">
              <button
                onClick={() => fetchHistory()}
                className="btn lacquer-gradient text-on-primary border-0 hover:opacity-90"
              >
                Áp dụng
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
