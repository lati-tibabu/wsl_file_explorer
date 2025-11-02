
import React from 'react';
import { FileSystemNode, NodeType } from '../types';
import { ICONS } from '../constants';

interface FileViewProps {
  nodes: FileSystemNode[];
  onOpenFile: (node: FileSystemNode) => void;
  isLoading: boolean;
}

const FileView: React.FC<FileViewProps> = ({ nodes, onOpenFile, isLoading }) => {
    
  if (isLoading) {
    return <div className="p-4 text-gray-400">Loading directory contents...</div>;
  }
    
  if (nodes.length === 0) {
    return <div className="p-4 text-gray-400">This directory is empty.</div>;
  }

  return (
    <div className="p-2">
      <ul>
        {nodes.map(node => (
          <li
            key={node.path}
            onDoubleClick={() => onOpenFile(node)}
            className="flex items-center p-2 rounded cursor-pointer hover:bg-gray-700/50 transition-colors duration-150"
          >
            {node.type === NodeType.DIRECTORY ? ICONS.folder : ICONS.file}
            <span className="text-sm">{node.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileView;
