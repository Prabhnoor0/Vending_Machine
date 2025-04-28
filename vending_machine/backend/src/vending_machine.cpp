#include "vending_machine.h"
#include <iostream>
#include <stdexcept>
#include <cmath>
#include <algorithm>

// Valid coin denominations in dollars
const std::vector<double> VALID_DENOMINATIONS = {0.01, 0.05, 0.10, 0.25, 0.50, 1.00, 2.00, 5.00, 10.00, 20.00};

VendingMachine::VendingMachine() {
    items = {
        {"Coke", 1.50, 10},
        {"Pepsi", 1.50, 10},
        {"Water", 1.00, 10},
        {"Chips", 1.25, 10},
        {"Candy", 0.75, 10}
    };
    balance = 0.0;
}

void VendingMachine::insertMoney(double amount) {
    if (amount <= 0) {
        throw std::invalid_argument("Amount must be positive");
    }
    balance += amount;
}

double VendingMachine::getBalance() const {
    return balance;
}

std::vector<Item> VendingMachine::getAvailableItems() const {
    return items;
}

bool VendingMachine::purchaseItem(const std::string& itemName) {
    for (auto& item : items) {
        if (item.name == itemName) {
            if (item.quantity <= 0) {
                throw std::runtime_error("Item out of stock");
            }
            if (balance < item.price) {
                throw std::runtime_error("Insufficient balance");
            }
            balance -= item.price;
            item.quantity--;
            return true;
        }
    }
    throw std::runtime_error("Item not found");
}

double VendingMachine::returnChange() {
    double change = balance;
    balance = 0.0;
    return change;
} 