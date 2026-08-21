#ifndef CONTRACT_H
#define CONTRACT_H

#include <string>
#include <iostream>
#include <sstream>

class Contract {
private:
    std::string maHD;
    std::string maKH;
    std::string bienSo;
    std::string ngayThue;
    std::string ngayTraDuKien;
    std::string ngayTraThucTe; // Trống nếu chưa trả
    double soTienThanhToan; // 0.0 nếu chưa trả

public:
    Contract() : maHD(""), maKH(""), bienSo(""), ngayThue(""), ngayTraDuKien(""), ngayTraThucTe(""), soTienThanhToan(0.0) {}
    Contract(std::string mhd, std::string mkh, std::string bs, std::string nt, std::string ntdk) 
        : maHD(mhd), maKH(mkh), bienSo(bs), ngayThue(nt), ngayTraDuKien(ntdk), ngayTraThucTe(""), soTienThanhToan(0.0) {}

    std::string getMaHD() const { return maHD; }
    void setMaHD(const std::string& mhd) { maHD = mhd; }

    std::string getMaKH() const { return maKH; }
    void setMaKH(const std::string& mkh) { maKH = mkh; }

    std::string getBienSo() const { return bienSo; }
    void setBienSo(const std::string& bs) { bienSo = bs; }

    std::string getNgayThue() const { return ngayThue; }
    void setNgayThue(const std::string& nt) { ngayThue = nt; }

    std::string getNgayTraDuKien() const { return ngayTraDuKien; }
    void setNgayTraDuKien(const std::string& ntdk) { ngayTraDuKien = ntdk; }

    std::string getNgayTraThucTe() const { return ngayTraThucTe; }
    void setNgayTraThucTe(const std::string& nttt) { ngayTraThucTe = nttt; }

    double getSoTienThanhToan() const { return soTienThanhToan; }
    void setSoTienThanhToan(double st) { soTienThanhToan = st; }

    double TinhTienThanhToan(int soNgayThueThucTe, double giaThue) {
        soTienThanhToan = soNgayThueThucTe * giaThue;
        return soTienThanhToan;
    }

    void XuatHopDong() const {
        std::cout << "Mã HĐ: " << maHD << " | Mã KH: " << maKH << " | Biển số: " << bienSo 
                  << " | Ngày thuê: " << ngayThue << " | Ngày trả DK: " << ngayTraDuKien 
                  << " | Ngày trả thực tế: " << (ngayTraThucTe.empty() ? "Chưa trả" : ngayTraThucTe)
                  << " | Thanh toán: " << soTienThanhToan << std::endl;
    }

    friend std::ostream& operator<<(std::ostream& out, const Contract& contract) {
        out << contract.maHD << "|" << contract.maKH << "|" << contract.bienSo << "|" 
            << contract.ngayThue << "|" << contract.ngayTraDuKien << "|" 
            << (contract.ngayTraThucTe.empty() ? "NULL" : contract.ngayTraThucTe) << "|" 
            << contract.soTienThanhToan;
        return out;
    }

    friend std::istream& operator>>(std::istream& in, Contract& contract) {
        std::string line;
        if (std::getline(in, line)) {
            if (!line.empty() && line.back() == '\r') line.pop_back();
            if (line.empty()) return in;
            std::stringstream ss(line);
            std::string mhd, mkh, bs, nt, ntdk, nttt, st_str;
            if (std::getline(ss, mhd, '|') &&
                std::getline(ss, mkh, '|') &&
                std::getline(ss, bs, '|') &&
                std::getline(ss, nt, '|') &&
                std::getline(ss, ntdk, '|') &&
                std::getline(ss, nttt, '|') &&
                std::getline(ss, st_str, '|')) {
                contract.maHD = mhd;
                contract.maKH = mkh;
                contract.bienSo = bs;
                contract.ngayThue = nt;
                contract.ngayTraDuKien = ntdk;
                contract.ngayTraThucTe = (nttt == "NULL" ? "" : nttt);
                contract.soTienThanhToan = std::stod(st_str);
            }
        }
        return in;
    }
};

#endif // CONTRACT_H
