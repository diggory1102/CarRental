#include <iostream>
#include <string>
#include <thread>
#include <limits>
#include <cstdlib>
#include <ctime>
#include "../include/httplib.h"
#include "../include/templates/QuanLy.hpp"
#include "../include/utils/FileManager.h"
#include "../include/api/AuthController.h"
#include "../include/api/CarController.h"
#include "../include/api/CustomerController.h"
#include "../include/api/ContractController.h"
#include "../include/exceptions/CarNotAvailableException.h"
#include "../include/exceptions/InvalidIdException.h"

// Clear input buffer
void clearInputBuffer() {
    std::cin.clear();
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
}

// Sub-menu for Car Management
void MenuQuanLyOto(QuanLy<Car>& qlCars, const std::string& carPath) {
    int choice;
    do {
        std::cout << "\n==========================================" << std::endl;
        std::cout << "        MENU QUAN LY O TO" << std::endl;
        std::cout << "==========================================" << std::endl;
        std::cout << "1. Them xe moi" << std::endl;
        std::cout << "2. Xoa xe" << std::endl;
        std::cout << "3. Cap nhat gia thue" << std::endl;
        std::cout << "4. Tim kiem xe theo Bien so" << std::endl;
        std::cout << "5. Tim cac xe dang 'San sang'" << std::endl;
        std::cout << "6. Hien thi danh sach xe" << std::endl;
        std::cout << "7. Cap nhat trang thai xe" << std::endl;
        std::cout << "0. Quay lai menu chinh" << std::endl;
        std::cout << "Lua chon cua ban: ";
        if (!(std::cin >> choice)) {
            std::cout << "Lua chon khong hop le!" << std::endl;
            clearInputBuffer();
            continue;
        }

        try {
            if (choice == 1) {
                std::string bienSo, tenXe, loaiXe, trangThai;
                double giaThue;
                std::cout << "Nhap bien so xe: ";
                std::getline(std::cin >> std::ws, bienSo);
                if (bienSo.empty()) throw InvalidIdException("Bien so xe khong duoc de trong!");

                std::cout << "Nhap ten xe (VD: Toyota Vios): ";
                std::getline(std::cin >> std::ws, tenXe);
                std::cout << "Nhap loai xe (4 cho, 7 cho, Ban tai): ";
                std::getline(std::cin >> std::ws, loaiXe);
                std::cout << "Nhap gia thue/ngay: ";
                if (!(std::cin >> giaThue)) {
                    clearInputBuffer();
                    throw std::invalid_argument("Gia thue phai la mot so!");
                }
                int ttChoice = 1;
                std::cout << "Chon trang thai xe (1: San sang, 2: Bao tri): ";
                if (!(std::cin >> ttChoice)) {
                    clearInputBuffer();
                    ttChoice = 1;
                }
                trangThai = u8"Sẵn sàng";
                if (ttChoice == 2) {
                    trangThai = u8"Bảo trì";
                }
                Car newCar(bienSo, tenXe, loaiXe, giaThue, trangThai);
                qlCars.Them(newCar);
                FileManager::Save(carPath, qlCars);
                std::cout << "Them xe moi thanh cong!" << std::endl;

            } else if (choice == 2) {
                std::string bienSo;
                std::cout << "Nhap bien so xe can xoa: ";
                std::getline(std::cin >> std::ws, bienSo);
                if (bienSo.empty()) throw InvalidIdException("Bien so xe khong duoc de trong!");

                Car* car = qlCars.TimKiem(bienSo);
                if (car && car->getTrangThai() == "Dang thue") {
                    throw std::runtime_error("Khong the xoa xe dang trong hop dong thue!");
                }

                qlCars.Xoa(bienSo);
                FileManager::Save(carPath, qlCars);
                std::cout << "Xoa xe thanh cong!" << std::endl;

            } else if (choice == 3) {
                std::string bienSo;
                double giaMoi;
                std::cout << "Nhap bien so xe: ";
                std::getline(std::cin >> std::ws, bienSo);
                Car* car = qlCars.TimKiem(bienSo);
                if (!car) {
                    std::cout << "Khong tim thay xe co bien so nay!" << std::endl;
                } else {
                    std::cout << "Nhap gia thue moi: ";
                    if (!(std::cin >> giaMoi)) {
                        clearInputBuffer();
                        throw std::invalid_argument("Gia thue phai la mot so!");
                    }
                    car->CapNhatGia(giaMoi);
                    FileManager::Save(carPath, qlCars);
                    std::cout << "Cap nhat gia thue thanh cong!" << std::endl;
                }

            } else if (choice == 4) {
                std::string bienSo;
                std::cout << "Nhap bien so xe can tim: ";
                std::getline(std::cin >> std::ws, bienSo);
                Car* car = qlCars.TimKiem(bienSo);
                if (car) {
                    std::cout << "\n--- Thong tin xe tim thay ---" << std::endl;
                    car->XuatThongTin();
                } else {
                    std::cout << "Khong tim thay xe co bien so nay!" << std::endl;
                }

            } else if (choice == 5) {
                std::cout << "\n--- Danh sach xe dang San sang ---" << std::endl;
                int count = 0;
                for (const auto& car : qlCars.getDanhSach()) {
                    if (car.getTrangThai() == "San sang" || car.getTrangThai() == "Sẵn sàng") {
                        car.XuatThongTin();
                        count++;
                    }
                }
                if (count == 0) {
                    std::cout << "Khong co xe nao dang o trang thai San sang." << std::endl;
                }

            } else if (choice == 6) {
                std::cout << "\n--- Danh sach tat ca xe ---" << std::endl;
                qlCars.HienThiDanhSach();
            } else if (choice == 7) {
                std::string bienSo, trangThaiMoi;
                std::cout << "Nhap bien so xe can cap nhat trang thai: ";
                std::getline(std::cin >> std::ws, bienSo);
                Car* car = qlCars.TimKiem(bienSo);
                if (!car) {
                    std::cout << "Khong tim thay xe co bien so nay!" << std::endl;
                } else {
                    int ttChoice = 1;
                    std::cout << "Chon trang thai moi (1: San sang, 2: Bao tri): ";
                    if (!(std::cin >> ttChoice)) {
                        clearInputBuffer();
                        ttChoice = 1;
                    }
                    trangThaiMoi = u8"Sẵn sàng";
                    if (ttChoice == 2) {
                        trangThaiMoi = u8"Bảo trì";
                    }
                    if (car->getTrangThai() == "Dang thue" || car->getTrangThai() == u8"Đang thuê") {
                        throw std::runtime_error("Khong the cap nhat trang thai xe dang trong hop dong thue!");
                    }
                    car->setTrangThai(trangThaiMoi);
                    FileManager::Save(carPath, qlCars);
                    std::cout << "Cap nhat trang thai xe thanh cong!" << std::endl;
                }
            }
        } catch (const InvalidIdException& e) {
            std::cout << "LOI QUY PHAM: " << e.what() << std::endl;
        } catch (const std::exception& e) {
            std::cout << "LOI: " << e.what() << std::endl;
        }

    } while (choice != 0);
}

// Sub-menu for Customer Management
void MenuQuanLyKhachHang(QuanLy<Customer>& qlCustomers, const std::string& customerPath) {
    int choice;
    do {
        std::cout << "\n==========================================" << std::endl;
        std::cout << "        MENU QUAN LY KHACH HANG" << std::endl;
        std::cout << "==========================================" << std::endl;
        std::cout << "1. Them khach hang moi" << std::endl;
        std::cout << "2. Cap nhat thong tin khach hang" << std::endl;
        std::cout << "3. Tim kiem khach hang" << std::endl;
        std::cout << "4. Hien thi danh sach khach hang" << std::endl;
        std::cout << "0. Quay lai menu chinh" << std::endl;
        std::cout << "Lua chon cua ban: ";
        if (!(std::cin >> choice)) {
            std::cout << "Lua chon khong hop le!" << std::endl;
            clearInputBuffer();
            continue;
        }

        try {
            if (choice == 1) {
                std::string maKH, hoTen, sdt;
                int namSinh;
                std::cout << "Nhap ma khach hang (CCCD/Passport): ";
                std::getline(std::cin >> std::ws, maKH);
                if (maKH.empty()) throw InvalidIdException("Ma khach hang khong duoc de trong!");

                std::cout << "Nhap ho va ten: ";
                std::getline(std::cin >> std::ws, hoTen);
                std::cout << "Nhap so dien thoai: ";
                std::getline(std::cin >> std::ws, sdt);
                std::cout << "Nhap nam sinh: ";
                if (!(std::cin >> namSinh)) {
                    clearInputBuffer();
                    throw std::invalid_argument("Nam sinh phai la mot so!");
                }

                for (const auto& cust : qlCustomers.getDanhSach()) {
                    if (cust.getSdt() == sdt) {
                        throw std::invalid_argument("So dien thoai nay da duoc dang ky boi khach hang khac!");
                    }
                }
                Customer newCust(maKH, hoTen, sdt, namSinh);
                qlCustomers.Them(newCust);
                FileManager::Save(customerPath, qlCustomers);
                std::cout << "Them khach hang thanh cong!" << std::endl;

            } else if (choice == 2) {
                std::string maKH;
                std::cout << "Nhap ma khach hang can cap nhat (CCCD/Passport): ";
                std::getline(std::cin >> std::ws, maKH);
                Customer* cust = qlCustomers.TimKiem(maKH);
                if (!cust) {
                    std::cout << "Khong tim thay khach hang nay!" << std::endl;
                } else {
                    std::string hoTen, sdt;
                    int namSinh;
                    std::cout << "Nhap ho ten moi: ";
                    std::getline(std::cin >> std::ws, hoTen);
                    std::cout << "Nhap so dien thoai moi: ";
                    std::getline(std::cin >> std::ws, sdt);
                    std::cout << "Nhap nam sinh moi: ";
                    if (!(std::cin >> namSinh)) {
                        clearInputBuffer();
                        throw std::invalid_argument("Nam sinh phai la mot so!");
                    }
                    for (const auto& other : qlCustomers.getDanhSach()) {
                        if (other.getSdt() == sdt && other.getMaKH() != maKH) {
                            throw std::invalid_argument("So dien thoai nay da duoc dang ky boi khach hang khac!");
                        }
                    }
                    cust->CapNhatThongTin(hoTen, sdt, namSinh);
                    FileManager::Save(customerPath, qlCustomers);
                    std::cout << "Cap nhat thong tin khach hang thanh cong!" << std::endl;
                }

            } else if (choice == 3) {
                std::string maKH;
                std::cout << "Nhap ma khach hang can tim: ";
                std::getline(std::cin >> std::ws, maKH);
                Customer* cust = qlCustomers.TimKiem(maKH);
                if (cust) {
                    std::cout << "\n--- Thong tin khach hang tim thay ---" << std::endl;
                    cust->XuatThongTin();
                } else {
                    std::cout << "Khong tim thay khach hang!" << std::endl;
                }

            } else if (choice == 4) {
                std::cout << "\n--- Danh sach khach hang ---" << std::endl;
                qlCustomers.HienThiDanhSach();
            }
        } catch (const InvalidIdException& e) {
            std::cout << "LOI QUY PHAM: " << e.what() << std::endl;
        } catch (const std::exception& e) {
            std::cout << "LOI: " << e.what() << std::endl;
        }

    } while (choice != 0);
}

// Sub-menu for Rental and Return
void MenuQuanLyThueTra(
    QuanLy<Contract>& qlContracts, 
    QuanLy<Car>& qlCars, 
    QuanLy<Customer>& qlCustomers, 
    const std::string& contractPath, 
    const std::string& carPath
) {
    int choice;
    do {
        std::cout << "\n==========================================" << std::endl;
        std::cout << "        MENU THUE & TRA XE" << std::endl;
        std::cout << "==========================================" << std::endl;
        std::cout << "1. Thuc hien thue xe (Lap hop dong)" << std::endl;
        std::cout << "2. Thuc hien tra xe & Thanh toan" << std::endl;
        std::cout << "0. Quay lai menu chinh" << std::endl;
        std::cout << "Lua chon cua ban: ";
        if (!(std::cin >> choice)) {
            std::cout << "Lua chon khong hop le!" << std::endl;
            clearInputBuffer();
            continue;
        }

        try {
            if (choice == 1) {
                std::string maHD, maKH, bienSo, ngayThue, ngayTraDK;
                do {
                    maHD = "HD" + std::to_string(std::rand() % 9000 + 1000);
                } while (qlContracts.TimKiem(maHD) != nullptr);
                std::cout << "Ma hop dong tu dong phat sinh: " << maHD << std::endl;

                std::cout << "Nhap ma khach hang (CCCD/Passport): ";
                std::getline(std::cin >> std::ws, maKH);
                Customer* cust = qlCustomers.TimKiem(maKH);
                if (!cust) {
                    std::cout << "Mã khach hang chua ton tai! Vui long them khach hang vao danh sach truoc." << std::endl;
                    continue;
                }

                std::cout << "Nhap bien so xe: ";
                std::getline(std::cin >> std::ws, bienSo);
                Car* car = qlCars.TimKiem(bienSo);
                if (!car) {
                    std::cout << "Khong tim thay xe co bien so nay!" << std::endl;
                    continue;
                }

                // Check availability
                if (car->getTrangThai() != "San sang" && car->getTrangThai() != "Sẵn sàng") {
                    throw CarNotAvailableException("Xe bien so " + bienSo + " hien dang ban hoac bao tri!");
                }

                if (ngayTraDK < ngayThue) {
                    throw std::invalid_argument("Ngay tra du kien khong the truoc ngay thue!");
                }
                std::cout << "Nhap ngay thue (yyyy-mm-dd): ";
                std::getline(std::cin >> std::ws, ngayThue);
                std::cout << "Nhap ngay tra du kien (yyyy-mm-dd): ";
                std::getline(std::cin >> std::ws, ngayTraDK);

                Contract newContract(maHD, maKH, bienSo, ngayThue, ngayTraDK);
                qlContracts.Them(newContract);

                // Update status
                car->setTrangThai("Dang thue");

                // Save
                FileManager::Save(contractPath, qlContracts);
                FileManager::Save(carPath, qlCars);

                std::cout << "Lap hop dong va thue xe thanh cong!" << std::endl;

            } else if (choice == 2) {
                std::string query;
                std::cout << "Nhap Ma hop dong hoac Bien so xe de tra: ";
                std::getline(std::cin >> std::ws, query);

                // Find contract
                Contract* target = nullptr;
                for (auto& ct : qlContracts.getDanhSach()) {
                    if ((ct.getMaHD() == query || ct.getBienSo() == query) && ct.getNgayTraThucTe().empty()) {
                        target = &ct;
                        break;
                    }
                }

                if (!target) {
                    std::cout << "Khong tim thay hop dong dang thue tuong ung!" << std::endl;
                    continue;
                }

                std::string ngayTraThucTe;
                int soNgayThucTe;
                std::string trangThaiSauTra;

                std::cout << "Nhap ngay tra xe thuc te (yyyy-mm-dd): ";
                std::getline(std::cin >> std::ws, ngayTraThucTe);
                std::cout << "Nhap so ngay thue thuc te: ";
                if (!(std::cin >> soNgayThucTe) || soNgayThucTe < 0) {
                    clearInputBuffer();
                    throw std::invalid_argument("So ngay thue khong hop le!");
                }

                Car* car = qlCars.TimKiem(target->getBienSo());
                if (!car) {
                    std::cout << "Khong tim thay thong tin xe lien quan!" << std::endl;
                    continue;
                }

                // Calculate bill
                double tongTien = target->TinhTienThanhToan(soNgayThucTe, car->getGiaThue());
                target->setNgayTraThucTe(ngayTraThucTe);

                std::cout << "Xe co gap su co gi khong? (Nhap 'Bao tri' neu co, nguoc lai nhap 'San sang'): ";
                std::getline(std::cin >> std::ws, trangThaiSauTra);
                if (trangThaiSauTra != "Bao tri" && trangThaiSauTra != "Sẵn sàng" && trangThaiSauTra != "San sang") {
                    trangThaiSauTra = "San sang";
                }
                car->setTrangThai(trangThaiSauTra);

                // Save
                FileManager::Save(contractPath, qlContracts);
                FileManager::Save(carPath, qlCars);

                std::cout << "Tra xe thanh cong! Tong tien thanh toan: " << tongTien << " VND" << std::endl;
            }
        } catch (const CarNotAvailableException& e) {
            std::cout << "LOI THUE XE: " << e.what() << std::endl;
        } catch (const InvalidIdException& e) {
            std::cout << "LOI DINH DANH: " << e.what() << std::endl;
        } catch (const std::exception& e) {
            std::cout << "LOI: " << e.what() << std::endl;
        }

    } while (choice != 0);
}

// Sub-menu for Statistics
void MenuThongKe(QuanLy<Contract>& qlContracts, QuanLy<Customer>& qlCustomers) {
    int choice;
    do {
        std::cout << "\n==========================================" << std::endl;
        std::cout << "        MENU THONG KE & LICH SU" << std::endl;
        std::cout << "==========================================" << std::endl;
        std::cout << "1. Xem tat ca hop dong (Lich su thue)" << std::endl;
        std::cout << "2. Tra cuu lich su cua mot khach hang cu the" << std::endl;
        std::cout << "0. Quay lai menu chinh" << std::endl;
        std::cout << "Lua chon cua ban: ";
        if (!(std::cin >> choice)) {
            std::cout << "Lua chon khong hop le!" << std::endl;
            clearInputBuffer();
            continue;
        }

        if (choice == 1) {
            std::cout << "\n--- Danh sach tat ca hop dong ---" << std::endl;
            qlContracts.HienThiDanhSach();
        } else if (choice == 2) {
            std::string maKH;
            std::cout << "Nhap ma khach hang can tra cuu (CCCD/Passport): ";
            std::getline(std::cin >> std::ws, maKH);
            Customer* cust = qlCustomers.TimKiem(maKH);
            if (!cust) {
                std::cout << "Khong tim thay thong tin khach hang!" << std::endl;
                continue;
            }

            std::cout << "\n=== Lich su thue xe cua khach hang: " << cust->getHoTen() << " ===" << std::endl;
            double tongChi = 0.0;
            int count = 0;
            for (const auto& ct : qlContracts.getDanhSach()) {
                if (ct.getMaKH() == maKH) {
                    ct.XuatHopDong();
                    tongChi += ct.getSoTienThanhToan();
                    count++;
                }
            }
            if (count == 0) {
                std::cout << "Khach hang nay chua thuc hien giao dich thue xe nao." << std::endl;
            } else {
                std::cout << ">> Tong so tien da chi: " << tongChi << " VND" << std::endl;
            }
        }

    } while (choice != 0);
}


int getLockDurationSec(int failCount) {
    if (failCount == 3) return 60;
    if (failCount == 4) return 180;
    if (failCount == 5) return 300;
    return 600;
}

int main() {
    std::srand(std::time(nullptr));
    // File paths
    const std::string carPath = "backend/data/cars.txt";
    const std::string customerPath = "backend/data/customers.txt";
    const std::string contractPath = "backend/data/contracts.txt";
    const std::string accountPath = "backend/data/accounts.txt";

    // Manage objects
    QuanLy<Car> qlCars;
    QuanLy<Customer> qlCustomers;
    QuanLy<Contract> qlContracts;
    QuanLy<Account> qlAccounts;

    // Load data from text files
    std::cout << "Dang tai du lieu..." << std::endl;
    FileManager::Load(carPath, qlCars);
    FileManager::Load(customerPath, qlCustomers);
    FileManager::Load(contractPath, qlContracts);
    FileManager::Load(accountPath, qlAccounts);

    // Create default account if none exists
    if (qlAccounts.getDanhSach().empty()) {
        Account defaultAdmin("admin", "admin123");
        qlAccounts.Them(defaultAdmin);
        FileManager::Save(accountPath, qlAccounts);
    }

    // Add some default cars if empty, to make testing easy
    if (qlCars.getDanhSach().empty()) {
        qlCars.Them(Car("29A-12345", "Toyota Vios", "Sedan", 500000.0, "San sang"));
        qlCars.Them(Car("30F-99999", "Mercedes C200", "Sedan", 1200000.0, "San sang"));
        qlCars.Them(Car("51H-88888", "Hyundai SantaFe", "SUV", 900000.0, "San sang"));
        qlCars.Them(Car("15A-67890", "VinFast Lux A2.0", "Sedan", 800000.0, "Bao tri"));
        FileManager::Save(carPath, qlCars);
    }

    // Add some default customers if empty
    if (qlCustomers.getDanhSach().empty()) {
        qlCustomers.Them(Customer("001203004567", "Nguyen Van A", "0987654321", 1995));
        qlCustomers.Them(Customer("001204009876", "Tran Thi B", "0912345678", 1998));
        FileManager::Save(customerPath, qlCustomers);
    }

    // Start C++ REST API Server in a background thread
    httplib::Server svr;

    svr.set_post_routing_handler([](const auto&, auto& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    });

    svr.Options(R"(/api/.*)", [](const httplib::Request&, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.status = 204;
    });

    // Register controllers
    RegisterAuthRoutes(svr, qlAccounts, accountPath);
    RegisterCarRoutes(svr, qlCars, carPath);
    RegisterCustomerRoutes(svr, qlCustomers, customerPath);
    RegisterContractRoutes(svr, qlContracts, qlCars, qlCustomers, contractPath, carPath);

    std::thread apiThread([&]() {
        svr.listen("0.0.0.0", 18080);
    });
    apiThread.detach();

    std::cout << "\n[Web Server HTTP] Dang chay tren http://localhost:18080" << std::endl;

    // Interactive console-based OOP application
    std::string user, pass;
    bool loggedIn = false;
    int loginAttempts = 0;

    std::cout << "\n==========================================" << std::endl;
    std::cout << "      DANG NHAP QUAN LY CHO THUE XE" << std::endl;
    std::cout << "==========================================" << std::endl;

    while (!loggedIn) {
        std::cout << "Username: ";
        std::cin >> user;
        std::cout << "Password: ";
        std::cin >> pass;

        Account* acc = qlAccounts.TimKiem(user);
        if (acc && acc->DangNhap(user, pass)) {
            loggedIn = true;
            std::cout << "\nDang nhap thanh cong!" << std::endl;
        } else {
            loginAttempts++;
            if (loginAttempts >= 3) {
                int sec = getLockDurationSec(loginAttempts);
                std::cout << "\nTai khoan hoac mat khau khong dung!" << std::endl;
                for (int i = sec; i > 0; --i) {
                    std::cout << "\rBan da dang nhap sai " << loginAttempts << " lan! Vui long thu lai sau " << i << "s... " << std::flush;
                    std::this_thread::sleep_for(std::chrono::seconds(1));
                }
                std::cout << "\n\nVui long nhap lai thong tin dang nhap:\n" << std::endl;
            } else {
                std::cout << "Tai khoan hoac mat khau khong dung! Con lai " << (3 - loginAttempts) << " lan thu." << std::endl;
            }
        }
    }

    int mainChoice;
    do {
        std::cout << "\n==========================================" << std::endl;
        std::cout << "        MENU CHINH - CAR RENTAL MANAGER" << std::endl;
        std::cout << "==========================================" << std::endl;
        std::cout << "1. Quan ly danh sach O to" << std::endl;
        std::cout << "2. Quan ly danh sach Khach hang" << std::endl;
        std::cout << "3. Nghiang vu Thu e & Tra xe" << std::endl;
        std::cout << "4. Thong ke doanh thu & Tra cuu lich su" << std::endl;
        std::cout << "0. Thoat chuong trinh & Luu file" << std::endl;
        std::cout << "Lua chon cua ban: ";
        if (!(std::cin >> mainChoice)) {
            std::cout << "Lua chon khong hop le!" << std::endl;
            clearInputBuffer();
            continue;
        }

        if (mainChoice == 1) {
            MenuQuanLyOto(qlCars, carPath);
        } else if (mainChoice == 2) {
            MenuQuanLyKhachHang(qlCustomers, customerPath);
        } else if (mainChoice == 3) {
            MenuQuanLyThueTra(qlContracts, qlCars, qlCustomers, contractPath, carPath);
        } else if (mainChoice == 4) {
            MenuThongKe(qlContracts, qlCustomers);
        }

    } while (mainChoice != 0);

    // Save final status
    std::cout << "Dang luu lai du lieu cuoi..." << std::endl;
    FileManager::Save(carPath, qlCars);
    FileManager::Save(customerPath, qlCustomers);
    FileManager::Save(contractPath, qlContracts);
    FileManager::Save(accountPath, qlAccounts);
    std::cout << "Da luu thanh cong. Chuong trinh ket thuc." << std::endl;

    return 0;
}
