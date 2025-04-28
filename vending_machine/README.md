# Vending Machine Project

This project is a full-stack vending machine application with a C++ backend and a React/MUI frontend.

---

## Project Structure

```
vending_machine/
├── backend/      # C++ API server
├── frontend/     # React frontend
└── README.md     # This file
```

---

## Backend (C++ API Server)

### 1. Build the Backend
```sh
cd backend
mkdir -p build
cd build
cmake ..
make
```

### 2. Run the Backend Server
```sh
./vending_machine_server
```
- The backend will start at: **http://localhost:8080**
- API endpoints:
  - `GET    /api/items`
  - `POST   /api/insert-money`
  - `POST   /api/purchase`
  - `POST   /api/return-change`

---

## Frontend (React + MUI)

### 1. Install Dependencies
```sh
cd frontend
npm install
```

### 2. Run the Frontend Dev Server
```sh
npm run dev
```
- The frontend will start at: **http://localhost:5173** (or the next available port)
- Open this URL in your browser to use the vending machine UI.

> **Note:** Always run npm commands from the `frontend` directory. If you are in the project root, first run:
> ```sh
> cd frontend
> ```

## Run Both Frontend and Backend Together (Dev)

You can run both servers with a single command from the `frontend` directory:

```sh
cd frontend
npm run dev:all
```
- This will start both the backend and frontend servers.
- Open http://localhost:5173 in your browser.

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