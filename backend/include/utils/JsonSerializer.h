#ifndef JSON_SERIALIZER_H
#define JSON_SERIALIZER_H

#include <string>
#include <vector>
#include <cctype>
#include "../models/Car.h"
#include "../models/Customer.h"
#include "../models/Contract.h"

class JsonSerializer {
public:
    static std::string Escape(const std::string& s) {
        std::string res = "";
        for (char c : s) {
            if (c == '"') res += "\\\"";
            else if (c == '\\') res += "\\\\";
            else if (c == '\n') res += "\\n";
            else if (c == '\r') res += "\\r";
            else if (c == '\t') res += "\\t";n
            else res += c;
        }
        return res;
    }

    static std::string Serialize(const Car& car) {
        return "{\"bienSo\":\"" + Escape(car.getBienSo()) + 
               "\",\"tenXe\":\"" + Escape(car.getTenXe()) + 
               "\",\"loaiXe\":\"" + Escape(car.getLoaiXe()) + 
               "\",\"giaThue\":" + std::to_string(car.getGiaThue()) + 
               ",\"trangThai\":\"" + Escape(car.getTrangThai()) + "\"}";
    }

    static std::string Serialize(const Customer& c) {
        return "{\"maKH\":\"" + Escape(c.getMaKH()) + 
               "\",\"hoTen\":\"" + Escape(c.getHoTen()) + 
               "\",\"sdt\":\"" + Escape(c.getSdt()) + 
               "\",\"namSinh\":" + std::to_string(c.getNamSinh()) + "}";
    }

    static std::string Serialize(const Contract& c) {
        return "{\"maHD\":\"" + Escape(c.getMaHD()) + 
               "\",\"maKH\":\"" + Escape(c.getMaKH()) + 
               "\",\"bienSo\":\"" + Escape(c.getBienSo()) + 
               "\",\"ngayThue\":\"" + Escape(c.getNgayThue()) + 
               "\",\"ngayTraDuKien\":\"" + Escape(c.getNgayTraDuKien()) + 
               "\",\"ngayTraThucTe\":\"" + Escape(c.getNgayTraThucTe()) + 
               "\",\"soTienThanhToan\":" + std::to_string(c.getSoTienThanhToan()) + "}";
    }

    template <typename T>
    static std::string SerializeList(const std::vector<T>& list) {
        std::string res = "[";
        for (size_t i = 0; i < list.size(); ++i) {
            res += Serialize(list[i]);
            if (i + 1 < list.size()) res += ",";
        }
        res += "]";
        return res;
    }

    static std::string GetJsonValue(const std::string& json, const std::string& key) {
        size_t keyPos = json.find("\"" + key + "\"");
        if (keyPos == std::string::npos) return "";
        size_t colonPos = json.find(":", keyPos);
        if (colonPos == std::string::npos) return "";
        size_t valStart = json.find_first_not_of(" \t\r\n", colonPos + 1);
        if (valStart == std::string::npos) return "";

        if (json[valStart] == '"') {
            size_t valEnd = json.find('"', valStart + 1);
            if (valEnd == std::string::npos) return "";
            return json.substr(valStart + 1, valEnd - valStart - 1);
        } else {
            size_t valEnd = json.find_first_of(",}", valStart);
            if (valEnd == std::string::npos) return "";
            std::string sub = json.substr(valStart, valEnd - valStart);
            while(!sub.empty() && std::isspace(static_cast<unsigned char>(sub.back()))) sub.pop_back();
            return sub;
        }
    }
};

#endif // JSON_SERIALIZER_H
