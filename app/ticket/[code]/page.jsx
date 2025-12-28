"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function TicketPage() {
  const params = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTicket() {
      try {
        const res = await fetch(`/api/ticket/${params.code}`);
        const data = await res.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setTicket(data.ticket);
        }
      } catch (err) {
        setError("Không thể tải thông tin vé");
      } finally {
        setLoading(false);
      }
    }
    
    if (params.code) {
      fetchTicket();
    }
  }, [params.code]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return price?.toLocaleString("vi-VN") + " VND";
  };

  if (loading) {
    return (
      <div className="ticket-page">
        <div className="ticket-page__loading">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin vé...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ticket-page">
        <div className="ticket-page__error">
          <div className="error-icon">❌</div>
          <h2>Không tìm thấy vé</h2>
          <p>{error}</p>
          <Link href="/" className="btn-back">Về trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-page">
      <div className="ticket-display">
        {/* Header */}
        <div className="ticket-display__header">
          <div className="ticket-display__logo">
            <span>🎬</span>
            <strong>LMK CINEMA</strong>
          </div>
          <div className={`ticket-display__status ticket-display__status--${ticket.payment_status === 'paid' ? 'valid' : 'invalid'}`}>
            {ticket.payment_status === 'paid' ? '✓ VÉ HỢP LỆ' : '⚠ CHƯA THANH TOÁN'}
          </div>
        </div>

        {/* Movie Poster & Info */}
        <div className="ticket-display__movie">
          {ticket.poster && (
            <div className="ticket-display__poster">
              <img src={ticket.poster} alt={ticket.movie} />
            </div>
          )}
          <div className="ticket-display__movie-info">
            <h1 className="ticket-display__title">{ticket.movie}</h1>
            {ticket.rating && (
              <span className="ticket-display__rating">{ticket.rating}</span>
            )}
          </div>
        </div>

        {/* Ticket Details */}
        <div className="ticket-display__details">
          <div className="ticket-detail-row">
            <div className="ticket-detail-icon">📅</div>
            <div className="ticket-detail-content">
              <span className="ticket-detail-label">Ngày chiếu</span>
              <strong>{formatDate(ticket.showtime)}</strong>
            </div>
          </div>

          <div className="ticket-detail-row">
            <div className="ticket-detail-icon">🕐</div>
            <div className="ticket-detail-content">
              <span className="ticket-detail-label">Giờ chiếu</span>
              <strong>{formatTime(ticket.showtime)}</strong>
            </div>
          </div>

          <div className="ticket-detail-row">
            <div className="ticket-detail-icon">📍</div>
            <div className="ticket-detail-content">
              <span className="ticket-detail-label">Rạp</span>
              <strong>{ticket.branch}</strong>
            </div>
          </div>

          <div className="ticket-detail-row">
            <div className="ticket-detail-icon">🎬</div>
            <div className="ticket-detail-content">
              <span className="ticket-detail-label">Phòng chiếu</span>
              <strong>{ticket.screen}</strong>
            </div>
          </div>

          <div className="ticket-detail-row ticket-detail-row--highlight">
            <div className="ticket-detail-icon">💺</div>
            <div className="ticket-detail-content">
              <span className="ticket-detail-label">Ghế</span>
              <strong className="ticket-seats">{ticket.seats}</strong>
            </div>
          </div>
        </div>

        {/* Booking Code */}
        <div className="ticket-display__code-section">
          <div className="ticket-code-label">Mã vé</div>
          <div className="ticket-code-value">{ticket.booking_code}</div>
        </div>

        {/* Price */}
        <div className="ticket-display__price">
          <span>Tổng tiền</span>
          <strong>{formatPrice(ticket.total_amount)}</strong>
        </div>

        {/* Footer */}
        <div className="ticket-display__footer">
          <p>Vui lòng đưa mã này cho nhân viên soát vé</p>
          <p className="ticket-customer">Khách hàng: {ticket.customer_name || 'Khách'}</p>
        </div>
      </div>
    </div>
  );
}
