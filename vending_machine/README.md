# Vending Machine Full-Stack Application

A modern vending machine application with a C++ backend and React/MUI frontend.

## Prerequisites

### For macOS:

1. Install Homebrew (Package Manager):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Install Required Tools:
```bash
# Install Git
brew install git

# Install Node.js and npm
brew install node

# Install C++ compiler and build tools
brew install cmake
brew install nlohmann-json
brew install openssl

# Verify installations
git --version
node --version
npm --version
cmake --version
```

### For Windows:

1. Install Git:
   - Download from: https://git-scm.com/download/windows
   - During installation, choose "Git Bash" option

2. Install Node.js and npm:
   - Download from: https://nodejs.org/
   - Choose LTS version
   - Run installer and follow prompts

3. Install Visual Studio with C++ workload:
   - Download Visual Studio Community: https://visualstudio.microsoft.com/downloads/
   - During installation, select:
     - "Desktop development with C++"
     - "C++ CMake tools"

4. Install CMake:
   - Download from: https://cmake.org/download/
   - Choose Windows x64 Installer
   - During installation, select "Add CMake to system PATH"

## Project Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd vending_machine
```

2. Set up the backend:

For macOS:
```bash
# Navigate to backend directory
cd backend

# Make the build script executable
chmod +x build.sh

# Run the build script
./build.sh
```

For Windows:
```bash
# Navigate to backend directory
cd backend

# Create and navigate to build directory
mkdir build
cd build

# Generate build files with CMake
cmake ..

# Build the project
cmake --build .

# Return to backend directory
cd ..
```

3. Set up the frontend:
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

## Running the Application

You'll need two terminal windows/tabs to run both backend and frontend.

### Terminal 1 - Running the Backend Server:

For macOS:
```bash
# From project root
cd backend/build
./vending_machine_server
```

For Windows:
```bash
# From project root
cd backend\build
.\vending_machine_server.exe
```

The backend server will start at: http://localhost:8080

### Terminal 2 - Running the Frontend Development Server:

```bash
# From project root
cd frontend
npm run dev
```

The frontend will be available at: http://localhost:5173 (or another port if 5173 is in use)

## Building the Backend (Detailed Steps)

### For macOS:

The `build.sh` script performs these steps:
```bash
# Install required packages
brew install cmake nlohmann-json

# Create and enter build directory
mkdir -p build
cd build

# Generate build files
cmake ..

# Build the project
make

# Make the server executable
chmod +x vending_machine_server
```

### For Windows:

If not using the CMake GUI:
```bash
# Create and enter build directory
mkdir build
cd build

# Generate build files (use your Visual Studio version)
cmake -G "Visual Studio 17 2022" ..

# Build the project
cmake --build . --config Release
```

## API Endpoints

The backend server provides the following REST API endpoints:

- `GET /api/items` - Get all available items
- `POST /api/insert-money` - Insert money into the machine
  ```json
  { "amount": 1.00 }
  ```
- `POST /api/purchase` - Purchase an item
  ```json
  { "item": "Coke" }
  ```
- `POST /api/return-change` - Return remaining change

## Project Structure

```
vending_machine/
├── backend/
│   ├── build/              # Build output directory
│   ├── include/            # Header files
│   ├── lib/               # External libraries
│   ├── src/               # Source files
│   ├── CMakeLists.txt     # CMake configuration
│   ├── build.sh           # Build script for macOS
│   └── run_dev.sh         # Development run script
└── frontend/
    ├── src/               # React source files
    ├── public/            # Static files
    ├── package.json       # Node.js dependencies
    └── vite.config.js     # Vite configuration
```

## Troubleshooting

### Common Issues:

1. Port already in use:
   - Backend: Change port in server.cpp (default: 8080)
   - Frontend: Vite will automatically try next available port

2. Build errors:
   - Make sure all prerequisites are installed
   - For Windows, ensure Visual Studio is properly set up with C++ workload
   - For macOS, ensure XCode Command Line Tools are installed:
     ```bash
     xcode-select --install
     ```

3. Frontend dependency issues:
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

4. Permission denied for build.sh:
   ```bash
   chmod +x backend/build.sh
   ```

5. CMake not finding dependencies:
   - For macOS: `brew install nlohmann-json openssl`
   - For Windows: Check system PATH variables

### For Windows Users:
- Use Git Bash or PowerShell for commands
- Replace forward slashes (/) with backslashes (\\) in paths
- Use .exe extension for executables

### For macOS Users:
- If permission denied for scripts:
  ```bash
  chmod +x backend/build.sh
  chmod +x backend/run_dev.sh
  ```

## Development

The project uses:
- Backend: C++17, CMake, OpenSSL, nlohmann/json
- Frontend: React, Material-UI, Vite
- HTTP Server: cpp-httplib

