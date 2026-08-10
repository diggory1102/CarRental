import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit, AlertCircle, RefreshCw } from "lucide-react";
import { carApi } from "../api/carApi";

export default function CarManagementPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditPriceModal, setShowEditPriceModal] = useState(false);

  // Form states
  const [newCar, setNewCar] = useState({ bienSo: "", tenXe: "", loaiXe: "", giaThue: "", trangThai: "Sẵn sàng" });
  const [selectedCar, setSelectedCar] = useState(null);
  const [newPrice, setNewPrice] = useState("");

  const fetchCars = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await carApi.getAll();
      setCars(data);
    } catch (err) {
      setError("Không thể tải danh sách xe: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleAddCar = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    try {
      await carApi.create(newCar);
      setSuccessMsg("Thêm xe thành công!");
      setNewCar({ bienSo: "", tenXe: "", loaiXe: "", giaThue: "", trangThai: "Sẵn sàng" });
      setShowAddModal(false);
      fetchCars();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCar = async (bienSo) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa xe biển số ${bienSo}?`)) return;
    setError("");
    setSuccessMsg("");
    try {
      await carApi.delete(bienSo);
      setSuccessMsg("Xóa xe thành công!");
      fetchCars();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenEditPrice = (car) => {
    setSelectedCar(car);
    setNewPrice(car.giaThue);
    setShowEditPriceModal(true);
  };

  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    try {
      await carApi.updatePrice(selectedCar.bienSo, newPrice);
      setSuccessMsg("Cập nhật giá thuê thành công!");
      setShowEditPriceModal(false);
      fetchCars();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateStatus = async (bienSo, currentStatus) => {
    const nextStatus = currentStatus === "Sẵn sàng" ? "Bảo trì" : currentStatus === "Bảo trì" ? "Sẵn sàng" : null;
    if (!nextStatus) {
      alert("Không thể đổi trạng thái xe đang thuê theo cách này!");
      return;
    }
    setError("");
    setSuccessMsg("");
    try {
      await carApi.updateStatus(bienSo, nextStatus);
      setSuccessMsg("Cập nhật trạng thái xe thành công!");
      fetchCars();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="content-header">
        <div>
          <h1>Quản lý Ô tô</h1>
          <p style={{ color: "#94a3b8", marginTop: "0.25rem" }}>Danh sách các xe ô tô tự lái trong hệ thống.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          <span>Thêm Xe Mới</span>
        </button>
      </div>

      {successMsg && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--success)", padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
          {successMsg}
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(239, 68, 68, 0.15)", color: "var(--danger)", padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "1.5rem", display: "flex", gap: "0.5rem" }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p>Đang tải danh sách xe...</p>
      ) : (
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Biển số</th>
                  <th>Tên xe</th>
                  <th>Loại xe</th>
                  <th>Giá thuê / ngày</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: "right" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cars.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>Chưa có xe nào trong danh sách.</td>
                  </tr>
                ) : (
                  cars.map((car) => (
                    <tr key={car.bienSo}>
                      <td style={{ fontWeight: 600, color: "white" }}>{car.bienSo}</td>
                      <td>{car.tenXe}</td>
                      <td>{car.loaiXe}</td>
                      <td>{car.giaThue.toLocaleString("vi-VN")} VND</td>
                      <td>
                        <span className={`badge ${
                          car.trangThai === "Sẵn sàng" ? "badge-success" : 
                          car.trangThai === "Đang thuê" ? "badge-secondary" : "badge-warning"
                        }`}>
                          {car.trangThai}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: "0.4rem 0.6rem" }}
                            onClick={() => handleUpdateStatus(car.bienSo, car.trangThai)}
                            disabled={car.trangThai === "Đang thuê"}
                            title="Chuyển đổi Sẵn sàng / Bảo trì"
                          >
                            <RefreshCw size={14} />
                          </button>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: "0.4rem 0.6rem" }}
                            onClick={() => handleOpenEditPrice(car)}
                            title="Sửa giá thuê"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className="btn btn-danger" 
                            style={{ padding: "0.4rem 0.6rem" }}
                            onClick={() => handleDeleteCar(car.bienSo)}
                            disabled={car.trangThai === "Đang thuê"}
                            title="Xóa xe"
                          >
                            <Trash2 size={14} />
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h2>Thêm Xe Ô Tô Mới</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddCar}>
              <div className="form-group">
                <label>Biển số xe</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: 29A-12345"
                  value={newCar.bienSo}
                  onChange={(e) => setNewCar({ ...newCar, bienSo: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tên xe</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: Toyota Vios"
                  value={newCar.tenXe}
                  onChange={(e) => setNewCar({ ...newCar, tenXe: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Loại xe</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: Sedan, SUV..."
                  value={newCar.loaiXe}
                  onChange={(e) => setNewCar({ ...newCar, loaiXe: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Giá thuê (VND/ngày)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ví dụ: 500000"
                  value={newCar.giaThue}
                  onChange={(e) => setNewCar({ ...newCar, giaThue: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Trạng thái ban đầu</label>
                <select 
                  className="form-control"
                  value={newCar.trangThai}
                  onChange={(e) => setNewCar({ ...newCar, trangThai: e.target.value })}
                >
                  <option value="Sẵn sàng">Sẵn sàng</option>
                  <option value="Bảo trì">Bảo trì</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Price Modal */}
      {showEditPriceModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h2>Cập nhật Giá Thuê</h2>
              <button className="modal-close" onClick={() => setShowEditPriceModal(false)}>×</button>
            </div>
            <form onSubmit={handleUpdatePrice}>
              <div style={{ marginBottom: "1rem" }}>
                <p>Xe: <strong>{selectedCar?.tenXe}</strong> ({selectedCar?.bienSo})</p>
              </div>
              <div className="form-group">
                <label>Giá thuê mới (VND/ngày)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Nhập giá mới..."
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditPriceModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Cập nhật</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
