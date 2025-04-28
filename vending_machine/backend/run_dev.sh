#!/bin/bash
echo "Starting Vending Machine Backend Server..."

# Check if build directory exists
if [ ! -d "build" ]; then
    echo "Creating build directory..."
    mkdir build
    cd build
    cmake ..
    make
    cd ..
fi

# Run the server
cd build
./vending_machine_server 