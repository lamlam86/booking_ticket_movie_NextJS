import { prisma } from '@/lib/prisma';

const badgeClass = (status: string) => {
  switch (status) {
    case 'paid':
      return 'status-badge status-badge--now_showing';
    case 'refunded':
    case 'cancelled':
      return 'status-badge status-badge--draft';
    default:
      return 'status-badge status-badge--coming_soon';
  }
};

export default async function AdminOrdersPage() {
  const orders = await prisma.bookings.findMany({
    orderBy: { created_at: 'desc' },
    take: 50,
    include: {
      user: { select: { full_name: true, email: true } },
      showtime: {
        select: {
          movie: { select: { title: true } },
          start_time: true,
        },
      },
    },
  });

  return (
    <div className="admin-stack">
      <div className="page-heading">
        <div>
          <p className="admin-eyebrow">Theo dõi bán vé</p>
          <h2>Đơn hàng / Vé đã bán</h2>
        </div>
      </div>

      <section className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Phim</th>
              <th>Thời gian chiếu</th>
              <th>Tổng tiền</th>
              <th>Thanh toán</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.booking_code}</td>
                <td>
                  {order.user?.full_name || 'Khách lẻ'}
                  <small className="muted">{order.user?.email}</small>
                </td>
                <td>{order.showtime.movie.title}</td>
                <td>{new Date(order.showtime.start_time).toLocaleString('vi-VN')}</td>
                <td>{Number(order.total_amount ?? 0).toLocaleString('vi-VN')} đ</td>
                <td>
                  <span className={badgeClass(order.payment_status)}>
                    {order.payment_status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6}>Chưa có đơn hàng nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
