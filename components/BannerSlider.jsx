"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function BannerSlider() {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/movies/featured");
        const data = await res.json();
        if (data.movies) {
          setFeaturedMovies(data.movies);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  // Fallback static banners if no featured movies
  const staticBanners = [
    { media: "/assets/images/banner-web.jpg", name: "LMK Cinema" },
    { media: "/assets/images/web-banner-chung.jpg", name: "Khuyến mãi" },
  ];

  const banners = featuredMovies.length > 0 
    ? featuredMovies.map(m => ({
        id: m.id,
        media: m.backdrop_url || m.poster_url,
        name: m.title,
        isMovie: true
      }))
    : staticBanners;

  if (loading) {
    return (
      <div className="banner-wrap banner-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="banner-wrap">
      <Swiper
        className="banner-swiper"
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1.2}
        centeredSlides={true}
        spaceBetween={20}
        loop={banners.length > 2}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ 
          delay: 3000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        breakpoints={{
          640: {
            slidesPerView: 1.2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 1.3,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 1.2,
            spaceBetween: 40,
          },
          1200: {
            slidesPerView: 1.2,
            spaceBetween: 50,
          },
        }}
      >
        {banners.map((s, i) => (
          <SwiperSlide key={s.id || i} className="banner-slide">
            {s.isMovie ? (
              <Link href={`/movie/${s.id}`} className="banner-link">
                {s.media ? (
                  <Image
                    src={s.media}
                    alt={s.name}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    className="banner-img"
                  />
                ) : (
                  <div className="banner-placeholder">
                    <span>🎬</span>
                    <h2>{s.name}</h2>
                  </div>
                )}
                <div className="banner-overlay">
                  <h2 className="banner-title">{s.name}</h2>
                  <span className="banner-cta">Xem chi tiết →</span>
                </div>
              </Link>
            ) : (
              <Image
                src={s.media}
                alt={s.name}
                fill
                priority={i === 0}
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="banner-img"
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
