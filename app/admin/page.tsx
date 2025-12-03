'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

type MovieStatus = 'now_showing' | 'coming_soon' | 'draft';

type MovieRecord = {
  id: number;
  title: string;
  poster: string | null;
  status: MovieStatus;
  releaseDate: string;
  duration: number;
  rating: string;
  isFeatured: boolean;
  soldTickets: number;
  totalShows: number;
};

const NAV_LINKS = [
  { label: 'Tổng quan', badge: 'Live' },
  { label: 'Suất chiếu', badge: null },
  { label: 'Combo', badge: 'Hot' },
  { label: 'Khuyến mãi', badge: null },
  { label: 'Thành viên', badge: null },
  { label: 'Báo cáo', badge: null },
];

const QUICK_ACTIONS = [
  { label: 'Tạo suất chiếu', icon: '🎞' },
  { label: 'Đăng phim mới', icon: '🎬' },
  { label: 'Chiến dịch vé', icon: '🚀' },
  { label: 'Khuyến mãi', icon: '💳' },
];

const UPCOMING_PREMIERES = [
  { title: 'Cyber Ninja', date: '12/12', branches: 8 },
  { title: 'Eclipse Love', date: '18/12', branches: 5 },
  { title: 'Ocean Heart', date: '21/12', branches: 6 },
];

const PERFORMANCE_CHART = [420, 610, 530, 710, 680, 760, 820];

const BUILD_LINE_POINTS = (values: number[]) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * 100;
      const normalized = max === min ? 0.5 : (value - min) / (max - min);
      const y = 100 - normalized * 80 - 10;
      return `${x},${y}`;
    })
    .join(' ');
};

const EMPTY_FORM = {
  title: '',
  poster: '',
  status: 'now_showing' as MovieStatus,
  releaseDate: '',
  duration: 120,
  rating: 'P',
};

type FlashState = {
  type: 'success' | 'error';
  message: string;
} | null;

const STATUS_LABELS: Record<MovieStatus, string> = {
  now_showing: 'Đang chiếu',
  coming_soon: 'Sắp chiếu',
  draft: 'Nháp',
};

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<MovieRecord[]>([]);
  const [filter, setFilter] = useState<'all' | MovieStatus>('all');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [flash, setFlash] = useState<FlashState>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/movies');
      if (!res.ok) throw new Error('Fetch failed');
      const payload = await res.json();
      setMovies(payload.data ?? []);
    } catch (error) {
      console.error(error);
      setFlash({ type: 'error', message: 'Không thể tải danh sách phim.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const filteredMovies = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return movies.filter(movie => {
      const matchFilter = filter === 'all' ? true : movie.status === filter;
      const matchKeyword = movie.title.toLowerCase().includes(keyword);
      return matchFilter && matchKeyword;
    });
  }, [filter, movies, search]);

  const stats = useMemo(() => {
    const nowShowing = movies.filter(m => m.status === 'now_showing');
    const coming = movies.filter(m => m.status === 'coming_soon');
    const draft = movies.filter(m => m.status === 'draft');
    const revenue = nowShowing.reduce((sum, movie) => sum + movie.soldTickets * 45000, 0);

    return [
      {
        label: 'Tổng phim',
        value: movies.length,
        subText: `${nowShowing.length} đang chiếu`,
      },
      {
        label: 'Vé đã bán (ước tính)',
        value: revenue.toLocaleString('vi-VN') + 'đ',
        subText: 'Giá vé giả lập 45.000đ',
      },
      {
        label: 'Sắp chiếu',
        value: coming.length,
        subText: 'Đã sẵn sàng mở vé',
      },
      {
        label: 'Nháp',
        value: draft.length,
        subText: 'Cần duyệt nội dung',
      },
    ];
  }, [movies]);

  const topMovies = useMemo(() => {
    return [...movies]
      .filter(m => m.status === 'now_showing')
      .sort((a, b) => b.soldTickets - a.soldTickets)
      .slice(0, 4);
  }, [movies]);

  const resetFlashAfterDelay = (message: FlashState, delay = 2500) => {
    setFlash(message);
    if (message) {
      setTimeout(() => setFlash(null), delay);
    }
  };

  const upsertMovie = (next: MovieRecord) => {
    setMovies(prev => {
      const exists = prev.findIndex(movie => movie.id === next.id);
      if (exists === -1) return [next, ...prev];
      const copy = [...prev];
      copy[exists] = next;
      return copy;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = form.title.trim();
    if (!trimmedTitle || !form.releaseDate) {
      resetFlashAfterDelay({ type: 'error', message: 'Vui lòng nhập tiêu đề và ngày phát hành.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: trimmedTitle,
          status: form.status,
          poster: form.poster || null,
          releaseDate: form.releaseDate,
          duration: form.duration,
          rating: form.rating,
        }),
      });

      if (!res.ok) throw new Error('create failed');
      const payload = await res.json();
      upsertMovie(payload.data);
      setForm(EMPTY_FORM);
      resetFlashAfterDelay({ type: 'success', message: 'Đã thêm phim vào danh sách!' });
    } catch (error) {
      console.error(error);
      resetFlashAfterDelay({ type: 'error', message: 'Không thể thêm phim.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (movieId: number, nextStatus: MovieStatus) => {
    try {
      const res = await fetch(`/api/movies/${movieId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error();
      const payload = await res.json();
      upsertMovie(payload.data);
    } catch (error) {
      console.error(error);
      resetFlashAfterDelay({ type: 'error', message: 'Không thể cập nhật trạng thái.' });
    }
  };

  const handleFeatureToggle = async (movieId: number, next: boolean) => {
    try {
      const res = await fetch(`/api/movies/${movieId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: next }),
      });
      if (!res.ok) throw new Error();
      const payload = await res.json();
      upsertMovie(payload.data);
    } catch (error) {
      console.error(error);
      resetFlashAfterDelay({ type: 'error', message: 'Không thể cập nhật nổi bật.' });
    }
  };

  const handleDelete = async (movieId: number) => {
    if (!confirm('Bạn chắc chắn muốn xóa phim này?')) return;
    try {
      const res = await fetch(`/api/movies/${movieId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setMovies(prev => prev.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error(error);
      resetFlashAfterDelay({ type: 'error', message: 'Không thể xóa phim.' });
    }
  };

  const filterOptions: { id: 'all' | MovieStatus; label: string }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'now_showing', label: 'Đang chiếu' },
    { id: 'coming_soon', label: 'Sắp chiếu' },
    { id: 'draft', label: 'Nháp' },
  ];

  return (
    <div className="app">
      <main className="admin-page">
        <div className="admin-shell">
          <aside className="admin-sidebar">
            <div className="admin-sidebar__brand">
              <span className="admin-logo">CINE CRM</span>
              <p>Điều phối lịch chiếu toàn hệ thống.</p>
            </div>

            <nav className="admin-nav">
              {NAV_LINKS.map(link => (
                <button key={link.label} className="admin-nav__item" type="button">
                  <span>{link.label}</span>
                  {link.badge && <span className="admin-nav__badge">{link.badge}</span>}
                </button>
              ))}
            </nav>

            <div className="admin-sidebar__card">
              <p className="admin-sidebar__label">Suất chiếu hoạt động</p>
              <h3>128</h3>
              <p className="admin-sidebar__muted">+12% so với tuần trước</p>
            </div>
          </aside>

          <section className="admin-main">
            <header className="admin-topbar">
              <div>
                <p className="admin-eyebrow">Dashboard realtime</p>
                <h1>Quản trị phim & chiến dịch</h1>
              </div>
              <div className="admin-topbar__actions">
                <div className="admin-search">
                  <input
                    type="search"
                    placeholder="Tìm nhanh phim hoặc suất chiếu"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                  />
                  <span role="img" aria-hidden>
                    🔍
                  </span>
                </div>
                <button className="admin-pill" type="button">
                  7 ngày qua
                </button>
                <button className="admin-pill admin-pill--primary" type="button">
                  + Báo cáo nhanh
                </button>
              </div>
            </header>

            {flash && <div className={`admin-alert admin-alert--${flash.type}`}>{flash.message}</div>}

            <section className="admin-hero">
              <div className="admin-hero__primary">
                <div>
                  <p>Doanh thu vé dự kiến</p>
                  <h2>215.5 triệu đ</h2>
                  <p className="admin-hero__muted">57 suất chiếu đang mở bán</p>
                </div>
                <div className="admin-hero__trend">
                  <span>+18% tuần này</span>
                  <small>So với cùng kỳ</small>
                </div>
              </div>
              <div className="admin-hero__actions">
                <div className="admin-quick-actions">
                  {QUICK_ACTIONS.map(action => (
                    <button key={action.label} type="button">
                      <span>{action.icon}</span>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="admin-stats admin-stats--grid">
              {stats.map(stat => (
                <article key={stat.label} className="admin-stat-card">
                  <p className="admin-stat-label">{stat.label}</p>
                  <p className="admin-stat-value">{stat.value}</p>
                  <p className="admin-stat-sub">{stat.subText}</p>
                </article>
              ))}
            </section>

            <section className="admin-analytics-grid">
              <article className="admin-chart-card">
                <header>
                  <div>
                    <p>Hiệu suất bán vé</p>
                    <h3>820 vé / tuần</h3>
                  </div>
                  <span className="admin-pill admin-pill--ghost">Realtime</span>
                </header>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Ticket performance chart">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    points={BUILD_LINE_POINTS(PERFORMANCE_CHART)}
                  />
                  <polyline
                    fill="rgba(192, 132, 252, 0.15)"
                    stroke="transparent"
                    points={`${BUILD_LINE_POINTS(PERFORMANCE_CHART)} 100,100 0,100`}
                  />
                </svg>
              </article>

              <article className="admin-chart-card admin-chart-card--list">
                <header>
                  <p>Phim bán chạy</p>
                  <span className="admin-pill admin-pill--ghost">Top 4</span>
                </header>
                <ul>
                  {topMovies.map(movie => {
                    const percent = movie.soldTickets ? Math.min(100, (movie.soldTickets / 1000) * 100) : 0;
                    return (
                      <li key={movie.id}>
                        <div>
                          <p>{movie.title}</p>
                          <small>{movie.soldTickets.toLocaleString('vi-VN')} vé</small>
                        </div>
                        <div className="admin-progress">
                          <span style={{ width: `${percent}%` }} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </article>

              <article className="admin-chart-card admin-chart-card--list">
                <header>
                  <p>Lịch ra mắt</p>
                  <span className="admin-pill admin-pill--ghost">3 phim</span>
                </header>
                <ul>
                  {UPCOMING_PREMIERES.map(movie => (
                    <li key={movie.title}>
                      <div>
                        <p>{movie.title}</p>
                        <small>Mở bán {movie.date}</small>
                      </div>
                      <span className="admin-chip admin-chip--ghost">{movie.branches} cụm rạp</span>
                    </li>
                  ))}
                </ul>
              </article>
            </section>

            <section className="admin-manage-grid">
              <article className="admin-form-section admin-card">
                <div className="admin-section-head">
                  <h2>Thêm phim mới</h2>
                  <p>Đồng bộ poster, lịch phát hành và hạn mức tuổi.</p>
                </div>
                <form className="admin-form" onSubmit={handleSubmit}>
                  <div className="admin-form-grid">
                    <label>
                      Tiêu đề
                      <input
                        className="admin-input"
                        value={form.title}
                        onChange={event => setForm(prev => ({ ...prev, title: event.target.value }))}
                        placeholder="Nhập tên phim"
                      />
                    </label>

                    <label>
                      Trạng thái
                      <select
                        className="admin-input"
                        value={form.status}
                        onChange={event => setForm(prev => ({ ...prev, status: event.target.value as MovieStatus }))}
                      >
                        <option value="now_showing">Đang chiếu</option>
                        <option value="coming_soon">Sắp chiếu</option>
                        <option value="draft">Nháp</option>
                      </select>
                    </label>

                    <label>
                      Ngày phát hành
                      <input
                        className="admin-input"
                        type="date"
                        value={form.releaseDate}
                        onChange={event => setForm(prev => ({ ...prev, releaseDate: event.target.value }))}
                      />
                    </label>

                    <label>
                      Thời lượng (phút)
                      <input
                        className="admin-input"
                        type="number"
                        min={40}
                        max={240}
                        value={form.duration}
                        onChange={event => setForm(prev => ({ ...prev, duration: Number(event.target.value) }))}
                      />
                    </label>

                    <label>
                      Độ tuổi
                      <input
                        className="admin-input"
                        value={form.rating}
                        onChange={event => setForm(prev => ({ ...prev, rating: event.target.value }))}
                        placeholder="P / C13 / C16 / C18"
                      />
                    </label>

                    <label>
                      Poster (URL)
                      <input
                        className="admin-input"
                        value={form.poster}
                        onChange={event => setForm(prev => ({ ...prev, poster: event.target.value }))}
                        placeholder="https://..."
                      />
                    </label>
                  </div>

                  <button type="submit" className="admin-submit-btn" disabled={submitting}>
                    {submitting ? 'Đang lưu...' : 'Lưu phim'}
                  </button>
                </form>
              </article>

              <article className="admin-table-section admin-card">
                <div className="admin-section-head">
                  <div>
                    <h2>Danh sách phim</h2>
                    <p>
                      {loading ? 'Đang tải dữ liệu...' : `${filteredMovies.length} phim phù hợp bộ lọc`}
                    </p>
                  </div>
                  <div className="admin-filters admin-filters--compact">
                    {filterOptions.map(option => (
                      <button
                        key={option.id}
                        type="button"
                        className={`admin-filter-btn${filter === option.id ? ' admin-filter-btn--active' : ''}`}
                        onClick={() => setFilter(option.id)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Phim</th>
                        <th>Trạng thái</th>
                        <th>Lịch</th>
                        <th>Vé đã bán</th>
                        <th>Thiết lập</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!loading && filteredMovies.length === 0 && (
                        <tr>
                          <td colSpan={5} className="admin-table-empty">
                            Không có phim nào khớp bộ lọc.
                          </td>
                        </tr>
                      )}

                      {filteredMovies.map(movie => (
                        <tr key={movie.id}>
                          <td>
                            <div className="admin-movie">
                              <img src={movie.poster || '/assets/images/phim1.png'} alt={movie.title} />
                              <div>
                                <p className="admin-movie-title">{movie.title}</p>
                                <p className="admin-movie-meta">
                                  {movie.duration} phút • {movie.rating || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge status-badge--${movie.status}`}>
                              {STATUS_LABELS[movie.status]}
                            </span>
                          </td>
                          <td>
                            <p className="admin-movie-meta">{movie.releaseDate || 'Chưa cập nhật'}</p>
                            <p className="admin-movie-meta">{movie.totalShows} suất chiếu</p>
                          </td>
                          <td>
                            <p className="admin-movie-meta">{movie.soldTickets.toLocaleString('vi-VN')} vé</p>
                          </td>
                          <td>
                            <div className="admin-actions">
                              <select
                                className="admin-input admin-input--dense"
                                value={movie.status}
                                onChange={event =>
                                  handleStatusChange(movie.id, event.target.value as MovieStatus)
                                }
                              >
                                <option value="now_showing">Đang chiếu</option>
                                <option value="coming_soon">Sắp chiếu</option>
                                <option value="draft">Nháp</option>
                              </select>
                              <button
                                type="button"
                                className={`admin-chip${movie.isFeatured ? ' admin-chip--active' : ''}`}
                                onClick={() => handleFeatureToggle(movie.id, !movie.isFeatured)}
                              >
                                {movie.isFeatured ? 'Đang nổi bật' : 'Đánh dấu nổi bật'}
                              </button>
                              <button
                                type="button"
                                className="admin-chip admin-chip--danger"
                                onClick={() => handleDelete(movie.id)}
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </section>
          </section>
        </div>
      </main>
    </div>
  );
}
