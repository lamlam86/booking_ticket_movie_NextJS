"use client";
import { useState, useEffect } from "react";

const SCREEN_TYPES = {
  standard: "Phòng chiếu"
};

const SEAT_TYPES = {
  standard: "Ghế thường",
  vip: "Ghế VIP"
};


export default function AdminTicketPricesPage() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPrice, setNewPrice] = useState({
    screen_type: "standard",
    seat_type: "standard",
    price: 65000
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchPrices();
  }, []);

  async function fetchPrices() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/ticket-prices?_t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      setPrices(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePrice(id) {
    try {
      const res = await fetch("/api/admin/ticket-prices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, price: parseInt(editPrice) })
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMessage({ type: "success", text: "Cập nhật thành công!" });
      setEditingId(null);
      fetchPrices();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
    setTimeout(() => setMessage({ type: "", text: "" }), 2000);
  }

  async function handleToggleActive(id, currentActive) {
    try {
      await fetch("/api/admin/ticket-prices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !currentActive })
      });
      fetchPrices();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddPrice(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/ticket-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPrice)
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMessage({ type: "success", text: "Thêm giá vé thành công!" });
      setShowAddModal(false);
      setNewPrice({ screen_type: "standard", seat_type: "standard", price: 65000 });
      fetchPrices();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
    setTimeout(() => setMessage({ type: "", text: "" }), 2000);
  }

  // Group prices by screen type
  const groupedPrices = prices.reduce((acc, price) => {
    if (!acc[price.screenType]) acc[price.screenType] = [];
    acc[price.screenType].push(price);
    return acc;
  }, {});

  return (
    <div className="admin-stack">
      <div className="page-heading">
        <div>
          <p className="admin-eyebrow">Quản lý nội dung</p>
          <h2>Bảng giá vé</h2>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Thêm giá vé
        </button>
      </div>

      {message.text && (
        <div className={`admin-message admin-message--${message.type}`}>{message.text}</div>
      )}

      {loading ? (
        <div className="admin-loading">Đang tải...</div>
      ) : (
        <div className="admin-stack" style={{ gap: 24 }}>
          {Object.entries(groupedPrices).map(([screenType, screenPrices]) => (
            <div key={screenType} className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Loại ghế</th>
                      <th>Giá vé</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {screenPrices.map(price => (
                      <tr key={price.id}>
                        <td><strong>{SEAT_TYPES[price.seatType] || price.seatType}</strong></td>
                        <td>
                          {editingId === price.id ? (
                            <input
                              type="number"
                              className="admin-input"
                              style={{ width: 120 }}
                              value={editPrice}
                              onChange={e => setEditPrice(e.target.value)}
                              autoFocus
                            />
                          ) : (
                            <strong style={{ color: "var(--primary)" }}>{price.price.toLocaleString()}đ</strong>
                          )}
                        </td>
                        <td>
                          <button
                            className={`admin-badge admin-badge--${price.isActive ? "success" : "danger"}`}
                            onClick={() => handleToggleActive(price.id, price.isActive)}
                            style={{ cursor: "pointer", border: "none" }}
                          >
                            {price.isActive ? "Đang áp dụng" : "Tạm dừng"}
                          </button>
                        </td>
                        <td>
                          <div className="admin-actions" style={{ flexDirection: "row", gap: 8 }}>
                            {editingId === price.id ? (
                              <>
                                <button
                                  className="admin-action-btn"
                                  onClick={() => handleUpdatePrice(price.id)}
                                  title="Lưu"
                                >
                                  ✅
                                </button>
                                <button
                                  className="admin-action-btn"
                                  onClick={() => setEditingId(null)}
                                  title="Hủy"
                                >
                                  ❌
                                </button>
                              </>
                            ) : (
                              <button
                                className="admin-action-btn"
                                onClick={() => { setEditingId(price.id); setEditPrice(price.price.toString()); }}
                                title="Sửa giá"
                              >
                                ✏️
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {Object.keys(groupedPrices).length === 0 && (
            <div className="admin-empty-state">
              <p>Chưa có bảng giá nào. Hãy thêm giá vé mới.</p>
            </div>
          )}
        </div>
      )}

      {/* Add Price Modal */}
      {showAddModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 450 }}>
            <div className="admin-modal__header">
              <h2>Thêm giá vé mới</h2>
              <button className="admin-modal__close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleAddPrice} className="admin-modal__body">
              <div className="admin-form-group">
                <label>Loại ghế *</label>
                <select 
                  value={newPrice.seat_type} 
                  onChange={e => setNewPrice({...newPrice, seat_type: e.target.value})}
                  required
                >
                  {Object.entries(SEAT_TYPES).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label>Giá vé (VNĐ) *</label>
                <input
                  type="number"
                  value={newPrice.price}
                  onChange={e => setNewPrice({...newPrice, price: parseInt(e.target.value)})}
                  required
                  min={0}
                />
              </div>

              <div className="admin-modal__footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Thêm giá vé</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
