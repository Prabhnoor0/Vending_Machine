# Vending Machine Project

This project is a full-stack vending machine application with a C++ backend and a React/MUI frontend.

---
## Project Structure

```
vending_machine/
├── backend/      # C++ API server
└── frontend/     # React frontend
```

---

## Prerequisites

### Backend Dependencies

#### CMake and Make
- **macOS**:
  ```sh
  # Using Homebrew
  brew install cmake make
  ```
  [Download from Homebrew](https://brew.sh/)

- **Windows**:
  - Download CMake from [CMake Downloads](https://cmake.org/download/)
  - Download Make from [GNU Make for Windows](https://www.gnu.org/software/make/)
  - Add both to your system PATH
  - Restart your terminal after installation

#### C++ Compiler
- **macOS**:
  ```sh
  # Install Xcode Command Line Tools
  xcode-select --install
  ```
  [Download Xcode](https://developer.apple.com/xcode/)

- **Windows**:
  - Download and install [Visual Studio Community](https://visualstudio.microsoft.com/vs/community/)
  - During installation, select "Desktop development with C++"
  - Or install [MinGW-w64](https://www.mingw-w64.org/)

#### OpenSSL
- **macOS**:
  ```sh
  brew install openssl
  ```

- **Windows**:
  - Download from [OpenSSL for Windows](https://slproweb.com/products/Win32OpenSSL.html)
  - Install the full version (not light)
  - Add OpenSSL to your system PATH

### Frontend Dependencies

#### Node.js and npm
- **macOS**:
  ```sh
  # Using Homebrew
  brew install node
  ```
  Or download from [Node.js Official Website](https://nodejs.org/)

- **Windows**:
  - Download the LTS version from [Node.js Official Website](https://nodejs.org/)
  - Run the installer and follow the instructions
  - Restart your terminal after installation

> **Note**: After installing Node.js, verify your installation:
> ```sh
> node --version
> npm --version
> ```

---

## Quick Start

### Option 1: Run Both Frontend and Backend Together

#### macOS/Windows
```sh
cd frontend
npm install
npm run dev:all
```

This will start both servers:
- Backend at: **http://localhost:8080**
- Frontend at: **http://localhost:5173**

### Option 2: Run Services Separately

#### Running the Backend

##### macOS/Windows
```sh
cd backend
make run
```

Available make commands:
- `make build` - Build the project
- `make run`   - Build and run the server
- `make clean` - Clean build files
- `make help`  - Show available commands

#### Running the Frontend
```sh
cd frontend
npm install
npm run dev
```

---

## Development Workflow

1. **Start the Backend**:
   - Use `make run` in the backend directory
   - The backend will automatically build if needed
   - Data is stored in:
     - macOS: `~/.vendingmachine/data.json`
     - Windows: `%APPDATA%\VendingMachine\data.json`

2. **Start the Frontend**:
   - The frontend will automatically connect to the backend
   - Hot reloading is enabled for development
   - Changes will be reflected immediately

3. **Making Changes**:
   - Backend changes require a server restart (`make run` again)
   - Frontend changes are automatically reloaded
   - Both Windows and macOS users can work on the same codebase

---

## Troubleshooting

### Common Issues

- **Backend Won't Start?**
  - Check if port 8080 is available
  - Verify OpenSSL is installed correctly
  - On Windows, ensure Visual Studio C++ tools are installed
  - Try `make clean` followed by `make run`

- **Frontend Can't Connect?**
  - Ensure the backend is running
  - Check browser console for CORS errors
  - Verify both servers are using the correct ports

- **Data Not Saving?**
  - Check file permissions in the data directory
  - Verify the directory exists and is writable

### Platform-Specific Issues

#### Windows
- If Make is not found:
  - Add Make to your system PATH
  - Restart your terminal
- If OpenSSL is not found:
  - Add OpenSSL to your system PATH
  - Restart your terminal

#### macOS
- If Xcode tools are missing:
  ```sh
  xcode-select --install
  ```
- If Homebrew is not installed:
  ```sh
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  ```

---

## API Endpoints

The backend provides the following endpoints:

- `GET    /api/items` - Get available items
- `POST   /api/insert-money` - Insert money
- `POST   /api/purchase` - Purchase an item
- `POST   /api/return-change` - Return change

---

## Contact / Support
If you have issues, please check the console output and error messages, then ask for help with the details.