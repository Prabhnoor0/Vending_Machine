#include "vending_machine.h"
#include <iostream>
#include <stdexcept>
#include <cmath>
#include <algorithm>

// Valid coin denominations in dollars
const std::vector<double> VALID_DENOMINATIONS = {0.01, 0.05, 0.10, 0.25, 0.50, 1.00, 2.00, 5.00, 10.00, 20.00};

VendingMachine::VendingMachine(std::unique_ptr<IPaymentMethod> paymentMethod,
                             std::unique_ptr<Inventory> inventory,
                             std::unique_ptr<TransactionLog> transactionLog)
    : paymentMethod(std::move(paymentMethod)),
      inventory(std::move(inventory)),
      transactionLog(std::move(transactionLog)) {}

void VendingMachine::insertMoney(double amount) {
    if (amount <= 0) {
        throw std::invalid_argument("Amount must be positive");
    }
    auto cashPayment = dynamic_cast<CashPayment*>(paymentMethod.get());
    if (cashPayment) {
        cashPayment->addMoney(amount);
    } else {
        throw std::runtime_error("Only cash payments are supported");
    }
}

double VendingMachine::getBalance() const {
    auto cashPayment = dynamic_cast<CashPayment*>(paymentMethod.get());
    if (cashPayment) {
        return cashPayment->getBalance();
    }
    return 0.0;
}

double VendingMachine::returnChange() {
    auto cashPayment = dynamic_cast<CashPayment*>(paymentMethod.get());
    if (cashPayment) {
        return cashPayment->returnChange();
    }
    return 0.0;
}

std::vector<std::unique_ptr<IItem>> VendingMachine::getAvailableItems() const {
    auto items = inventory->getItems();
    std::vector<std::unique_ptr<IItem>> result;
    
    for (const auto& [name, details] : items) {
        // Create appropriate item type based on name or other criteria
        if (name == "Coke" || name == "Pepsi" || name == "Water" || 
            name == "Sprite" || name == "Fanta" || name == "Mountain Dew") {
            result.push_back(std::make_unique<Beverage>(name, details.second, details.first, 330));
        } else {
            result.push_back(std::make_unique<Snack>(name, details.second, details.first, 50));
        }
    }
    
    return result;
}

bool VendingMachine::purchaseItem(const std::string& itemName) {
    auto items = inventory->getItems();
    if (items.find(itemName) == items.end()) {
        return false;
    }

    double price = items[itemName].second;
    if (!paymentMethod->processPayment(price)) {
        return false;
    }

    if (inventory->purchaseItem(itemName)) {
        transactionLog->logTransaction(itemName, price);
        return true;
    }

    // If purchase failed, refund the money
    auto cashPayment = dynamic_cast<CashPayment*>(paymentMethod.get());
    if (cashPayment) {
        cashPayment->addMoney(price);
    }
    return false;
}

void VendingMachine::addItem(std::unique_ptr<IItem> item) {
    inventory->addItem(item->getName(), item->getQuantity(), item->getPrice());
}

void VendingMachine::refillItem(const std::string& itemName, int quantity) {
    inventory->refillItem(itemName, quantity);
}

std::vector<Transaction> VendingMachine::getTransactionHistory() const {
    return transactionLog->getHistory();
} 