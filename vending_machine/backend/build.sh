#!/bin/bash

# Install required dependencies using Homebrew
if ! command -v brew &> /dev/null; then
    echo "Homebrew not found. Please install Homebrew first: https://brew.sh/"
    exit 1
fi

# Install required packages
brew install cmake
brew install nlohmann-json

# Create build directory
mkdir -p build
cd build

# Configure and build
cmake ..
make

# Make the server executable
chmod +x vending_machine_server

echo "Build completed successfully!"
echo "To run the server, use: ./vending_machine_server" 