#include "../include/vending_machine.h"
#include "httplib.h"
#include "../lib/json/json.hpp"
#include <iostream>

using json = nlohmann::json;

int main() {
    VendingMachine vm;
    httplib::Server svr;

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
            res.set_content(json({{"balance", vm.getBalance()}}).dump(), "application/json");
        } catch (const std::exception &e) {
            res.status = 400;
            res.set_content(json({{"error", e.what()}}).dump(), "application/json");
        }
    });

    // Return change
    svr.Post("/api/return-change", [&vm](const httplib::Request &, httplib::Response &res) {
        double change = vm.returnChange();
        res.set_content(json({{"change", change}}).dump(), "application/json");
    });

    std::cout << "Server started at http://localhost:8080" << std::endl;
    svr.listen("localhost", 8080);
    return 0;
} 