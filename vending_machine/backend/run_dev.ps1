# PowerShell script for Windows users
Write-Host "Starting Vending Machine Backend Server..." -ForegroundColor Green

# Check if build directory exists
if (-not (Test-Path "build")) {
    Write-Host "Creating build directory..." -ForegroundColor Yellow
    mkdir build
    cd build
    cmake ..
    cmake --build .
    cd ..
}

# Run the server
cd build
.\vending_machine_server.exe 