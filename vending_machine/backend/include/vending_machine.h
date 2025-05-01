#ifndef VENDING_MACHINE_H
#define VENDING_MACHINE_H

#include <string>
#include <vector>
#include <memory>
#include "payment.hpp"
#include "inventory.hpp"
#include "transaction.hpp"

class VendingMachine {
public:
    // Constructor with dependency injection
    VendingMachine(std::unique_ptr<IPaymentMethod> paymentMethod,
                  std::unique_ptr<Inventory> inventory,
                  std::unique_ptr<TransactionLog> transactionLog);

    // Payment operations
    void insertMoney(double amount);
    double getBalance() const;
    double returnChange();

    // Item operations
    std::vector<std::unique_ptr<IItem>> getAvailableItems() const;
    bool purchaseItem(const std::string& itemName);
    void addItem(std::unique_ptr<IItem> item);
    void refillItem(const std::string& itemName, int quantity);

    // Transaction operations
    std::vector<Transaction> getTransactionHistory() const;

private:
    std::unique_ptr<IPaymentMethod> paymentMethod;
    std::unique_ptr<Inventory> inventory;
    std::unique_ptr<TransactionLog> transactionLog;
};

#endif 