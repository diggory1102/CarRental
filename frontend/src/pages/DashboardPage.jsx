import React, { useEffect, useState } from "react";
import { Car, Users, FileText, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import { carApi } from "../api/carApi";
import { customerApi } from "../api/customerApi";
import { contractApi } from "../api/contractApi";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    rentedCars: 0,
    maintainingCars: 0,
    totalCustomers: 0,
    activeContracts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cars, customers, contracts] = await Promise.all([
          carApi.getAll(),
          customerApi.getAll(),
          contractApi.getAll(),
        ]);

        const totalCars = cars.length;
        const availableCars = cars.filter(c => c.trangThai === "Sẵn sàng").length;
        const rentedCars = cars.filter(c => c.trangThai === "Đang thuê").length;
        const maintainingCars = cars.filter(c => c.trangThai === "Bảo trì").length;
        const totalCustomers = customers.length;
        const activeContracts = contracts.filter(c => c.ngayTraThucTe === "").length;

        setStats({
          totalCars,
          availableCars,
          rentedCars,
          maintainingCars,
          totalCustomers,
          activeContracts
        });
      } catch (err) {
        setError("Không thể tải thông tin thống kê từ Backend C++");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cardItems = [
    { title: "Tổng số xe", value: stats.totalCars, icon: Car, color: "var(--primary)" },
    { title: "Xe sẵn sàng", value: stats.availableCars, icon: CheckCircle2, color: "var(--success)" },
    { title: "Xe đang thuê", value: stats.rentedCars, icon: FileText, color: "var(--secondary)" },
    { title: "Xe bảo trì", value: stats.maintainingCars, icon: AlertTriangle, color: "var(--warning)" },
    { title: "Khách hàng", value: stats.totalCustomers, icon: Users, color: "#a855f7" },
    { title: "Hợp đồng đang chạy", value: stats.activeContracts, icon: FileText, color: "#f43f5e" },
  ];

  return (
    <div>
      <div className="content-header">
        <div>
          <h1>Dashboard Thống kê</h1>
          <p style={{ color: "#94a3b8", marginTop: "0.25rem" }}>Chào mừng đến với hệ thống quản lý thuê xe ô tô.</p>
        </div>
      </div>

      {error && (
        <div style={{
          background: "rgba(239, 68, 68, 0.15)",
          color: "var(--danger)",
          padding: "1rem",
          borderRadius: "10px",
          marginBottom: "1.5rem"
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Đang tải dữ liệu từ máy chủ C++...</p>
      ) : (
        <>
          <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {cardItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="glass-panel info-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ color: "#94a3b8", fontSize: "0.9rem", fontWeight: 500 }}>{item.title}</p>
                    <h3 style={{ fontSize: "2rem", fontWeight: 700, marginTop: "0.5rem", color: "white" }}>{item.value}</h3>
                  </div>
                  <div style={{
                    background: `rgba(${item.color === 'var(--primary)' ? '99,102,241' : item.color === 'var(--success)' ? '16,185,129' : '14,165,233'}, 0.15)`,
                    color: item.color,
                    padding: "0.75rem",
                    borderRadius: "12px"
                  }}>
                    <Icon size={28} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="glass-panel" style={{ marginTop: "2.5rem", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>Hướng dẫn quy trình vận hành</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <span style={{ 
                  background: "var(--primary)", 
                  width: "24px", 
                  height: "24px", 
                  borderRadius: "50%", 
                  display: "inline-flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "0.85rem",
                  fontWeight: 700
                }}>1</span>
                <div>
                  <h4 style={{ fontWeight: 600, color: "white" }}>Thêm Xe và Khách Hàng</h4>
                  <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Truy cập mục "Quản lý Xe" và "Khách hàng" để bổ sung các thực thể vào hệ thống.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <span style={{ 
                  background: "var(--primary)", 
                  width: "24px", 
                  height: "24px", 
                  borderRadius: "50%", 
                  display: "inline-flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "0.85rem",
                  fontWeight: 700
                }}>2</span>
                <div>
                  <h4 style={{ fontWeight: 600, color: "white" }}>Lập Hợp Đồng Thuê Xe</h4>
                  <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Vào mục "Thuê & Trả xe", chọn một chiếc xe đang ở trạng thái <strong>Sẵn sàng</strong>, điền mã Khách hàng (CCCD) đã đăng ký cùng ngày hẹn trả để lập hợp đồng.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <span style={{ 
                  background: "var(--primary)", 
                  width: "24px", 
                  height: "24px", 
                  borderRadius: "50%", 
                  display: "inline-flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "0.85rem",
                  fontWeight: 700
                }}>3</span>
                <div>
                  <h4 style={{ fontWeight: 600, color: "white" }}>Trả Xe & Tính Tiền</h4>
                  <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Khi khách trả xe, nhấn "Trả xe" trên hợp đồng đang hoạt động, nhập ngày trả thực tế và số ngày thuê thực tế để hệ thống tự động nhân với đơn giá ngày ra tổng số tiền thanh toán.</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
