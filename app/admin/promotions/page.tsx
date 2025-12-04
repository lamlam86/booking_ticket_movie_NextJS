import { prisma } from '@/lib/prisma';

export default async function AdminPromotionsPage() {
  const promotions = await prisma.promotions.findMany({
    orderBy: { created_at: 'desc' },
  });

  return (
    <div className="admin-stack">
      <div className="page-heading">
        <div>
          <p className="admin-eyebrow">Gói ưu đãi</p>
          <h2>Khuyến mãi & chiến dịch</h2>
        </div>
      </div>

      <section className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên chương trình</th>
              <th>Mã áp dụng</th>
              <th>Loại giảm</th>
              <th>Giá trị</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map(promo => (
              <tr key={promo.id}>
                <td>{promo.name}</td>
                <td>{promo.code || '--'}</td>
                <td>{promo.discount_type === 'percent' ? 'Phần trăm' : 'Số tiền'}</td>
                <td>
                  {promo.discount_type === 'percent'
                    ? `${promo.discount_value}%`
                    : `${Number(promo.discount_value).toLocaleString('vi-VN')} đ`}
                </td>
                <td>
                  {promo.start_date
                    ? new Date(promo.start_date).toLocaleDateString('vi-VN')
                    : '---'}{' '}
                  -{' '}
                  {promo.end_date ? new Date(promo.end_date).toLocaleDateString('vi-VN') : '---'}
                </td>
                <td>
                  <span className={`status-badge status-badge--${promo.status}`}>
                    {promo.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
            {promotions.length === 0 && (
              <tr>
                <td colSpan={6}>Chưa có khuyến mãi nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
