#ifndef TRANSACTION_HPP
#define TRANSACTION_HPP

#include <string>
#include <vector>
#include <ctime>

struct Transaction {
    std::string itemName;
    double price;
    std::time_t timestamp;
};

class TransactionLog {
public:
    void logTransaction(const std::string& itemName, double price);
    std::vector<Transaction> getHistory();

private:
    std::vector<Transaction> history;
};

#endif