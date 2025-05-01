#ifndef PAYMENT_HPP
#define PAYMENT_HPP

#include <string>

// Interface for all payment methods
class IPaymentMethod {
public:
    virtual ~IPaymentMethod() = default;
    virtual bool processPayment(double amount) = 0;
    virtual std::string getPaymentType() const = 0;
};

// Concrete implementation for cash payment
class CashPayment : public IPaymentMethod {
public:
    CashPayment(double initialBalance = 0.0);
    bool processPayment(double amount) override;
    std::string getPaymentType() const override;
    double getBalance() const;
    void addMoney(double amount);
    double returnChange();

private:
    double balance;
};

// Interface for item types
class IItem {
public:
    virtual ~IItem() = default;
    virtual std::string getName() const = 0;
    virtual double getPrice() const = 0;
    virtual int getQuantity() const = 0;
    virtual void setQuantity(int quantity) = 0;
    virtual std::string getType() const = 0;
};

// Base class for all items
class BaseItem : public IItem {
public:
    BaseItem(const std::string& name, double price, int quantity);
    std::string getName() const override;
    double getPrice() const override;
    int getQuantity() const override;
    void setQuantity(int quantity) override;
    std::string getType() const override;

protected:
    std::string name;
    double price;
    int quantity;
};

// Specific item types
class Beverage : public BaseItem {
public:
    Beverage(const std::string& name, double price, int quantity, int volume);
    std::string getType() const override;
    int getVolume() const;

private:
    int volume; // in ml
};

class Snack : public BaseItem {
public:
    Snack(const std::string& name, double price, int quantity, int weight);
    std::string getType() const override;
    int getWeight() const;

private:
    int weight; // in grams
};

#endif 