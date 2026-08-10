#ifndef FILE_MANAGER_H
#define FILE_MANAGER_H

#include <string>
#include <fstream>
#include <filesystem>
#include "../templates/QuanLy.hpp"

class FileManager {
public:
    template <typename T>
    static void Load(const std::string& filepath, QuanLy<T>& ql) {
        std::ifstream file(filepath);
        if (!file.is_open()) {
            // Create directories if they do not exist
            std::filesystem::path p(filepath);
            if (p.has_parent_path()) {
                std::filesystem::create_directories(p.parent_path());
            }
            // Create an empty file
            std::ofstream outfile(filepath);
            outfile.close();
            return;
        }

        T item;
        while (file >> item) {
            bool isValid = false;
            if constexpr (std::is_same_v<T, Car>) {
                isValid = !item.getBienSo().empty();
            } else if constexpr (std::is_same_v<T, Customer>) {
                isValid = !item.getMaKH().empty();
            } else if constexpr (std::is_same_v<T, Contract>) {
                isValid = !item.getMaHD().empty();
            } else if constexpr (std::is_same_v<T, Account>) {
                isValid = !item.getUsername().empty();
            }

            if (isValid) {
                ql.getDanhSach().push_back(item);
            }
        }
        file.close();
    }

    template <typename T>
    static void Save(const std::string& filepath, const QuanLy<T>& ql) {
        std::ofstream file(filepath, std::ios::trunc);
        if (!file.is_open()) return;

        for (const auto& item : ql.getDanhSach()) {
            file << item << "\n";
        }
        file.close();
    }
};

#endif // FILE_MANAGER_H
