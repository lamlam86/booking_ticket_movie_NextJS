"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, getCartTotal, getCartCount } = useCart();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [qrPayment, setQrPayment] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [bookingIds, setBookingIds] = useState([]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const calculateItemTotal = (item) => {
    // Tính tiền vé từ seatData (có giá riêng mỗi ghế từ ticket_prices)
    const ticketTotal = item.seatData 
      ? item.seatData.reduce((sum, s) => sum + (s.price || 65000), 0)
      : item.seats.length * (item.showtime.base_price || 65000);
    const concessionTotal = Object.entries(item.concessions || {}).reduce((sum, [id, qty]) => {
      const concession = item.concessionItems?.find(c => c.id === Number(id));
      return sum + (concession ? concession.price * qty : 0);
    }, 0);
    return ticketTotal + concessionTotal;
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    try {
      const res = await fetch(`/api/promotions/check?code=${promoCode}&total=${getCartTotal()}`);
      const data = await res.json();
      
      if (data.valid) {
        setDiscount(data.discount);
        setPromoMessage(`Áp dụng thành công! Giảm ${formatPrice(data.discount)}`);
      } else {
        setDiscount(0);
        setPromoMessage(data.message || "Mã khuyến mãi không hợp lệ");
      }
    } catch (e) {
      setPromoMessage("Lỗi kiểm tra mã khuyến mãi");
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }

    if (cart.length === 0) {
      return;
    }

    setProcessing(true);

    try {
      const createdBookingIds = [];

      // Create bookings for each item in cart
      for (const item of cart) {
        // Format seats for API (needs seat_id and price from seatData)
        const seatsForApi = item.seatData || item.seats.map((label, idx) => ({
          seat_id: idx + 1, // Fallback if no seatData
          price: 65000, // Giá mặc định
        }));

        // Format concessions for API (needs concession_id and quantity)
        const concessionsForApi = Object.entries(item.concessions || {})
          .filter(([, qty]) => qty > 0)
          .map(([id, qty]) => ({
            concession_id: Number(id),
            quantity: qty,
          }));

        const bookingData = {
          showtime_id: item.showtime.id,
          seats: seatsForApi,
          concessions: concessionsForApi,
          payment_method: paymentMethod === "bank" ? "bank_transfer" : paymentMethod,
        };

        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData)
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Đặt vé thất bại");
        }

        createdBookingIds.push(data.booking.id);
      }

      setBookingIds(createdBookingIds);

      // Nếu là thanh toán chuyển khoản, tạo QR code
      if (paymentMethod === "bank") {
        // Tạo QR cho booking đầu tiên (hoặc có thể tạo cho tất cả)
        const firstBookingId = createdBookingIds[0];
        const qrRes = await fetch("/api/payments/create-qr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ booking_id: firstBookingId }),
        });

        const qrData = await qrRes.json();
        if (qrRes.ok && qrData.success) {
          setQrPayment(qrData.payment);
          // Bắt đầu kiểm tra thanh toán tự động
          startPaymentCheck(qrData.payment.transaction_id);
        } else {
          throw new Error("Lỗi tạo mã QR thanh toán");
        }
      } else {
        // Các phương thức khác: redirect đến success
        clearCart();
        router.push("/checkout/success");
      }

    } catch (error) {
      alert("Lỗi đặt vé: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  // Kiểm tra trạng thái thanh toán tự động
  const startPaymentCheck = (transactionId) => {
    setCheckingPayment(true);
    
    const checkInterval = setInterval(async () => {
      try {
        const res = await fetch("/api/payments/check-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transaction_id: transactionId }),
        });

        const data = await res.json();
        
        if (data.success && data.status === "paid") {
          clearInterval(checkInterval);
          setCheckingPayment(false);
          clearCart();
          router.push("/checkout/success");
        } else if (data.status === "expired" || data.status === "failed") {
          clearInterval(checkInterval);
          setCheckingPayment(false);
          alert("Mã QR đã hết hạn hoặc thanh toán thất bại");
        }
      } catch (error) {
        console.error("Error checking payment:", error);
      }
    }, 5000); // Kiểm tra mỗi 5 giây

    // Dừng kiểm tra sau 15 phút
    setTimeout(() => {
      clearInterval(checkInterval);
      setCheckingPayment(false);
    }, 15 * 60 * 1000);
  };

  const finalTotal = getCartTotal() - discount;

  if (loading) {
    return (
      <div className="app">
        <Header />
        <main className="checkout-page">
          <div className="container">
            <div className="loading-state">Đang tải...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="checkout-page">
        <div className="container">
          <h1 className="page-title">THANH TOÁN</h1>

          {cart.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🛒</div>
              <h3>Giỏ hàng trống</h3>
              <p>Bạn chưa chọn vé nào để thanh toán</p>
              <button className="btn btn-primary" onClick={() => router.push("/movie")}>
                Đặt vé ngay
              </button>
            </div>
          ) : (
            <div className="checkout-content">
              {/* Order Summary */}
              <div className="checkout-orders">
                <h2>Chi tiết đơn hàng ({getCartCount()} vé)</h2>
                
                {cart.map(item => (
                  <div key={item.id} className="checkout-order-item">
                    <div className="checkout-order-item__header">
                      <div className="checkout-order-item__poster">
                        {item.movie.poster_url ? (
                          <img src={item.movie.poster_url} alt={item.movie.title} />
                        ) : (
                          <div className="poster-placeholder-sm">🎬</div>
                        )}
                      </div>
                      <div className="checkout-order-item__movie">
                        <h3>{item.movie.title}</h3>
                        <p className="checkout-order-item__rating">{item.movie.rating || "P"}</p>
                      </div>
                    </div>

                    <div className="checkout-order-item__details">
                      <div className="detail-row">
                        <span>📍 Rạp:</span>
                        <strong>{item.showtime.branch}</strong>
                      </div>
                      <div className="detail-row">
                        <span>🎬 Phòng:</span>
                        <strong>{item.showtime.screen}</strong>
                      </div>
                      <div className="detail-row">
                        <span>📅 Suất chiếu:</span>
                        <strong>{formatTime(item.showtime.start_time)} - {formatDate(item.showtime.start_time)}</strong>
                      </div>
                      <div className="detail-row">
                        <span>💺 Ghế:</span>
                        <strong>{item.seats.join(", ")}</strong>
                      </div>
                      <div className="detail-row">
                        <span>🎟️ Giá vé:</span>
                        <strong>{item.seatData 
                          ? formatPrice(item.seatData.reduce((sum, s) => sum + (s.price || 65000), 0))
                          : `${item.seats.length} vé`
                        }</strong>
                      </div>
                    </div>

                    {Object.keys(item.concessions || {}).length > 0 && (
                      <div className="checkout-order-item__concessions">
                        <h4>🍿 Bắp nước:</h4>
                        {Object.entries(item.concessions).map(([id, qty]) => {
                          if (qty === 0) return null;
                          const concession = item.concessionItems?.find(c => c.id === Number(id));
                          return concession ? (
                            <div key={id} className="detail-row">
                              <span>{concession.name} x{qty}</span>
                              <strong>{formatPrice(concession.price * qty)}</strong>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}

                    <div className="checkout-order-item__subtotal">
                      <span>Thành tiền:</span>
                      <strong>{formatPrice(calculateItemTotal(item))}</strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Section */}
              <div className="checkout-payment">
                {/* User Info */}
                {user ? (
                  <div className="checkout-user">
                    <h3>Thông tin khách hàng</h3>
                    <p><strong>{user.fullName}</strong></p>
                    <p>{user.email}</p>
                    {user.phone && <p>{user.phone}</p>}
                  </div>
                ) : (
                  <div className="checkout-login-prompt">
                    <h3>Vui lòng đăng nhập</h3>
                    <p>Bạn cần đăng nhập để tiếp tục thanh toán</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => router.push("/login?redirect=/checkout")}
                    >
                      Đăng nhập
                    </button>
                  </div>
                )}

                {/* Promo Code */}
                <div className="checkout-promo">
                  <h3>Mã khuyến mãi</h3>
                  <div className="checkout-promo__input">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Nhập mã khuyến mãi"
                    />
                    <button onClick={handleApplyPromo}>Áp dụng</button>
                  </div>
                  {promoMessage && (
                    <p className={`checkout-promo__message ${discount > 0 ? "success" : "error"}`}>
                      {promoMessage}
                    </p>
                  )}
                </div>

                {/* Payment Method */}
                <div className="checkout-method">
                  <h3>Phương thức thanh toán</h3>
                  <div className="payment-methods">
                    <label className={`payment-option ${paymentMethod === "momo" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="momo"
                        checked={paymentMethod === "momo"}
                        onChange={e => setPaymentMethod(e.target.value)}
                      />
                      <span className="payment-option__icon">💳</span>
                      <span className="payment-option__name">Ví MoMo</span>
                    </label>
                    <label className={`payment-option ${paymentMethod === "vnpay" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="vnpay"
                        checked={paymentMethod === "vnpay"}
                        onChange={e => setPaymentMethod(e.target.value)}
                      />
                      <span className="payment-option__icon">🏦</span>
                      <span className="payment-option__name">VNPay</span>
                    </label>
                    <label className={`payment-option ${paymentMethod === "bank" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="bank"
                        checked={paymentMethod === "bank"}
                        onChange={e => setPaymentMethod(e.target.value)}
                      />
                      <span className="payment-option__icon">🏦</span>
                      <span className="payment-option__name">Chuyển khoản QR</span>
                    </label>
                    <label className={`payment-option ${paymentMethod === "cash" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={e => setPaymentMethod(e.target.value)}
                      />
                      <span className="payment-option__icon">💵</span>
                      <span className="payment-option__name">Tiền mặt tại rạp</span>
                    </label>
                  </div>
                </div>

                {/* Total */}
                <div className="checkout-summary">
                  <div className="checkout-summary__row">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                  {discount > 0 && (
                    <div className="checkout-summary__row checkout-summary__discount">
                      <span>Giảm giá:</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="checkout-summary__row checkout-summary__total">
                    <span>Tổng cộng:</span>
                    <strong>{formatPrice(finalTotal)}</strong>
                  </div>
                </div>

                {!qrPayment ? (
                  <button
                    className="btn btn-primary checkout-btn"
                    onClick={handleCheckout}
                    disabled={processing || !user || cart.length === 0}
                  >
                    {processing ? "Đang xử lý..." : `Thanh toán ${formatPrice(finalTotal)}`}
                  </button>
                ) : (
                  <div className="qr-payment-section">
                    <h3>Quét mã QR để thanh toán</h3>
                    <div className="qr-code-container">
                      <img src={qrPayment.qr_code} alt="QR Code" className="qr-code-image" />
                      <div className="qr-payment-info">
                        <p><strong>Số tài khoản:</strong> {qrPayment.bank_account}</p>
                        <p><strong>Ngân hàng:</strong> {qrPayment.bank_name}</p>
                        <p><strong>Chủ tài khoản:</strong> {qrPayment.account_name}</p>
                        <p><strong>Số tiền:</strong> {formatPrice(qrPayment.amount)}</p>
                        <p><strong>Nội dung:</strong> LMK-{qrPayment.booking_code}</p>
                        <p className="qr-expires">
                          ⏰ Mã QR hết hạn sau: {new Date(qrPayment.expires_at).toLocaleTimeString("vi-VN")}
                        </p>
                      </div>
                    </div>
                    {checkingPayment && (
                      <div className="payment-checking">
                        <div className="spinner"></div>
                        <p>Đang kiểm tra thanh toán tự động...</p>
                        <p className="payment-check-note">
                          Hệ thống sẽ tự động xác nhận khi nhận được tiền
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <p className="checkout-note">
                  Bằng việc thanh toán, bạn đồng ý với <a href="#">Điều khoản sử dụng</a> của LMK Cinema.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

