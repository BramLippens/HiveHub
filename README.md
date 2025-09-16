# HiveHub

HiveHub is a modular app platform built with a **React Native frontend (Expo)** and a **NestJS backend**, using a **pnpm monorepo structure**. It is designed to support multiple “modules” (like the first DVD/movie organizer) that can be activated independently.

-----

## 🏗️ Project Structure

```
HiveHub/
├─ frontend/          # Expo React Native app
├─ backend/           # NestJS backend
├─ packages/core/     # Shared types/constants between frontend & backend
├─ package.json       # Root workspace config
├─ pnpm-workspace.yaml
└─ .gitignore
```

-----

## 📋 Prerequisites

  * **Node.js** ≥ 20 (use `nvm` or `nvm-windows`)
  * **pnpm** (`corepack enable` then `corepack prepare pnpm@latest --activate`)
  * **Git**

-----

## 🚀 Getting Started

### 1\. Clone the repository

```bash
git clone <your-repo-url>
cd HiveHub
```

### 2\. Install dependencies

```bash
pnpm install
```

### 3\. Run the backend

```bash
pnpm start:backend
```

  * Backend runs on `http://localhost:3000`
  * Status endpoint: `http://localhost:3000/status`

### 4\. Run the frontend

```bash
pnpm start:frontend
```

  * This opens Expo Dev Tools in your browser.
  * Scan the QR code with the **Expo Go** app to run on your physical device or an emulator.

-----

## 📦 Workspace & Modules

  * **`frontend`** → React Native app
  * **`backend`** → NestJS API
  * **`packages/core`** → Shared types and constants
  * **`packages/modules`** → Future modules (e.g., DVD organizer)

All dependencies are managed via **pnpm workspaces** for a single `pnpm-lock.yaml` file and efficient installs.

-----

## ➕ Adding a New Module

1.  Create a new folder inside `packages/modules/<module-name>`.
2.  Add backend API logic or frontend components as needed.
3.  Import shared types from `@hivehub/core`.
4.  Update workspace scripts if required.

-----

## 💻 Development Tips

  * Check available scripts for any workspace using the following commands:

<!-- end list -->

```bash
pnpm --filter backend run
pnpm --filter frontend run
```

  * All apps share a single `node_modules` directory thanks to **pnpm workspaces**.
  * The `.gitignore` file is pre-configured to ignore `node_modules`, build outputs, logs, and Expo artifacts.

-----

## 📄 License

Specify your preferred license (MIT, Apache 2.0, etc.) in the root `LICENSE` file.

-----

## 📝 Notes

  * Designed for **modular expansion**.
  * Works on Linux, macOS, and Windows.
  * Supports both online and offline functionality in the frontend.