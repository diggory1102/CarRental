#ifndef CUSTOMER_H
#define CUSTOMER_H

#include <string>
#include <iostream>
#include <sstream>
#include <stdexcept>
#include <cctype>
#include "../exceptions/InvalidIdException.h"

class Customer {
private:
    std::string maKH; // CCCD
    std::string hoTen;
    std::string sdt;
    int namSinh;

public:
    Customer() : maKH(""), hoTen(""), sdt(""), namSinh(2000) {}
    Customer(std::string mkh, std::string ht, std::string s, int ns) {
        if (mkh.length() != 12) {
            throw InvalidIdException("Số CCCD phải có đúng 12 chữ số!");
        }
        for (char c : mkh) {
            if (!std::isdigit(c)) {
                throw InvalidIdException("Số CCCD chỉ được phép chứa các chữ số!");
            }
        }
        if (s.length() != 10 || s[0] != '0') {
            throw std::invalid_argument("Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0!");
        }
        for (char c : s) {
            if (!std::isdigit(c)) {
                throw std::invalid_argument("Số điện thoại chỉ được phép chứa các chữ số!");
            }
        }
        if (ns < 1900 || ns > 2026) {
            throw std::invalid_argument("Năm sinh không hợp lệ (1900 - 2026)");
        }
        maKH = mkh;
        hoTen = ht;
        sdt = s;
        namSinh = ns;
    }

    std::string getMaKH() const { return maKH; }
    void setMaKH(const std::string& mkh) { 
        if (mkh.length() != 12) {
            throw InvalidIdException("Số CCCD phải có đúng 12 chữ số!");
        }
        for (char c : mkh) {
            if (!std::isdigit(c)) {
                throw InvalidIdException("Số CCCD chỉ được phép chứa các chữ số!");
            }
        }
        maKH = mkh; 
    }

    std::string getHoTen() const { return hoTen; }
    void setHoTen(const std::string& ht) { hoTen = ht; }

    std::string getSdt() const { return sdt; }
    void setSdt(const std::string& s) { 
        if (s.length() != 10 || s[0] != '0') {
            throw std::invalid_argument("Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0!");
        }
        for (char c : s) {
            if (!std::isdigit(c)) {
                throw std::invalid_argument("Số điện thoại chỉ được phép chứa các chữ số!");
            }
        }
        sdt = s; 
    }

    int getNamSinh() const { return namSinh; }
    void setNamSinh(int ns) {
        if (ns < 1900 || ns > 2026) {
            throw std::invalid_argument("Năm sinh không hợp lệ (1900 - 2026)");
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
            if (!line.empty() && line.back() == '\r') line.pop_back();
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
