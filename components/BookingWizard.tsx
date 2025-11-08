"use client";

import { useMemo, useState } from "react";
import SeatPicker from "./SeatPicker";
import ConcessionPicker, { ConItem, ConSelection } from "./ConcessionPicker";

type State = {
  date: string | null;
  theater: string | null;
  time: string | null;
  seats: string[];
  concessions: ConSelection; // NEW
};

export default function BookingWizard() {
  // 7 ngày kế tiếp
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("vi-VN", {
        weekday: "short", day: "2-digit", month: "2-digit",
      });
      return { key, label };
    });
  }, []);

  // mock data suất chiếu (y như trước)
  const DATA = useMemo(
    () => ({
      "Cinestar Mỹ Tho": {
        [days[0].key]: ["10:30", "13:00", "15:30", "19:00"],
        [days[1].key]: ["09:45", "14:15", "21:10"],
      },
      "Cinestar Kiên Giang": {
        [days[0].key]: ["11:00", "16:10", "20:20"],
        [days[2].key]: ["09:00", "12:30", "18:45"],
      },
      "Cinestar Huế": {
        [days[1].key]: ["10:00", "15:00", "19:30"],
        [days[3].key]: ["08:40", "13:00", "17:20", "21:00"],
      },
    }),
    [days]
  );

  // ghế đã đặt demo
  const getReservedSeats = (date: string | null, theater: string | null, time: string | null): string[] => {
    if (!date || !theater || !time) return [];
    const key = `${date}|${theater}|${time}`;
    const map: Record<string, string[]> = {
      [`${days[0].key}|Cinestar Mỹ Tho|13:00`]: ["A1", "A2", "D5", "H8"],
      [`${days[0].key}|Cinestar Kiên Giang|11:00`]: ["C5", "C6"],
    };
    return map[key] || ["B5"];
  };

  // Bảng bắp nước mẫu
  const CON_ITEMS: ConItem[] = [
    { id: "combo-couple", name: "Combo Couple (Bắp lớn + 2 Nước)", price: 105000, type: "combo" },
    { id: "combo-fam", name: "Combo Family (Bắp lớn + 3 Nước)", price: 145000, type: "combo" },
    { id: "pop-l", name: "Bắp L", price: 45000, type: "popcorn" },
    { id: "pop-m", name: "Bắp M", price: 35000, type: "popcorn" },
    { id: "drink-coke", name: "Coke 500ml", price: 30000, type: "drink" },
    { id: "drink-sprite", name: "Sprite 500ml", price: 30000, type: "drink" },
    { id: "snack-sausage", name: "Xúc xích nướng", price: 40000, type: "snack" },
  ];

  const [st, setSt] = useState<State>({
    date: null,
    theater: null,
    time: null,
    seats: [],
    concessions: {}, // NEW
  });

  const theatersForDate = (date: string | null) => {
    if (!date) return [];
    return Object.entries(DATA)
      .filter(([, schedule]) => (schedule as any)[date as string])
      .map(([name, schedule]) => ({ name, times: (schedule as any)[date as string] as string[] }));
  };

  const timesForSelection = () => {
    if (!st.date || !st.theater) return [];
    return (DATA as any)[st.theater]?.[st.date] ?? [];
  };

  const reserved = useMemo(
    () => getReservedSeats(st.date, st.theater, st.time),
    [st.date, st.theater, st.time]
  );

  const canBook = !!(st.date && st.theater && st.time && st.seats.length > 0);

  // Pricing demo
  const TICKET_PRICE = 90000; // /ghế
  const ticketTotal = st.seats.length * TICKET_PRICE;
  const concessionTotal = useMemo(
    () =>
      CON_ITEMS.reduce((s, it) => s + (st.concessions[it.id] || 0) * it.price, 0),
    [CON_ITEMS, st.concessions]
  );
  const grandTotal = ticketTotal + concessionTotal;

  const fmt = (n: number) =>
    n.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

  const resetAll = () =>
    setSt({ date: null, theater: null, time: null, seats: [], concessions: {} });

  return (
    <>
      {/* 1) Chọn ngày */}
      <section className="bk-card">
        <div className="bk-row">
          <h2 className="section-heading">1) Chọn ngày</h2>
          {!st.date && <span className="bk-hint">Hãy chọn ngày</span>}
        </div>
        <div className="bk-grid bk-cols-4">
          {days.map((d) => (
            <button
              key={d.key}
              className={`bk-btn ${st.date === d.key ? "is-active" : ""}`}
              onClick={() => setSt({ date: d.key, theater: null, time: null, seats: [], concessions: {} })}
            >
              {d.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2) Chọn rạp */}
      <section className="bk-card">
        <div className="bk-row">
          <h2 className="section-heading">2) Chọn rạp</h2>
          {!st.date && <span className="bk-hint">Chọn ngày trước</span>}
        </div>
        <div className="bk-grid bk-cols-3">
          {st.date ? (
            theatersForDate(st.date).length ? (
              theatersForDate(st.date).map((t) => (
                <button
                  key={t.name}
                  className={`bk-btn ${st.theater === t.name ? "is-active" : ""}`}
                  onClick={() =>
                    setSt((s) => ({ ...s, theater: t.name, time: null, seats: [], concessions: {} }))
                  }
                >
                  {t.name}
                </button>
              ))
            ) : (
              <span className="bk-hint">Ngày này chưa có suất chiếu.</span>
            )
          ) : null}
        </div>
      </section>

      {/* 3) Chọn giờ */}
      <section className="bk-card">
        <div className="bk-row">
          <h2 className="section-heading">3) Chọn giờ</h2>
          {!st.theater && <span className="bk-hint">Chọn rạp để xem giờ chiếu</span>}
        </div>
        <div className="bk-grid bk-cols-4">
          {st.theater &&
            timesForSelection().map((t: string) => (
              <button
                key={t}
                className={`bk-btn ${st.time === t ? "is-active" : ""}`}
                onClick={() => setSt((s) => ({ ...s, time: t, seats: [], concessions: {} }))}
              >
                {t}
              </button>
            ))}
        </div>
      </section>

      {/* 4) Chọn ghế */}
      {st.time && (
        <SeatPicker
          rows={["A","B","C","D","E","F","G","H"]}
          seatsPerRow={8}
          reserved={reserved}
          value={st.seats}
          onChange={(next) => setSt((s) => ({ ...s, seats: next }))}
          maxSelect={8}
        />
      )}

      {/* 5) Bắp & Nước */}
      {st.time && (
        <ConcessionPicker
          items={CON_ITEMS}
          value={st.concessions}
          onChange={(next) => setSt((s) => ({ ...s, concessions: next }))}
        />
      )}

      {/* Summary + CTA */}
      <section className="bk-card">
        <div className="bk-footer">
          <div className={`bk-summary ${canBook ? "" : "muted"}`}>
            {canBook ? (
              <>
                <strong>Thông tin đặt vé</strong><br/>
                Ngày: <strong>{st.date}</strong> | Rạp: <strong>{st.theater}</strong> | Giờ: <strong>{st.time}</strong><br/>
                Ghế: <strong>{st.seats.join(", ")}</strong><br/>
                Vé: <strong>{fmt(ticketTotal)}</strong> • Bắp nước: <strong>{fmt(concessionTotal)}</strong><br/>
                <span>Tổng thanh toán: <strong>{fmt(grandTotal)}</strong></span>
              </>
            ) : (<>Chưa chọn đủ thông tin.</>)}
          </div>

          <div className="bk-actions">
            <button className="bk-btn ghost" onClick={resetAll}>Làm lại</button>
            <button
              className="bk-btn primary"
              disabled={!canBook}
              onClick={() =>
                alert(
                  `Đặt vé:\nNgày: ${st.date}\nRạp: ${st.theater}\nGiờ: ${st.time}\nGhế: ${st.seats.join(", ")}\n` +
                  `Bắp nước: ${JSON.stringify(st.concessions)}\n` +
                  `Tổng: ${fmt(grandTotal)}`
                )
              }
            >
              Đặt vé
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
