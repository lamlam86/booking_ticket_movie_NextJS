import { prisma } from '@/lib/prisma';

export default async function AdminCombosPage() {
  const combos = await prisma.concessions.findMany({
    orderBy: { price: 'desc' },
  });

  return (
    <div className="admin-stack">
      <div className="page-heading">
        <div>
          <p className="admin-eyebrow">Combo bắp nước</p>
          <h2>Sản phẩm & dịch vụ</h2>
        </div>
      </div>

      <section className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên combo</th>
              <th>Loại</th>
              <th>Mô tả</th>
              <th>Giá bán</th>
            </tr>
          </thead>
          <tbody>
            {combos.map(combo => (
              <tr key={combo.id}>
                <td>{combo.name}</td>
                <td>{combo.type}</td>
                <td>{combo.description || '--'}</td>
                <td>{Number(combo.price).toLocaleString('vi-VN')} đ</td>
              </tr>
            ))}
            {combos.length === 0 && (
              <tr>
                <td colSpan={4}>Chưa có combo nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
