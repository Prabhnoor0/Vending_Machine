find_path(JSON_INCLUDE_DIR
    NAMES nlohmann/json.hpp
    PATHS
        /usr/include
        /usr/local/include
        ${CMAKE_INSTALL_PREFIX}/include
)

include(FindPackageHandleStandardArgs)
find_package_handle_standard_args(JSON DEFAULT_MSG JSON_INCLUDE_DIR)

if(JSON_FOUND)
    set(JSON_INCLUDE_DIRS ${JSON_INCLUDE_DIR})
    if(NOT TARGET nlohmann_json::nlohmann_json)
        add_library(nlohmann_json::nlohmann_json INTERFACE IMPORTED)
        set_target_properties(nlohmann_json::nlohmann_json PROPERTIES
            INTERFACE_INCLUDE_DIRECTORIES "${JSON_INCLUDE_DIR}")
    endif()
endif() 