"use client";
import { useState, useEffect } from "react";

const STATUS_LABELS = {
  reserved: { label: "Đã đặt", color: "blue" },
  confirmed: { label: "Đã xác nhận", color: "green" },
  cancelled: { label: "Đã hủy", color: "red" }
};

const PAYMENT_STATUS = {
  pending: { label: "Chờ thanh toán", color: "orange" },
  paid: { label: "Đã thanh toán", color: "green" },
  failed: { label: "Thất bại", color: "red" },
  refunded: { label: "Hoàn tiền", color: "blue" }
};

export default function AdminTicketsPage() {
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [filters, setFilters] = useState({ 
    date: new Date().toISOString().split("T")[0]
  });

  useEffect(() => {
    fetchShowtimes();
  }, [filters.date]);

  async function fetchShowtimes() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.date) params.append("date", filters.date);
      
      const res = await fetch(`/api/admin/showtimes?${params}`);
      const data = await res.json();
      setShowtimes(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTickets(showtimeId) {
    setTicketsLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?showtime_id=${showtimeId}`);
      const data = await res.json();
      setTickets(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setTicketsLoading(false);
    }
  }

  function handleShowtimeSelect(showtime) {
    setSelectedShowtime(showtime);
    fetchTickets(showtime.id);
  }

  const stats = {
    totalShowtimes: showtimes.length,
    totalSeatsBooked: tickets.reduce((sum, t) => sum + t.seats.length, 0),
    paidTickets: tickets.filter(t => t.payment_status === "paid").length,
    totalRevenue: tickets.filter(t => t.payment_status === "paid").reduce((sum, t) => sum + t.total_amount, 0)
  };

  return (
    <div className="admin-stack">
      <div className="page-heading">
        <div>
          <p className="admin-eyebrow">Quản lý nội dung</p>
          <h2>Quản lý vé</h2>
        </div>
      </div>

      {/* Date Filter */}
      <div className="admin-filters" style={{gap: 16, flexWrap: "wrap"}}>
        <input
          type="date"
          className="admin-input"
          style={{width: "auto"}}
          value={filters.date}
          onChange={e => {
            setFilters({...filters, date: e.target.value});
            setSelectedShowtime(null);
            setTickets([]);
          }}
        />
        <select
          className="admin-input"
          style={{width: "auto", minWidth: 400}}
          value={selectedShowtime?.id || ""}
          onChange={e => {
            const st = showtimes.find(s => s.id.toString() === e.target.value);
            if (st) handleShowtimeSelect(st);
          }}
        >
          <option value="">-- Chọn suất chiếu để quản lý vé --</option>
          {showtimes.map(st => (
            <option key={st.id} value={st.id}>
              {st.movie.title} - {st.branch.name} - {st.screen.name} - {new Date(st.start_time).toLocaleTimeString("vi-VN", {hour: "2-digit", minute: "2-digit"})}
            </option>
          ))}
        </select>
      </div>

      {!selectedShowtime ? (
        <div className="admin-empty-state" style={{textAlign: "center", padding: "60px 20px"}}>
          <p style={{fontSize: "1.1rem", color: "var(--text-muted)"}}>Chọn suất chiếu để quản lý vé</p>
        </div>
      ) : (
        <>
          {/* Showtime Info */}
          <div className="dashboard-card" style={{padding: 20}}>
            <div style={{display: "flex", gap: 20, alignItems: "center"}}>
              {selectedShowtime.movie.poster_url && (
                <img 
                  src={selectedShowtime.movie.poster_url} 
                  alt="" 
                  style={{width: 80, height: 120, borderRadius: 8, objectFit: "cover"}} 
                />
              )}
              <div>
                <h3 style={{margin: 0}}>{selectedShowtime.movie.title}</h3>
                <p style={{margin: "8px 0", color: "var(--text-muted)"}}>
                  {selectedShowtime.branch.name} • {selectedShowtime.screen.name}
                </p>
                <p style={{margin: 0, color: "var(--text-soft)"}}>
                  {new Date(selectedShowtime.start_time).toLocaleString("vi-VN")} • Giá cơ bản: {selectedShowtime.base_price.toLocaleString()}đ
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <section className="dashboard-kpi-grid">
            <article className="dashboard-card kpi">
              <p>Vé đã bán</p>
              <strong>{stats.totalSeatsBooked}</strong>
              <span>Ghế đã đặt</span>
            </article>
            <article className="dashboard-card kpi">
              <p>Đã thanh toán</p>
              <strong>{stats.paidTickets}</strong>
              <span>Đơn đã thanh toán</span>
            </article>
            <article className="dashboard-card kpi">
              <p>Doanh thu</p>
              <strong>{stats.totalRevenue.toLocaleString()}đ</strong>
              <span>Từ vé đã thanh toán</span>
            </article>
          </section>

          {/* Tickets Table */}
          {ticketsLoading ? (
            <div className="admin-loading">Đang tải...</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Ghế</th>
                    <th>Tổng tiền</th>
                    <th>Thanh toán</th>
                    <th>Trạng thái</th>
                    <th>Ngày đặt</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.length === 0 ? (
                    <tr><td colSpan="7" className="admin-empty">Chưa có vé nào được đặt</td></tr>
                  ) : (
                    tickets.map(ticket => (
                      <tr key={ticket.id}>
                        <td><code>{ticket.booking_code}</code></td>
                        <td>
                          {ticket.user ? (
                            <div>
                              <strong>{ticket.user.name}</strong>
                              <div style={{fontSize: "0.8rem", color: "var(--text-muted)"}}>{ticket.user.email}</div>
                            </div>
                          ) : <span style={{color: "var(--text-muted)"}}>Khách vãng lai</span>}
                        </td>
                        <td>{ticket.seats.join(", ")}</td>
                        <td><strong>{ticket.total_amount.toLocaleString()}đ</strong></td>
                        <td>
                          <span className={`admin-badge admin-badge--${ticket.payment_status}`}>
                            {PAYMENT_STATUS[ticket.payment_status]?.label}
                          </span>
                        </td>
                        <td>
                          <span className={`admin-badge admin-badge--${ticket.status}`}>
                            {STATUS_LABELS[ticket.status]?.label}
                          </span>
                        </td>
                        <td style={{fontSize: "0.85rem"}}>{new Date(ticket.created_at).toLocaleString("vi-VN")}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
