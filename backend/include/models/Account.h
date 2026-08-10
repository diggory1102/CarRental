#ifndef ACCOUNT_H
#define ACCOUNT_H

#include <string>
#include <iostream>

class Account {
private:
    std::string username;
    std::string password;

public:
    Account() : username(""), password("") {}
    Account(std::string user, std::string pass) : username(user), password(pass) {}

    std::string getUsername() const { return username; }
    void setUsername(const std::string& user) { username = user; }

    std::string getPassword() const { return password; }
    void setPassword(const std::string& pass) { password = pass; }

    bool DangNhap(const std::string& user, const std::string& pass) const {
        return (username == user && password == pass);
    }

    void DoiMatKhau(const std::string& newPass) {
        password = newPass;
    }

    // Friend stream operators for File I/O
    friend std::ostream& operator<<(std::ostream& out, const Account& acc) {
        out << acc.username << " " << acc.password;
        return out;
    }

    friend std::istream& operator>>(std::istream& in, Account& acc) {
        in >> acc.username >> acc.password;
        return in;
    }
};

#endif // ACCOUNT_H
