# Development Setup

<!--Prerequisites Installation-->

## Prerequisites Installation

1. Install Node.js and npm (skip if already installed):

- Windows/macOS: Download from [official Node.js website](https://nodejs.org/)
- Linux (Ubuntu/Debian):
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```
- Verify installation:
  ```bash
  node -v
  npm -v
  ```

2. Project Installation
   ```bash
   npm install
   ```

<!--Running the Application-->

## Running the Application

1. Configure the application by updating `api.js` with:

```
baseURL: "https://127.0.0.1:8000",
```

2. Start development server

```bash
npm run dev
```

- Access at: https://127.0.0.1:5173/

3. Backend Integration
   The frontend requires the [RavensPedia.Backend](https://github.com/Zattox/RavensPedia) to be running.
   Follow the steps from the readme file on the backend implementation page.
