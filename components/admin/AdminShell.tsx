'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type NavItem = {
  label: string;
  href: string;
  badge?: string;
};

const NAV_SECTIONS: Array<{ title: string; items: NavItem[] }> = [
  {
    title: 'Dashboard',
    items: [{ label: 'Tổng quan', href: '/admin' }],
  },
  {
    title: 'Quản lý nội dung',
    items: [
      { label: 'Quản lý phim', href: '/admin/movies' },
      { label: 'Quản lý lịch chiếu', href: '/admin/showtimes' },
      { label: 'Quản lý rạp', href: '/admin/cinemas' },
    ],
  },
  {
    title: 'Vận hành',
    items: [
      { label: 'Đơn hàng / Vé', href: '/admin/orders' },
      { label: 'Khách hàng', href: '/admin/customers' },
    ],
  },
  {
    title: 'Gói ưu đãi',
    items: [
      { label: 'Combo bắp nước', href: '/admin/combos' },
      { label: 'Khuyến mãi', href: '/admin/promotions' },
    ],
  },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand__title">CINESTAR</span>
          <small>Bảng điều khiển</small>
        </div>

        {NAV_SECTIONS.map(section => (
          <div key={section.title} className="admin-nav-group">
            <p className="admin-nav-group__title">{section.title}</p>
            <div className="admin-nav-group__list">
              {section.items.map(item => {
                const isActive =
                  pathname === item.href ||
                  (pathname?.startsWith(item.href) && item.href !== '/admin');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-link${isActive ? ' is-active' : ''}`}
                  >
                    <span>{item.label}</span>
                    {item.badge && <em>{item.badge}</em>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </aside>

      <div className="admin-content">
        <header className="admin-content__header">
          <div>
            <p className="admin-eyebrow">Xin chào, quản trị viên!</p>
            <h1>Bảng điều khiển</h1>
          </div>

          <div className="admin-header-user">
            <div className="admin-user-avatar">A</div>
            <div>
              <p className="admin-user-name">Admin</p>
              <small>manager@cinecrm.com</small>
            </div>
          </div>
        </header>

        <div className="admin-content__body">{children}</div>
      </div>
    </div>
  );
}
