cmake_minimum_required(VERSION 3.10)
project(vending_machine_backend)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(OpenSSL REQUIRED)

include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    ${CMAKE_CURRENT_SOURCE_DIR}/lib/httplib
    ${CMAKE_CURRENT_SOURCE_DIR}/lib/json
    ${OPENSSL_INCLUDE_DIR}
)

add_executable(vending_machine_server
    src/server.cpp
    src/vending_machine.cpp
)

target_link_libraries(vending_machine_server
    pthread
    ${OPENSSL_SSL_LIBRARY}
    ${OPENSSL_CRYPTO_LIBRARY}
)