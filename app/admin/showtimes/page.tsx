import { prisma } from '@/lib/prisma';

export default async function AdminShowtimesPage() {
  const showtimes = await prisma.showtimes.findMany({
    orderBy: { start_time: 'desc' },
    take: 30,
    include: {
      movie: { select: { title: true } },
      screen: {
        select: {
          name: true,
          branch: { select: { name: true } },
        },
      },
    },
  });

  return (
    <div className="admin-stack">
      <div className="page-heading">
        <div>
          <p className="admin-eyebrow">Quản lý lịch chiếu</p>
          <h2>Suất chiếu gần nhất</h2>
        </div>
      </div>

      <section className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Phim</th>
              <th>Rạp / Phòng</th>
              <th>Giờ bắt đầu</th>
              <th>Giờ kết thúc</th>
              <th>Giá cơ bản</th>
            </tr>
          </thead>
          <tbody>
            {showtimes.map(showtime => (
              <tr key={showtime.id}>
                <td>{showtime.movie.title}</td>
                <td>
                  {showtime.screen.branch.name}
                  <small className="muted"> • {showtime.screen.name}</small>
                </td>
                <td>{new Date(showtime.start_time).toLocaleString('vi-VN')}</td>
                <td>{new Date(showtime.end_time).toLocaleString('vi-VN')}</td>
                <td>{Number(showtime.base_price).toLocaleString('vi-VN')} đ</td>
              </tr>
            ))}
            {showtimes.length === 0 && (
              <tr>
                <td colSpan={5}>Chưa có lịch chiếu nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
