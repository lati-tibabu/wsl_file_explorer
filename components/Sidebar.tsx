
import React, { useState } from 'react';
import { FileSystemNode, NodeType } from '../types';
import { ICONS } from '../constants';

interface DirectoryTreeItemProps {
  node: FileSystemNode;
  onNodeSelect: (node: FileSystemNode) => void;
  activePath: string;
  depth: number;
}

const DirectoryTreeItem: React.FC<DirectoryTreeItemProps> = ({ node, onNodeSelect, activePath, depth }) => {
  const [isOpen, setIsOpen] = useState(node.path === '/' || activePath.startsWith(node.path + '/'));

  const isDirectory = node.type === NodeType.DIRECTORY;
  const isActive = activePath === node.path;
  const hasChildren = isDirectory && node.children && node.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(isDirectory) {
        setIsOpen(!isOpen);
    }
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeSelect(node);
    if(isDirectory && !isOpen) {
        setIsOpen(true);
    }
  }

  return (
    <div>
      <div
        onClick={handleSelect}
        className={`flex items-center p-1 rounded cursor-pointer hover:bg-gray-700 ${isActive ? 'bg-blue-600/50' : ''}`}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
      >
        {isDirectory && hasChildren && (
          <span onClick={handleToggle} className="mr-1 hover:bg-gray-600 rounded p-0.5">
            {isOpen ? ICONS.chevronDown : ICONS.chevronRight}
          </span>
        )}
        {!isDirectory && <div className="w-4 mr-1"></div>}
        {isDirectory ? ICONS.folder : ICONS.file}
        <span className="truncate flex-1 text-sm">{node.name}</span>
      </div>
      {isOpen && hasChildren && node.children && (
        <div>
          {node.children.map(child => (
            <DirectoryTreeItem
              key={child.path}
              node={child}
              onNodeSelect={onNodeSelect}
              activePath={activePath}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  root: FileSystemNode;
  onNodeSelect: (node: FileSystemNode) => void;
  activePath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ root, onNodeSelect, activePath }) => {
  return (
    <div className="p-2">
      <DirectoryTreeItem node={root} onNodeSelect={onNodeSelect} activePath={activePath} depth={0} />
    </div>
  );
};

export default Sidebar;
