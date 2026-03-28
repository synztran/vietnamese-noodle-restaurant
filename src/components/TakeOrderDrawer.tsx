"use client";

import { useState, useEffect, useRef } from "react";
import {
  NoodleType,
  ToppingCategory,
  NOODLE_PRICES,
  MENU_TOPPINGS,
  type IDish,
  type ITopping,
  type ISettings,
  type CreateOrderInput,
} from "@/lib/types";

// Static fallback lookup map
const TOPPING_MAP = new Map<string, ITopping>(MENU_TOPPINGS.map((t) => [t.id, t]));

const DEFAULT_HOLIDAY_FEE: ISettings["holidayServiceFee"] = { enabled: false, feeType: "absolute", amount: 0 };

// Noodle types grouped for display
const ALL_NOODLE_TYPES = Object.values(NoodleType);

// Toppings grouped by category
const TOPPINGS_BY_CATEGORY = Object.values(ToppingCategory).map((cat) => ({
  category: cat,
  items: MENU_TOPPINGS.filter((t) => t.category === cat && t.isAvailable),
}));

interface CartDish extends IDish {
  _localId: number;
}

interface Props {
  onClose: () => void;
  onOrderCreated: () => void;
  tableNumber?: string;
  isOpen?: boolean; // Optional prop to control drawer visibility
}

let _localCounter = 0;

function generateTableNum(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const YY = String(now.getFullYear()).slice(-2);
  const HH = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `T-${dd}${MM}${YY}-${HH}${mm}`;
}

export default function TakeOrderDrawer({ onClose, onOrderCreated, tableNumber, isOpen }: Props) {
  const [selectedNoodles, setSelectedNoodles] = useState<NoodleType[]>([]);
  const [selectedToppingIds, setSelectedToppingIds] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [cart, setCart] = useState<CartDish[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [tableNum, setTableNum] = useState(() => tableNumber ?? generateTableNum());
  const [liveSettings, setLiveSettings] = useState<ISettings | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(14, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const drawerRef = useRef<HTMLDivElement>(null);

  // Fetch settings once on mount for live prices
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.ok ? r.json() : null)
      .then((data: ISettings | null) => { if (data) setLiveSettings(data); })
      .catch(() => {});
  }, []);

  // Helpers that use live settings prices, falling back to static values
  const noodlePrice = (nt: NoodleType): number =>
    (liveSettings?.noodlePrices as Record<string, number> | undefined)?.[nt] ?? NOODLE_PRICES[nt] ?? 0;

  const toppingPrice = (id: string): number =>
    liveSettings?.toppingPrices?.[id] ?? TOPPING_MAP.get(id)?.price ?? 0;

  const holidayFee = liveSettings?.holidayServiceFee ?? DEFAULT_HOLIDAY_FEE;

  // Lock body scroll and prevent pull-to-refresh while drawer is open,
  // but allow normal touch-scrolling inside the drawer panel itself.
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    const blockTouchMove = (e: TouchEvent) => {
      if (drawerRef.current && drawerRef.current.contains(e.target as Node)) return;
      e.preventDefault();
    };
    document.documentElement.addEventListener("touchmove", blockTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.overscrollBehavior = prevOverscroll;
      document.documentElement.removeEventListener("touchmove", blockTouchMove);
    };
  }, [isOpen]);

  function toggleNoodle(nt: NoodleType) {
    setSelectedNoodles((prev) =>
      prev.includes(nt) ? prev.filter((x) => x !== nt) : [...prev, nt],
    );
  }

  function toggleTopping(id: string) {
    setSelectedToppingIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function calcDishPrice(
    noodles: NoodleType[],
    toppingIds: string[],
  ): { base: number; total: number } {
    // Only the first noodle type sets the base price (combos don't add extra)
    const base = noodles.length > 0 ? noodlePrice(noodles[0]) : 0;
    const extras = toppingIds.reduce((s, id) => s + toppingPrice(id), 0);
    return { base, total: base + extras };
  }

  function addDish() {
    if (selectedNoodles.length === 0) return;
    const { base, total } = calcDishPrice(selectedNoodles, selectedToppingIds);
    setCart((prev) => [
      ...prev,
      {
        _localId: ++_localCounter,
        noodleTypes: [...selectedNoodles],
        toppings: [...selectedToppingIds],
        customerNote: note.trim() || undefined,
        basePrice: base,
        totalDishPrice: total,
      },
    ]);
    setSelectedNoodles([]);
    setSelectedToppingIds([]);
    setNote("");
  }

  function removeDish(localId: number) {
    setCart((prev) => prev.filter((d) => d._localId !== localId));
  }

  const cartSubtotal = cart.reduce((s, d) => s + d.totalDishPrice, 0);
  const cartHolidayFeeAmount = holidayFee.enabled
    ? holidayFee.feeType === "percent"
      ? Math.round(cartSubtotal * (holidayFee.amount / 100))
      : holidayFee.amount
    : 0;
  const cartTotal = cartSubtotal + cartHolidayFeeAmount;

  async function confirmOrder() {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      const body: CreateOrderInput = {
        tableNumber: tableNum || "—",
        dishes: cart.map((d) => ({
          noodleTypes: d.noodleTypes,
          toppings: d.toppings,
          customerNote: d.customerNote,
        })),
        ...(isScheduled && scheduledAt && {
          scheduleOrder: {
            scheduledAt: new Date(scheduledAt).toISOString(),
            customerName: customerName.trim() || undefined,
            customerPhone: customerPhone.trim() || undefined,
          },
        }),
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        // Reset all order state
        setCart([]);
        setSelectedNoodles([]);
        setSelectedToppingIds([]);
        setNote("");
        setTableNum(tableNumber ?? generateTableNum());
        setIsScheduled(false);
        setScheduledAt(() => {
          const d = new Date();
          d.setDate(d.getDate() + 1);
          d.setHours(14, 0, 0, 0);
          return d.toISOString().slice(0, 16);
        });
        setCustomerName("");
        setCustomerPhone("");
        onOrderCreated();
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  }

  const { base: previewBase, total: previewTotal } = calcDishPrice(
    selectedNoodles,
    selectedToppingIds,
  );

  return (
    <div ref={drawerRef} className={`fixed bottom-0 left-0 w-full bg-surface-container-lowest rounded-t-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] max-h-max overflow-y-auto  flex flex-col z-[60] transition-all duration-500 ${isOpen ? "top-[5vh]" : "top-[100vh]"}`}>

        {/* Handle & Header */}
        <div className="sticky top-0 bg-surface-container-lowest z-10 px-6 pt-5 pb-3">
          <div className="w-10 h-1 bg-surface-dim rounded-full mx-auto mb-4" />
          <div className="flex justify-between items-start">
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-secondary font-medium">
                Gọi món
              </p>
              <h2 className="font-headline text-xl text-primary">Tạo Đơn</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsScheduled((v) => !v)}
                className={`btn btn-sm gap-1 rounded-full px-3 ${isScheduled ? "bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200" : "btn-ghost text-on-surface-variant"}`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15, fontVariationSettings: isScheduled ? "'FILL' 1" : "'FILL' 0" }}>schedule</span>
                <span className="text-xs font-medium">Đặt trước</span>
              </button>
              <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-6">

          {/* ── Số bàn ── */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-on-surface-variant">
              Số bàn
            </legend>
            <input
              type="text"
              value={tableNum}
              onChange={(e) => setTableNum(e.target.value)}
              className="input input-bordered w-full focus:outline-primary font-mono text-base"
            />
            <p className="fieldset-label">Để trống nếu mang về</p>
          </fieldset>

          {/* ── Đặt trước ── */}
          {isScheduled && (
            <div className="bg-purple-50/60 border border-purple-200/80 rounded-2xl p-4 space-y-3">
              <p className="font-label text-xs font-semibold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>schedule</span>
                Thông tin đặt trước
              </p>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-on-surface-variant">Thời gian hẹn</legend>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="input input-bordered w-full focus:outline-primary text-base"
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-on-surface-variant">Tên khách hàng</legend>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="VD: Nguyễn Văn A"
                  className="input input-bordered w-full focus:outline-primary text-base"
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-on-surface-variant">Số điện thoại</legend>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="VD: 0912 345 678"
                  className="input input-bordered w-full focus:outline-primary text-base"
                />
              </fieldset>
            </div>
          )}

          {/* ── Loại sợi ── */}
          <div>
            <p className="font-label text-xs uppercase tracking-widest font-semibold mb-4 text-on-surface-variant flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
              Chọn Loại Sợi{" "}
              <span className="text-[9px] opacity-60">(nhiều loại = tô hỗn hợp)</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ALL_NOODLE_TYPES.map((nt) => (
                <button
                  key={nt}
                  type="button"
                  onClick={() => toggleNoodle(nt)}
                  className={`btn btn-outline h-auto py-2.5 flex-col items-start gap-0.5 rounded-xl border-2 transition-all ${
                    selectedNoodles.includes(nt)
                      ? "border-secondary bg-secondary-fixed text-on-surface hover:bg-secondary-fixed hover:border-secondary"
                      : "border-transparent bg-surface-container-low hover:bg-surface-container-high hover:border-transparent text-on-surface"
                  }`}
                >
                  <span className="font-semibold text-sm">{nt}</span>
                  <span className="text-[10px] opacity-60 font-normal">
                    {noodlePrice(nt).toLocaleString()}đ
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Topping theo danh mục ── */}
          {TOPPINGS_BY_CATEGORY.map(({ category, items }) => (
            <div key={category}>
              <p className="font-label text-xs uppercase tracking-widest font-semibold mb-3 text-on-surface-variant flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTopping(t.id)}
                    className={`btn btn-sm btn-outline rounded-full gap-1 border-2 transition-all ${
                      selectedToppingIds.includes(t.id)
                        ? "btn-secondary border-green-600 font-bold text-base"
                        : "border-outline-variant text-on-surface hover:border-secondary/50 bg-transparent hover:bg-transparent"
                    }`}
                  >
                    {t.name}
                    <span className="opacity-60">+{toppingPrice(t.id).toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* ── Ghi chú khách hàng ── */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-on-surface-variant">
              Ghi chú khách hàng
            </legend>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: ít bánh, không giá, thêm nước lèo…"
              className="textarea textarea-bordered w-full focus:outline-primary resize-none text-base"
            />
          </fieldset>

          {/* ── Xem trước giá ── */}
          {selectedNoodles.length > 0 && (
            <div className="flex items-center justify-between bg-surface-container-low rounded-xl p-4">
              <div>
                <p className="text-on-surface-variant text-xs">
                  Sợi: {previewBase.toLocaleString()}đ
                </p>
                <p className="text-on-surface-variant text-xs">
                  Topping: +{(previewTotal - previewBase).toLocaleString()}đ
                </p>
              </div>
              <span className="font-headline font-bold text-secondary text-xl">
                {previewTotal.toLocaleString()}đ
              </span>
            </div>
          )}

          {/* ── Nút Xóa / Thêm tô ── */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedNoodles([]);
                setSelectedToppingIds([]);
                setNote("");
              }}
              className="btn btn-ghost flex-1 text-primary border border-outline-variant"
            >
              Xóa
            </button>
            <button
              type="button"
              onClick={addDish}
              disabled={selectedNoodles.length === 0}
              className="btn flex-1 lacquer-gradient text-on-primary border-0 hover:opacity-90 disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Thêm tô
            </button>
          </div>

          {/* ── Đơn hiện tại ── */}
          {cart.length > 0 && (
              <div className="bg-surface-container-low rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-headline text-base text-primary font-bold">Đơn hiện tại</h3>
                <div className="badge badge-secondary font-bold uppercase tracking-wide">
                  {cart.length} tô
                </div>
              </div>

              {cart.map((dish) => (
                <div
                  key={dish._localId}
                  className="flex items-start justify-between border-t border-surface-container pt-3 gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-on-surface text-sm">
                      {dish.noodleTypes.join(" + ")}
                    </p>
                    {dish.toppings.length > 0 && (
                      <p className="text-on-surface-variant text-xs mt-0.5 truncate">
                        +{" "}
                        {dish.toppings
                          .map((id) => TOPPING_MAP.get(id)?.name ?? id)
                          .join(", ")}
                      </p>
                    )}
                    {dish.customerNote && (
                      <p className="text-primary/70 italic text-xs mt-0.5">
                        <span className="not-italic font-semibold text-on-surface-variant not-italic">Ghi chú: </span>
                        &ldquo;{dish.customerNote}&rdquo;
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-headline font-bold text-on-surface text-sm">
                      {dish.totalDishPrice.toLocaleString()}đ
                    </span>
                    <button
                      type="button"
                      onClick={() => removeDish(dish._localId)}
                      className="btn btn-xs btn-ghost btn-circle text-error/60 hover:text-error hover:bg-error/10"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>
              ))}

              <div className="divider my-0" />

              {holidayFee.enabled && (
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>celebration</span>
                    Phí lễ/tết{holidayFee.feeType === "percent" ? ` (${holidayFee.amount}%)` : ""}
                  </span>
                  <span>+{cartHolidayFeeAmount.toLocaleString()}đ</span>
                </div>
              )}

              <div className="flex justify-between font-headline font-bold text-primary text-base">
                <span>Tổng cộng</span>
                <span>{cartTotal.toLocaleString()}đ</span>
              </div>

              <button
                type="button"
                onClick={confirmOrder}
                disabled={submitting}
                className={`btn btn-block border-0 hover:opacity-90 disabled:opacity-60 ${isScheduled ? "bg-purple-600 text-white hover:bg-purple-700" : "lacquer-gradient text-on-primary"}`}
              >
                {submitting ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">{isScheduled ? "bookmark_added" : "send"}</span>
                    {isScheduled ? "Lưu Đặt Trước" : "Gửi vào bếp"}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
    </div>
  );
}
