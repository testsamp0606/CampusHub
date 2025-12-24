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
  Users2,
  Contact,
  CreditCard,
  Briefcase,
} from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  {
    href: '/students',
    label: 'Students',
    icon: Users2,
  },
  {
    href: '/teachers',
    label: 'Teachers',
    icon: Briefcase,
  },
  {
    href: '/parents',
    label: 'Parents',
    icon: Contact,
  },
  {
    href: '/school',
    label: 'School',
    icon: School,
  },
  {
    href: '/attendance',
    label: 'Attendance',
    icon: ClipboardCheck,
  },
  {
    href: '/examinations',
    label: 'Examinations',
    icon: FileText,
  },
  {
    href: '/fees',
    label: 'Student Fee',
    icon: CircleDollarSign,
  },
  { href: '/payment', label: 'Payment', icon: CreditCard },
  { href: '/accounts', label: 'Accounts', icon: BookUser },
  { href: '/expenses', label: 'Expenses', icon: TrendingDown },
  { href: '/library', label: 'Library', icon: Library },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/assets', label: 'Assets', icon: Archive },
  { href: '/transport', label: 'Transport', icon: Bus },
];
