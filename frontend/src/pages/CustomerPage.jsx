import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit, AlertCircle, Search, History } from "lucide-react";
import { customerApi } from "../api/customerApi";
import { contractApi } from "../api/contractApi";

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({ maKH: "", hoTen: "", sdt: "", namSinh: "" });

  // Modal level error
  const [modalError, setModalError] = useState("");

  // History Modal states
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [historyContracts, setHistoryContracts] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const handleOpenHistory = async (cust) => {
    setSelectedCustomer(cust);
    setShowHistoryModal(true);
    setLoadingHistory(true);
    setHistoryError("");
    setHistoryContracts([]);
    try {
      const data = await contractApi.getHistory(cust.maKH);
      setHistoryContracts(data);
    } catch (err) {
      setHistoryError("Không thể tải lịch sử thuê xe: " + err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await customerApi.getAll();
      setCustomers(data);
    } catch (err) {
      setError("Không thể tải danh sách khách hàng: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setModalError("");
    setForm({ maKH: "", hoTen: "", sdt: "", namSinh: "" });
    setShowModal(true);
  };

  const handleOpenEdit = (cust) => {
    setIsEdit(true);
    setModalError("");
    setForm(cust);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError("");
    setSuccessMsg("");

    // Validate CCCD (Mã KH)
    const cccdRegex = /^[0-9]{12}$/;
    if (!cccdRegex.test(form.maKH)) {
      setModalError("Số CCCD không hợp lệ!");
      return;
    }

    // Validate Phone (Số điện thoại)
    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(form.sdt)) {
      setModalError("Số điện thoại không hợp lệ");
      return;
    }

    // Validate Year of birth
    const currentYear = new Date().getFullYear();
    const birthYear = parseInt(form.namSinh);
    if (isNaN(birthYear) || birthYear < 1900 || birthYear > currentYear) {
      setModalError(`Năm sinh không hợp lệ!`);
      return;
    }

    try {
      await customerApi.createOrUpdate({ ...form, isEdit });
      setSuccessMsg(isEdit ? "Cập nhật khách hàng thành công!" : "Thêm khách hàng thành công!");
      setShowModal(false);
      fetchCustomers();
    } catch (err) {
      setModalError(err.message);
    }
  };

  const handleDelete = async (maKH) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa khách hàng có mã CCCD: ${maKH}?`)) return;
    setError("");
    setSuccessMsg("");
    try {
      await customerApi.delete(maKH);
      setSuccessMsg("Xóa khách hàng thành công!");
      fetchCustomers();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredCustomers = customers.filter((cust) => {
    const maKHClean = cust.maKH.toLowerCase();
    const hoTenClean = cust.hoTen.toLowerCase();
    const sdtClean = cust.sdt.toLowerCase();
    const queryClean = searchQuery.toLowerCase().trim();

    return (
      maKHClean.includes(queryClean) ||
      hoTenClean.includes(queryClean) ||
      sdtClean.includes(queryClean)
    );
  });

  return (
    <div>
      <div className="content-header">
        <div>
          <h1>Quản lý Khách hàng</h1>
          <p style={{ color: "#94a3b8", marginTop: "0.25rem" }}>Thông tin khách hàng đăng ký thuê xe (cần thiết để làm hợp đồng).</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>Thêm Khách Hàng</span>
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

      {/* Search Panel */}
      <div className="glass-panel" style={{ padding: "1.25rem 1.5rem", marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "flex-end" }}>
        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <Search size={14} />
            <span>Tìm kiếm khách hàng</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập họ tên, số điện thoại hoặc số CCCD để tìm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery && (
          <button
            className="btn btn-secondary"
            onClick={() => setSearchQuery("")}
            style={{ height: "38px" }}
          >
            Xóa lọc
          </button>
        )}
      </div>

      {loading ? (
        <p>Đang tải danh sách khách hàng...</p>
      ) : (
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Mã KH (CCCD)</th>
                  <th>Họ và Tên</th>
                  <th>Số điện thoại</th>
                  <th>Năm sinh</th>
                  <th style={{ textAlign: "right" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>
                      Không tìm thấy khách hàng nào khớp với điều kiện tìm kiếm.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => (
                    <tr key={cust.maKH}>
                      <td style={{ fontWeight: 600, color: "white" }}>{cust.maKH}</td>
                      <td>{cust.hoTen}</td>
                      <td>{cust.sdt}</td>
                      <td>{cust.namSinh}</td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: "0.4rem 0.6rem", color: "var(--secondary)" }}
                            onClick={() => handleOpenHistory(cust)}
                            title="Lịch sử giao dịch"
                          >
                            <History size={14} />
                          </button>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: "0.4rem 0.6rem" }}
                            onClick={() => handleOpenEdit(cust)}
                            title="Sửa thông tin"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: "0.4rem 0.6rem" }}
                            onClick={() => handleDelete(cust.maKH)}
                            title="Xóa khách hàng"
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

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h2>{isEdit ? "Cập nhật Khách Hàng" : "Thêm Khách Hàng Mới"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            {modalError && (
              <div style={{ background: "rgba(239, 68, 68, 0.15)", color: "var(--danger)", padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
                <AlertCircle size={18} />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Mã Khách hàng (CCCD)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập số CCCD..."
                  value={form.maKH}
                  onChange={(e) => setForm({ ...form, maKH: e.target.value })}
                  disabled={isEdit}
                  required
                />
              </div>
              <div className="form-group">
                <label>Họ và Tên</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={form.hoTen}
                  onChange={(e) => setForm({ ...form, hoTen: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: 0987654321"
                  value={form.sdt}
                  onChange={(e) => setForm({ ...form, sdt: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Năm sinh</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ví dụ: 1995"
                  value={form.namSinh}
                  onChange={(e) => setForm({ ...form, namSinh: e.target.value })}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: "700px", width: "95%" }}>
            <div className="modal-header">
              <h2>Lịch sử thuê xe</h2>
              <button className="modal-close" onClick={() => setShowHistoryModal(false)}>×</button>
            </div>

            {selectedCustomer && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p><strong>Khách hàng:</strong> {selectedCustomer.hoTen}</p>
                <p><strong>CCCD:</strong> {selectedCustomer.maKH} | <strong>SĐT:</strong> {selectedCustomer.sdt}</p>
              </div>
            )}

            {loadingHistory ? (
              <p>Đang tải lịch sử giao dịch...</p>
            ) : historyError ? (
              <div style={{ background: "rgba(239, 68, 68, 0.15)", color: "var(--danger)", padding: "0.75rem 1rem", borderRadius: "8px", display: "flex", gap: "0.5rem" }}>
                <AlertCircle size={18} />
                <span>{historyError}</span>
              </div>
            ) : (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div className="glass-panel" style={{ padding: "1rem", textAlign: "center", background: "rgba(255, 255, 255, 0.02)" }}>
                    <div style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Tổng số lần thuê</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 750, color: "white", marginTop: "0.25rem" }}>
                      {historyContracts.length}
                    </div>
                  </div>
                  <div className="glass-panel" style={{ padding: "1rem", textAlign: "center", background: "rgba(255, 255, 255, 0.02)" }}>
                    <div style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Tổng tiền đã chi</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 750, color: "var(--secondary)", marginTop: "0.25rem" }}>
                      {historyContracts.reduce((sum, c) => sum + (c.soTienThanhToan || 0), 0).toLocaleString("vi-VN")} VND
                    </div>
                  </div>
                </div>

                <div className="table-container" style={{ maxHeight: "300px", overflowY: "auto" }}>
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Mã HĐ</th>
                        <th>Biển số</th>
                        <th>Ngày thuê</th>
                        <th>Ngày trả</th>
                        <th style={{ textAlign: "right" }}>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyContracts.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: "center", color: "#64748b", padding: "1.5rem" }}>
                            Chưa có giao dịch thuê xe nào.
                          </td>
                        </tr>
                      ) : (
                        historyContracts.map((c) => (
                          <tr key={c.maHD}>
                            <td>{c.maHD}</td>
                            <td style={{ fontWeight: 650 }}>{c.bienSo}</td>
                            <td>{c.ngayThue}</td>
                            <td>
                              {c.ngayTraThucTe ? (
                                c.ngayTraThucTe
                              ) : (
                                <span style={{ color: "var(--warning)", fontSize: "0.875rem" }}>Đang thuê</span>
                              )}
                            </td>
                            <td style={{ textAlign: "right", color: c.soTienThanhToan ? "white" : "#64748b" }}>
                              {c.soTienThanhToan ? `${c.soTienThanhToan.toLocaleString("vi-VN")} VND` : "-"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="modal-footer" style={{ marginTop: "1.5rem" }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowHistoryModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
