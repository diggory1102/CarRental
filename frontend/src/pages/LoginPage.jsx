import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Key, Lock, User, AlertCircle } from "lucide-react";
import { axiosClient } from "../api/axiosClient";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0); // Limits to 3 times
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (attempts >= 3) {
      setError("Bạn đã đăng nhập sai quá 3 lần! Chức năng đăng nhập đã bị khóa.");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosClient.post("/login", { username, password });
      if (res.success) {
        localStorage.setItem("username", username);
        setAttempts(0); // Reset attempts on success
        navigate("/");
      } else {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        if (nextAttempts >= 3) {
          setError("Bạn đã đăng nhập sai quá 3 lần! Chức năng đăng nhập đã bị khóa.");
        } else {
          setError(`Tài khoản hoặc mật khẩu không chính xác (${nextAttempts}/3 lần)`);
        }
      }
    } catch (err) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      if (nextAttempts >= 3) {
        setError("Bạn đã đăng nhập sai quá 3 lần! Chức năng đăng nhập đã bị khóa.");
      } else {
        setError(`Tài khoản hoặc mật khẩu không chính xác (${nextAttempts}/3 lần)`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "1rem"
    }}>
      <div className="glass-panel" style={{
        width: "100%",
        maxWidth: "420px",
        padding: "2.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            background: "rgba(99, 102, 241, 0.2)",
            padding: "1rem",
            borderRadius: "50%",
            color: "var(--primary)",
            display: "inline-flex"
          }}>
            <Key size={36} />
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "0.5rem" }}>Car Rental Manager</h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Hệ thống quản lý cho thuê xe ô tô C++ OOP</p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            color: "var(--danger)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.9rem"
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="form-group">
            <label htmlFor="username">Tên tài khoản</label>
            <div style={{ position: "relative" }}>
              <User size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                id="username"
                type="text"
                className="form-control"
                placeholder="Nhập tên tài khoản (admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: "2.5rem", width: "100%" }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Nhập mật khẩu (admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: "2.5rem", width: "100%" }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "0.8rem", fontSize: "1rem" }}
            disabled={loading || attempts >= 3}
          >
            {loading ? "Đang kết nối..." : attempts >= 3 ? "Đã bị khóa đăng nhập" : "Đăng nhập"}
          </button>
        </form>

        <div style={{ textAlign: "center", fontSize: "0.8rem", color: "#64748b", marginTop: "1rem" }}>
          <p>Tài khoản dùng thử mặc định:</p>
          <code style={{ background: "rgba(255, 255, 255, 0.05)", padding: "0.2rem 0.4rem", borderRadius: "4px" }}>admin / admin123</code>
        </div>
      </div>
    </div>
  );
}
