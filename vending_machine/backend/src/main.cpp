#define CROW_MAIN
#include "crow_all.hpp"
#include "inventory.hpp"
#include "transaction.hpp"

int main() {
    crow::SimpleApp app;
    Inventory inventory;
    TransactionLog tlog;

    // Add all items with initial quantities and prices
    inventory.addItem("Coke", 10, 1.5);
    inventory.addItem("Pepsi", 8, 1.2);
    inventory.addItem("Water", 15, 1.0);
    inventory.addItem("Chips", 12, 1.8);
    inventory.addItem("Candy", 20, 1.0);
    inventory.addItem("Sprite", 10, 1.5);
    inventory.addItem("Fanta", 10, 1.5);
    inventory.addItem("Mountain Dew", 8, 1.2);
    inventory.addItem("Doritos", 12, 1.8);
    inventory.addItem("Snickers", 15, 1.2);
    inventory.addItem("Twix", 15, 1.2);
    inventory.addItem("KitKat", 15, 1.2);

    CROW_ROUTE(app, "/items")
    ([&inventory]() {
        auto items = inventory.getItems();
        crow::json::wvalue response;
        int i = 0;
        for (auto& item : items) {
            response[i]["name"] = item.first;
            response[i]["quantity"] = item.second.first;
            response[i]["price"] = item.second.second;
            i++;
        }
        return response;
    });

    CROW_ROUTE(app, "/buy/<string>")
    ([&inventory, &tlog](std::string name) {
        if (inventory.purchaseItem(name)) {
            auto items = inventory.getItems();
            tlog.logTransaction(name, items[name].second);
            return crow::response(200, "Purchase successful");
        } else {
            return crow::response(400, "Item out of stock or does not exist");
        }
    });

    CROW_ROUTE(app, "/transactions")
    ([&tlog]() {
        auto history = tlog.getHistory();
        crow::json::wvalue result;
        for (size_t i = 0; i < history.size(); ++i) {
            result[i]["item"] = history[i].itemName;
            result[i]["price"] = history[i].price;
            result[i]["timestamp"] = static_cast<unsigned>(history[i].timestamp);
        }
        return result;
    });

    app.port(18080).multithreaded().run();
}