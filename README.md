# Productivity Tray App

A lightweight Windows productivity app that lives in your system tray. Built to give you quick access to your tools without interrupting your workflow.

## What is this?

This is a minimal system tray application that runs quietly in the background. Click the tray icon and a small popup appears right where you need it. No windows cluttering your taskbar, no alt-tabbing through a dozen apps to find what you need.

The idea is simple: keep productivity tools one click away, then get out of your way.

## Features

- Runs entirely from the system tray
- Small, centered popup window on click
- No taskbar presence
- Lightweight and fast
- Closes when you click away (optional)
- Starts minimized to tray

## Tech Stack

- **Tauri** - Desktop app framework
- **Rust** - Backend logic
- **React** - UI components
- **TypeScript** - Type safety
- **Vite** - Build tooling
- **Tailwind CSS** - Styling

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Rust](https://www.rust-lang.org/tools/install)
- Windows 10/11

### Running Locally

Clone the repository:

```bash
git clone https://github.com/yourusername/productivity-tray-app.git
cd productivity-tray-app
```

Install dependencies:

```bash
npm install
```

Run the development build:

```bash
npm run tauri dev
```

The app will start in the system tray. Look for the icon in your hidden icons area.

### Building

To create a production build:

```bash
npm run tauri build
```

The installer will be in `src-tauri/target/release/bundle/`.

## Project Structure

```
├── src/                  # React frontend
│   ├── components/       # UI components
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── src-tauri/           # Rust backend
│   ├── src/
│   │   └── main.rs      # Tauri app logic
│   └── tauri.conf.json  # Tauri configuration
├── public/              # Static assets
└── package.json
```

## Why I Built This

I kept finding myself switching between apps or opening heavy programs just to check something quick. This started as a way to consolidate a few utilities I use constantly into something that's always there but never in the way.

It's still evolving, but the core idea is solid: fast access, minimal footprint, no friction.

## License

This project is licensed under the MIT License.

Carlos Abucci.
