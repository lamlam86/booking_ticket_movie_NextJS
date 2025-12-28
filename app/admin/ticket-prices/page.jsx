"use client";
import { useState, useEffect } from "react";

const SEAT_TYPES = {
  standard: "Ghế thường",
  vip: "Ghế VIP",
};

export default function AdminTicketPricesPage() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    fetchPrices();
  }, []);

  async function fetchPrices() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/ticket-prices?_t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setPrices(data.data || []);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePrice(id) {
    await fetch("/api/admin/ticket-prices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, price: parseInt(editPrice) }),
    });
    setEditingId(null);
    fetchPrices();
  }

  async function handleToggleActive(id, currentActive) {
    await fetch("/api/admin/ticket-prices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: !currentActive }),
    });
    fetchPrices();
  }

  // ✅ CHỈ LẤY 1 GHẾ THƯỜNG + 1 GHẾ VIP (ưu tiên đang active)
  const uniquePrices = Object.values(
    prices.reduce((acc, p) => {
      if (!acc[p.seatType] || p.isActive) {
        acc[p.seatType] = p;
      }
      return acc;
    }, {})
  );

  return (
    <div className="admin-stack">
      <h2>Bảng giá vé</h2>

      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <div className="admin-card">
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
              {uniquePrices.map((price) => (
                <tr key={price.id}>
                  <td>
                    <strong>{SEAT_TYPES[price.seatType]}</strong>
                  </td>

                  <td>
                    {editingId === price.id ? (
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                      />
                    ) : (
                      <strong>{price.price.toLocaleString()}đ</strong>
                    )}
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        handleToggleActive(price.id, price.isActive)
                      }
                    >
                      {price.isActive ? "Đang áp dụng" : "Tạm dừng"}
                    </button>
                  </td>

                  <td>
                    {editingId === price.id ? (
                      <button onClick={() => handleUpdatePrice(price.id)}>
                        Lưu
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(price.id);
                          setEditPrice(price.price.toString());
                        }}
                      >
                        Sửa
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
