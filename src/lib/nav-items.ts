import {
  LayoutDashboard,
  School,
  ClipboardCheck,
  FileText,
  BookUser,
  Library,
  Calendar,
  Archive,
  Bus,
  Users,
  Users2,
  Contact,
  CreditCard,
  Briefcase,
  TrendingDown,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  href?: string;
  label: string;
  icon: LucideIcon;
  subItems?: NavItem[];
};

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  {
    label: 'Users',
    icon: Users,
    subItems: [
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
    ],
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
    label: 'Accounts',
    icon: BookUser,
    subItems: [
      { href: '/fees', label: 'Fee Collection', icon: CreditCard },
      { href: '/payment', label: 'Payments', icon: CreditCard },
      { href: '/expenses', label: 'Expenses', icon: TrendingDown },
    ],
  },
  { href: '/library', label: 'Library', icon: Library },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/assets', label: 'Assets', icon: Archive },
  { href: '/transport', label: 'Transport', icon: Bus },
];
