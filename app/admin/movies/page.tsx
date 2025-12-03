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

const QUICK_ACTIONS = [
  { label: 'Tạo suất chiếu', icon: '🎞' },
  { label: 'Đăng phim mới', icon: '🎬' },
  { label: 'Chiến dịch vé', icon: '🚀' },
  { label: 'Khuyến mãi', icon: '💳' },
];

const EMPTY_FORM = {
  title: '',
  poster: '',
  status: 'now_showing' as MovieStatus,
  releaseDate: '',
  duration: 120,
  rating: 'P',
};

type FlashState = { type: 'success' | 'error'; message: string } | null;

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

  const resetFlash = (message: FlashState) => {
    setFlash(message);
    if (message) setTimeout(() => setFlash(null), 2400);
  };

  const upsertMovie = (next: MovieRecord) => {
    setMovies(prev => {
      const idx = prev.findIndex(movie => movie.id === next.id);
      if (idx === -1) return [next, ...prev];
      const copy = [...prev];
      copy[idx] = next;
      return copy;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = form.title.trim();
    if (!trimmedTitle || !form.releaseDate) {
      resetFlash({ type: 'error', message: 'Vui lòng nhập tiêu đề và ngày phát hành.' });
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
      resetFlash({ type: 'success', message: 'Đã thêm phim vào danh sách!' });
    } catch (error) {
      console.error(error);
      resetFlash({ type: 'error', message: 'Không thể thêm phim.' });
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
      resetFlash({ type: 'error', message: 'Không thể cập nhật trạng thái.' });
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
      resetFlash({ type: 'error', message: 'Không thể cập nhật nổi bật.' });
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
      resetFlash({ type: 'error', message: 'Không thể xóa phim.' });
    }
  };

  const filterOptions: { id: 'all' | MovieStatus; label: string }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'now_showing', label: 'Đang chiếu' },
    { id: 'coming_soon', label: 'Sắp chiếu' },
    { id: 'draft', label: 'Nháp' },
  ];

  return (
    <div className="admin-stack">
      <div className="page-heading">
        <div>
          <p className="admin-eyebrow">Quản lý nội dung</p>
          <h2>Quản lý phim</h2>
        </div>
        <div className="admin-heading-actions">
          <div className="admin-search">
            <input
              type="search"
              placeholder="Tìm phim..."
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
            <span role="img" aria-hidden>
              🔍
            </span>
          </div>
        </div>
      </div>

      {flash && <div className={`admin-alert admin-alert--${flash.type}`}>{flash.message}</div>}

      <section className="admin-kpi-grid">
        {stats.map(stat => (
          <article key={stat.label} className="admin-stat-card">
            <p className="admin-stat-label">{stat.label}</p>
            <p className="admin-stat-value">{stat.value}</p>
            <p className="admin-stat-sub">{stat.subText}</p>
          </article>
        ))}
      </section>

      <section className="admin-card admin-quick">
        <h3>Nhiệm vụ nhanh</h3>
        <div className="admin-quick-actions">
          {QUICK_ACTIONS.map(action => (
            <button key={action.label} type="button">
              <span>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </section>

      <section className="admin-manage-grid">
        <article className="admin-card">
          <div className="admin-section-head">
            <h3>Thêm phim mới</h3>
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

        <article className="admin-card">
          <div className="admin-section-head">
            <div>
              <h3>Danh sách phim</h3>
              <p>{loading ? 'Đang tải dữ liệu...' : `${filteredMovies.length} phim phù hợp bộ lọc`}</p>
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
                  <th>Ngày phát hành</th>
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
                          onChange={event => handleStatusChange(movie.id, event.target.value as MovieStatus)}
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
    </div>
  );
}
