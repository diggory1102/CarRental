#ifndef QUANLY_HPP
#define QUANLY_HPP

#include <vector>
#include <string>
#include <iostream>
#include <type_traits>

// Forward declarations or includes
#include "../models/Car.h"
#include "../models/Customer.h"
#include "../models/Contract.h"
#include "../models/Account.h"

template <typename T>
class QuanLy {
private:
    std::vector<T> danhSach;

public:
    const std::vector<T>& getDanhSach() const { return danhSach; }
    std::vector<T>& getDanhSach() { return danhSach; }

    void Them(T item) {
        // Validate if item already exists
        if constexpr (std::is_same_v<T, Car>) {
            if (TimKiem(item.getBienSo()) != nullptr) {
                throw std::invalid_argument("Biển số xe đã tồn tại");
            }
        } else if constexpr (std::is_same_v<T, Customer>) {
            if (TimKiem(item.getMaKH()) != nullptr) {
                throw std::invalid_argument("Mã khách hàng (CCCD) đã tồn tại");
            }
        } else if constexpr (std::is_same_v<T, Contract>) {
            if (TimKiem(item.getMaHD()) != nullptr) {
                throw std::invalid_argument("Mã hợp đồng đã tồn tại");
            }
        } else if constexpr (std::is_same_v<T, Account>) {
            if (TimKiem(item.getUsername()) != nullptr) {
                throw std::invalid_argument("Tên tài khoản đã tồn tại");
            }
        }
        danhSach.push_back(item);
    }

    void Xoa(std::string id) {
        for (auto it = danhSach.begin(); it != danhSach.end(); ++it) {
            bool matches = false;
            if constexpr (std::is_same_v<T, Car>) {
                matches = (it->getBienSo() == id);
            } else if constexpr (std::is_same_v<T, Customer>) {
                matches = (it->getMaKH() == id);
            } else if constexpr (std::is_same_v<T, Contract>) {
                matches = (it->getMaHD() == id);
            } else if constexpr (std::is_same_v<T, Account>) {
                matches = (it->getUsername() == id);
            }
            if (matches) {
                danhSach.erase(it);
                return;
            }
        }
        throw std::invalid_argument("Không tìm thấy phần tử cần xóa");
    }

    T* TimKiem(std::string id) {
        for (auto& item : danhSach) {
            bool matches = false;
            if constexpr (std::is_same_v<T, Car>) {
                matches = (item.getBienSo() == id);
            } else if constexpr (std::is_same_v<T, Customer>) {
                matches = (item.getMaKH() == id);
            } else if constexpr (std::is_same_v<T, Contract>) {
                matches = (item.getMaHD() == id);
            } else if constexpr (std::is_same_v<T, Account>) {
                matches = (item.getUsername() == id);
            }
            if (matches) {
                return &item;
            }
        }
        return nullptr;
    }

    void HienThiDanhSach() {
        for (const auto& item : danhSach) {
            if constexpr (std::is_same_v<T, Car>) {
                item.XuatThongTin();
            } else if constexpr (std::is_same_v<T, Customer>) {
                item.XuatThongTin();
            } else if constexpr (std::is_same_v<T, Contract>) {
                item.XuatHopDong();
            } else if constexpr (std::is_same_v<T, Account>) {
                std::cout << "Account: " << item.getUsername() << std::endl;
            }
        }
    }
};

#endif // QUANLY_HPP
