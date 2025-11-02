import React, { useState, useEffect, useCallback } from 'react';
import { FileSystemNode, NodeType } from '../types';
import { getFileSystemTree, getNodeByPath } from '../services/wslApiService';
import Sidebar from './Sidebar';
import FileView from './FileView';
import FileContent from './FileContent';

const FileExplorer: React.FC = () => {
  const [fileSystem, setFileSystem] = useState<FileSystemNode | null>(null);
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [currentNode, setCurrentNode] = useState<FileSystemNode | null>(null);
  const [activeFile, setActiveFile] = useState<FileSystemNode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fsTree = await getFileSystemTree();
      setFileSystem(fsTree);
      setCurrentNode(fsTree);
      setCurrentPath(fsTree.path);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const navigateToPath = useCallback(async (path: string) => {
    if (!fileSystem) return;
    setIsLoading(true);
    try {
      const node = await getNodeByPath(path);
      if (node && node.type === NodeType.DIRECTORY) {
        setCurrentPath(path);
        setCurrentNode(node);
        setActiveFile(null);
      }
    } catch (e: any) {
        setError(e.message || 'Failed to navigate to path.');
    } finally {
        setIsLoading(false);
    }
  }, [fileSystem]);

  const handleNodeSelect = (node: FileSystemNode) => {
    if (node.type === NodeType.DIRECTORY) {
      navigateToPath(node.path);
    } else {
      // Fetch the full file content when selected from sidebar
      const fetchFileContent = async () => {
        const fullFileNode = await getNodeByPath(node.path);
        if (fullFileNode) {
             setActiveFile(fullFileNode);
        }
      }
      fetchFileContent();
     
      const parentPath = node.path.substring(0, node.path.lastIndexOf('/')) || '/';
      if (currentPath !== parentPath) {
        navigateToPath(parentPath);
      }
    }
  };

  const handleOpenFile = (file: FileSystemNode) => {
    if (file.type === NodeType.FILE) {
       const fetchFileContent = async () => {
        setIsLoading(true);
        const fullFileNode = await getNodeByPath(file.path);
        if (fullFileNode) {
             setActiveFile(fullFileNode);
        }
        setIsLoading(false);
      }
      fetchFileContent();
    } else {
        navigateToPath(file.path);
    }
  };

  if (isLoading && !fileSystem && !error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4">Connecting to WSL Bridge...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center bg-gray-800 p-8 rounded-lg shadow-2xl max-w-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-red-400">Connection Failed</h2>
          <p className="mt-2 text-gray-300">This application requires a local server to access your WSL file system.</p>
          <div className="mt-4 p-3 bg-gray-900 rounded font-mono text-sm text-left">
            <p className="text-gray-400">Error Details:</p>
            <p className="text-red-400">{error}</p>
          </div>
           <p className="mt-4 text-sm text-gray-400">
            Please start your WSL bridge server, ensure it's running on <code className="bg-gray-700 p-1 rounded">http://localhost:3001</code>, and then try again.
          </p>
          <button 
            onClick={fetchInitialData} 
            className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!fileSystem) {
    return <div className="p-4 flex items-center justify-center h-full">An unexpected error occurred. Filesystem data is unavailable.</div>;
  }

  return (
    <div className="flex h-full">
      <aside className="w-1/4 min-w-[250px] max-w-[400px] bg-gray-800/50 border-r border-gray-700 overflow-y-auto">
        <Sidebar root={fileSystem} onNodeSelect={handleNodeSelect} activePath={currentPath} />
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-2 border-b border-gray-700 bg-gray-800">
          <p className="text-sm truncate">Current Path: <span className="font-mono text-green-400">{currentPath}</span></p>
        </div>
        <div className="flex-1 flex overflow-hidden">
            <div className={`transition-all duration-300 ease-in-out overflow-y-auto border-r border-gray-700 ${activeFile ? 'w-1/2' : 'w-full'}`}>
                 <FileView
                    nodes={currentNode?.children || []}
                    onOpenFile={handleOpenFile}
                    isLoading={isLoading}
                />
            </div>
            {activeFile && (
                <div className="w-1/2 overflow-y-auto">
                     <FileContent file={activeFile} />
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;