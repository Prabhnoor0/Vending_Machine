#include "httplib.h"
#include "vending_machine.h"
#include "payment.hpp"
#include "inventory.hpp"
#include "transaction.hpp"
#include <memory>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

int main() {
    // Create dependencies with dependency injection
    auto paymentMethod = std::make_unique<CashPayment>();
    auto inventory = std::make_unique<Inventory>();
    auto transactionLog = std::make_unique<TransactionLog>();
    
    // Create vending machine with dependencies
    VendingMachine vendingMachine(std::move(paymentMethod), 
                                std::move(inventory), 
                                std::move(transactionLog));

    // Add items using the new item types
    vendingMachine.addItem(std::make_unique<Beverage>("Coke", 1.5, 10, 330));
    vendingMachine.addItem(std::make_unique<Beverage>("Pepsi", 1.2, 8, 330));
    vendingMachine.addItem(std::make_unique<Beverage>("Water", 1.0, 15, 500));
    vendingMachine.addItem(std::make_unique<Snack>("Chips", 1.8, 12, 50));
    vendingMachine.addItem(std::make_unique<Snack>("Candy", 1.0, 20, 30));
    vendingMachine.addItem(std::make_unique<Beverage>("Sprite", 1.5, 10, 330));
    vendingMachine.addItem(std::make_unique<Beverage>("Fanta", 1.5, 10, 330));
    vendingMachine.addItem(std::make_unique<Beverage>("Mountain Dew", 1.2, 8, 330));
    vendingMachine.addItem(std::make_unique<Snack>("Doritos", 1.8, 12, 50));
    vendingMachine.addItem(std::make_unique<Snack>("Snickers", 1.2, 15, 45));
    vendingMachine.addItem(std::make_unique<Snack>("Twix", 1.2, 15, 45));
    vendingMachine.addItem(std::make_unique<Snack>("KitKat", 1.2, 15, 45));

    httplib::Server svr;

    // Enable CORS
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

    // API endpoints
    svr.Get("/api/items", [&vendingMachine](const httplib::Request&, httplib::Response &res) {
        auto items = vendingMachine.getAvailableItems();
        json response = json::array();
        for (const auto& item : items) {
            response.push_back({
                {"name", item->getName()},
                {"price", item->getPrice()},
                {"quantity", item->getQuantity()},
                {"type", item->getType()}
            });
        }
        res.set_content(response.dump(), "application/json");
    });

    svr.Post("/api/insert-money", [&vendingMachine](const httplib::Request &req, httplib::Response &res) {
        try {
            auto data = json::parse(req.body);
            if (!data.contains("amount")) {
                res.status = 400;
                res.set_content("Invalid request: missing amount", "text/plain");
                return;
            }
            vendingMachine.insertMoney(data["amount"].get<double>());
            res.set_content("Money inserted successfully", "text/plain");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(e.what(), "text/plain");
        }
    });

    svr.Post("/api/purchase", [&vendingMachine](const httplib::Request &req, httplib::Response &res) {
        try {
            auto data = json::parse(req.body);
            if (!data.contains("item")) {
                res.status = 400;
                res.set_content("Invalid request: missing item", "text/plain");
                return;
            }
            if (vendingMachine.purchaseItem(data["item"].get<std::string>())) {
                res.set_content("Purchase successful", "text/plain");
            } else {
                res.status = 400;
                res.set_content("Purchase failed", "text/plain");
            }
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(e.what(), "text/plain");
        }
    });

    svr.Post("/api/return-change", [&vendingMachine](const httplib::Request&, httplib::Response &res) {
        double change = vendingMachine.returnChange();
        res.set_content(std::to_string(change), "text/plain");
    });

    std::cout << "Server started at http://localhost:8080" << std::endl;
    svr.listen("localhost", 8080);
    return 0;
} 