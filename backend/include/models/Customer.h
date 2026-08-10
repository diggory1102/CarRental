#ifndef CUSTOMER_H
#define CUSTOMER_H

#include <string>
#include <iostream>
#include <sstream>
#include <stdexcept>

class Customer {
private:
    std::string maKH; // CCCD
    std::string hoTen;
    std::string sdt;
    int namSinh;

public:
    Customer() : maKH(""), hoTen(""), sdt(""), namSinh(2000) {}
    Customer(std::string mkh, std::string ht, std::string s, int ns) 
        : maKH(mkh), hoTen(ht), sdt(s), namSinh(ns) {
        if (ns < 1900 || ns > 2026) {
            throw std::invalid_argument("Năm sinh không hợp lệ");
        }
    }

    std::string getMaKH() const { return maKH; }
    void setMaKH(const std::string& mkh) { maKH = mkh; }

    std::string getHoTen() const { return hoTen; }
    void setHoTen(const std::string& ht) { hoTen = ht; }

    std::string getSdt() const { return sdt; }
    void setSdt(const std::string& s) { sdt = s; }

    int getNamSinh() const { return namSinh; }
    void setNamSinh(int ns) {
        if (ns < 1900 || ns > 2026) {
            throw std::invalid_argument("Năm sinh không hợp lệ");
        }
        namSinh = ns;
    }

    void CapNhatThongTin(const std::string& ht, const std::string& s, int ns) {
        setHoTen(ht);
        setSdt(s);
        setNamSinh(ns);
    }

    void XuatThongTin() const {
        std::cout << "Mã KH: " << maKH << " | Họ Tên: " << hoTen 
                  << " | SDT: " << sdt << " | Năm sinh: " << namSinh << std::endl;
    }

    friend std::ostream& operator<<(std::ostream& out, const Customer& cust) {
        out << cust.maKH << "|" << cust.hoTen << "|" << cust.sdt << "|" << cust.namSinh;
        return out;
    }

    friend std::istream& operator>>(std::istream& in, Customer& cust) {
        std::string line;
        if (std::getline(in, line)) {
            if (line.empty()) return in;
            std::stringstream ss(line);
            std::string mkh, ht, s, ns_str;
            if (std::getline(ss, mkh, '|') &&
                std::getline(ss, ht, '|') &&
                std::getline(ss, s, '|') &&
                std::getline(ss, ns_str, '|')) {
                cust.maKH = mkh;
                cust.hoTen = ht;
                cust.sdt = s;
                cust.namSinh = std::stoi(ns_str);
            }
        }
        return in;
    }
};

#endif // CUSTOMER_H
