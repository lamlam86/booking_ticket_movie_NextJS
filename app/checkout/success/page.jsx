"use client";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CheckoutSuccessPage() {
  return (
    <div className="app">
      <Header />
      <main className="checkout-success-page">
        <div className="container">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h1>Đặt vé thành công!</h1>
            <p>
              Cảm ơn bạn đã đặt vé tại LMK Cinema. 
              Thông tin vé đã được gửi đến email của bạn.
            </p>
            
            <div className="success-actions">
              <Link href="/my-tickets" className="btn btn-primary">
                Xem vé của tôi
              </Link>
              <Link href="/" className="btn btn-secondary">
                Về trang chủ
              </Link>
            </div>

            <div className="success-tips">
              <h3>Lưu ý:</h3>
              <ul>
                <li>Vui lòng đến rạp trước giờ chiếu 15-30 phút</li>
                <li>Xuất trình mã QR hoặc email xác nhận tại quầy vé</li>
                <li>Mang theo CCCD/CMND nếu mua vé ưu đãi học sinh/sinh viên</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}







