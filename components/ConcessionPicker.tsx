"use client";

import { useMemo } from "react";

export type ConItem = {
  id: string;
  name: string;
  price: number;   // VND
  type: "popcorn" | "drink" | "combo" | "snack";
  unit?: string;   // ly, bắp, set...
};

export type ConSelection = Record<string, number>; // {itemId: qty}

type Props = {
  items: ConItem[];
  value: ConSelection;
  onChange: (next: ConSelection) => void;
};

export default function ConcessionPicker({ items, value, onChange }: Props) {
  const total = useMemo(
    () => items.reduce((s, it) => s + (value[it.id] || 0) * it.price, 0),
    [items, value]
  );

  const setQty = (id: string, next: number) => {
    const v = Math.max(0, Math.min(99, next|0));
    const copy = { ...value };
    if (v === 0) delete copy[id];
    else copy[id] = v;
    onChange(copy);
  };

  const fmt = (n: number) =>
    n.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

  return (
    <div className="bk-card">
      <h2 className="section-heading">5) Bắp &amp; Nước</h2>

      <div className="bk-con-grid">
        {items.map((it) => {
          const q = value[it.id] || 0;
          return (
            <div key={it.id} className="bk-con-item">
              <div className="bk-con-head">
                <span className={`bk-con-badge ${it.type}`}>{label(it.type)}</span>
                <div className="bk-con-name">{it.name}</div>
              </div>

              <div className="bk-con-price">{fmt(it.price)}</div>

              <div className="bk-con-qty">
                <button className="bk-stepper" onClick={() => setQty(it.id, q - 1)} aria-label="minus">−</button>
                <input
                  className="bk-stepper-input"
                  inputMode="numeric"
                  value={q}
                  onChange={(e) => setQty(it.id, parseInt(e.target.value || "0", 10))}
                />
                <button className="bk-stepper" onClick={() => setQty(it.id, q + 1)} aria-label="plus">+</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bk-con-footer">
        <div className="bk-con-note">* Không bắt buộc. Bạn có thể thêm bắp nước sau.</div>
        <div className="bk-con-total">
          Tổng bắp nước: <strong>{fmt(total)}</strong>
        </div>
      </div>
    </div>
  );
}

function label(t: ConItem["type"]) {
  switch (t) {
    case "combo": return "Combo";
    case "popcorn": return "Bắp";
    case "drink": return "Nước";
    default: return "Snack";
  }
}
