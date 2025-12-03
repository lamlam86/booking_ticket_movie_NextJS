import { prisma } from '@/lib/prisma';

export default async function AdminCustomersPage() {
  const customers = await prisma.users.findMany({
    orderBy: { created_at: 'desc' },
    take: 50,
  });

  return (
    <div className="admin-stack">
      <div className="page-heading">
        <div>
          <p className="admin-eyebrow">Khách hàng</p>
          <h2>Danh sách người dùng</h2>
        </div>
      </div>

      <section className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id.toString()}>
                <td>{customer.full_name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone || '--'}</td>
                <td>
                  <span className={`status-badge status-badge--${customer.status}`}>
                    {customer.status === 'active' ? 'Hoạt động' : customer.status}
                  </span>
                </td>
                <td>{new Date(customer.created_at).toLocaleDateString('vi-VN')}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5}>Chưa có khách hàng.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
