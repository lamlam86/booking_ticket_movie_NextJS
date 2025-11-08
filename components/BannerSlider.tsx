"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function BannerSlider() {
  const slides = [
    { media: "/assets/images/banner-web.jpg", name: "Banner 1" },
    { media: "/assets/images/web-banner-chung.jpg", name: "Banner 2" },
    { media: "/assets/images/banner3.jpg", name: "Banner 3" },
  ];

  return (
    <div className="banner-wrap">
      <Swiper
        className="banner-swiper"
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        centeredSlides={false}
        spaceBetween={0}
        loop
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i} className="banner-slide">
            {/* Fill để ảnh bám khung, không vượt ra ngoài */}
            <Image
              src={s.media}
              alt={s.name}
              fill
              priority={i === 0}
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="banner-img"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
