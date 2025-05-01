#include "payment.hpp"
#include <stdexcept>

// CashPayment implementation
CashPayment::CashPayment(double initialBalance) : balance(initialBalance) {}

bool CashPayment::processPayment(double amount) {
    if (balance >= amount) {
        balance -= amount;
        return true;
    }
    return false;
}

std::string CashPayment::getPaymentType() const {
    return "Cash";
}

double CashPayment::getBalance() const {
    return balance;
}

void CashPayment::addMoney(double amount) {
    if (amount < 0) {
        throw std::invalid_argument("Amount cannot be negative");
    }
    balance += amount;
}

double CashPayment::returnChange() {
    double change = balance;
    balance = 0.0;
    return change;
}

// BaseItem implementation
BaseItem::BaseItem(const std::string& name, double price, int quantity)
    : name(name), price(price), quantity(quantity) {}

std::string BaseItem::getName() const {
    return name;
}

double BaseItem::getPrice() const {
    return price;
}

int BaseItem::getQuantity() const {
    return quantity;
}

void BaseItem::setQuantity(int quantity) {
    if (quantity < 0) {
        throw std::invalid_argument("Quantity cannot be negative");
    }
    this->quantity = quantity;
}

std::string BaseItem::getType() const {
    return "Base";
}

// Beverage implementation
Beverage::Beverage(const std::string& name, double price, int quantity, int volume)
    : BaseItem(name, price, quantity), volume(volume) {}

std::string Beverage::getType() const {
    return "Beverage";
}

int Beverage::getVolume() const {
    return volume;
}

// Snack implementation
Snack::Snack(const std::string& name, double price, int quantity, int weight)
    : BaseItem(name, price, quantity), weight(weight) {}

std::string Snack::getType() const {
    return "Snack";
}

int Snack::getWeight() const {
    return weight;
} 