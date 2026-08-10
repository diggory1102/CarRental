#ifndef CAR_NOT_AVAILABLE_EXCEPTION_H
#define CAR_NOT_AVAILABLE_EXCEPTION_H

#include <stdexcept>
#include <string>

class CarNotAvailableException : public std::runtime_error {
public:
    explicit CarNotAvailableException(const std::string& message)
        : std::runtime_error(message) {}
};

#endif // CAR_NOT_AVAILABLE_EXCEPTION_H
