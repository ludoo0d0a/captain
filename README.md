# Captain

[![Build Status](https://github.com/ludoo0d0a/captain/actions/workflows/deploy.yml/badge.svg)](https://github.com/ludoo0d0a/captain/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Live Preview](https://img.shields.io/badge/preview-online-brightgreen)](https://ludoo0d0a.github.io/captain/)

A modern Nuxt 3 dashboard to manage releases, status, and deployed versions of multiple applications across environments—similar to Cloudfresh, but open and extensible.

[**Live Preview**](https://ludoo0d0a.github.io/captain/)

---

## Features

- **Environment-centric and App-centric Dashboards**
- **Manage Applications & Environments**: Add, edit, rename, delete, and tag
- **Version Deployment & Promotion**: Deploy or promote versions between environments
- **Snapshot Support**: Mark and filter snapshot versions
- **Tagging & Filtering**: Multi-tag, color-coded, and quick filter everywhere
- **Connector System**: Unified interface for GitHub Actions, Jenkins, SSH, HTTP, XL Deploy (mock & future real API support)
- **Settings Management**: Configure connectors, credentials, and endpoints
- **Modern UI**: Responsive, clean, and fast, built with Tailwind CSS
- **Persistence**: State saved in localStorage
- **Extensible**: Easily add new connectors or features

---

## Screenshots

> _Replace the screenshot below with your own!_

![Dashboard Screenshot](screenshots/dashboard.png)

---

## Animated GIFs

> _Showcase features or flows with animated GIFs!_

![Demo GIF](screenshots/demo.gif)

---

## Tech Stack

- [Nuxt 3](https://nuxt.com/) (Vue 3, Vite)
- [Pinia](https://pinia.vuejs.org/) for state management
- [Tailwind CSS](https://tailwindcss.com/) for UI
- [GitHub Actions](https://github.com/features/actions) for CI/CD & deployment

---

## Getting Started

### 1. Clone & Install

```bash
# Clone the repo
git clone https://github.com/ludoo0d0a/captain.git
cd captain

# Install dependencies (choose one)
pnpm install   # recommended
# or
npm install
```

### 2. Run Locally

```bash
# Start the dev server
pnpm dev
# or
npm run dev

# App will be available at http://localhost:3000
```

### 3. Build for Production

```bash
pnpm generate
# or
npm run generate

# Output will be in the dist/ folder
```

---

## Deployment

This project is automatically deployed to GitHub Pages via [GitHub Actions](.github/workflows/deploy.yml).

- **Preview:** [https://ludoo0d0a.github.io/captain/](https://ludoo0d0a.github.io/captain/)
- To deploy manually, push to the `main` branch.

---

## Customization & Extensibility

- Add new connectors in the `connectors/` folder and register their config in the Pinia store.
- UI and state are fully type-safe and modular.
- All settings and management screens are easily extensible.

---

## License

MIT
