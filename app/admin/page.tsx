'use client';

import { FormEvent, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const POSTER_POOL = [
  '/assets/images/phim1.png',
  '/assets/images/phim2.png',
  '/assets/images/phim3.png',
  '/assets/images/phim4.png',
  '/assets/images/phim5.png',
  '/assets/images/phim6.png',
];

type MovieStatus = 'nowShowing' | 'comingSoon' | 'draft';

type Movie = {
  id: string;
  title: string;
  poster: string;
  status: MovieStatus;
  releaseDate: string;
  duration: number;
  rating: string;
  isFeatured: boolean;
  soldTickets: number;
  totalShows: number;
};

const STATUS_LABELS: Record<MovieStatus, string> = {
  nowShowing: 'Đang chiếu',
  comingSoon: 'Sắp chiếu',
  draft: 'Nháp',
};

const seedMovies: Movie[] = [
  {
    id: 'n-1',
    title: 'Avatar Reborn',
    poster: POSTER_POOL[0],
    status: 'nowShowing',
    releaseDate: '2024-11-10',
    duration: 128,
    rating: 'C13',
    isFeatured: true,
    soldTickets: 860,
    totalShows: 32,
  },
  {
    id: 'n-2',
    title: 'Haunted Melody',
    poster: POSTER_POOL[1],
    status: 'nowShowing',
    releaseDate: '2024-11-01',
    duration: 115,
    rating: 'C16',
    isFeatured: false,
    soldTickets: 640,
    totalShows: 26,
  },
  {
    id: 'c-1',
    title: 'Future Horizon',
    poster: POSTER_POOL[2],
    status: 'comingSoon',
    releaseDate: '2025-01-05',
    duration: 134,
    rating: 'P',
    isFeatured: true,
    soldTickets: 0,
    totalShows: 0,
  },
  {
    id: 'c-2',
    title: 'Moonlit Heist',
    poster: POSTER_POOL[3],
    status: 'comingSoon',
    releaseDate: '2024-12-18',
    duration: 123,
    rating: 'C13',
    isFeatured: false,
    soldTickets: 0,
    totalShows: 0,
  },
  {
    id: 'd-1',
    title: 'Untitled Horror Project',
    poster: POSTER_POOL[4],
    status: 'draft',
    releaseDate: '2025-03-01',
    duration: 100,
    rating: 'C18',
    isFeatured: false,
    soldTickets: 0,
    totalShows: 0,
  },
  {
    id: 'd-2',
    title: 'Summer Romance 2',
    poster: POSTER_POOL[5],
    status: 'draft',
    releaseDate: '2025-02-10',
    duration: 105,
    rating: 'P',
    isFeatured: false,
    soldTickets: 0,
    totalShows: 0,
  },
];

const EMPTY_FORM = {
  title: '',
  poster: POSTER_POOL[0],
  status: 'nowShowing' as MovieStatus,
  releaseDate: '',
  duration: 120,
  rating: 'P',
};

type FlashState = {
  type: 'success' | 'error';
  message: string;
} | null;

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>(seedMovies);
  const [filter, setFilter] = useState<'all' | MovieStatus>('all');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [flash, setFlash] = useState<FlashState>(null);

  const filteredMovies = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return movies.filter(movie => {
      const matchFilter = filter === 'all' ? true : movie.status === filter;
      const matchKeyword = movie.title.toLowerCase().includes(keyword);
      return matchFilter && matchKeyword;
    });
  }, [filter, movies, search]);

  const stats = useMemo(() => {
    const totalRevenue = movies
      .filter(m => m.status === 'nowShowing')
      .reduce((sum, movie) => sum + movie.soldTickets * 45000, 0);

    return [
      {
        label: 'Tổng phim',
        value: movies.length,
        subText: `${movies.filter(m => m.status === 'nowShowing').length} đang chiếu`,
      },
      {
        label: 'Vé đã bán (ước tính)',
        value: totalRevenue.toLocaleString('vi-VN') + 'đ',
        subText: 'Giá vé giả lập 45.000đ',
      },
      {
        label: 'Sắp chiếu',
        value: movies.filter(m => m.status === 'comingSoon').length,
        subText: 'Đã sẵn sàng mở vé',
      },
      {
        label: 'Nháp',
        value: movies.filter(m => m.status === 'draft').length,
        subText: 'Cần duyệt nội dung',
      },
    ];
  }, [movies]);

  const filterOptions: { id: 'all' | MovieStatus; label: string }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'nowShowing', label: 'Đang chiếu' },
    { id: 'comingSoon', label: 'Sắp chiếu' },
    { id: 'draft', label: 'Nháp' },
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = form.title.trim();

    if (!trimmedTitle || !form.releaseDate) {
      setFlash({ type: 'error', message: 'Vui lòng nhập tiêu đề và ngày phát hành.' });
      return;
    }

    const newMovie: Movie = {
      id: `m-${Date.now()}`,
      title: trimmedTitle,
      poster: form.poster,
      status: form.status,
      releaseDate: form.releaseDate,
      duration: Number(form.duration) || 90,
      rating: form.rating,
      isFeatured: false,
      soldTickets: 0,
      totalShows: 0,
    };

    setMovies(prev => [newMovie, ...prev]);
    setForm(EMPTY_FORM);
    setFlash({ type: 'success', message: 'Đã thêm phim vào danh sách!' });
  };

  const handleStatusChange = (movieId: string, nextStatus: MovieStatus) => {
    setMovies(prev => prev.map(movie => (movie.id === movieId ? { ...movie, status: nextStatus } : movie)));
  };

  const handleFeatureToggle = (movieId: string) => {
    setMovies(prev =>
      prev.map(movie =>
        movie.id === movieId
          ? {
              ...movie,
              isFeatured: !movie.isFeatured,
            }
          : movie,
      ),
    );
  };

  const handleDelete = (movieId: string) => {
    setMovies(prev => prev.filter(movie => movie.id !== movieId));
  };

  return (
    <div className="app">
      <Header />

      <main className="admin-page">
        <div className="admin-panel">
          <header className="admin-headline">
            <div>
              <p className="admin-eyebrow">Dashboard nội bộ</p>
              <h1>Quản lý phim</h1>
            </div>
            <span className="badge badge--highlight">Realtime mock</span>
          </header>

          <section className="admin-stats">
            {stats.map(stat => (
              <article key={stat.label} className="admin-stat-card">
                <p className="admin-stat-label">{stat.label}</p>
                <p className="admin-stat-value">{stat.value}</p>
                <p className="admin-stat-sub">{stat.subText}</p>
              </article>
            ))}
          </section>

          <section className="admin-toolbar">
            <div className="admin-toolbar-block">
              <label htmlFor="movie-search">Tìm kiếm</label>
              <input
                id="movie-search"
                className="admin-input"
                placeholder="Nhập tên phim..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="admin-toolbar-block">
              <span>Trạng thái</span>
              <div className="admin-filters">
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
          </section>

          {flash && (
            <div className={`admin-alert admin-alert--${flash.type}`}>
              {flash.message}
            </div>
          )}

          <section className="admin-form-section">
            <h2>Thêm phim mới</h2>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <label>
                  Tiêu đề
                  <input
                    className="admin-input"
                    value={form.title}
                    onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nhập tên phim"
                  />
                </label>

                <label>
                  Trạng thái
                  <select
                    className="admin-input"
                    value={form.status}
                    onChange={e => setForm(prev => ({ ...prev, status: e.target.value as MovieStatus }))}
                  >
                    <option value="nowShowing">Đang chiếu</option>
                    <option value="comingSoon">Sắp chiếu</option>
                    <option value="draft">Nháp</option>
                  </select>
                </label>

                <label>
                  Ngày phát hành
                  <input
                    className="admin-input"
                    type="date"
                    value={form.releaseDate}
                    onChange={e => setForm(prev => ({ ...prev, releaseDate: e.target.value }))}
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
                    onChange={e => setForm(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  />
                </label>

                <label>
                  Độ tuổi
                  <input
                    className="admin-input"
                    value={form.rating}
                    onChange={e => setForm(prev => ({ ...prev, rating: e.target.value }))}
                    placeholder="P / C13 / C16 / C18"
                  />
                </label>

                <label>
                  Poster (URL)
                  <select
                    className="admin-input"
                    value={form.poster}
                    onChange={e => setForm(prev => ({ ...prev, poster: e.target.value }))}
                  >
                    {POSTER_POOL.map(src => (
                      <option key={src} value={src}>
                        {src.split('/').pop()}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <button type="submit" className="admin-submit-btn">
                Lưu phim
              </button>
            </form>
          </section>

          <section className="admin-table-section">
            <div className="admin-table-head">
              <h2>Danh sách phim</h2>
              <p>{filteredMovies.length} phim phù hợp bộ lọc</p>
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
                  {filteredMovies.length === 0 && (
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
                          <img src={movie.poster} alt={movie.title} />
                          <div>
                            <p className="admin-movie-title">{movie.title}</p>
                            <p className="admin-movie-meta">
                              {movie.duration} phút • {movie.rating}
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
                            onChange={e => handleStatusChange(movie.id, e.target.value as MovieStatus)}
                          >
                            <option value="nowShowing">Đang chiếu</option>
                            <option value="comingSoon">Sắp chiếu</option>
                            <option value="draft">Nháp</option>
                          </select>
                          <button
                            type="button"
                            className={`admin-chip${movie.isFeatured ? ' admin-chip--active' : ''}`}
                            onClick={() => handleFeatureToggle(movie.id)}
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
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
