#include "../include/vending_machine.h"
#include "httplib.h"
#include "../lib/json/json.hpp"
#include <iostream>
#include <fstream>
#include <filesystem>
#include <cstdlib>

using json = nlohmann::json;
namespace fs = std::filesystem;

// Get the data directory path in a cross-platform way
std::string getDataFilePath() {
    const char* appData = std::getenv("APPDATA");
    fs::path dataDir;
    
    if (appData) {
        // Windows: Use AppData directory
        dataDir = fs::path(appData) / "VendingMachine";
    } else {
        // Unix-like: Use home directory
        const char* home = std::getenv("HOME");
        dataDir = fs::path(home ? home : ".") / ".vendingmachine";
    }
    
    // Create directory if it doesn't exist
    fs::create_directories(dataDir);
    
    return (dataDir / "data.json").string();
}

void saveMachineState(const VendingMachine& vm) {
    json data;
    data["balance"] = vm.getBalance();
    auto items = vm.getAvailableItems();
    for (const auto& item : items) {
        data["items"].push_back({
            {"name", item.name},
            {"price", item.price},
            {"quantity", item.quantity}
        });
    }
    
    std::ofstream file(getDataFilePath());
    if (file.is_open()) {
        file << data.dump(4);
    }
}

void loadMachineState(VendingMachine& vm) {
    std::string dataFile = getDataFilePath();
    if (!fs::exists(dataFile)) {
        return;
    }
    
    std::ifstream file(dataFile);
    if (file.is_open()) {
        json data;
        file >> data;
        
        // Load balance
        vm.insertMoney(data["balance"].get<double>());
        
        // Load items
        std::vector<Item> items;
        for (const auto& itemData : data["items"]) {
            items.push_back({
                itemData["name"].get<std::string>(),
                itemData["price"].get<double>(),
                itemData["quantity"].get<int>()
            });
        }
        vm.setItems(items);
    }
}

int main() {
    VendingMachine vm;
    httplib::Server svr;

    // Load previous state if available
    loadMachineState(vm);

    // Enable CORS
    svr.set_base_dir("./");
    svr.set_mount_point("/", "./");
    svr.set_pre_routing_handler([](const httplib::Request &req, httplib::Response &res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        if (req.method == "OPTIONS") {
            res.status = 200;
            return httplib::Server::HandlerResponse::Handled;
        }
        return httplib::Server::HandlerResponse::Unhandled;
    });

    // Get available items
    svr.Get("/api/items", [&vm](const httplib::Request &, httplib::Response &res) {
        auto items = vm.getAvailableItems();
        json response;
        for (const auto &item : items) {
            response.push_back({
                {"name", item.name},
                {"price", item.price},
                {"quantity", item.quantity}
            });
        }
        res.set_content(response.dump(), "application/json");
    });

    // Insert money
    svr.Post("/api/insert-money", [&vm](const httplib::Request &req, httplib::Response &res) {
        try {
            auto body = json::parse(req.body);
            double amount = body["amount"];
            vm.insertMoney(amount);
            saveMachineState(vm);
            res.set_content(json({{"balance", vm.getBalance()}}).dump(), "application/json");
        } catch (const std::exception &e) {
            res.status = 400;
            res.set_content(json({{"error", e.what()}}).dump(), "application/json");
        }
    });

    // Purchase item
    svr.Post("/api/purchase", [&vm](const httplib::Request &req, httplib::Response &res) {
        try {
            auto body = json::parse(req.body);
            std::string itemName = body["item"];
            vm.purchaseItem(itemName);
            saveMachineState(vm);
            res.set_content(json({{"balance", vm.getBalance()}}).dump(), "application/json");
        } catch (const std::exception &e) {
            res.status = 400;
            res.set_content(json({{"error", e.what()}}).dump(), "application/json");
        }
    });

    // Return change
    svr.Post("/api/return-change", [&vm](const httplib::Request &, httplib::Response &res) {
        try {
            double change = vm.returnChange();
            saveMachineState(vm);
            res.set_content(json({{"change", change}}).dump(), "application/json");
        } catch (const std::exception &e) {
            res.status = 400;
            res.set_content(json({{"error", e.what()}}).dump(), "application/json");
        }
    });

    std::cout << "Server started at http://0.0.0.0:8080" << std::endl;
    svr.listen("0.0.0.0", 8080);
    return 0;
} 