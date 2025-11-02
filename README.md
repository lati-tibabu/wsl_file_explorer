<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# WSL File Explorer

A React-based file explorer that allows you to browse your WSL (Windows Subsystem for Linux) filesystem through a web interface.

## Features

- Browse WSL directories and files
- View file contents directly in the browser
- Clean, modern UI built with React and TypeScript

## Prerequisites

- Node.js (v16 or higher)
- WSL installed and configured on Windows
- A WSL distribution (Ubuntu, etc.)

## Setup and Running

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Start the WSL Bridge Server

The frontend requires a backend server to access the WSL filesystem.

```bash
# Navigate to the server directory
cd server

# Install server dependencies
npm install

# Start the server
npm start
```

The server will run on `http://localhost:3001`.

### 3. Start the Frontend

In a separate terminal:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (check the console for the exact URL).

## Project Structure

```
wsl-file-explorer/
├── server/                 # Backend bridge server
│   ├── server.js          # Express server
│   ├── package.json       # Server dependencies
│   └── README.md          # Server documentation
├── src/
│   ├── components/        # React components
│   ├── services/          # API service layer
│   └── types.ts           # TypeScript type definitions
├── package.json           # Frontend dependencies
└── vite.config.ts         # Vite configuration
```

## API

The bridge server provides a REST API for filesystem access:

- `GET /api/fs/node?path=<encoded_path>` - Get directory/file information
- `GET /api/health` - Health check

## Development

For development with auto-restart of the server:

```bash
cd server
npm run dev
```

## Troubleshooting

- **Server won't start**: Make sure port 3001 is available
- **Cannot access WSL files**: Ensure WSL is properly installed and you have permission to access the files
- **Connection refused**: Make sure the bridge server is running before starting the frontend
