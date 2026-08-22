#ifndef CAR_CONTROLLER_H
#define CAR_CONTROLLER_H

#include "../httplib.h"
#include "../templates/QuanLy.hpp"
#include "../utils/JsonSerializer.h"
#include "../utils/FileManager.h"
#include "../models/Contract.h"

inline void RegisterCarRoutes(httplib::Server& svr, QuanLy<Car>& qlCars, QuanLy<Contract>& qlContracts, const std::string& filepath) {
    svr.Get("/api/cars", [&](const httplib::Request&, httplib::Response& res) {
        res.set_content(JsonSerializer::SerializeList(qlCars.getDanhSach()), "application/json");
    });

    svr.Post("/api/cars", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            std::string bienSo = JsonSerializer::GetJsonValue(req.body, "bienSo");
            std::string tenXe = JsonSerializer::GetJsonValue(req.body, "tenXe");
            std::string loaiXe = JsonSerializer::GetJsonValue(req.body, "loaiXe");
            std::string giaThueStr = JsonSerializer::GetJsonValue(req.body, "giaThue");
            std::string trangThai = JsonSerializer::GetJsonValue(req.body, "trangThai");

            if (bienSo.empty() || tenXe.empty() || loaiXe.empty() || giaThueStr.empty()) {
                res.status = 400;
                res.set_content("{\"success\":false, \"message\":\"Thông tin xe không được để trống\"}", "application/json");
                return;
            }

            double giaThue = std::stod(giaThueStr);
            if (trangThai.empty()) trangThai = "Sẵn sàng";

            Car newCar(bienSo, tenXe, loaiXe, giaThue, trangThai);
            qlCars.Them(newCar);
            FileManager::Save(filepath, qlCars);

            res.set_content("{\"success\":true, \"message\":\"Thêm xe thành công\"}", "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content("{\"success\":false, \"message\":\"" + std::string(e.what()) + "\"}", "application/json");
        }
    });

    svr.Post("/api/cars/delete", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            std::string bienSo = JsonSerializer::GetJsonValue(req.body, "bienSo");
            
            // Check if there are active contracts for this car (where return date is empty)
            for (const auto& c : qlContracts.getDanhSach()) {
                if (c.getBienSo() == bienSo && c.getNgayTraThucTe().empty()) {
                    throw std::runtime_error("Không thể xóa xe vì đang có hợp đồng thuê hoạt động!");
                }
            }

            Car* car = qlCars.TimKiem(bienSo);
            if (car && (car->getTrangThai() == "Đang thuê" || car->getTrangThai() == "Dang thue")) {
                throw std::runtime_error("Không thể xóa xe đang trong trạng thái: Đang thuê!");
            }
            if (car) {
                car->setTrangThai("Đã xóa");
            }
            FileManager::Save(filepath, qlCars);
            res.set_content("{\"success\":true, \"message\":\"Xóa xe thành công\"}", "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content("{\"success\":false, \"message\":\"" + std::string(e.what()) + "\"}", "application/json");
        }
    });

    svr.Post("/api/cars/update-price", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            std::string bienSo = JsonSerializer::GetJsonValue(req.body, "bienSo");
            std::string giaThueStr = JsonSerializer::GetJsonValue(req.body, "giaThue");
            
            Car* car = qlCars.TimKiem(bienSo);
            if (!car) {
                res.status = 404;
                res.set_content("{\"success\":false, \"message\":\"Không tìm thấy xe\"}", "application/json");
                return;
            }

            double giaThue = std::stod(giaThueStr);
            car->CapNhatGia(giaThue);
            FileManager::Save(filepath, qlCars);

            res.set_content("{\"success\":true, \"message\":\"Cập nhật giá thuê thành công\"}", "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content("{\"success\":false, \"message\":\"" + std::string(e.what()) + "\"}", "application/json");
        }
    });

    svr.Post("/api/cars/update-status", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            std::string bienSo = JsonSerializer::GetJsonValue(req.body, "bienSo");
            std::string trangThai = JsonSerializer::GetJsonValue(req.body, "trangThai");
            
            Car* car = qlCars.TimKiem(bienSo);
            if (!car) {
                res.status = 404;
                res.set_content("{\"success\":false, \"message\":\"Không tìm thấy xe\"}", "application/json");
                return;
            }

            car->setTrangThai(trangThai);
            FileManager::Save(filepath, qlCars);

            res.set_content("{\"success\":true, \"message\":\"Cập nhật trạng thái thành công\"}", "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content("{\"success\":false, \"message\":\"" + std::string(e.what()) + "\"}", "application/json");
        }
    });
}

#endif // CAR_CONTROLLER_H
