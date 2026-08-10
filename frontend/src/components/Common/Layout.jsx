import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  FileSignature, 
  History, 
  LogOut,
  Key
} from "lucide-react";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username") || "Quản trị viên";

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  const menuItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/cars", label: "Quản lý Xe", icon: Car },
    { path: "/customers", label: "Khách hàng", icon: Users },
    { path: "/rentals", label: "Thuê & Trả xe", icon: FileSignature },
    { path: "/history", label: "Lịch sử thuê xe", icon: History },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Key size={28} />
          <span>CarRental</span>
        </div>

        <nav style={{ flex: 1, marginTop: '2rem' }}>
          <ul className="sidebar-menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
          <div style={{ marginBottom: '1rem', padding: '0 1rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Đăng nhập với:</p>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white' }}>{username}</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
