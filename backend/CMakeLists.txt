cmake_minimum_required(VERSION 3.10)
project(CarRentalBackend)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(include)

add_executable(server src/main.cpp)

if(WIN32)
    target_link_libraries(server ws2_32)
endif()
