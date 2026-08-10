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

            if (maKH.empty() || hoTen.empty() || sdt.empty() || namSinhStr.empty()) {
                res.status = 400;
                res.set_content("{\"success\":false, \"message\":\"Thông tin khách hàng không được để trống\"}", "application/json");
                return;
            }

            int namSinh = std::stoi(namSinhStr);

            Customer* existing = qlCustomers.TimKiem(maKH);
            if (existing) {
                // Update
                existing->CapNhatThongTin(hoTen, sdt, namSinh);
                FileManager::Save(filepath, qlCustomers);
                res.set_content("{\"success\":true, \"message\":\"Cập nhật thông tin khách hàng thành công\"}", "application/json");
            } else {
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
