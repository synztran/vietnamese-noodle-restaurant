"use client";

import { useState, useEffect, useRef } from "react";
import {
  NoodleType,
  ToppingCategory,
  NOODLE_PRICES,
  MENU_TOPPINGS,
  type IDish,
  type ITopping,
  type CreateOrderInput,
} from "@/lib/types";

// Topping lookup map for price display
const TOPPING_MAP = new Map<string, ITopping>(MENU_TOPPINGS.map((t) => [t.id, t]));

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

export default function TakeOrderDrawer({ onClose, onOrderCreated, tableNumber }: Props) {
  const [selectedNoodles, setSelectedNoodles] = useState<NoodleType[]>([]);
  const [selectedToppingIds, setSelectedToppingIds] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [cart, setCart] = useState<CartDish[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [tableNum, setTableNum] = useState(() => tableNumber ?? generateTableNum());
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll and prevent pull-to-refresh while drawer is open,
  // but allow normal touch-scrolling inside the drawer panel itself.
  useEffect(() => {
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
  }, []);

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
    const base = noodles.reduce((s, nt) => s + NOODLE_PRICES[nt], 0);
    const extras = toppingIds.reduce(
      (s, id) => s + (TOPPING_MAP.get(id)?.price ?? 0),
      0,
    );
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

  const cartTotal = cart.reduce((s, d) => s + d.totalDishPrice, 0);

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
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
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
    <div ref={drawerRef} className="fixed bottom-0 left-0 w-full bg-surface-container-lowest rounded-t-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] max-h-[80vh] overflow-y-auto overscroll-none no-scrollbar flex flex-col z-[60]">

        {/* Handle & Header */}
        <div className="sticky top-0 bg-surface-container-lowest z-10 px-6 pt-5 pb-3">
          <div className="w-10 h-1 bg-surface-dim rounded-full mx-auto mb-4" />
          <div className="flex justify-between items-start">
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-secondary font-medium">
                Gọi món
              </p>
              <h2 className="font-headline text-xl text-primary">Tạo Tô Mới</h2>
            </div>
            <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
              <span className="material-symbols-outlined text-on-surface-variant">close</span>
            </button>
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
                    {NOODLE_PRICES[nt].toLocaleString()}đ
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
                    <span className="opacity-60">+{t.price.toLocaleString()}</span>
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

              <div className="flex justify-between font-headline font-bold text-primary text-base">
                <span>Tổng cộng</span>
                <span>{cartTotal.toLocaleString()}đ</span>
              </div>

              <button
                type="button"
                onClick={confirmOrder}
                disabled={submitting}
                className="btn btn-block lacquer-gradient text-on-primary border-0 hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">send</span>
                    Gửi vào bếp
                  </>
                )}
              </button>
            </div>
          )}
        </div>
    </div>
  );
}
