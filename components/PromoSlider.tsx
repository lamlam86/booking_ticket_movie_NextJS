"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function PromoSlider() {
  const items = ["1", "2", "3", "4", "5", "6"]; // thêm bao nhiêu ảnh cũng được

  return (
    <Swiper
      className="promo-swiper"
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={3}        // 3 ảnh/1 hàng
      slidesPerGroup={1}       // mỗi lần chuyển 1 ảnh
      spaceBetween={20}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }} // tự chạy vài giây
      loop
      speed={600}
      breakpoints={{
        0:   { slidesPerView: 1, slidesPerGroup: 1 },
        640: { slidesPerView: 2, slidesPerGroup: 1 },
        1024:{ slidesPerView: 3, slidesPerGroup: 1 },
      }}
    >
      {items.map((n) => (
        <SwiperSlide key={n}>
          <img src={`/assets/image/Khuyen mai ${n}.webp`} alt={`Khuyến mãi ${n}`} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
