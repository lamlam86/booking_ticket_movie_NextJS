"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

const EVENTS = [
  {
    id: 1,
    title: "Thuê rạp tổ chức sinh nhật",
    description: "Tổ chức sinh nhật độc đáo tại rạp phim với màn hình lớn, âm thanh sống động",
    price: "từ 5,000,000 VND",
    icon: "🎂",
    features: ["Phòng chiếu riêng", "Trang trí theo yêu cầu", "Bánh kem và đồ ăn nhẹ", "Quay phim, chụp ảnh"],
  },
  {
    id: 2,
    title: "Họp báo ra mắt phim",
    description: "Tổ chức họp báo, buổi chiếu ra mắt phim chuyên nghiệp",
    price: "từ 15,000,000 VND",
    icon: "🎬",
    features: ["Phòng chiếu VIP", "Sảnh tiếp tân", "Hệ thống âm thanh micro", "Hỗ trợ kỹ thuật"],
  },
  {
    id: 3,
    title: "Sự kiện doanh nghiệp",
    description: "Hội nghị, workshop, team building cho doanh nghiệp",
    price: "từ 10,000,000 VND",
    icon: "🏢",
    features: ["Màn hình trình chiếu", "Wifi tốc độ cao", "Đồ ăn nhẹ coffee break", "Nhân viên hỗ trợ"],
  },
  {
    id: 4,
    title: "Cầu hôn lãng mạn",
    description: "Khoảnh khắc cầu hôn đáng nhớ trên màn ảnh rộng",
    price: "từ 3,000,000 VND",
    icon: "💍",
    features: ["Video/ảnh tùy chỉnh", "Hoa và nến trang trí", "Champagne", "Không gian riêng tư"],
  },
  {
    id: 5,
    title: "Chiếu phim riêng",
    description: "Thuê phòng chiếu riêng cho nhóm bạn bè, gia đình",
    price: "từ 2,500,000 VND",
    icon: "🎥",
    features: ["Chọn phim tùy thích", "Tối đa 50 người", "Bắp nước không giới hạn", "Linh hoạt thời gian"],
  },
  {
    id: 6,
    title: "Gaming & Esports",
    description: "Tổ chức giải đấu game, xem trực tiếp esports trên màn hình lớn",
    price: "từ 8,000,000 VND",
    icon: "🎮",
    features: ["Màn hình 4K", "Âm thanh sống động", "Thiết bị gaming", "MC dẫn chương trình"],
  },
];

export default function EventsPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (e) {}
      finally { setLoading(false); }
    }
    checkUser();
  }, []);

  const handleBookEvent = (eventId) => {
    const event = EVENTS.find(e => e.id === eventId);
    if (!event) return;
    
    // Extract price number from string like "từ 5,000,000 VND"
    const priceMatch = event.price.match(/[\d,]+/);
    const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 0;
    
    // Add to cart
    addToCart({
      type: 'event',
      id: `event-${eventId}`,
      title: event.title,
      description: event.description,
      price: price,
      icon: event.icon,
      features: event.features,
      priceDisplay: event.price,
    });
  };

  return (
    <div className="app">
      <Header />
      <main className="events-page">
        <div className="container">
          <h1 className="page-title">TỔ CHỨC SỰ KIỆN</h1>
          <p className="page-subtitle">Biến mọi khoảnh khắc thành kỷ niệm đáng nhớ cùng LMK Cinema</p>

          <div className="events-grid">
            {EVENTS.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-card__icon">{event.icon}</div>
                <h3 className="event-card__title">{event.title}</h3>
                <p className="event-card__desc">{event.description}</p>
                <p className="event-card__price">{event.price}</p>
                <ul className="event-card__features">
                  {event.features.map((feature, idx) => (
                    <li key={idx}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="event-card__actions">
                  <button 
                    onClick={() => {
                      if (!user && !loading) {
                        router.push(`/login?redirect=/to-chuc-su-kien`);
                        return;
                      }
                      handleBookEvent(event.id);
                    }} 
                    className="event-card__btn event-card__btn--secondary"
                  >
                    Thêm vào giỏ
                  </button>
                  <button 
                    onClick={() => {
                      if (!user && !loading) {
                        router.push(`/login?redirect=/to-chuc-su-kien`);
                        return;
                      }
                      handleBookEvent(event.id);
                      router.push("/checkout");
                    }} 
                    className="event-card__btn event-card__btn--primary"
                  >
                    Đặt hàng ngay
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <section className="events-cta">
            <h2>Bạn có ý tưởng khác?</h2>
            <p>Liên hệ với chúng tôi để được tư vấn và báo giá chi tiết</p>
            <div className="events-cta__contact">
              <a href="tel:19006017" className="btn-cta btn-cta--solid">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                1900 6017
              </a>
              <a href="mailto:events@cinestar.vn" className="btn-cta btn-cta--ghost">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                events@cinestar.vn
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

