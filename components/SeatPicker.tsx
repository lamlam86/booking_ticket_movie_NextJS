"use client";

import { useMemo } from "react";

type SeatPickerProps = {
  rows: string[];          // ví dụ: ['A'..'H']
  seatsPerRow: number;     // ví dụ: 8 -> A1..A8
  reserved?: string[];     // ghế đã đặt: ['A1','B3',...]
  value: string[];         // ghế đang chọn
  onChange: (next: string[]) => void;
  maxSelect?: number;      // mặc định 8
};

export default function SeatPicker({
  rows,
  seatsPerRow,
  reserved = [],
  value,
  onChange,
  maxSelect = 8,
}: SeatPickerProps) {
  const reservedSet = useMemo(() => new Set(reserved), [reserved]);
  const selectedSet = useMemo(() => new Set(value), [value]);

  const toggleSeat = (code: string) => {
    if (reservedSet.has(code)) return; // ghế đã đặt thì không chọn được
    const next = new Set(selectedSet);
    if (next.has(code)) next.delete(code);
    else {
      if (next.size >= maxSelect) return;
      next.add(code);
    }
    onChange(Array.from(next).sort(sortSeatCode));
  };

  return (
    <div className="bk-card">
      <h2 className="section-heading">4) Chọn ghế</h2>

      <div className="bk-screen">MÀN HÌNH</div>

      <div className="bk-seat-grid">
        {rows.map((r) => (
          <div
            key={r}
            className="bk-seat-row"
            // quan trọng: set số cột động để hỗ trợ 8 ghế/hàng (hoặc bất kỳ)
            style={{ gridTemplateColumns: `32px repeat(${seatsPerRow}, 1fr)` }}
          >
            <div className="bk-seat-row-label">{r}</div>
            {Array.from({ length: seatsPerRow }, (_, i) => i + 1).map((n) => {
              const code = `${r}${n}`;
              const isReserved = reservedSet.has(code);
              const isSelected = selectedSet.has(code);
              return (
                <button
                  key={code}
                  type="button"
                  aria-label={`Seat ${code}`}
                  className={[
                    "bk-seat",
                    isReserved ? "bk-seat--reserved" : "",
                    isSelected ? "bk-seat--selected" : "",
                  ].join(" ")}
                  onClick={() => toggleSeat(code)}
                  disabled={isReserved}
                >
                  {n}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="bk-legend">
        <span className="bk-pill">Trống</span>
        <span className="bk-pill bk-pill--selected">Đang chọn</span>
        <span className="bk-pill bk-pill--reserved">Đã đặt</span>
      </div>
    </div>
  );
}

/** A1 < A2 < ... < B1 ... */
function sortSeatCode(a: string, b: string) {
  const [ra, na] = splitSeat(a);
  const [rb, nb] = splitSeat(b);
  if (ra < rb) return -1;
  if (ra > rb) return 1;
  return na - nb;
}
function splitSeat(s: string): [string, number] {
  const m = s.match(/^([A-Z]+)(\d+)$/i);
  if (!m) return [s, 0];
  return [m[1].toUpperCase(), parseInt(m[2], 10)];
}
