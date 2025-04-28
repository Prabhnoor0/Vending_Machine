#ifndef INVENTORY_HPP
#define INVENTORY_HPP

#include <string>
#include <map>
#include <mutex>

class Inventory {
public:
    void addItem(const std::string& name, int quantity, double price);
    bool purchaseItem(const std::string& name);
    void refillItem(const std::string& name, int quantity);
    std::map<std::string, std::pair<int, double>> getItems();

private:
    std::map<std::string, std::pair<int, double>> items;
    std::mutex mtx;
};

#endif