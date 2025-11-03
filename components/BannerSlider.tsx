"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css"; import "swiper/css/navigation"; import "swiper/css/pagination";

export default function BannerSlider() {
  const slides = [
    { media: "/assets/images/banner-web.jpg", name: "Banner 1" },
    { media: "/assets/images/web-banner-chung.jpg", name: "Banner 2" },
    { media: "/assets/images/banner3.jpg", name: "Banner 3" },
  ];
  return (
    <Swiper
      className="banner-swiper"
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop
    >
      {slides.map((s, i) => (
        <SwiperSlide key={i}>
          <Image
            src={s.media}
            alt={s.name}
            width={1920}
            height={600}
            priority={i === 0}
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
