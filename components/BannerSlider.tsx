"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function BannerSlider() {
  return (
    <Swiper
      className="banner-swiper"
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop
    >
      <SwiperSlide>
        <img src="/assets/image/banner-web.jpg" alt="Banner 1" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="/assets/image/web-banner-chung.jpg" alt="Banner 2" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="/assets/image/banner3.jpg" alt="Banner 3" />
      </SwiperSlide>
    </Swiper>
  );
}
