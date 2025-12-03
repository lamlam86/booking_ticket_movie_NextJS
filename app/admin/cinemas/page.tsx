import { prisma } from '@/lib/prisma';

export default async function AdminCinemasPage() {
  const branches = await prisma.branches.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { screens: true } },
    },
  });

  return (
    <div className="admin-stack">
      <div className="page-heading">
        <div>
          <p className="admin-eyebrow">Quản lý hệ thống rạp</p>
          <h2>Danh sách rạp chiếu</h2>
        </div>
      </div>

      <section className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên rạp</th>
              <th>Thành phố</th>
              <th>Hotline</th>
              <th>Số phòng</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {branches.map(branch => (
              <tr key={branch.id}>
                <td>{branch.name}</td>
                <td>{branch.city || '--'}</td>
                <td>{branch.hotline || '--'}</td>
                <td>{branch._count.screens}</td>
                <td>
                  <span className={`status-badge status-badge--${branch.status}`}>
                    {branch.status === 'active' ? 'Đang hoạt động' : branch.status}
                  </span>
                </td>
              </tr>
            ))}
            {branches.length === 0 && (
              <tr>
                <td colSpan={5}>Chưa có rạp nào được thêm.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
