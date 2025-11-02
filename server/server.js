const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for the React frontend
app.use(cors());
app.use(express.json());

// FileSystemNode type definition (for reference)
// interface FileSystemNode {
//   name: string;
//   path: string;
//   type: 'file' | 'directory';
//   children?: FileSystemNode[];
//   content?: string;
// }

// Convert Windows path to WSL path
function windowsToWslPath(windowsPath) {
  // Convert C:\ to /mnt/c/
  if (windowsPath.match(/^[A-Z]:/i)) {
    const drive = windowsPath.charAt(0).toLowerCase();
    const pathWithoutDrive = windowsPath.substring(2).replace(/\\/g, '/');
    return `/mnt/${drive}${pathWithoutDrive}`;
  }
  // Handle WSL paths (\\wsl$\Ubuntu\...)
  if (windowsPath.startsWith('\\\\wsl$\\')) {
    const wslPath = windowsPath.replace(/\\/g, '/').replace(/^\/wsl\$\//, '/');
    return wslPath;
  }
  return windowsPath.replace(/\\/g, '/');
}

// Get filesystem node for a given path
function getFileSystemNode(fsPath) {
  try {
    const stats = fs.statSync(fsPath);

    const node = {
      name: path.basename(fsPath),
      path: windowsToWslPath(fsPath),
      type: stats.isDirectory() ? 'directory' : 'file'
    };

    if (stats.isDirectory()) {
      try {
        const children = fs.readdirSync(fsPath);
        node.children = children.map(child => {
          const childPath = path.join(fsPath, child);
          try {
            const childStats = fs.statSync(childPath);
            return {
              name: child,
              path: windowsToWslPath(childPath),
              type: childStats.isDirectory() ? 'directory' : 'file'
            };
          } catch (error) {
            // If we can't stat a child, skip it
            console.warn(`Could not stat ${childPath}:`, error.message);
            return null;
          }
        }).filter(child => child !== null);
      } catch (error) {
        console.warn(`Could not read directory ${fsPath}:`, error.message);
        node.children = [];
      }
    } else {
      // For files, try to read content (limit to reasonable size)
      try {
        const fileSize = stats.size;
        if (fileSize < 1024 * 1024) { // 1MB limit
          node.content = fs.readFileSync(fsPath, 'utf8');
        } else {
          node.content = `[File too large to display (${fileSize} bytes)]`;
        }
      } catch (error) {
        console.warn(`Could not read file ${fsPath}:`, error.message);
        node.content = '[Could not read file content]';
      }
    }

    return node;
  } catch (error) {
    console.error(`Error accessing path ${fsPath}:`, error.message);
    return null;
  }
}

// API endpoint to get filesystem node
app.get('/api/fs/node', (req, res) => {
  const encodedPath = req.query.path;
  if (!encodedPath) {
    return res.status(400).json({ error: 'Path parameter is required' });
  }

  const fsPath = decodeURIComponent(encodedPath);

  // Convert WSL path back to Windows path for fs operations
  let windowsPath;
  if (fsPath.startsWith('/mnt/')) {
    // Convert /mnt/c/path to C:\path
    const drive = fsPath.charAt(5);
    const pathWithoutMount = fsPath.substring(7);
    windowsPath = `${drive.toUpperCase()}:\\${pathWithoutMount.replace(/\//g, '\\')}`;
  } else if (fsPath === '/' || fsPath === '') {
    // Default to WSL root for Ubuntu
    windowsPath = '\\\\wsl$\\Ubuntu';
  } else if (fsPath.startsWith('/')) {
    // Other WSL paths - assume Ubuntu for now
    windowsPath = `\\\\wsl$\\Ubuntu${fsPath.replace(/\//g, '\\')}`;
  } else {
    // Assume it's already a Windows path or relative path
    windowsPath = fsPath;
  }

  console.log(`Requesting path: ${fsPath} -> ${windowsPath}`);

  const node = getFileSystemNode(windowsPath);

  if (node) {
    res.json(node);
  } else {
    res.status(404).json({ error: 'Path not found' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'WSL Bridge Server is running' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`WSL Bridge Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`File system API: http://localhost:${PORT}/api/fs/node?path=/`);
});