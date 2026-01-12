

import { TableData } from './types/chat';

export interface Project {
  id: string;
  name: string;
  description?: string;
  dueDate: string;
  status: 'In Progress' | 'Complete' | 'Rejected' | 'Pending' | 'Approved';
  totalTasks: number;
  completedTasks: number;
  members: string[]; // Array of avatar URLs
  iconColor: string;
  icon: any; // Lucide Icon component
  image?: string; // URL for project cover image
  location?: string; // For the detailed card view
  tags?: string[]; // For the folder card view
  stats?: {
    distance?: string;
    elevation?: string;
    duration?: string;
  };
}

export interface Notification {
  id: string;
  user: string;
  avatar: string;
  action: string;
  time: string;
  isUnread?: boolean;
}

export interface Activity {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target?: string;
  time: string;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  action?: string;
}

// --- Notebook Types ---

export type CellType = 'code' | 'markdown';
export type CellStatus = 'idle' | 'running' | 'success' | 'error';
export type Environment = 'python' | 'r' | 'sql' | 'python-lite';
export type Compute = 'cpu-std' | 'cpu-pro' | 'gpu-t4' | 'tpu-v5';

export interface NotebookCell {
  id: string;
  type: CellType;
  content: string;
  status: CellStatus;
  output?: {
    type: 'text' | 'table' | 'chart' | 'image' | 'error';
    data: string | TableData; // For text/error/image (url), or TableData
    visualHint?: 'bar' | 'line' | 'pie' | 'scatter' | 'area';
  };
  lastRun?: Date;
}

export interface Notebook {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  gradient: string;
  icon?: any;
  // Runtime Config
  environment?: Environment;
  compute?: Compute;
  cells?: NotebookCell[];
}