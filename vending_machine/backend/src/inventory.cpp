#include "inventory.hpp"

void Inventory::addItem(const std::string& name, int quantity, double price) {
    std::lock_guard<std::mutex> lock(mtx);
    items[name] = { quantity, price };
}

bool Inventory::purchaseItem(const std::string& name) {
    std::lock_guard<std::mutex> lock(mtx);
    if (items.count(name) && items[name].first > 0) {
        items[name].first--;
        return true;
    }
    return false;
}

void Inventory::refillItem(const std::string& name, int quantity) {
    std::lock_guard<std::mutex> lock(mtx);
    if (items.count(name)) {
        items[name].first += quantity;
    }
}

std::map<std::string, std::pair<int, double>> Inventory::getItems() {
    std::lock_guard<std::mutex> lock(mtx);
    return items;
}