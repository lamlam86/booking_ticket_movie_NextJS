"use client";
import { useState, useEffect } from "react";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    link_url: "",
    description: "",
    position: 0,
    is_active: true
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/banners?_t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      
      if (data.message) {
        setMessage({ type: "warning", text: data.message });
      }
      
      setBanners(data.data || []);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Lỗi tải dữ liệu. Vui lòng chạy: npx prisma db push" });
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingBanner(null);
    setFormData({
      title: "",
      image_url: "",
      link_url: "",
      description: "",
      position: banners.length + 1,
      is_active: true
    });
    setPreviewUrl("");
    setShowModal(true);
  }

  function openEditModal(banner) {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      image_url: banner.imageUrl,
      link_url: banner.linkUrl || "",
      description: banner.description || "",
      position: banner.position,
      is_active: banner.isActive
    });
    setPreviewUrl(banner.imageUrl);
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setMessage({ type: "error", text: "Vui lòng nhập tiêu đề" });
      return;
    }
    
    if (!formData.image_url.trim()) {
      setMessage({ type: "error", text: "Vui lòng nhập URL hình ảnh" });
      return;
    }
    
    try {
      const url = editingBanner 
        ? `/api/admin/banners/${editingBanner.id}`
        : "/api/admin/banners";
      
      const res = await fetch(url, {
        method: editingBanner ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Lỗi thao tác");
      }

      setMessage({ 
        type: "success", 
        text: editingBanner ? "Cập nhật banner thành công!" : "Thêm banner thành công!" 
      });
      setShowModal(false);
      fetchBanners();
    } catch (err) {
      console.error("Submit error:", err);
      setMessage({ type: "error", text: err.message });
    }
    
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  }

  async function handleDelete(id) {
    if (!confirm("Bạn có chắc muốn xóa banner này?")) return;

    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Lỗi xóa banner");

      setMessage({ type: "success", text: "Xóa banner thành công!" });
      setBanners(banners.filter(b => b.id !== id));
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
    
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  }

  async function handleToggleActive(id, currentActive) {
    try {
      await fetch(`/api/admin/banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentActive })
      });
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleMovePosition(id, direction) {
    const index = banners.findIndex(b => b.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;

    const currentBanner = banners[index];
    const swapBanner = banners[newIndex];

    try {
      await Promise.all([
        fetch(`/api/admin/banners/${currentBanner.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ position: swapBanner.position })
        }),
        fetch(`/api/admin/banners/${swapBanner.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ position: currentBanner.position })
        })
      ]);
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  }

  function handleImageUrlChange(e) {
    const url = e.target.value;
    setFormData({ ...formData, image_url: url });
    setPreviewUrl(url);
  }

  return (
    <div className="admin-stack">
      <div className="page-heading">
        <div>
          <p className="admin-eyebrow">Quản lý giao diện</p>
          <h2>Quản lý Banner</h2>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + Thêm Banner
        </button>
      </div>

      {message.text && (
        <div className={`admin-message admin-message--${message.type}`}>{message.text}</div>
      )}

      {loading ? (
        <div className="admin-loading">Đang tải...</div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>STT</th>
                  <th style={{ width: 150 }}>Hình ảnh</th>
                  <th>Tiêu đề</th>
                  <th>Link</th>
                  <th style={{ width: 100 }}>Trạng thái</th>
                  <th style={{ width: 100 }}>Vị trí</th>
                  <th style={{ width: 150 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {banners.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: 40 }}>
                      Chưa có banner nào. Hãy thêm banner mới.
                    </td>
                  </tr>
                ) : (
                  banners.map((banner, index) => (
                    <tr key={banner.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="banner-thumbnail">
                          <img src={banner.imageUrl} alt={banner.title} />
                        </div>
                      </td>
                      <td>
                        <strong>{banner.title}</strong>
                        {banner.description && (
                          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "4px 0 0" }}>
                            {banner.description}
                          </p>
                        )}
                      </td>
                      <td>
                        {banner.linkUrl ? (
                          <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" 
                             style={{ color: "var(--primary)", fontSize: "0.85rem" }}>
                            {banner.linkUrl.length > 30 ? banner.linkUrl.slice(0, 30) + "..." : banner.linkUrl}
                          </a>
                        ) : (
                          <span style={{ color: "var(--text-soft)" }}>—</span>
                        )}
                      </td>
                      <td>
                        <button
                          className={`admin-badge admin-badge--${banner.isActive ? "success" : "danger"}`}
                          onClick={() => handleToggleActive(banner.id, banner.isActive)}
                          style={{ cursor: "pointer", border: "none" }}
                        >
                          {banner.isActive ? "Hiển thị" : "Ẩn"}
                        </button>
                      </td>
                      <td>
                        <div className="position-controls">
                          <button 
                            className="position-btn"
                            onClick={() => handleMovePosition(banner.id, 'up')}
                            disabled={index === 0}
                            title="Lên"
                          >
                            ▲
                          </button>
                          <span>{banner.position}</span>
                          <button 
                            className="position-btn"
                            onClick={() => handleMovePosition(banner.id, 'down')}
                            disabled={index === banners.length - 1}
                            title="Xuống"
                          >
                            ▼
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="admin-actions" style={{ flexDirection: "row", gap: 8 }}>
                          <button
                            className="admin-action-btn"
                            onClick={() => openEditModal(banner)}
                            title="Sửa"
                          >
                            ✏️
                          </button>
                          <button
                            className="admin-action-btn admin-action-btn--danger"
                            onClick={() => handleDelete(banner.id)}
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
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="admin-modal__header">
              <h2>{editingBanner ? "Sửa Banner" : "Thêm Banner mới"}</h2>
              <button className="admin-modal__close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="admin-modal__body">
              <div className="admin-form-group">
                <label>Tiêu đề *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Khuyến mãi tháng 12"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>URL Hình ảnh *</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={handleImageUrlChange}
                  placeholder="https://example.com/banner.jpg"
                  required
                />
                {previewUrl && (
                  <div className="banner-preview">
                    <img src={previewUrl} alt="Preview" onError={() => setPreviewUrl("")} />
                  </div>
                )}
              </div>

              <div className="admin-form-group">
                <label>Link khi click (tùy chọn)</label>
                <input
                  type="url"
                  value={formData.link_url}
                  onChange={e => setFormData({ ...formData, link_url: e.target.value })}
                  placeholder="https://example.com/promotion"
                />
              </div>

              <div className="admin-form-group">
                <label>Mô tả (tùy chọn)</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn về banner"
                  rows={2}
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Vị trí</label>
                  <input
                    type="number"
                    value={formData.position}
                    onChange={e => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
                    min={0}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Trạng thái</label>
                  <select
                    value={formData.is_active ? "active" : "inactive"}
                    onChange={e => setFormData({ ...formData, is_active: e.target.value === "active" })}
                  >
                    <option value="active">Hiển thị</option>
                    <option value="inactive">Ẩn</option>
                  </select>
                </div>
              </div>

              <div className="admin-modal__footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBanner ? "Cập nhật" : "Thêm Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .banner-thumbnail {
          width: 120px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          background: var(--glass);
        }
        .banner-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .banner-preview {
          margin-top: 12px;
          border-radius: 12px;
          overflow: hidden;
          background: var(--glass);
          max-height: 200px;
        }
        .banner-preview img {
          width: 100%;
          height: auto;
          max-height: 200px;
          object-fit: contain;
        }
        .position-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .position-btn {
          width: 24px;
          height: 24px;
          border: none;
          background: var(--glass);
          color: var(--text-muted);
          border-radius: 4px;
          cursor: pointer;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .position-btn:hover:not(:disabled) {
          background: var(--primary);
          color: white;
        }
        .position-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .admin-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
      `}</style>
    </div>
  );
}
