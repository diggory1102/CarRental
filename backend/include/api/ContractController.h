#ifndef CONTRACT_CONTROLLER_H
#define CONTRACT_CONTROLLER_H

#include "../httplib.h"
#include "../templates/QuanLy.hpp"
#include "../utils/JsonSerializer.h"
#include "../utils/FileManager.h"
#include "../exceptions/CarNotAvailableException.h"
#include "../exceptions/InvalidIdException.h"

inline void RegisterContractRoutes(
    httplib::Server& svr, 
    QuanLy<Contract>& qlContracts, 
    QuanLy<Car>& qlCars, 
    QuanLy<Customer>& qlCustomers, 
    const std::string& contractPath,
    const std::string& carPath
) {
    svr.Get("/api/contracts", [&](const httplib::Request&, httplib::Response& res) {
        res.set_content(JsonSerializer::SerializeList(qlContracts.getDanhSach()), "application/json");
    });

    // Rent car
    svr.Post("/api/rent", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            std::string maHD = JsonSerializer::GetJsonValue(req.body, "maHD");
            std::string maKH = JsonSerializer::GetJsonValue(req.body, "maKH");
            std::string bienSo = JsonSerializer::GetJsonValue(req.body, "bienSo");
            std::string ngayThue = JsonSerializer::GetJsonValue(req.body, "ngayThue");
            std::string ngayTraDuKien = JsonSerializer::GetJsonValue(req.body, "ngayTraDuKien");

            if (maHD.empty() || maKH.empty() || bienSo.empty() || ngayThue.empty() || ngayTraDuKien.empty()) {
                throw InvalidIdException("Mọi trường thông tin hợp đồng không được để trống");
            }

            // Check if car exists and is available
            Car* car = qlCars.TimKiem(bienSo);
            if (!car) {
                res.status = 404;
                res.set_content("{\"success\":false, \"message\":\"Không tìm thấy xe\"}", "application/json");
                return;
            }

            if (!car->KiemTraSanSang()) {
                throw CarNotAvailableException("Xe hiện đang trong trạng thái: " + car->getTrangThai() + " và không thể cho thuê.");
            }

            // Verify if customer exists
            Customer* customer = qlCustomers.TimKiem(maKH);
            if (!customer) {
                res.status = 400;
                res.set_content("{\"success\":false, \"message\":\"Mã khách hàng chưa tồn tại trong hệ thống. Vui lòng thêm khách hàng trước!\"}", "application/json");
                return;
            }

            // Create contract
            Contract contract(maHD, maKH, bienSo, ngayThue, ngayTraDuKien);
            qlContracts.Them(contract);

            // Update car status
            car->setTrangThai("Đang thuê");

            // Save to files
            FileManager::Save(contractPath, qlContracts);
            FileManager::Save(carPath, qlCars);

            res.set_content("{\"success\":true, \"message\":\"Tạo hợp đồng thuê xe thành công\"}", "application/json");
        } catch (const CarNotAvailableException& e) {
            res.status = 400;
            res.set_content("{\"success\":false, \"message\":\"" + std::string(e.what()) + "\"}", "application/json");
        } catch (const InvalidIdException& e) {
            res.status = 400;
            res.set_content("{\"success\":false, \"message\":\"" + std::string(e.what()) + "\"}", "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content("{\"success\":false, \"message\":\"" + std::string(e.what()) + "\"}", "application/json");
        }
    });

    // Return car
    svr.Post("/api/return", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            std::string maHD = JsonSerializer::GetJsonValue(req.body, "maHD");
            std::string ngayTraThucTe = JsonSerializer::GetJsonValue(req.body, "ngayTraThucTe");
            std::string soNgayStr = JsonSerializer::GetJsonValue(req.body, "soNgayThucTe");

            if (maHD.empty() || ngayTraThucTe.empty() || soNgayStr.empty()) {
                throw InvalidIdException("Thông tin trả xe không được trống");
            }

            Contract* contract = qlContracts.TimKiem(maHD);
            if (!contract) {
                res.status = 404;
                res.set_content("{\"success\":false, \"message\":\"Không tìm thấy hợp đồng\"}", "application/json");
                return;
            }

            if (!contract->getNgayTraThucTe().empty()) {
                res.status = 400;
                res.set_content("{\"success\":false, \"message\":\"Hợp đồng này đã được hoàn thành trước đó\"}", "application/json");
                return;
            }

            int soNgayThucTe = std::stoi(soNgayStr);
            if (soNgayThucTe < 0) {
                throw std::invalid_argument("Số ngày thuê thực tế không được âm");
            }

            Car* car = qlCars.TimKiem(contract->getBienSo());
            if (!car) {
                res.status = 404;
                res.set_content("{\"success\":false, \"message\":\"Không tìm thấy xe liên quan đến hợp đồng\"}", "application/json");
                return;
            }

            // Calculate billing
            double tongTien = contract->TinhTienThanhToan(soNgayThucTe, car->getGiaThue());
            contract->setNgayTraThucTe(ngayTraThucTe);

            // Update car status back to Sẵn sàng
            car->setTrangThai("Sẵn sàng");

            // Save to files
            FileManager::Save(contractPath, qlContracts);
            FileManager::Save(carPath, qlCars);

            std::stringstream ss;
            ss << "{\"success\":true, \"message\":\"Trả xe thành công\",\"tongTien\":" << tongTien << "}";
            res.set_content(ss.str(), "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content("{\"success\":false, \"message\":\"" + std::string(e.what()) + "\"}", "application/json");
        }
    });

    // Get rental history for a customer
    svr.Get("/api/history", [&](const httplib::Request& req, httplib::Response& res) {
        if (!req.has_param("maKH")) {
            res.status = 400;
            res.set_content("{\"success\":false, \"message\":\"Thiếu mã khách hàng\"}", "application/json");
            return;
        }

        std::string maKH = req.get_param_value("maKH");
        std::vector<Contract> history;

        for (const auto& contract : qlContracts.getDanhSach()) {
            if (contract.getMaKH() == maKH) {
                history.push_back(contract);
            }
        }

        res.set_content(JsonSerializer::SerializeList(history), "application/json");
    });
}

#endif // CONTRACT_CONTROLLER_H
