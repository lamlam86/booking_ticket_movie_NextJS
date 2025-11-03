"use client";

import { useMemo, useState } from "react";

/** Wizard state */
type State = {
    date: string | null;
    theater: string | null;
    time: string | null;
};

export default function BookingWizard() {
    // 7 ngày kế tiếp (label: T2 03/04)
    const days = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const key = d.toISOString().slice(0, 10);
            const label = d.toLocaleDateString("vi-VN", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
            });
            return { key, label };
        });
    }, []);

    // DATA mock: rạp -> (date -> các suất)
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

    const [st, setSt] = useState<State>({ date: null, theater: null, time: null });

    const theatersForDate = (date: string | null) => {
        if (!date) return [];
        return Object.entries(DATA)
            .filter(([, schedule]) => schedule[date as string])
            .map(([name, schedule]) => ({ name, times: schedule[date as string] as string[] }));
    };

    const timesForSelection = () => {
        if (!st.date || !st.theater) return [];
        return DATA[st.theater]?.[st.date] ?? [];
    };

    const canBook = !!(st.date && st.theater && st.time);

    return (
        <>
            {/* B1: Chọn ngày */}
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
                            onClick={() => setSt({ date: d.key, theater: null, time: null })}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* B2: Chọn rạp */}
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
                                    onClick={() => setSt((s) => ({ ...s, theater: t.name, time: null }))}
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

            {/* B3: Chọn giờ */}
            <section className="bk-card">
                <div className="bk-row">
                    <h2 className="section-heading">3) Chọn giờ</h2>
                    {!st.theater && <span className="bk-hint">Chọn rạp để xem giờ chiếu</span>}
                </div>

                <div className="bk-grid bk-cols-4">
                    {st.theater &&
                        timesForSelection().map((t) => (
                            <button
                                key={t}
                                className={`bk-btn ${st.time === t ? "is-active" : ""}`}
                                onClick={() => setSt((s) => ({ ...s, time: t }))}
                            >
                                {t}
                            </button>
                        ))}
                </div>
            </section>

            {/* Tóm tắt + CTA */}
            <section className="bk-card">
                <div className="bk-footer">
                    <div className={`bk-summary ${canBook ? "" : "muted"}`}>
                        {canBook ? (
                            <>
                                <strong>Thông tin đặt vé</strong>
                                <br />
                                Ngày: <strong>{st.date}</strong> | Rạp: <strong>{st.theater}</strong> | Giờ:{" "}
                                <strong>{st.time}</strong>
                                <br />
                                Sẵn sàng thanh toán (demo).
                            </>
                        ) : (
                            <>Chưa chọn đủ thông tin.</>
                        )}
                    </div>

                    <div className="bk-actions">
                        <button
                            className="bk-btn ghost"
                            onClick={() => setSt({ date: null, theater: null, time: null })}
                        >
                            Làm lại
                        </button>
                        <button
                            className="bk-btn primary"
                            disabled={!canBook}
                            onClick={() =>
                                alert(
                                    `Demo: Đặt vé thành công!\nNgày: ${st.date}\nRạp: ${st.theater}\nGiờ: ${st.time}`
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
