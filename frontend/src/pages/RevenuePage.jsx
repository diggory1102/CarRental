import React, { useEffect, useState } from "react";
import { Search, AlertCircle, TrendingUp, ShieldAlert, Award } from "lucide-react";
import { contractApi } from "../api/contractApi";
import { carApi } from "../api/carApi";
import { customerApi } from "../api/customerApi";

export default function RevenuePage() {
  const [contracts, setContracts] = useState([]);
  const [cars, setCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Search state
  const [searchCccd, setSearchCccd] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [allContracts, allCars, allCustomers] = await Promise.all([
        contractApi.getAll(),
        carApi.getAll(),
        customerApi.getAll(),
      ]);
      setContracts(allContracts);
      setCars(allCars);
      setCustomers(allCustomers);
    } catch (err) {
      setError("Không thể tải lịch sử hợp đồng: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchCccd.trim()) {
      setSearchResult(null);
      return;
    }
    setError("");
    try {
      const history = await contractApi.getHistory(searchCccd.trim());
      setSearchResult(history);
    } catch (err) {
      setError("Lỗi khi tìm kiếm lịch sử: " + err.message);
    }
  };

  const handleClearSearch = () => {
    setSearchCccd("");
    setSearchResult(null);
  };

  const getCarName = (bienSo) => {
    const car = cars.find(c => c.bienSo === bienSo);
    return car ? `${car.tenXe} (${bienSo})` : bienSo;
  };

  const getCustomerName = (maKH) => {
    const cust = customers.find(c => c.maKH === maKH);
    return cust ? cust.hoTen : maKH;
  };

  // Calculations
  const completedContracts = contracts.filter(c => c.ngayTraThucTe !== "");
  const activeContracts = contracts.filter(c => c.ngayTraThucTe === "");
  const totalRevenue = completedContracts.reduce((sum, c) => sum + c.soTienThanhToan, 0);

  const displayList = searchResult !== null ? searchResult : contracts;

  return (
    <div>
      <div className="content-header">
        <div>
          <h1>Lịch sử & Doanh thu</h1>
          <p style={{ color: "#94a3b8", marginTop: "0.25rem" }}>Thống kê doanh thu, lịch sử giao dịch và tra cứu hợp đồng theo khách hàng.</p>
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(239, 68, 68, 0.15)", color: "var(--danger)", padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "1.5rem", display: "flex", gap: "0.5rem" }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p>Đang tải dữ liệu lịch sử...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* Stats Cards */}
          <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            <div className="glass-panel info-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", fontWeight: 500 }}>Tổng doanh thu thực tế</p>
                <h3 style={{ fontSize: "2rem", fontWeight: 700, marginTop: "0.5rem", color: "var(--success)" }}>
                  {totalRevenue.toLocaleString("vi-VN")} VND
                </h3>
              </div>
              <div style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--success)", padding: "0.75rem", borderRadius: "12px" }}>
                <TrendingUp size={28} />
              </div>
            </div>

            <div className="glass-panel info-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", fontWeight: 500 }}>Hợp đồng hoàn thành</p>
                <h3 style={{ fontSize: "2rem", fontWeight: 700, marginTop: "0.5rem", color: "white" }}>
                  {completedContracts.length}
                </h3>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.08)", color: "white", padding: "0.75rem", borderRadius: "12px" }}>
                <Award size={28} />
              </div>
            </div>

            <div className="glass-panel info-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", fontWeight: 500 }}>Hợp đồng đang thực hiện</p>
                <h3 style={{ fontSize: "2rem", fontWeight: 700, marginTop: "0.5rem", color: "var(--secondary)" }}>
                  {activeContracts.length}
                </h3>
              </div>
              <div style={{ background: "rgba(14, 165, 233, 0.15)", color: "var(--secondary)", padding: "0.75rem", borderRadius: "12px" }}>
                <ShieldAlert size={28} />
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label>Tra cứu lịch sử theo mã khách hàng (CCCD)</label>
                <div style={{ position: "relative" }}>
                  <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập CCCD của khách hàng cần tra cứu..."
                    value={searchCccd}
                    onChange={(e) => setSearchCccd(e.target.value)}
                    style={{ paddingLeft: "2.5rem", width: "100%" }}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Tìm kiếm</button>
              {searchResult !== null && (
                <button type="button" className="btn btn-secondary" onClick={handleClearSearch}>Xóa lọc</button>
              )}
            </form>
          </div>

          {/* Contracts Table */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "white" }}>
              {searchResult !== null ? `Kết quả tìm kiếm cho CCCD: ${searchCccd}` : "Tất cả hợp đồng"}
            </h2>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Mã Hợp đồng</th>
                    <th>Khách hàng</th>
                    <th>Xe ô tô</th>
                    <th>Ngày thuê</th>
                    <th>Ngày trả thực tế</th>
                    <th>Số tiền thanh toán</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {displayList.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>Không tìm thấy hợp đồng nào.</td>
                    </tr>
                  ) : (
                    displayList.map((contract) => (
                      <tr key={contract.maHD}>
                        <td style={{ fontWeight: 600, color: "white" }}>{contract.maHD}</td>
                        <td>{getCustomerName(contract.maKH)} <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>(CCCD: {contract.maKH})</span></td>
                        <td>{getCarName(contract.bienSo)}</td>
                        <td>{contract.ngayThue}</td>
                        <td>{contract.ngayTraThucTe || "Chưa trả xe"}</td>
                        <td style={{ fontWeight: 600, color: contract.ngayTraThucTe ? "var(--success)" : "white" }}>
                          {contract.soTienThanhToan > 0 ? `${contract.soTienThanhToan.toLocaleString("vi-VN")} VND` : "—"}
                        </td>
                        <td>
                          <span className={`badge ${contract.ngayTraThucTe ? "badge-success" : "badge-secondary"}`}>
                            {contract.ngayTraThucTe ? "Đã trả xe" : "Đang thuê"}
                          </span>
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
    </div>
  );
}
