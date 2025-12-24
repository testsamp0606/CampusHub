import {
  LayoutDashboard,
  School,
  ClipboardCheck,
  FileText,
  CircleDollarSign,
  BookUser,
  TrendingDown,
  Library,
  Calendar,
  Archive,
  Bus,
} from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/school', label: 'Manage School', icon: School },
  { href: '/attendance', label: 'Manage Attendance', icon: ClipboardCheck },
  { href: '/examinations', label: 'Manage Examinations', icon: FileText },
  { href: '/fees', label: 'Student Fee', icon: CircleDollarSign },
  { href: '/accounts', label: 'Manage Accounts', icon: BookUser },
  { href: '/expenses', label: 'Expenses', icon: TrendingDown },
  { href: '/library', label: 'Manage Library', icon: Library },
  { href: '/calendar', label: 'Manage Calendar', icon: Calendar },
  { href: '/assets', label: 'Manage Assets', icon: Archive },
  { href: '/transport', label: 'Manage Transport', icon: Bus },
];
