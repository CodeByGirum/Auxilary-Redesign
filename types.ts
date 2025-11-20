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
}