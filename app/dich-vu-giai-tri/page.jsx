"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

const SERVICES = [
  {
    id: 1,
    title: "Karaoke Box",
    description: "Phòng karaoke hiện đại trong khuôn viên rạp chiếu phim",
    icon: "🎤",
    features: ["Phòng VIP", "Hệ thống âm thanh JBL", "Màn hình cảm ứng", "Đồ ăn nhẹ"],
    price: "150,000 VND/giờ",
  },
  {
    id: 2,
    title: "Game Zone",
    description: "Khu vực trò chơi điện tử với máy game mới nhất",
    icon: "🎮",
    features: ["PlayStation 5", "Xbox Series X", "Racing Simulator", "VR Experience"],
    price: "từ 50,000 VND/lượt",
  },
  {
    id: 3,
    title: "Kidzone",
    description: "Khu vui chơi an toàn dành riêng cho trẻ em",
    icon: "🎠",
    features: ["Nhà bóng", "Cầu trượt", "Xếp hình LEGO", "Nhân viên trông trẻ"],
    price: "100,000 VND/2 giờ",
  },
  {
    id: 4,
    title: "Bowling",
    description: "Bowling chuyên nghiệp với lane tiêu chuẩn quốc tế",
    icon: "🎳",
    features: ["6 làn bowling", "Giày bowling", "Bảng điểm tự động", "Huấn luyện viên"],
    price: "80,000 VND/game",
  },
  {
    id: 5,
    title: "Billiards",
    description: "Bàn bi-a cao cấp trong không gian sang trọng",
    icon: "🎱",
    features: ["Bàn Brunswick", "Đèn chuyên dụng", "Không gian riêng tư", "Đồ uống"],
    price: "60,000 VND/giờ",
  },
  {
    id: 6,
    title: "Photo Booth",
    description: "Khu vực chụp ảnh với nhiều backdrop và props",
    icon: "📸",
    features: ["Background đa dạng", "Props vui nhộn", "In ảnh tại chỗ", "Gửi email/share"],
    price: "50,000 VND/4 ảnh",
  },
];

export default function EntertainmentPage() {
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

  const handleBook = (serviceId) => {
    const service = SERVICES.find(s => s.id === serviceId);
    if (!service) return;
    
    // Extract price number from string like "150,000 VND/giờ"
    const priceMatch = service.price.match(/[\d,]+/);
    const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 0;
    
    // Add to cart
    addToCart({
      type: 'service',
      id: `service-${serviceId}`,
      title: service.title,
      description: service.description,
      price: price,
      icon: service.icon,
      features: service.features,
      priceDisplay: service.price,
    });
  };

  return (
    <div className="app">
      <Header />
      <main className="entertainment-page">
        <div className="container">
          <h1 className="page-title">DỊCH VỤ GIẢI TRÍ KHÁC</h1>
          <p className="page-subtitle">Không chỉ là rạp chiếu phim - LMK Cinema là điểm đến giải trí toàn diện</p>

          <div className="services-grid">
            {SERVICES.map(service => (
              <div key={service.id} className="service-card">
                <div className="service-card__icon">{service.icon}</div>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__desc">{service.description}</p>
                <ul className="service-card__features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                <p className="service-card__price">{service.price}</p>
                <div className="service-card__actions">
                  <button 
                    className="service-card__btn service-card__btn--secondary"
                    onClick={() => {
                      if (!user && !loading) {
                        router.push(`/login?redirect=/dich-vu-giai-tri`);
                        return;
                      }
                      handleBook(service.id);
                    }}
                  >
                    Thêm vào giỏ
                  </button>
                  <button 
                    className="service-card__btn service-card__btn--primary"
                    onClick={() => {
                      if (!user && !loading) {
                        router.push(`/login?redirect=/dich-vu-giai-tri`);
                        return;
                      }
                      handleBook(service.id);
                      router.push("/checkout");
                    }}
                  >
                    Đặt hàng ngay
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Promo Banner */}
          <section className="entertainment-promo">
            <div className="promo-content">
              <h2>🎉 COMBO GIẢI TRÍ</h2>
              <p>Mua vé xem phim + sử dụng dịch vụ khác được giảm 20%</p>
              <Link href="/chuong-trinh-khuyen-mai" className="btn-cta btn-cta--solid">
                Xem chi tiết
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

