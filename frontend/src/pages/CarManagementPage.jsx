import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit, AlertCircle, RefreshCw, Search } from "lucide-react";
import { carApi } from "../api/carApi";

export default function CarManagementPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditPriceModal, setShowEditPriceModal] = useState(false);

  // Modal level error
  const [modalError, setModalError] = useState("");

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

  const handleOpenAddModal = () => {
    setModalError("");
    setNewCar({ bienSo: "", tenXe: "", loaiXe: "", giaThue: "", trangThai: "Sẵn sàng" });
    setShowAddModal(true);
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    setModalError("");
    setSuccessMsg("");

    // Validate price
    const price = parseFloat(newCar.giaThue);
    if (isNaN(price) || price < 0) {
      setModalError("Giá thuê phải là một số lớn hơn hoặc bằng 0!");
      return;
    }

    if (!newCar.bienSo.trim()) {
      setModalError("Biển số xe không được để trống!");
      return;
    }

    try {
      await carApi.create(newCar);
      setSuccessMsg("Thêm xe thành công!");
      setShowAddModal(false);
      fetchCars();
    } catch (err) {
      setModalError(err.message);
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
    setModalError("");
    setShowEditPriceModal(true);
  };

  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    setModalError("");
    setSuccessMsg("");

    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) {
      setModalError("Giá thuê mới phải là một số lớn hơn hoặc bằng 0!");
      return;
    }

    try {
      await carApi.updatePrice(selectedCar.bienSo, newPrice);
      setSuccessMsg("Cập nhật giá thuê thành công!");
      setShowEditPriceModal(false);
      fetchCars();
    } catch (err) {
      setModalError(err.message);
    }
  };

  const handleUpdateStatus = async (bienSo, currentStatus) => {
    const statusClean = currentStatus.replace(/[\r\n]/g, "");
    const nextStatus = statusClean === "Sẵn sàng" ? "Bảo trì" : statusClean === "Bảo trì" ? "Sẵn sàng" : null;
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

  const filteredCars = cars.filter((car) => {
    const bienSoClean = car.bienSo.toLowerCase();
    const tenXeClean = car.tenXe.toLowerCase();
    const loaiXeClean = car.loaiXe.toLowerCase();
    const queryClean = searchQuery.toLowerCase().trim();

    const matchesSearch = 
      bienSoClean.includes(queryClean) || 
      tenXeClean.includes(queryClean) || 
      loaiXeClean.includes(queryClean);

    const carStatusClean = car.trangThai.replace(/[\r\n]/g, "");
    const matchesStatus = statusFilter === "All" || carStatusClean === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="content-header">
        <div>
          <h1>Quản lý Ô tô</h1>
          <p style={{ color: "#94a3b8", marginTop: "0.25rem" }}>Danh sách các xe ô tô tự lái trong hệ thống.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
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

      {/* Search and Filter Panel */}
      <div className="glass-panel" style={{ padding: "1.25rem 1.5rem", marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div className="form-group" style={{ flex: 2, marginBottom: 0, minWidth: "250px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <Search size={14} />
            <span>Tìm kiếm xe</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập biển số, tên xe hoặc phân khúc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="form-group" style={{ flex: 1, marginBottom: 0, minWidth: "180px" }}>
          <label>Trạng thái</label>
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Sẵn sàng">Sẵn sàng</option>
            <option value="Đang thuê">Đang thuê</option>
            <option value="Bảo trì">Bảo trì</option>
          </select>
        </div>
        {(searchQuery || statusFilter !== "All") && (
          <button 
            className="btn btn-secondary" 
            onClick={() => { setSearchQuery(""); setStatusFilter("All"); }}
            style={{ height: "38px" }}
          >
            Xóa lọc
          </button>
        )}
      </div>

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
                {filteredCars.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>
                      Không tìm thấy xe nào khớp với điều kiện tìm kiếm.
                    </td>
                  </tr>
                ) : (
                  filteredCars.map((car) => {
                    const carStatusClean = car.trangThai.replace(/[\r\n]/g, "");
                    return (
                      <tr key={car.bienSo}>
                        <td style={{ fontWeight: 600, color: "white" }}>{car.bienSo}</td>
                        <td>{car.tenXe}</td>
                        <td>{car.loaiXe}</td>
                        <td>{car.giaThue.toLocaleString("vi-VN")} VND</td>
                        <td>
                          <span className={`badge ${
                            carStatusClean === "Sẵn sàng" ? "badge-success" : 
                            carStatusClean === "Đang thuê" ? "badge-secondary" : "badge-warning"
                          }`}>
                            {carStatusClean}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: "0.4rem 0.6rem" }}
                              onClick={() => handleUpdateStatus(car.bienSo, car.trangThai)}
                              disabled={carStatusClean === "Đang thuê"}
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
                              disabled={carStatusClean === "Đang thuê"}
                              title="Xóa xe"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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

            {modalError && (
              <div style={{ background: "rgba(239, 68, 68, 0.15)", color: "var(--danger)", padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
                <AlertCircle size={18} />
                <span>{modalError}</span>
              </div>
            )}

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

            {modalError && (
              <div style={{ background: "rgba(239, 68, 68, 0.15)", color: "var(--danger)", padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
                <AlertCircle size={18} />
                <span>{modalError}</span>
              </div>
            )}

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
