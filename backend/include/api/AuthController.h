#ifndef AUTH_CONTROLLER_H
#define AUTH_CONTROLLER_H

#include "../httplib.h"
#include "../templates/QuanLy.hpp"
#include "../utils/JsonSerializer.h"
#include "../utils/FileManager.h"

inline void RegisterAuthRoutes(httplib::Server& svr, QuanLy<Account>& qlAccounts, const std::string& filepath) {
    svr.Post("/api/login", [&](const httplib::Request& req, httplib::Response& res) {
        std::string username = JsonSerializer::GetJsonValue(req.body, "username");
        std::string password = JsonSerializer::GetJsonValue(req.body, "password");

        Account* acc = qlAccounts.TimKiem(username);
        if (acc && acc->DangNhap(username, password)) {
            res.set_content("{\"success\":true, \"message\":\"Đăng nhập thành công\"}", "application/json");
        } else {
            res.status = 401;
            res.set_content("{\"success\":false, \"message\":\"Tài khoản hoặc mật khẩu không chính xác\"}", "application/json");
        }
    });

    svr.Post("/api/change-password", [&](const httplib::Request& req, httplib::Response& res) {
        std::string username = JsonSerializer::GetJsonValue(req.body, "username");
        std::string oldPass = JsonSerializer::GetJsonValue(req.body, "oldPassword");
        std::string newPass = JsonSerializer::GetJsonValue(req.body, "newPassword");

        Account* acc = qlAccounts.TimKiem(username);
        if (acc && acc->DangNhap(username, oldPass)) {
            acc->DoiMatKhau(newPass);
            FileManager::Save(filepath, qlAccounts);
            res.set_content("{\"success\":true, \"message\":\"Đổi mật khẩu thành công\"}", "application/json");
        } else {
            res.status = 400;
            res.set_content("{\"success\":false, \"message\":\"Mật khẩu cũ không chính xác\"}", "application/json");
        }
    });
}

#endif // AUTH_CONTROLLER_H
