# Productivity Tray App

A lightweight **system tray productivity application for Windows**, built with **Tauri**, focused on fast access, minimal distraction, and a modern user experience.

The app runs silently in the **Windows system tray** and opens a **small, centered popup panel** on click, allowing quick interactions without breaking workflow.

---

## ✨ Key Features

- Runs exclusively in the **system tray**
- Clean, modern, distraction-free UI
- Small **borderless popup window**
- Silent startup (no taskbar window)
- Extremely low memory usage
- Secure architecture powered by Tauri
- Much lighter than Electron-based alternatives

---

## 🖥️ Application Behavior

- On startup:
  - No visible window
  - Tray icon available in the system tray

- Left-click on the tray icon:
  - Opens a small, centered popup window
  - Designed for quick productivity actions

- Optional behavior:
  - Automatically hides when focus is lost

---

## 🛠️ Tech Stack

- **Tauri** — Desktop application framework
- **Rust** — Backend, system and window management
- **React + TypeScript** — Frontend UI
- **Vite** — Fast development and build tooling
- **Tailwind CSS** — Modern styling

---

## 📂 Project Structure

productivity/
├─ src/ # Frontend (React)
├─ src-tauri/
│ ├─ src/main.rs # Rust backend (tray, windows)
│ └─ tauri.conf.json
├─ package.json
└─ README.md

yaml
Copiar código

---

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS recommended)
- Rust (stable toolchain)
- npm

---

### Install dependencies

```bash
npm install
Run in development mode
bash
Copiar código
npm run tauri dev
The app will start minimized in the system tray.

📦 Production Build
bash
Copiar código
npm run tauri build
The compiled executable will be available at:

arduino
Copiar código
src-tauri/target/release
🔒 Security
This project follows Tauri security best practices:

Sensitive APIs are disabled by default

Secure IPC between frontend and backend

No Node.js runtime in production

🎯 Project Goals
This project aims to provide a solid foundation for a fast-access productivity hub, with future possibilities such as: 
Personal goals tracking
Task lists
Team requests
Global keyboard shortcuts
External service integrations
All while keeping the application lightweight, fast, and unobtrusive.

