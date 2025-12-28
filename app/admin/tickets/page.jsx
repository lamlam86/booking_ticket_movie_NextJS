"use client";
import { useState, useEffect } from "react";

const SEAT_TYPE_LABELS = {
  standard: "Thường",
  vip: "VIP",
  couple: "Đôi",
  disabled: "Khuyết tật"
};

const STATUS_LABELS = {
  reserved: "Đang giữ",
  confirmed: "Đã xác nhận",
  cancelled: "Đã hủy"
};

const PAYMENT_LABELS = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  refunded: "Đã hoàn tiền",
  failed: "Thất bại"
};

export default function AdminTicketsPage() {
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [filters, setFilters] = useState({ date: new Date().toISOString().split("T")[0] });

  useEffect(() => {
    fetchShowtimes();
  }, [filters.date]);

  async function fetchShowtimes() {
    try {
      const params = new URLSearchParams();
      if (filters.date) params.append("date", filters.date);
      const res = await fetch(`/api/admin/showtimes?${params}`);
      const data = await res.json();
      setShowtimes(data.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchTicketData(showtimeId) {
    if (!showtimeId) {
      setTicketData(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tickets?showtime_id=${showtimeId}`);
      const data = await res.json();
      if (res.ok) {
        setTicketData(data.data);
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleShowtimeChange(e) {
    const id = e.target.value;
    setSelectedShowtime(id);
    setSelectedSeats([]);
    fetchTicketData(id);
  }

  function toggleSeat(seat) {
    if (seat.isBooked) return;
    setSelectedSeats(prev => 
      prev.includes(seat.id) 
        ? prev.filter(id => id !== seat.id)
        : [...prev, seat.id]
    );
  }

  function openCreateModal() {
    if (selectedSeats.length === 0) {
      setMessage({ type: "error", text: "Vui lòng chọn ghế" });
      setTimeout(() => setMessage({ type: "", text: "" }), 2000);
      return;
    }
    setShowCreateModal(true);
  }

  async function handleCreateTicket(e) {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/admin/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showtime_id: selectedShowtime,
          seat_ids: selectedSeats
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setMessage({ type: "success", text: `Tạo vé thành công! Mã: ${data.data.code}` });
      setSelectedSeats([]);
      fetchTicketData(selectedShowtime);
      setTimeout(() => setShowCreateModal(false), 1500);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  // Group seats by row and sort
  const seatsByRow = ticketData?.seats?.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {}) || {};
  
  const sortedRows = Object.keys(seatsByRow).sort();

  return (
    <div className="admin-stack">
      <div className="page-heading">
        <div>
          <p className="admin-eyebrow">Quản lý nội dung</p>
          <h2>Quản lý vé</h2>
        </div>
      </div>

      {message.text && (
        <div className={`admin-message admin-message--${message.type}`}>{message.text}</div>
      )}

      {/* Filters */}
      <div className="admin-filters" style={{ gap: 16, flexWrap: "wrap" }}>
        <input
          type="date"
          className="admin-input"
          style={{ width: "auto" }}
          value={filters.date}
          onChange={e => setFilters({ ...filters, date: e.target.value })}
        />
        <select
          className="admin-input"
          style={{ width: "auto", minWidth: 400 }}
          value={selectedShowtime}
          onChange={handleShowtimeChange}
        >
          <option value="">-- Chọn suất chiếu --</option>
          {showtimes.map(st => (
            <option key={st.id} value={st.id}>
              {st.movie.title} - {st.branch.name} - {st.screen.name} - {new Date(st.start_time).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
            </option>
          ))}
        </select>
        {selectedSeats.length > 0 && (
          <button className="btn btn-primary" onClick={openCreateModal}>
            Tạo vé ({selectedSeats.length} ghế)
          </button>
        )}
      </div>

      {loading ? (
        <div className="admin-loading">Đang tải...</div>
      ) : ticketData ? (
        <>
          {/* Stats */}
          <section className="dashboard-kpi-grid">
            <article className="dashboard-card kpi">
              <p>Tổng ghế</p>
              <strong>{ticketData.stats.totalSeats}</strong>
              <span>{ticketData.showtime.screen.name}</span>
            </article>
            <article className="dashboard-card kpi">
              <p>Đã đặt</p>
              <strong>{ticketData.stats.bookedSeats}</strong>
              <span style={{ color: "#e74c3c" }}>Không khả dụng</span>
            </article>
            <article className="dashboard-card kpi">
              <p>Còn trống</p>
              <strong>{ticketData.stats.availableSeats}</strong>
              <span style={{ color: "#27ae60" }}>Có thể đặt</span>
            </article>
          </section>

          {/* Showtime Info */}
          <div className="admin-card" style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <div><strong>Phim:</strong> {ticketData.showtime.movie.title}</div>
              <div><strong>Rạp:</strong> {ticketData.showtime.branch.name}</div>
              <div><strong>Phòng:</strong> {ticketData.showtime.screen.name} ({ticketData.showtime.screen.type})</div>
              <div><strong>Giờ chiếu:</strong> {new Date(ticketData.showtime.startTime).toLocaleString("vi-VN")}</div>
              <div><strong>Loại ngày:</strong> {ticketData.showtime.dayType === "weekend" ? "Cuối tuần" : "Ngày thường"}</div>
            </div>
          </div>

          {/* Seat Map */}
          <div className="admin-card" style={{ padding: 24, marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16, textAlign: "center" }}>Sơ đồ ghế</h3>
            <div className="seat-map-container">
              <div className="screen-container">
                <div className="screen">Màn hình</div>
              </div>

              <div className="seat-map">
                {sortedRows.map(row => (
                  <div key={row} className="seat-row">
                    <span className="seat-row-label">{row}</span>
                    <div className="seat-row-seats">
                      {seatsByRow[row].map(seat => {
                        const isSelected = selectedSeats.includes(seat.id);
                        let seatClass = "seat seat--" + seat.type;
                        if (seat.isBooked) seatClass += " seat--booked";
                        else if (isSelected) seatClass += " seat--selected";
                        
                        return (
                          <button
                            key={seat.id}
                            className={seatClass}
                            onClick={() => toggleSeat(seat)}
                            disabled={seat.isBooked}
                            title={`${seat.code} - ${SEAT_TYPE_LABELS[seat.type]} - ${seat.price?.toLocaleString()}đ${seat.isBooked ? " (Đã đặt)" : ""}`}
                          >
                            {String(seat.number).padStart(2, "0")}
                          </button>
                        );
                      })}
                    </div>
                    <span className="seat-row-label">{row}</span>
                  </div>
                ))}
              </div>

              <div className="seat-legend">
                <div className="legend-item">
                  <span className="legend-seat legend-seat--standard"></span>
                  <span>Ghế Thường</span>
                </div>
                <div className="legend-item">
                  <span className="legend-seat legend-seat--vip"></span>
                  <span>Ghế VIP</span>
                </div>
                <div className="legend-item">
                  <span className="legend-seat legend-seat--couple"></span>
                  <span>Ghế Đôi</span>
                </div>
                <div className="legend-item">
                  <span className="legend-seat legend-seat--selected"></span>
                  <span>Ghế chọn</span>
                </div>
                <div className="legend-item">
                  <span className="legend-seat legend-seat--booked"></span>
                  <span>Ghế đã đặt</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="admin-card" style={{ padding: 16 }}>
            <h3 style={{ marginBottom: 16 }}>Danh sách vé đã đặt ({ticketData.bookings.length})</h3>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã vé</th>
                    <th>Khách hàng</th>
                    <th>Ghế</th>
                    <th>Tổng tiền</th>
                    <th>Thanh toán</th>
                    <th>Trạng thái</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketData.bookings.length === 0 ? (
                    <tr><td colSpan="7" className="admin-empty">Chưa có vé nào</td></tr>
                  ) : (
                    ticketData.bookings.map(booking => (
                      <tr key={booking.id}>
                        <td><strong>{booking.code}</strong></td>
                        <td>
                          {booking.user ? (
                            <div>
                              <div>{booking.user.name}</div>
                              <small style={{ color: "var(--text-muted)" }}>{booking.user.email}</small>
                            </div>
                          ) : (
                            <span style={{ color: "var(--text-muted)" }}>Khách vãng lai</span>
                          )}
                        </td>
                        <td>{booking.seats.join(", ")}</td>
                        <td><strong>{booking.total.toLocaleString()}đ</strong></td>
                        <td>
                          <span className={`admin-badge admin-badge--${booking.paymentStatus === "paid" ? "success" : "warning"}`}>
                            {PAYMENT_LABELS[booking.paymentStatus]}
                          </span>
                        </td>
                        <td>
                          <span className={`admin-badge admin-badge--${booking.status === "confirmed" ? "success" : booking.status === "cancelled" ? "danger" : "warning"}`}>
                            {STATUS_LABELS[booking.status]}
                          </span>
                        </td>
                        <td>{new Date(booking.createdAt).toLocaleString("vi-VN")}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="admin-empty-state">
          <p>Chọn suất chiếu để quản lý vé</p>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="admin-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="admin-modal__header">
              <h2>Tạo vé mới</h2>
              <button className="admin-modal__close" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleCreateTicket} className="admin-modal__body">
              {message.text && (
                <div className={`admin-message admin-message--${message.type}`}>{message.text}</div>
              )}
              
              <div className="admin-form-group">
                <label>Suất chiếu</label>
                <input type="text" value={`${ticketData?.showtime.movie.title} - ${new Date(ticketData?.showtime.startTime).toLocaleString("vi-VN")}`} disabled />
              </div>
              
              <div className="admin-form-group">
                <label>Ghế đã chọn ({selectedSeats.length})</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {selectedSeats.map(seatId => {
                    const seat = ticketData?.seats.find(s => s.id === seatId);
                    return (
                      <span key={seatId} style={{ padding: "4px 12px", background: "var(--primary)", color: "#fff", borderRadius: 4 }}>
                        {seat?.code}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="admin-form-group">
                <label>Tổng tiền</label>
                <input 
                  type="text" 
                  value={`${(selectedSeats.reduce((sum, seatId) => {
                    const seat = ticketData?.seats.find(s => s.id === seatId);
                    return sum + (seat?.price || 0);
                  }, 0)).toLocaleString()}đ`} 
                  disabled 
                />
              </div>

              <div className="admin-modal__footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Đang tạo..." : "Xác nhận tạo vé"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
