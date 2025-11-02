
export enum NodeType {
  FILE = 'file',
  DIRECTORY = 'directory',
}

export interface FileSystemNode {
  name: string;
  path: string;
  type: NodeType;
  children?: FileSystemNode[];
  content?: string;
}
