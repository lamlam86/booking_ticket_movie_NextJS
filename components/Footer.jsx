"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Footer() {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    async function fetchBranches() {
      try {
        const res = await fetch("/api/branches");
        const data = await res.json();
        if (data.branches) setBranches(data.branches);
      } catch (e) {}
    }
    fetchBranches();
  }, []);

  return (
    <footer className="footer">
      {/* Main Footer */}
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-col footer-col--brand">
              <Link href="/" className="footer-logo">
                <div className="footer-logo-text">
                  <span className="footer-logo-lmk">LMK</span>
                  <span className="footer-logo-cinema">CINEMA</span>
                </div>
              </Link>
              <p className="footer-slogan">BE HAPPY, BE A STAR ✨</p>
              <div className="footer-cta-btns">
                <Link href="/movie" className="footer-cta-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                    <line x1="7" y1="2" x2="7" y2="22"></line>
                    <line x1="17" y1="2" x2="17" y2="22"></line>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <line x1="2" y1="7" x2="7" y2="7"></line>
                    <line x1="2" y1="17" x2="7" y2="17"></line>
                    <line x1="17" y1="17" x2="22" y2="17"></line>
                    <line x1="17" y1="7" x2="22" y2="7"></line>
                  </svg>
                  <span>ĐẶT VÉ</span>
                </Link>
                <Link href="/popcorn-drink" className="footer-cta-btn footer-cta-btn--outline">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                    <line x1="6" y1="1" x2="6" y2="4"></line>
                    <line x1="10" y1="1" x2="10" y2="4"></line>
                    <line x1="14" y1="1" x2="14" y2="4"></line>
                  </svg>
                  <span>BẮP NƯỚC</span>
                </Link>
              </div>
              <div className="footer-social-icons">
                <a href="https://facebook.com/lmkcinema" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://youtube.com/@lmkcinema" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
                  </svg>
                </a>
                <a href="https://tiktok.com/@lmkcinema" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a href="https://instagram.com/lmkcinema" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Tài khoản */}
            <div className="footer-col">
              <h4>TÀI KHOẢN</h4>
              <Link href="/login">Đăng nhập</Link>
              <Link href="/signup">Đăng ký</Link>
              <Link href="/profile">Thông tin cá nhân</Link>
              <Link href="/my-tickets">Vé của tôi</Link>
            </div>

            {/* Xem phim */}
            <div className="footer-col">
              <h4>PHIM</h4>
              <Link href="/movie">Phim đang chiếu</Link>
              <Link href="/movie?status=coming_soon">Phim sắp chiếu</Link>
              <Link href="/lich-chieu">Lịch chiếu</Link>
              <Link href="/chuong-trinh-khuyen-mai">Khuyến mãi</Link>
            </div>

            {/* Dịch vụ */}
            <div className="footer-col">
              <h4>DỊCH VỤ</h4>
              <Link href="/popcorn-drink">Bắp & Nước</Link>
              <Link href="/to-chuc-su-kien">Thuê rạp sự kiện</Link>
              <Link href="/dich-vu-giai-tri">Giải trí khác</Link>
            </div>

            {/* Về chúng tôi */}
            <div className="footer-col">
              <h4>VỀ LMK CINEMA</h4>
              <Link href="/gioi-thieu">Giới thiệu</Link>
              <Link href="/he-thong-rap">Hệ thống rạp</Link>
              <Link href="/tuyen-dung">Tuyển dụng</Link>
              <Link href="/lien-he">Liên hệ</Link>
            </div>

            {/* Hệ thống rạp */}
            <div className="footer-col footer-col--cinemas">
              <h4>HỆ THỐNG RẠP</h4>
              {branches.length > 0 ? (
                branches.map(branch => (
                  <Link key={branch.id} href={`/he-thong-rap?id=${branch.id}`}>
                    {branch.name.replace("LMK Cinema ", "")}
                    <span className="footer-branch-city">{branch.city}</span>
                  </Link>
                ))
              ) : (
                <>
                  <Link href="/he-thong-rap">Man Thiện <span className="footer-branch-city">TP.HCM</span></Link>
                  <Link href="/he-thong-rap">Vincom Thủ Đức <span className="footer-branch-city">TP.HCM</span></Link>
                  <Link href="/he-thong-rap">Bình Dương <span className="footer-branch-city">Bình Dương</span></Link>
                  <Link href="/he-thong-rap">AEON Bình Dương <span className="footer-branch-city">Bình Dương</span></Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <p>© {new Date().getFullYear()} LMK Cinema. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link href="/dieu-khoan">Điều khoản sử dụng</Link>
              <Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
              <Link href="/hoi-dap">FAQ</Link>
            </div>
          </div>
          <div className="footer-legal">
            <p>CÔNG TY TNHH LMK CINEMA VIỆT NAM</p>
            <p>Trụ sở: 84 Man Thiện, Phường Hiệp Phú, TP. Thủ Đức, TP.HCM</p>
            <p>Zalo: <strong>0948 116 717</strong> | Email: <strong>cskh@lmkcinema.vn</strong></p>
          </div>
        </div>
      </div>
    </footer>
  );
}


