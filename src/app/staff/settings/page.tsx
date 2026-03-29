"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { NoodleType, ToppingCategory, MENU_TOPPINGS } from "@/lib/types";
import type { ISettings } from "@/lib/types";

const NOODLE_LABELS: Record<NoodleType, string> = {
  [NoodleType.HuTieu]: "Hủ tiếu",
  [NoodleType.BanhCanh]: "Bánh canh",
  [NoodleType.MiGoi]: "Mì gói",
  [NoodleType.MiBot]: "Mì bột",
  [NoodleType.MiTuoi]: "Mì tươi",
  [NoodleType.Nui]: "Nui",
};

const CATEGORY_LABELS: Record<ToppingCategory, string> = {
  [ToppingCategory.Chicken]: "Gà",
  [ToppingCategory.Pork]: "Heo",
  [ToppingCategory.Seafood]: "Hải sản",
  [ToppingCategory.Side]: "Món kèm",
  [ToppingCategory.Special]: "Đặc biệt",
};

function PriceInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [raw, setRaw] = useState(String(value));

  // Sync display when external value changes (e.g. on load)
  useEffect(() => {
    setRaw(String(value));
  }, [value]);

  return (
    <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1 shrink-0">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        className="input input-sm input-bordered w-28 text-right font-mono text-base"
        value={raw}
        onChange={(e) => {
          const digits = e.target.value.replace(/[^0-9]/g, "");
          setRaw(digits);
          const n = parseInt(digits, 10);
          onChange(isNaN(n) ? 0 : n);
        }}
        onBlur={() => setRaw(String(value))}
      />
    </div>
    <span className="text-xs text-right">{value.toLocaleString()}đ</span>
    </div>
  );
}

function SectionHeader({
  icon,
  label,
  iconColor = "text-primary",
}: {
  icon: string;
  label: string;
  iconColor?: string;
}) {
  return (
    <div className="px-4 py-3 border-b border-surface-container flex items-center gap-2">
      <span
        className={`material-symbols-outlined ${iconColor}`}
        style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
      <h2 className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">
        {label}
      </h2>
    </div>
  );
}

export default function StaffSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [noodlePrices, setNoodlePrices] = useState<Record<string, number>>({});
  const [toppingPrices, setToppingPrices] = useState<Record<string, number>>({});
  const [holidayFee, setHolidayFee] = useState<{ enabled: boolean; feeType: "absolute" | "percent"; amount: number }>({ enabled: false, feeType: "absolute", amount: 5000 });
  const [dailyTarget, setDailyTarget] = useState(15_000_000);
  const [monthlyTarget, setMonthlyTarget] = useState(400_000_000);
  const [applyForcePaid, setApplyForcePaid] = useState(false);

  // Track the last-saved snapshot
  const savedSnapshot = useRef({ noodlePrices: {}, toppingPrices: {}, holidayFee: { enabled: false, feeType: "absolute" as const, amount: 5000 }, dailyTarget: 15_000_000, monthlyTarget: 400_000_000, applyForcePaid: false } as {
    noodlePrices: Record<string, number>;
    toppingPrices: Record<string, number>;
    holidayFee: { enabled: boolean; feeType: "absolute" | "percent"; amount: number };
    dailyTarget: number;
    monthlyTarget: number;
    applyForcePaid: boolean;
  });

  const isDirty =
    JSON.stringify(noodlePrices) !== JSON.stringify(savedSnapshot.current.noodlePrices) ||
    JSON.stringify(toppingPrices) !== JSON.stringify(savedSnapshot.current.toppingPrices) ||
    holidayFee.enabled !== savedSnapshot.current.holidayFee.enabled ||
    holidayFee.feeType !== savedSnapshot.current.holidayFee.feeType ||
    holidayFee.amount !== savedSnapshot.current.holidayFee.amount ||
    dailyTarget !== savedSnapshot.current.dailyTarget ||
    monthlyTarget !== savedSnapshot.current.monthlyTarget ||
    applyForcePaid !== savedSnapshot.current.applyForcePaid;

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data: ISettings = await res.json();
        const np = (data.noodlePrices ?? {}) as Record<string, number>;
        const tp = data.toppingPrices ?? {};
        const hf = data.holidayServiceFee ?? { enabled: false, feeType: "absolute" as const, amount: 5000 };
        const dt = data.dailyTarget ?? 15_000_000;
        const mt = data.monthlyTarget ?? 400_000_000;
        const afp = data.applyForcePaid ?? false;
        setNoodlePrices(np);
        setToppingPrices(tp);
        setHolidayFee(hf);
        setDailyTarget(dt);
        setMonthlyTarget(mt);
        setApplyForcePaid(afp);
        savedSnapshot.current = { noodlePrices: np, toppingPrices: tp, holidayFee: hf, dailyTarget: dt, monthlyTarget: mt, applyForcePaid: afp };
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noodlePrices,
          toppingPrices,
          holidayServiceFee: holidayFee,
          dailyTarget,
          monthlyTarget,
          applyForcePaid,
        }),
      });
      // Update snapshot so isDirty resets to false
      savedSnapshot.current = { noodlePrices, toppingPrices, holidayFee, dailyTarget, monthlyTarget, applyForcePaid };
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-32 md:pb-10">
      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-40 bg-surface/95 silk-blur border-b border-surface-container safe-top">
        <div className="h-14 flex items-center justify-between px-5 max-w-2xl mx-auto">
          <h1 className="font-headline text-xl text-primary font-bold">
            Cài đặt
          </h1>
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-label font-bold text-xs uppercase tracking-wider transition-all active:scale-95 ${
              saved
                ? "bg-emerald-500 text-white"
                : isDirty
                ? "lacquer-gradient text-on-primary"
                : "bg-surface-container text-on-surface-variant cursor-not-allowed opacity-50"
            }`}
          >
          {saving ? (
            <span className="loading loading-spinner loading-xs" />
          ) : saved ? (
            <>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              Đã lưu
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                save
              </span>
              Lưu
            </>
          )}
        </button>
        </div>
      </div>

      <div className="px-4 max-w-2xl mx-auto space-y-4 pt-4">

        {/* ── Revenue targets ── */}
        <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
          <SectionHeader icon="flag" label="Mục tiêu doanh thu" />
          <div className="px-4 py-4 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-on-surface">Mục tiêu ngày</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Doanh thu mỗi ngày</p>
              </div>
              <PriceInput value={dailyTarget} onChange={setDailyTarget} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-on-surface">Mục tiêu tháng</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Doanh thu mỗi tháng</p>
              </div>
              <PriceInput value={monthlyTarget} onChange={setMonthlyTarget} />
            </div>
          </div>
        </section>

        {/* ── Holiday service fee ── */}
        <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
          <SectionHeader icon="celebration" label="Phí phục vụ lễ/tết" iconColor="text-secondary" />
          <div className="px-4 py-4 space-y-4">
            {/* Enable toggle */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-on-surface">Kích hoạt phí lễ/tết</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Cộng thêm vào mỗi đơn hàng</p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary toggle-sm"
                checked={holidayFee.enabled}
                onChange={(e) => setHolidayFee((f) => ({ ...f, enabled: e.target.checked }))}
              />
            </div>

            {/* Fee type + amount — dimmed when disabled */}
            <div className={`space-y-3 transition-opacity ${holidayFee.enabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
              {/* Type selector */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-on-surface">Loại phí</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">Cố định hoặc theo %</p>
                </div>
                <div className="flex rounded-lg overflow-hidden border border-surface-container-high text-xs font-bold shrink-0">
                  <button
                    type="button"
                    onClick={() => setHolidayFee((f) => ({ ...f, feeType: "absolute", amount: f.feeType === "percent" ? 5000 : f.amount }))}
                    className={`px-3 py-1.5 transition-colors ${holidayFee.feeType === "absolute" ? "bg-primary text-on-primary" : "bg-surface text-on-surface-variant"}`}
                  >
                    VNĐ
                  </button>
                  <button
                    type="button"
                    onClick={() => setHolidayFee((f) => ({ ...f, feeType: "percent", amount: f.feeType === "absolute" ? 10 : f.amount }))}
                    className={`px-3 py-1.5 transition-colors ${holidayFee.feeType === "percent" ? "bg-primary text-on-primary" : "bg-surface text-on-surface-variant"}`}
                  >
                    %
                  </button>
                </div>
              </div>

              {/* Amount input */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-on-surface">Mức phí mỗi đơn</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {holidayFee.feeType === "percent" ? "Phần trăm trên tổng đơn (0–100)" : "Số tiền cố định (VNĐ)"}
                  </p>
                </div>
                {holidayFee.feeType === "percent" ? (
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      className="input input-sm input-bordered w-20 text-right font-mono text-base"
                      value={holidayFee.amount === 0 ? "" : String(holidayFee.amount)}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9.]/g, "");
                        const n = parseFloat(raw);
                        setHolidayFee((f) => ({ ...f, amount: isNaN(n) ? 0 : Math.min(100, Math.max(0, n)) }));
                      }}
                    />
                    <span className="text-sm text-on-surface-variant">%</span>
                  </div>
                ) : (
                  <PriceInput
                    value={holidayFee.amount}
                    onChange={(v) => setHolidayFee((f) => ({ ...f, amount: v }))}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Special config */}
        <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
          <SectionHeader icon="celebration" label="Thiết lập đặc biệt" iconColor="text-secondary" />
          <div className="px-4 py-4 space-y-4">
            {/* Enable toggle */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-on-surface">Kích hoạt thiết lập thu tiền</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Nhân viên có thể áp dụng các thiết lập thu tiền đặc biệt cho mỗi đơn hàng</p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary toggle-sm"
                checked={applyForcePaid}
                onChange={(e) => setApplyForcePaid(e.target.checked)}
              />
            </div>
          </div>
        </section>

        {/* ── Main dish prices ── */}
        <div className="collapse collapse-arrow bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
          <input type="checkbox" defaultChecked />
          <div className="collapse-title px-4 py-3 border-b border-surface-container flex items-center gap-2 !pr-12">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
            >
              ramen_dining
            </span>
            <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Giá món chính
            </span>
          </div>
          <div className="collapse-content !px-0 !pb-0">
            <div className="px-4 py-4 space-y-3">
              <p className="text-xs text-on-surface-variant italic mb-1">
                Giá cơ bản mỗi loại sợi. Ghép nhiều sợi sẽ cộng dồn.
              </p>
              {Object.values(NoodleType).map((nt) => (
                <div key={nt} className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-on-surface">{NOODLE_LABELS[nt]}</p>
                  <PriceInput
                    value={noodlePrices[nt] ?? 0}
                    onChange={(v) => setNoodlePrices((p) => ({ ...p, [nt]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Topping prices by category ── */}
        {Object.values(ToppingCategory).map((cat) => {
          const toppings = MENU_TOPPINGS.filter((t) => t.category === cat);
          return (
            <div
              key={cat}
              className="collapse collapse-arrow bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm"
            >
              <input type="checkbox" />
              <div className="collapse-title px-4 py-3 border-b border-surface-container flex items-center gap-2 !pr-12">
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
                >
                  add_circle
                </span>
                <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Topping – {CATEGORY_LABELS[cat]}
                </span>
              </div>
              <div className="collapse-content !px-0 !pb-0">
                <div className="px-4 py-4 space-y-3">
                  {toppings.map((t) => (
                    <div key={t.id} className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-on-surface">{t.name}</p>
                      <PriceInput
                        value={toppingPrices[t.id] ?? 0}
                        onChange={(v) =>
                          setToppingPrices((p) => ({ ...p, [t.id]: v }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Account ── */}
        <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
          <SectionHeader icon="manage_accounts" label="Tài khoản" iconColor="text-on-surface-variant" />
          <div className="px-4 py-4 space-y-1">
            <p className="font-headline text-on-surface font-bold">Quản lý</p>
            <p className="text-sm text-on-surface-variant">Đặc quyền Chủ quán</p>
            <p className="text-sm text-on-surface-variant mt-2">Trạm Bến Tre #1</p>
          </div>
        </section>

        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-xl border-2 border-error/30 text-error font-body font-semibold active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Đăng xuất
        </button>
      </div>


    </div>
  );
}
