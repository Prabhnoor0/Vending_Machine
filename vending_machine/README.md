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

#### CMake
- **macOS**:
  ```sh
  # Using Homebrew
  brew install cmake
  ```
  [Download from Homebrew](https://brew.sh/)

- **Windows**:
  - Download the installer from [CMake Downloads](https://cmake.org/download/)
  - During installation, select "Add CMake to the system PATH"
  - Restart your terminal after installation

- **Linux (Ubuntu/Debian)**:
  ```sh
  sudo apt-get update
  sudo apt-get install cmake
  ```

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

- **Linux (Ubuntu/Debian)**:
  ```sh
  sudo apt-get update
  sudo apt-get install build-essential
  ```

#### Make
- **macOS**: Included with Xcode Command Line Tools
- **Windows**: Included with Visual Studio or MinGW
- **Linux (Ubuntu/Debian)**:
  ```sh
  sudo apt-get update
  sudo apt-get install make
  ```

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

- **Linux (Ubuntu/Debian)**:
  ```sh
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

> **Note**: After installing Node.js, verify your installation:
> ```sh
> node --version
> npm --version
> ```

---

## Quick Start (Running Both Frontend and Backend Together)

You can run both servers with a single command from the `frontend` directory:

```sh
cd frontend
npm install
npm run dev:all
```
- This will start both the backend and frontend servers.
- Open http://localhost:5173 in your browser to use the vending machine UI.

---

## Individual Setup Instructions

### Backend (C++ API Server)

#### 1. Build the Backend
```sh
cd backend
mkdir -p build
cd build
cmake ..
make
```

#### 2. Run the Backend Server
```sh
./vending_machine_server
```
- The backend will start at: **http://localhost:8080**
- API endpoints:
  - `GET    /api/items`
  - `POST   /api/insert-money`
  - `POST   /api/purchase`
  - `POST   /api/return-change`

### Frontend (React + MUI)

#### 1. Install Dependencies
```sh
cd frontend
npm install
```

#### 2. Run the Frontend Dev Server
```sh
npm run dev
```
- The frontend will start at: **http://localhost:5173** (or the next available port)
- Open this URL in your browser to use the vending machine UI.

> **Note:** Always run npm commands from the `frontend` directory. If you are in the project root, first run:
> ```sh
> cd frontend
> ```

---

## Troubleshooting

- **Blank Page in Browser?**
  - Check the browser console for errors (F12 > Console tab)
  - Make sure both backend and frontend servers are running
  - Make sure you are in the correct directory when running commands

- **Port Already in Use?**
  - Stop all running servers (Ctrl+C in each terminal)
  - If needed, kill processes using ports 5173/5174/5175:
    ```sh
    lsof -i :5173,5174,5175 | grep LISTEN
    kill <PID1> <PID2> ...
    ```

- **Backend Not Found (404)?**
  - The backend is an API server, not a web page. Only the frontend should be opened in the browser.

- **Dependency Issues?**
  - In `frontend/`, try:
    ```sh
    rm -rf node_modules package-lock.json
    npm install
    ```

---

## Contact / Support
If you have issues, please check the console output and error messages, then ask for help with the details.