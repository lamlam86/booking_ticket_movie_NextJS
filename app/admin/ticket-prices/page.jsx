"use client";
import { useState, useEffect } from "react";

const TICKET_TYPES = {
  single: "Đơn",
  couple: "Đôi"
};

export default function AdminTicketPricesPage() {
  const [ticketPrices, setTicketPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    ticket_type: "single",
    price_multiplier: 1,
    is_active: true,
    display_order: 0
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchTicketPrices();
  }, []);

  async function fetchTicketPrices() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ticket-prices");
      const data = await res.json();
      if (data.error) {
        setMessage({ type: "error", text: data.error });
      } else {
        setTicketPrices(data.data || []);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Lỗi kết nối server" });
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingId(null);
    setFormData({
      name: "",
      code: "",
      description: "",
      ticket_type: "single",
      price_multiplier: 1,
      is_active: true,
      display_order: ticketPrices.length
    });
    setMessage({ type: "", text: "" });
    setShowModal(true);
  }

  function openEditModal(item) {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      code: item.code,
      description: item.description || "",
      ticket_type: item.ticket_type,
      price_multiplier: item.price_multiplier,
      is_active: item.is_active,
      display_order: item.display_order
    });
    setMessage({ type: "", text: "" });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const url = editingId 
        ? `/api/admin/ticket-prices/${editingId}` 
        : "/api/admin/ticket-prices";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Có lỗi xảy ra");

      setMessage({ type: "success", text: editingId ? "Cập nhật thành công!" : "Tạo mới thành công!" });
      fetchTicketPrices();
      setTimeout(() => setShowModal(false), 1000);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!confirm(`Bạn có chắc muốn xóa giá vé "${item.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/ticket-prices/${item.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Có lỗi xảy ra");
      fetchTicketPrices();
    } catch (err) {
      alert(err.message);
    }
  }

  async function toggleActive(item) {
    try {
      await fetch(`/api/admin/ticket-prices/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !item.is_active })
      });
      fetchTicketPrices();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="admin-stack">
      <div className="page-heading">
        <div>
          <p className="admin-eyebrow">Quản lý nội dung</p>
          <h2>Bảng giá vé</h2>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + Thêm loại vé
        </button>
      </div>

      {/* Info */}
      <div className="dashboard-card" style={{padding: 16, background: "var(--glass)"}}>
        <p style={{margin: 0, color: "var(--text-muted)", fontSize: "0.9rem"}}>
          💡 Giá vé thực tế = Giá cơ bản của suất chiếu × Hệ số giá. Ví dụ: Nếu giá cơ bản là 65.000đ và hệ số là 0.9, 
          thì giá vé = 65.000 × 0.9 = 58.500đ
        </p>
      </div>

      {/* Stats */}
      <section className="dashboard-kpi-grid">
        <article className="dashboard-card kpi">
          <p>Tổng loại vé</p>
          <strong>{ticketPrices.length}</strong>
          <span>Loại vé đã tạo</span>
        </article>
        <article className="dashboard-card kpi">
          <p>Đang hoạt động</p>
          <strong>{ticketPrices.filter(tp => tp.is_active).length}</strong>
          <span>Hiển thị cho khách</span>
        </article>
        <article className="dashboard-card kpi">
          <p>Loại đơn</p>
          <strong>{ticketPrices.filter(tp => tp.ticket_type === "single").length}</strong>
          <span>Ghế đơn</span>
        </article>
        <article className="dashboard-card kpi">
          <p>Loại đôi</p>
          <strong>{ticketPrices.filter(tp => tp.ticket_type === "couple").length}</strong>
          <span>Ghế đôi</span>
        </article>
      </section>

      {/* Table */}
      {loading ? (
        <div className="admin-loading">Đang tải...</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên loại vé</th>
                <th>Mã</th>
                <th>Loại ghế</th>
                <th>Hệ số giá</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {ticketPrices.length === 0 ? (
                <tr><td colSpan="8" className="admin-empty">Chưa có loại vé nào</td></tr>
              ) : (
                ticketPrices.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td><strong>{item.name}</strong></td>
                    <td><code>{item.code}</code></td>
                    <td>
                      <span className={`admin-badge admin-badge--${item.ticket_type === "couple" ? "reserved" : "confirmed"}`}>
                        {TICKET_TYPES[item.ticket_type]}
                      </span>
                    </td>
                    <td><strong>×{item.price_multiplier}</strong></td>
                    <td style={{maxWidth: 200, color: "var(--text-muted)"}}>{item.description || "—"}</td>
                    <td>
                      <button
                        className={`admin-toggle-btn ${item.is_active ? "active" : ""}`}
                        onClick={() => toggleActive(item)}
                        title={item.is_active ? "Đang bật" : "Đang tắt"}
                      >
                        {item.is_active ? "Bật" : "Tắt"}
                      </button>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="admin-action-btn"
                          onClick={() => openEditModal(item)}
                          title="Sửa"
                        >
                          ✏️
                        </button>
                        <button
                          className="admin-action-btn admin-action-btn--danger"
                          onClick={() => handleDelete(item)}
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{maxWidth: 500}}>
            <div className="admin-modal__header">
              <h2>{editingId ? "Sửa loại vé" : "Thêm loại vé mới"}</h2>
              <button className="admin-modal__close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="admin-modal__body">
              {message.text && (
                <div className={`admin-message admin-message--${message.type}`}>{message.text}</div>
              )}
              
              <div className="admin-form-group">
                <label>Tên loại vé *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required 
                  placeholder="Ví dụ: NGƯỜI LỚN"
                />
              </div>
              
              <div className="admin-form-group">
                <label>Mã *</label>
                <input 
                  type="text" 
                  value={formData.code} 
                  onChange={e => setFormData({...formData, code: e.target.value.toLowerCase().replace(/\s/g, "_")})} 
                  required 
                  placeholder="Ví dụ: adult"
                />
              </div>
              
              <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16}}>
                <div className="admin-form-group">
                  <label>Loại ghế *</label>
                  <select 
                    value={formData.ticket_type} 
                    onChange={e => setFormData({...formData, ticket_type: e.target.value})}
                  >
                    <option value="single">Ghế đơn</option>
                    <option value="couple">Ghế đôi</option>
                  </select>
                </div>
                
                <div className="admin-form-group">
                  <label>Hệ số giá *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    value={formData.price_multiplier} 
                    onChange={e => setFormData({...formData, price_multiplier: parseFloat(e.target.value)})} 
                    required 
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Mô tả</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  rows={2}
                  placeholder="Mô tả thêm về loại vé (tùy chọn)"
                />
              </div>

              <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16}}>
                <div className="admin-form-group">
                  <label>Thứ tự hiển thị</label>
                  <input 
                    type="number" 
                    value={formData.display_order} 
                    onChange={e => setFormData({...formData, display_order: parseInt(e.target.value)})} 
                  />
                </div>
                
                <div className="admin-form-group">
                  <label>Trạng thái</label>
                  <select 
                    value={formData.is_active ? "true" : "false"} 
                    onChange={e => setFormData({...formData, is_active: e.target.value === "true"})}
                  >
                    <option value="true">Hoạt động</option>
                    <option value="false">Tạm tắt</option>
                  </select>
                </div>
              </div>

              <div className="admin-modal__footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Đang lưu..." : (editingId ? "Cập nhật" : "Tạo mới")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
