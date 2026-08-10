#include <iostream>
#include <string>
#include "../include/httplib.h"
#include "../include/templates/QuanLy.hpp"
#include "../include/utils/FileManager.h"
#include "../include/api/AuthController.h"
#include "../include/api/CarController.h"
#include "../include/api/CustomerController.h"
#include "../include/api/ContractController.h"

int main() {
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
        std::cout << "Khong co tai khoan, tao tai khoan mac dinh admin/admin123" << std::endl;
        Account defaultAdmin("admin", "admin123");
        qlAccounts.Them(defaultAdmin);
        FileManager::Save(accountPath, qlAccounts);
    }

    // Add some default cars if empty, to make testing easy
    if (qlCars.getDanhSach().empty()) {
        std::cout << "Khong co xe, tao danh sach xe mac dinh" << std::endl;
        qlCars.Them(Car("29A-12345", "Toyota Vios", "Sedan", 500000.0, "Sẵn sàng"));
        qlCars.Them(Car("30F-99999", "Mercedes C200", "Sedan", 1200000.0, "Sẵn sàng"));
        qlCars.Them(Car("51H-88888", "Hyundai SantaFe", "SUV", 900000.0, "Sẵn sàng"));
        qlCars.Them(Car("15A-67890", "VinFast Lux A2.0", "Sedan", 800000.0, "Bảo trì"));
        FileManager::Save(carPath, qlCars);
    }

    // Add some default customers if empty
    if (qlCustomers.getDanhSach().empty()) {
        std::cout << "Khong co khach hang, tao danh sach mac dinh" << std::endl;
        qlCustomers.Them(Customer("001203004567", "Nguyen Van A", "0987654321", 1995));
        qlCustomers.Them(Customer("001204009876", "Tran Thi B", "0912345678", 1998));
        FileManager::Save(customerPath, qlCustomers);
    }

    httplib::Server svr;

    // CORS Headers middleware
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

    std::cout << "CarRentalManager C++ Backend dang chay tren http://localhost:18080" << std::endl;
    svr.listen("0.0.0.0", 18080);

    return 0;
}
