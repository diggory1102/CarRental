# Hệ Thống Quản Lý Thuê Xe (Car Rental Management System)

Dự án này là một hệ thống quản lý thuê xe toàn diện bao gồm:
*   **Backend**: Được xây dựng bằng C++ sử dụng Winsock để xây dựng một HTTP Web Server tự thiết kế từ đầu (hoạt động tại port `18080`).
*   **Frontend**: Được xây dựng bằng React 19, Vite, Tailwind CSS / Custom CSS, Lucide React, và React Router Dom (hoạt động tại port `5173`).

---

## 🚀 Các Tính Năng Chính

Hệ thống được thiết kế dành cho Người Quản Trị (Admin) quản lý dịch vụ cho thuê xe với các chức năng chính:
1.  **Đăng nhập hệ thống**: Xác thực tài khoản Admin.
2.  **Bảng điều khiển (Dashboard)**: Thống kê nhanh số lượng xe đang cho thuê, xe sẵn sàng, số hợp đồng hoạt động và tổng doanh thu.
3.  **Quản lý xe (Car Management)**: 
    *   Thêm mới, cập nhật thông tin xe (Tên xe, biển số, loại xe, giá thuê/ngày, trạng thái).
    *   Theo dõi trạng thái xe (Sẵn sàng, Đang thuê, Đang bảo dưỡng).
4.  **Quản lý khách hàng (Customer Management)**: 
    *   Lưu trữ thông tin khách hàng (Họ tên, số điện thoại, số CCCD/CMND, mã số bằng lái xe).
5.  **Quản lý hợp đồng thuê xe (Rental Contracts)**:
    *   Tạo hợp đồng thuê xe (chọn khách hàng, chọn xe, ngày thuê, ngày trả dự kiến).
    *   Tính toán chi phí thuê xe tạm tính và thực tế.
    *   Xử lý trả xe và cập nhật trạng thái xe tự động.
6.  **Thống kê doanh thu (Revenue Management)**:
    *   Xem lịch sử giao dịch và tổng doanh thu.
    *   Biểu đồ/Bảng thống kê chi tiết theo từng hợp đồng.

---

## 🛠 Cấu Trúc Dự Án

```text
CarRental/
├── backend/                  # C++ HTTP Web Server
│   ├── include/              # Header files (.h)
│   ├── src/                  # Source files (.cpp)
│   ├── CMakeLists.txt        # File cấu hình CMake
│   └── run.bat               # Script biên dịch và chạy Backend nhanh
├── frontend/                 # React UI Client
│   ├── src/                  # Mã nguồn React (Pages, Components, API)
│   ├── package.json          # Quản lý dependencies node
│   └── vite.config.js        # Cấu hình Vite
├── start.bat                 # Script chạy đồng thời cả Backend và Frontend
└── README.md                 # Tài liệu hướng dẫn sử dụng
```

---

## 💻 Yêu Cầu Hệ Thống

Để chạy được dự án này trên môi trường local, máy tính của bạn cần cài đặt:
1.  **C++ Compiler**: `g++` hỗ trợ chuẩn C++17 (đã được thêm vào biến môi trường `PATH`).
2.  **Node.js**: Phiên bản 18+ để chạy Frontend.

---

## ⚡ Hướng Dẫn Cài Đặt & Khởi Chạy

### Cách 1: Khởi chạy nhanh bằng File Script (Khuyên Dùng)

Ở thư mục gốc của dự án, bạn chỉ cần chạy file:
```bash
./start.bat
```
Script này sẽ tự động khởi chạy 2 cửa sổ dòng lệnh độc lập:
1.  **Backend C++** tại địa chỉ: `http://localhost:18080`
2.  **Frontend React** tại địa chỉ: `http://localhost:5173`

---

### Cách 2: Khởi chạy thủ công từng phần

#### 1. Khởi chạy Backend C++
Di chuyển vào thư mục `backend/` và thực thi file biên dịch:
```bash
cd backend
run.bat
```
Hoặc nếu muốn biên dịch thủ công qua `g++`:
```bash
g++ -std=c++17 -Iinclude src/main.cpp -o server.exe -lws2_32
server.exe
```

#### 2. Khởi chạy Frontend React
Di chuyển vào thư mục `frontend/`, cài đặt các thư viện và chạy:
```bash
cd frontend
npm install
npm run dev
```

---

## 🔒 Tài Khoản Đăng Nhập Mặc Định

Bạn có thể sử dụng thông tin tài khoản sau để đăng nhập vào trang quản trị:
*   **Username**: `admin`
*   **Password**: `admin123`
