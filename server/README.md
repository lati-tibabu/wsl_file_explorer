# WSL Bridge Server

This is the backend server for the WSL File Explorer application. It provides a REST API that allows the React frontend to access the WSL filesystem.

## Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:3001`.

## API Endpoints

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "WSL Bridge Server is running"
}
```

### GET /api/fs/node?path=<encoded_path>
Get filesystem information for a specific path.

**Parameters:**
- `path`: URL-encoded path to the file or directory (e.g., `/mnt/c/Users` or `/home/user`)

**Response:**
```json
{
  "name": "folder",
  "path": "/mnt/c/Users/folder",
  "type": "directory",
  "children": [
    {
      "name": "file.txt",
      "path": "/mnt/c/Users/folder/file.txt",
      "type": "file"
    }
  ]
}
```

For files, the response includes a `content` field with the file contents (limited to 1MB).

## Path Mapping

The server automatically converts between WSL paths and Windows paths:
- `/mnt/c/` → `C:\`
- `/mnt/d/` → `D:\`
- etc.

## Running Both Frontend and Backend

1. Start the backend server (as described above)
2. In another terminal, start the frontend:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173` (or similar, check the console output).