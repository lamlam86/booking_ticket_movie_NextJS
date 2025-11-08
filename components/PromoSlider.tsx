"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const promos = ["1", "2", "3", "4", "5", "6"].map((n) => ({
  media: `/assets/images/Khuyen mai ${n}.webp`,
  name: `Khuyến mãi ${n}`,
}));

export default function PromoSlider() {
  return (
    // bọc một div để các rule .promo-swiper .swiper trong CSS áp dụng chuẩn
    <div className="promo-swiper">
      <Swiper
        className="swiper"
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={3}
        slidesPerGroup={1}
        spaceBetween={20}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop
        speed={600}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {promos.map((p) => (
          <SwiperSlide key={p.name}>
            {/* CSS của bạn đã set kích thước/bo góc cho .promo-swiper .swiper-slide img */}
            <Image
              src={p.media}
              alt={p.name}
              width={380}
              height={214}
              sizes="(max-width: 768px) 90vw, 380px"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
