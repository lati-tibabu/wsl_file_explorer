
import React from 'react';
import { FileSystemNode } from '../types';

interface FileContentProps {
  file: FileSystemNode | null;
}

const FileContent: React.FC<FileContentProps> = ({ file }) => {
  if (!file) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Select a file to view its content</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="p-2 border-b border-gray-700 bg-gray-800/70">
        <p className="text-sm font-mono text-yellow-400 truncate">{file.path}</p>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <pre className="text-sm text-gray-300 whitespace-pre-wrap">
          <code>
            {file.content || '[File is empty]'}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default FileContent;
