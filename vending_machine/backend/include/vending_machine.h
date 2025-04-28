#ifndef VENDING_MACHINE_H
#define VENDING_MACHINE_H

#include <string>
#include <vector>

struct Item {
    std::string name;
    double price;
    int quantity;
};

class VendingMachine {
public:
    VendingMachine();
    void insertMoney(double amount);
    double getBalance() const;
    std::vector<Item> getAvailableItems() const;
    bool purchaseItem(const std::string& itemName);
    double returnChange();

private:
    std::vector<Item> items;
    double balance;
};

#endif 