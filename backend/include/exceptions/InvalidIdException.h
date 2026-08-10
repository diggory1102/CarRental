#ifndef INVALID_ID_EXCEPTION_H
#define INVALID_ID_EXCEPTION_H

#include <stdexcept>
#include <string>

class InvalidIdException : public std::runtime_error {
public:
    explicit InvalidIdException(const std::string& message)
        : std::runtime_error(message) {}
};

#endif // INVALID_ID_EXCEPTION_H
