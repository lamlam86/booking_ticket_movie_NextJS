"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Default static banners
const DEFAULT_BANNERS = [
  { 
    id: 1, 
    media: "https://www.cgv.vn/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/9/8/980x448_u22_1_.jpg", 
    name: "LMK Cinema - Khuyến mãi U22",
    link: "/chuong-trinh-khuyen-mai"
  },
  { 
    id: 2, 
    media: "https://www.cgv.vn/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/c/o/combo_2nguoi_980x448.jpg", 
    name: "Combo Bắp Nước",
    link: "/popcorn-drink"
  },
  { 
    id: 3, 
    media: "https://www.cgv.vn/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/h/o/home_-_main_banner_-_980wx448h_28_.jpg", 
    name: "Phim Hot",
    link: "/movie"
  },
];

export default function BannerSlider() {
  const [banners, setBanners] = useState(DEFAULT_BANNERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        // Fetch banners from database first
        const bannerRes = await fetch("/api/banners?_t=" + Date.now(), { cache: 'no-store' });
        const bannerData = await bannerRes.json();
        
        if (bannerData.banners && bannerData.banners.length > 0) {
          setBanners(bannerData.banners.map(b => ({
            id: b.id,
            media: b.imageUrl,
            name: b.title,
            link: b.linkUrl,
            description: b.description,
            isCustomBanner: true
          })));
        } else {
          // Fallback to featured movies if no banners in DB
          try {
            const movieRes = await fetch("/api/movies/featured");
            const movieData = await movieRes.json();
            
            if (movieData.movies && movieData.movies.length > 0) {
              setBanners(movieData.movies.map(m => ({
                id: m.id,
                media: m.backdrop_url || m.poster_url,
                name: m.title,
                link: `/movie/${m.id}`,
                isMovie: true
              })));
            }
            // If no movies, keep DEFAULT_BANNERS
          } catch (movieErr) {
            console.log("Using default banners");
            // Keep DEFAULT_BANNERS
          }
        }
      } catch (err) {
        console.log("Banner fetch error, using defaults");
        // Keep DEFAULT_BANNERS on error
      } finally {
        setLoading(false);
      }
    }
    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="banner-wrap banner-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
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
          delay: 4000, 
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
        {banners.map((banner, i) => (
          <SwiperSlide key={banner.id || i} className="banner-slide">
            {banner.link ? (
              <Link 
                href={banner.link} 
                className="banner-link"
                target={banner.link.startsWith('http') && !banner.link.includes(typeof window !== 'undefined' ? window.location.host : '') ? '_blank' : '_self'}
              >
                {banner.media ? (
                  banner.media.startsWith('http') ? (
                    <img
                      src={banner.media}
                      alt={banner.name}
                      className="banner-img-external"
                    />
                  ) : (
                    <Image
                      src={banner.media}
                      alt={banner.name}
                      fill
                      priority={i === 0}
                      sizes="(max-width: 1200px) 100vw, 1200px"
                      className="banner-img"
                    />
                  )
                ) : (
                  <div className="banner-placeholder">
                    <span>🎬</span>
                    <h2>{banner.name}</h2>
                  </div>
                )}
                {(banner.isMovie || banner.description) && (
                  <div className="banner-overlay">
                    <h2 className="banner-title">{banner.name}</h2>
                    {banner.description && <p className="banner-desc">{banner.description}</p>}
                    <span className="banner-cta">
                      {banner.isMovie ? "Xem chi tiết →" : "Xem ngay →"}
                    </span>
                  </div>
                )}
              </Link>
            ) : (
              <div className="banner-static">
                {banner.media ? (
                  banner.media.startsWith('http') ? (
                    <img
                      src={banner.media}
                      alt={banner.name}
                      className="banner-img-external"
                    />
                  ) : (
                    <Image
                      src={banner.media}
                      alt={banner.name}
                      fill
                      priority={i === 0}
                      sizes="(max-width: 1200px) 100vw, 1200px"
                      className="banner-img"
                    />
                  )
                ) : (
                  <div className="banner-placeholder">
                    <span>🎬</span>
                    <h2>{banner.name}</h2>
                  </div>
                )}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
