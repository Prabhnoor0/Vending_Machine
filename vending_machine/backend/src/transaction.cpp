#include "transaction.hpp"
#include <ctime>

void TransactionLog::logTransaction(const std::string& itemName, double price) {
    Transaction t;
    t.itemName = itemName;
    t.price = price;
    t.timestamp = std::time(nullptr);
    history.push_back(t);
}

std::vector<Transaction> TransactionLog::getHistory() {
    return history;
}