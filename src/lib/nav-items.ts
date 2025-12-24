'use client';

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
  BookCopy,
  Book,
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
    label: 'Academics',
    icon: School,
    subItems: [
      { href: '/classes', label: 'Classes', icon: BookCopy },
      { href: '/subjects', label: 'Subjects', icon: Book },
      {
        href: '/examinations',
        label: 'Examinations',
        icon: FileText,
      },
      {
        href: '/attendance',
        label: 'Attendance',
        icon: ClipboardCheck,
      },
      { href: '/calendar', label: 'Calendar', icon: Calendar },
    ],
  },
  {
    label: 'Accounts',
    icon: BookUser,
    subItems: [
      { href: '/fees', label: 'Fee Collection', icon: CreditCard },
      { href: '/payment', label: 'Payments', icon: CreditCard },
      { href: '/expenses', label: 'Expenses', icon: TrendingDown },
      { href: '/accounts', label: 'Ledger', icon: BookUser },
    ],
  },
  { href: '/library', label: 'Library', icon: Library },
  { href: '/assets', label: 'Assets', icon: Archive },
  { href: '/transport', label: 'Transport', icon: Bus },
];
