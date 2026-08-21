#ifndef CAR_H
#define CAR_H

#include <string>
#include <iostream>
#include <sstream>
#include <stdexcept>

class Car {
private:
    std::string bienSo;
    std::string tenXe;
    std::string loaiXe;
    double giaThue;
    std::string trangThai; // "Sẵn sàng", "Đang thuê", "Bảo trì"

public:
    Car() : bienSo(""), tenXe(""), loaiXe(""), giaThue(0.0), trangThai("Sẵn sàng") {}
    Car(std::string bs, std::string tx, std::string lx, double gt, std::string tt = "Sẵn sàng") 
        : bienSo(bs), tenXe(tx), loaiXe(lx), giaThue(gt), trangThai(tt) {
        if (giaThue < 0) {
            throw std::invalid_argument("Giá thuê không được âm");
        }
    }

    std::string getBienSo() const { return bienSo; }
    void setBienSo(const std::string& bs) { bienSo = bs; }

    std::string getTenXe() const { return tenXe; }
    void setTenXe(const std::string& tx) { tenXe = tx; }

    std::string getLoaiXe() const { return loaiXe; }
    void setLoaiXe(const std::string& lx) { loaiXe = lx; }

    double getGiaThue() const { return giaThue; }
    void setGiaThue(double gt) {
        if (gt < 0) {
            throw std::invalid_argument("Giá thuê không được âm");
        }
        giaThue = gt;
    }

    std::string getTrangThai() const { return trangThai; }
    void setTrangThai(const std::string& tt) { trangThai = tt; }

    void CapNhatGia(double gt) {
        setGiaThue(gt);
    }

    bool KiemTraSanSang() const {
        return trangThai == "Sẵn sàng";
    }

    void XuatThongTin() const {
        std::cout << "Biển số: " << bienSo << " | Tên xe: " << tenXe 
                  << " | Loại xe: " << loaiXe << " | Giá thuê: " << giaThue 
                  << " | Trạng thái: " << trangThai << std::endl;
    }

    friend std::ostream& operator<<(std::ostream& out, const Car& car) {
        out << car.bienSo << "|" << car.tenXe << "|" << car.loaiXe << "|" << car.giaThue << "|" << car.trangThai;
        return out;
    }

    friend std::istream& operator>>(std::istream& in, Car& car) {
        std::string line;
        if (std::getline(in, line)) {
            if (!line.empty() && line.back() == '\r') line.pop_back();
            if (line.empty()) return in;
            std::stringstream ss(line);
            std::string bs, tx, lx, gt_str, tt;
            if (std::getline(ss, bs, '|') &&
                std::getline(ss, tx, '|') &&
                std::getline(ss, lx, '|') &&
                std::getline(ss, gt_str, '|') &&
                std::getline(ss, tt, '|')) {
                car.bienSo = bs;
                car.tenXe = tx;
                car.loaiXe = lx;
                car.giaThue = std::stod(gt_str);
                car.trangThai = tt;
            }
        }
        return in;
    }
};

#endif // CAR_H
