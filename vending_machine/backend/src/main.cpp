#define CROW_MAIN
#include "crow_all.hpp"
#include "vending_machine.h"
#include "payment.hpp"
#include <memory>

int main() {
    crow::SimpleApp app;
    
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

    // API endpoints
    CROW_ROUTE(app, "/api/items")
    ([&vendingMachine]() {
        auto items = vendingMachine.getAvailableItems();
        crow::json::wvalue response;
        int i = 0;
        for (const auto& item : items) {
            response[i]["name"] = item->getName();
            response[i]["price"] = item->getPrice();
            response[i]["quantity"] = item->getQuantity();
            response[i]["type"] = item->getType();
            i++;
        }
        return response;
    });

    CROW_ROUTE(app, "/api/insert-money")
    .methods("POST"_method)
    ([&vendingMachine](const crow::request& req) {
        auto json = crow::json::load(req.body);
        if (!json || !json.has("amount")) {
            return crow::response(400, "Invalid request");
        }
        try {
            vendingMachine.insertMoney(json["amount"].d());
            return crow::response(200, "Money inserted successfully");
        } catch (const std::exception& e) {
            return crow::response(400, e.what());
        }
    });

    CROW_ROUTE(app, "/api/purchase")
    .methods("POST"_method)
    ([&vendingMachine](const crow::request& req) {
        auto json = crow::json::load(req.body);
        if (!json || !json.has("item") || !json.has("quantity")) {
            return crow::response(400, "Invalid request");
        }
        try {
            if (vendingMachine.purchaseItem(json["item"].s())) {
                return crow::response(200, "Purchase successful");
            }
            return crow::response(400, "Purchase failed");
        } catch (const std::exception& e) {
            return crow::response(400, e.what());
        }
    });

    CROW_ROUTE(app, "/api/return-change")
    .methods("POST"_method)
    ([&vendingMachine]() {
        double change = vendingMachine.returnChange();
        return crow::response(200, std::to_string(change));
    });

    app.port(8080).multithreaded().run();
}