import React, { useEffect, useState } from "react";
import { Plus, Check, AlertCircle, RefreshCw } from "lucide-react";
import { carApi } from "../api/carApi";
import { customerApi } from "../api/customerApi";
import { contractApi } from "../api/contractApi";

export default function RentalPage() {
  const [cars, setCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modals
  const [showRentModal, setShowRentModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);

  // Form states
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);

  const [rentForm, setRentForm] = useState({
    maHD: "",
    maKH: "",
    ngayThue: new Date().toISOString().split("T")[0],
    ngayTraDuKien: new Date(Date.now() + 86400000).toISOString().split("T")[0],
  });

  const [returnForm, setReturnForm] = useState({
    ngayTraThucTe: new Date().toISOString().split("T")[0],
    soNgayThucTe: "1",
  });

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [carsData, custData, contractData] = await Promise.all([
        carApi.getAll(),
        customerApi.getAll(),
        contractApi.getAll(),
      ]);
      setCars(carsData);
      setCustomers(custData);
      setContracts(contractData.filter(c => c.ngayTraThucTe === "")); // active ones
    } catch (err) {
      setError("Lỗi tải dữ liệu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenRent = (car) => {
    setSelectedCar(car);
    setRentForm({
      maHD: "HD" + Math.floor(1000 + Math.random() * 9000),
      maKH: custDataDropdownValue(),
      ngayThue: new Date().toISOString().split("T")[0],
      ngayTraDuKien: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    });
    setShowRentModal(true);
  };

  const custDataDropdownValue = () => {
    return customers.length > 0 ? customers[0].maKH : "";
  };

  const handleRentSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    try {
      const payload = {
        ...rentForm,
        bienSo: selectedCar.bienSo
      };
      const res = await contractApi.rent(payload);
      setSuccessMsg(res.message || "Tạo hợp đồng thành công!");
      setShowRentModal(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenReturn = (contract) => {
    setSelectedContract(contract);
    setReturnForm({
      ngayTraThucTe: new Date().toISOString().split("T")[0],
      soNgayThucTe: "1",
    });
    setShowReturnModal(true);
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    try {
      const payload = {
        maHD: selectedContract.maHD,
        ngayTraThucTe: returnForm.ngayTraThucTe,
        soNgayThucTe: returnForm.soNgayThucTe
      };
      const res = await contractApi.returnCar(payload);
      setSuccessMsg(`Trả xe thành công! Tổng tiền thanh toán: ${res.tongTien.toLocaleString("vi-VN")} VND`);
      setShowReturnModal(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const getCarName = (bienSo) => {
    const car = cars.find(c => c.bienSo === bienSo);
    return car ? `${car.tenXe} (${bienSo})` : bienSo;
  };

  const getCustomerName = (maKH) => {
    const cust = customers.find(c => c.maKH === maKH);
    return cust ? cust.hoTen : maKH;
  };

  const availableCars = cars.filter(c => c.trangThai === "Sẵn sàng");

  return (
    <div>
      <div className="content-header">
        <div>
          <h1>Nghiệp vụ Thuê & Trả xe</h1>
          <p style={{ color: "#94a3b8", marginTop: "0.25rem" }}>Thực hiện cho thuê các xe sẵn sàng hoặc hoàn thành hợp đồng trả xe.</p>
        </div>
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
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          
          {/* Section 1: Rentable Cars */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "white" }}>1. Danh sách xe sẵn sàng cho thuê</h2>
            <div className="card-grid" style={{ marginTop: "1rem" }}>
              {availableCars.length === 0 ? (
                <p style={{ color: "#64748b", gridColumn: "1/-1" }}>Hiện tại không có xe nào rảnh rỗi hoặc sẵn sàng để cho thuê.</p>
              ) : (
                availableCars.map((car) => (
                  <div key={car.bienSo} className="glass-panel info-card" style={{ display: "flex", flexDirection: "column", justifyContent: "between", gap: "0.75rem", background: "rgba(255,255,255,0.02)" }}>
                    <div className="info-card-header" style={{ marginBottom: 0 }}>
                      <div>
                        <h3 className="info-card-title">{car.tenXe}</h3>
                        <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{car.loaiXe} • {car.bienSo}</p>
                      </div>
                      <span className="badge badge-success">Sẵn sàng</span>
                    </div>
                    <div style={{ borderTop: "1px solid var(--glass-border)", padding: "0.5rem 0", color: "white", fontSize: "1.1rem", fontWeight: 700 }}>
                      {car.giaThue.toLocaleString("vi-VN")} VND<span style={{ fontSize: "0.8rem", fontWeight: 500, color: "#94a3b8" }}> / ngày</span>
                    </div>
                    <button 
                      className="btn btn-primary" 
                      style={{ width: "100%", justifyContent: "center" }}
                      onClick={() => handleOpenRent(car)}
                    >
                      <Plus size={16} />
                      <span>Thuê xe này</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 2: Active Contracts */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "white" }}>2. Hợp đồng đang thuê (Chờ trả xe)</h2>
            <div className="table-container" style={{ marginTop: "1rem" }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Mã Hợp đồng</th>
                    <th>Khách hàng</th>
                    <th>Thông tin xe</th>
                    <th>Ngày thuê</th>
                    <th>Hạn trả dự kiến</th>
                    <th style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>Không có hợp đồng thuê xe nào đang hoạt động.</td>
                    </tr>
                  ) : (
                    contracts.map((contract) => (
                      <tr key={contract.maHD}>
                        <td style={{ fontWeight: 600, color: "white" }}>{contract.maHD}</td>
                        <td>{getCustomerName(contract.maKH)} <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>(CCCD: {contract.maKH})</span></td>
                        <td>{getCarName(contract.bienSo)}</td>
                        <td>{contract.ngayThue}</td>
                        <td>{contract.ngayTraDuKien}</td>
                        <td style={{ textAlign: "right" }}>
                          <button 
                            className="btn btn-secondary"
                            style={{ gap: "0.3rem", padding: "0.4rem 0.8rem", borderColor: "var(--primary)", color: "white", background: "rgba(99, 102, 241, 0.1)" }}
                            onClick={() => handleOpenReturn(contract)}
                          >
                            <Check size={14} />
                            <span>Trả xe / Tính tiền</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Rent Modal */}
      {showRentModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h2>Lập Hợp Đồng Thuê Xe</h2>
              <button className="modal-close" onClick={() => setShowRentModal(false)}>×</button>
            </div>
            <form onSubmit={handleRentSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <p>Xe đã chọn: <strong>{selectedCar?.tenXe}</strong> ({selectedCar?.bienSo})</p>
                <p>Giá thuê: <strong>{selectedCar?.giaThue.toLocaleString("vi-VN")} VND/ngày</strong></p>
              </div>

              <div className="form-group">
                <label>Mã Hợp đồng</label>
                <input
                  type="text"
                  className="form-control"
                  value={rentForm.maHD}
                  onChange={(e) => setRentForm({ ...rentForm, maHD: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Khách hàng thuê xe</label>
                {customers.length === 0 ? (
                  <p style={{ color: "var(--danger)", fontSize: "0.85rem" }}>Chưa có khách hàng đăng ký! Hãy vào menu Khách hàng tạo trước.</p>
                ) : (
                  <select 
                    className="form-control"
                    value={rentForm.maKH}
                    onChange={(e) => setRentForm({ ...rentForm, maKH: e.target.value })}
                    required
                  >
                    <option value="">-- Chọn khách hàng --</option>
                    {customers.map(c => (
                      <option key={c.maKH} value={c.maKH}>{c.hoTen} (CCCD: {c.maKH})</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="form-group">
                <label>Ngày thuê xe</label>
                <input
                  type="date"
                  className="form-control"
                  value={rentForm.ngayThue}
                  onChange={(e) => setRentForm({ ...rentForm, ngayThue: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Ngày trả dự kiến</label>
                <input
                  type="date"
                  className="form-control"
                  value={rentForm.ngayTraDuKien}
                  onChange={(e) => setRentForm({ ...rentForm, ngayTraDuKien: e.target.value })}
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRentModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={customers.length === 0 || !rentForm.maKH}>Thuê xe</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {showReturnModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h2>Xử Lý Trả Xe & Tính Tiền</h2>
              <button className="modal-close" onClick={() => setShowReturnModal(false)}>×</button>
            </div>
            <form onSubmit={handleReturnSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <p>Hợp đồng: <strong>{selectedContract?.maHD}</strong></p>
                <p>Khách hàng: <strong>{getCustomerName(selectedContract?.maKH)}</strong></p>
                <p>Xe: <strong>{getCarName(selectedContract?.bienSo)}</strong></p>
              </div>

              <div className="form-group">
                <label>Ngày trả thực tế</label>
                <input
                  type="date"
                  className="form-control"
                  value={returnForm.ngayTraThucTe}
                  onChange={(e) => setReturnForm({ ...returnForm, ngayTraThucTe: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Số ngày thuê thực tế</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ví dụ: 3"
                  min="0"
                  value={returnForm.soNgayThucTe}
                  onChange={(e) => setReturnForm({ ...returnForm, soNgayThucTe: e.target.value })}
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowReturnModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Xác nhận trả & Thanh toán</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
