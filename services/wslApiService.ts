import { FileSystemNode } from '../types';

const API_BASE_URL = 'http://localhost:3001/api/fs';

const fetchNode = async (path: string): Promise<FileSystemNode | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/node?path=${encodeURIComponent(path)}`);
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }
        const data: FileSystemNode = await response.json();
        return data;
    } catch (error) {
        console.error(`Failed to fetch node for path "${path}":`, error);
        // Re-throw a more user-friendly error to be caught by the component
        throw new Error("Could not connect to the WSL bridge server. Please ensure it's running on http://localhost:3001.");
    }
};

export const getFileSystemTree = async (): Promise<FileSystemNode> => {
    const rootNode = await fetchNode('/');
    if (!rootNode) {
        throw new Error("Could not fetch the root ('/') of the filesystem from the server.");
    }
    return rootNode;
};

export const getNodeByPath = async(path: string): Promise<FileSystemNode | null> => {
    return await fetchNode(path);
};


/*
// --- MOCK DATA & BACKEND API GUIDE ---
//
// To connect this UI to your real WSL filesystem, you need to create a simple
// local backend server (e.g., using Node.js and Express). This server will
// act as a bridge between the browser and your local files.
//
// The server should expose an endpoint like:
// GET /api/fs/node?path=<url_encoded_path>
//
// - When a request is received, it should read the directory or file at the
//   corresponding path inside your WSL distribution (e.g., '\\wsl$\Ubuntu\home\user...').
// - It should then return a JSON response in the `FileSystemNode` format, as
//   defined in `types.ts`.
// - For directories, the `children` array should contain a list of files and
//   subdirectories, but *without* their own `children` or `content` for performance.
//   Those can be fetched on demand when the user navigates into them.
// - For files, it should include the file's `content` as a string.
//
// Example `FileSystemNode` for a directory:
//
// const directoryNode: FileSystemNode = {
//   name: 'projects',
//   path: '/home/ubuntu/projects',
//   type: 'directory',
//   children: [
//     { name: 'website', path: '/home/ubuntu/projects/website', type: 'directory' },
//     { name: 'README.md', path: '/home/ubuntu/projects/README.md', type: 'file' },
//   ],
// };
//
// Example `FileSystemNode` for a file:
//
// const fileNode: FileSystemNode = {
//   name: 'README.md',
//   path: '/home/ubuntu/projects/README.md',
//   type: 'file',
//   content: '# My Projects',
// };
*/
