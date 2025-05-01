cmake_minimum_required(VERSION 3.10)
project(vending_machine_backend)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find OpenSSL
find_package(OpenSSL REQUIRED)

# Platform-specific settings
if(WIN32)
    # Windows-specific settings
    add_definitions(-D_WIN32_WINNT=0x0601)  # Windows 7 or later
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /EHsc")  # Enable C++ exceptions
endif()

# Add include directories
include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    ${CMAKE_CURRENT_SOURCE_DIR}/lib
    ${CMAKE_CURRENT_SOURCE_DIR}/lib/httplib
    ${CMAKE_CURRENT_SOURCE_DIR}/lib/json
    ${OPENSSL_INCLUDE_DIR}
)

# Add source files
add_executable(vending_machine_server
    src/server.cpp
    src/vending_machine.cpp
    src/payment.cpp
    src/inventory.cpp
    src/transaction.cpp
)

if(WIN32)
    target_link_libraries(vending_machine_server
        ws2_32
        ${OPENSSL_SSL_LIBRARY}
        ${OPENSSL_CRYPTO_LIBRARY}
    )
else()
    target_link_libraries(vending_machine_server
        pthread
        ${OPENSSL_SSL_LIBRARY}
        ${OPENSSL_CRYPTO_LIBRARY}
    )
endif()

# Install the executable
install(TARGETS vending_machine_server
    RUNTIME DESTINATION bin
)