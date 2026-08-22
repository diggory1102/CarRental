#ifndef CUSTOMER_CONTROLLER_H
#define CUSTOMER_CONTROLLER_H

#include "../httplib.h"
#include "../templates/QuanLy.hpp"
#include "../utils/JsonSerializer.h"
#include "../utils/FileManager.h"

inline void RegisterCustomerRoutes(httplib::Server& svr, QuanLy<Customer>& qlCustomers, const std::string& filepath) {
    svr.Get("/api/customers", [&](const httplib::Request&, httplib::Response& res) {
        res.set_content(JsonSerializer::SerializeList(qlCustomers.getDanhSach()), "application/json");
    });

    svr.Post("/api/customers", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            std::string maKH = JsonSerializer::GetJsonValue(req.body, "maKH");
            std::string hoTen = JsonSerializer::GetJsonValue(req.body, "hoTen");
            std::string sdt = JsonSerializer::GetJsonValue(req.body, "sdt");
            std::string namSinhStr = JsonSerializer::GetJsonValue(req.body, "namSinh");
            std::string isEditStr = JsonSerializer::GetJsonValue(req.body, "isEdit");
            bool isEdit = (isEditStr == "true");

            if (maKH.empty() || hoTen.empty() || sdt.empty() || namSinhStr.empty()) {
                res.status = 400;
                res.set_content("{\"success\":false, \"message\":\"Thông tin khách hàng không được để trống\"}", "application/json");
                return;
            }

            int namSinh = std::stoi(namSinhStr);

            // Kiểm tra trùng Số điện thoại
            for (const auto& cust : qlCustomers.getDanhSach()) {
                if (cust.getSdt() == sdt && cust.getMaKH() != maKH) {
                    res.status = 400;
                    res.set_content("{\"success\":false, \"message\":\"Số điện thoại này đã được đăng ký bởi khách hàng khác!\"}", "application/json");
                    return;
                }
            }

            Customer* existing = qlCustomers.TimKiem(maKH);
            if (existing) {
                if (!isEdit) {
                    res.status = 400;
                    res.set_content("{\"success\":false, \"message\":\"Mã khách hàng (CCCD) đã tồn tại trong hệ thống!\"}", "application/json");
                    return;
                }
                // Update
                existing->CapNhatThongTin(hoTen, sdt, namSinh);
                FileManager::Save(filepath, qlCustomers);
                res.set_content("{\"success\":true, \"message\":\"Cập nhật thông tin khách hàng thành công\"}", "application/json");
            } else {
                if (isEdit) {
                    res.status = 400;
                    res.set_content("{\"success\":false, \"message\":\"Không tìm thấy khách hàng cần cập nhật\"}", "application/json");
                    return;
                }
                // Create
                Customer newCust(maKH, hoTen, sdt, namSinh);
                qlCustomers.Them(newCust);
                FileManager::Save(filepath, qlCustomers);
                res.set_content("{\"success\":true, \"message\":\"Thêm khách hàng thành công\"}", "application/json");
            }
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content("{\"success\":false, \"message\":\"" + std::string(e.what()) + "\"}", "application/json");
        }
    });

    svr.Post("/api/customers/delete", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            std::string maKH = JsonSerializer::GetJsonValue(req.body, "maKH");
            qlCustomers.Xoa(maKH);
            FileManager::Save(filepath, qlCustomers);
            res.set_content("{\"success\":true, \"message\":\"Xóa khách hàng thành công\"}", "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content("{\"success\":false, \"message\":\"" + std::string(e.what()) + "\"}", "application/json");
        }
    });
}

#endif // CUSTOMER_CONTROLLER_H
