
import { Project, Notification, Activity, Contact } from './types';
import { 
  Layout, Globe, Coffee, PenTool, Smartphone, 
  Briefcase, CreditCard, ShoppingCart, Music, PieChart, BarChart3, LineChart, Sparkles, FileText
} from 'lucide-react';

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Personal Email Assistant',
    description: 'AI helper for reading, organizing, and responding.',
    dueDate: 'Nov 10, 2022',
    status: 'In Progress',
    totalTasks: 2386,
    completedTasks: 36,
    members: ['https://picsum.photos/30/30?random=1', 'https://picsum.photos/30/30?random=12', 'https://picsum.photos/30/30?random=13'],
    iconColor: 'text-blue-500 bg-blue-100',
    icon: Layout,
    tags: ['Personal', 'Marketing']
  },
  {
    id: '2',
    name: 'Coffee Shop App',
    description: 'Mobile app design for local coffee chain.',
    dueDate: 'Nov 10, 2022',
    status: 'Complete',
    totalTasks: 1042,
    completedTasks: 56,
    members: ['https://picsum.photos/30/30?random=2'],
    iconColor: 'text-purple-500 bg-purple-100',
    icon: Coffee,
    tags: ['Design', 'Mobile']
  },
  {
    id: '3',
    name: 'Bottle Graphics',
    description: '3D rendering and label design for water bottle.',
    dueDate: 'Nov 10, 2022',
    status: 'Rejected',
    totalTasks: 432,
    completedTasks: 16,
    members: ['https://picsum.photos/30/30?random=3'],
    iconColor: 'text-blue-600 bg-blue-100',
    icon: Globe,
    tags: ['3D', 'Branding']
  },
  {
    id: '4',
    name: 'Company Rebrand',
    description: 'New logo, color palette and brand guidelines.',
    dueDate: 'Feb 21, 2022',
    status: 'Complete',
    totalTasks: 850,
    completedTasks: 20,
    members: ['https://picsum.photos/30/30?random=4'],
    iconColor: 'text-orange-500 bg-orange-100',
    icon: PenTool,
    tags: ['Branding', 'Identity']
  },
  {
    id: '5',
    name: 'SaaS Landing Page',
    description: 'High conversion landing page for new SaaS tool.',
    dueDate: 'Jun 20, 2022',
    status: 'Pending',
    totalTasks: 120,
    completedTasks: 5,
    members: ['https://picsum.photos/30/30?random=5', 'https://picsum.photos/30/30?random=6', 'https://picsum.photos/30/30?random=7'],
    iconColor: 'text-black bg-gray-200',
    icon: Smartphone,
    tags: ['Web', 'Growth']
  },
  {
    id: '6',
    name: 'E-commerce Redesign',
    description: 'Full overhaul of product page UX/UI.',
    dueDate: 'Jun 20, 2022',
    status: 'In Progress',
    totalTasks: 2500,
    completedTasks: 12,
    members: ['https://picsum.photos/30/30?random=8'],
    iconColor: 'text-pink-500 bg-pink-100',
    icon: ShoppingCart,
    tags: ['UX', 'E-commerce']
  },
  {
    id: '7',
    name: 'Internal Dashboard',
    description: 'Admin panel for managing user data.',
    dueDate: 'Jun 24, 2022',
    status: 'Approved',
    totalTasks: 600,
    completedTasks: 8,
    members: ['https://picsum.photos/30/30?random=9'],
    iconColor: 'text-black bg-gray-200',
    icon: Coffee,
    tags: ['Internal', 'Admin']
  },
  {
    id: '8',
    name: 'Travel App',
    description: 'Flight booking flow optimization.',
    dueDate: 'Oct 25, 2022',
    status: 'Approved',
    totalTasks: 340,
    completedTasks: 17,
    members: ['https://picsum.photos/30/30?random=10'],
    iconColor: 'text-yellow-500 bg-yellow-100',
    icon: Briefcase,
    tags: ['Mobile', 'Travel']
  },
  {
    id: '9',
    name: 'Fintech Ledger',
    description: 'Secure transaction history view.',
    dueDate: 'Nov 10, 2022',
    status: 'Pending',
    totalTasks: 1500,
    completedTasks: 2,
    members: ['https://picsum.photos/30/30?random=11'],
    iconColor: 'text-green-500 bg-green-100',
    icon: CreditCard,
    tags: ['Finance', 'Security']
  },
];

export const PUBLISHED_NOTEBOOKS = [
  { 
    id: 'p1', 
    title: 'Q4 Ad Spend Audit', 
    description: 'A comprehensive audit of Meta and Google Ads performance across primary conversion funnels.',
    author: 'Sarah Connor', 
    date: 'Jan 15, 2024',
    category: 'Advertising',
    gradient: 'bg-gradient-to-br from-[#f472b6] to-[#db2777]',
    icon: PieChart,
    likes: 124,
    reads: '1.2k'
  },
  { 
    id: 'p2', 
    title: 'Influencer Campaign ROI', 
    description: 'Measuring the direct and assisted revenue impact of our Q3 creator partnerships.',
    author: 'Elias K. Wren', 
    date: 'Dec 10, 2023',
    category: 'Social',
    gradient: 'bg-gradient-to-br from-[#60a5fa] to-[#2563eb]',
    icon: BarChart3,
    likes: 89,
    reads: '2.4k'
  },
  { 
    id: 'p3', 
    title: 'Email Segment Study', 
    description: 'Behavioral analysis of automated flows vs. weekly blasts for retention optimization.',
    author: 'Frank Herbert', 
    date: 'Nov 05, 2023',
    category: 'CRM',
    gradient: 'bg-gradient-to-br from-[#fbbf24] to-[#d97706]',
    icon: LineChart,
    likes: 245,
    reads: '3.1k'
  },
  { 
    id: 'p4', 
    title: 'SEO Keyword Gap 2024', 
    description: 'Identifying high-volume search opportunities our top 3 competitors are currently ignoring.',
    author: 'Marketing Ops', 
    date: 'Feb 12, 2024',
    category: 'Search',
    gradient: 'bg-gradient-to-br from-[#818cf8] to-[#4f46e5]',
    icon: Sparkles,
    likes: 512,
    reads: '12k'
  },
  { 
    id: 'p5', 
    title: 'Brand Sentiment Pulse', 
    description: 'Analyzing 50,000+ social mentions to gauge the impact of the recent product rebrand.',
    author: 'Product Team', 
    date: 'Feb 20, 2024',
    category: 'Research',
    gradient: 'bg-gradient-to-br from-[#34d399] to-[#059669]',
    icon: FileText,
    likes: 67,
    reads: '890'
  },
  { 
    id: 'p6', 
    title: 'Retargeting Leakage', 
    description: 'Technical investigation into drop-off rates for dynamic product ads (DPA) on mobile.',
    author: 'Growth Team', 
    date: 'Mar 01, 2024',
    category: 'Growth',
    gradient: 'bg-gradient-to-br from-[#f87171] to-[#dc2626]',
    icon: BarChart3,
    likes: 156,
    reads: '1.5k'
  },
];

export const NOTIFICATIONS: Notification[] = [
  { id: '1', user: 'Bug Report', avatar: 'https://picsum.photos/40/40?random=20', action: 'You have a bug that needs...', time: 'Just now' },
  { id: '2', user: 'New User', avatar: 'https://picsum.photos/40/40?random=21', action: 'New user registered', time: '59 minutes ago' },
  { id: '3', user: 'Bug Report', avatar: 'https://picsum.photos/40/40?random=20', action: 'You have a bug that needs...', time: '12 hours ago' },
  { id: '4', user: 'Andi Lane', avatar: 'https://picsum.photos/40/40?random=23', action: 'subscribed to you', time: 'Today, 11:59 AM' },
];

export const ACTIVITIES: Activity[] = [
  { id: '1', user: 'Bug Report', avatar: 'https://picsum.photos/40/40?random=20', action: 'You have a bug that needs...', time: 'Just now' },
  { id: '2', user: 'Release', avatar: 'https://picsum.photos/40/40?random=25', action: 'Released a new version', time: '59 minutes ago' },
  { id: '3', user: 'Bug', avatar: 'https://picsum.photos/40/40?random=26', action: 'Submitted a bug', time: '12 hours ago' },
  { id: '4', user: 'Modified', avatar: 'https://picsum.photos/40/40?random=27', action: 'Modified A data in Page X', time: 'Today, 11:59 AM' },
  { id: '5', user: 'Deleted', avatar: 'https://picsum.photos/40/40?random=28', action: 'Deleted a page in Project X', time: 'Feb 2, 2023' },
];

export const CONTACTS: Contact[] = [
  { id: '1', name: 'Natali Craig', avatar: 'https://picsum.photos/40/40?random=30' },
  { id: '2', name: 'Drew Cano', avatar: 'https://picsum.photos/40/40?random=31' },
  { id: '3', name: 'Orlando Diggs', avatar: 'https://picsum.photos/40/40?random=32' },
  { id: '4', name: 'Andi Lane', avatar: 'https://picsum.photos/40/40?random=33' },
  { id: '5', name: 'Kate Morrison', avatar: 'https://picsum.photos/40/40?random=34' },
  { id: '6', name: 'Koray Okumus', avatar: 'https://picsum.photos/40/40?random=35' },
];
