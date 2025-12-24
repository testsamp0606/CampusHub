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
  Megaphone,
  ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  href?: string;
  label: string;
  icon: LucideIcon;
  subItems?: NavItem[];
  roles?: string[];
};

export const ALL_NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  {
    label: 'Users',
    icon: Users,
    roles: ['SuperAdmin', 'Admin'],
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
    roles: ['SuperAdmin', 'Admin'],
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
    roles: ['SuperAdmin', 'Admin', 'Accountant'],
    subItems: [
      { href: '/fees', label: 'Fee Collection', icon: CreditCard },
      { href: '/payment', label: 'Payments', icon: CreditCard },
      { href: '/expenses', label: 'Expenses', icon: TrendingDown },
      { href: '/accounts', label: 'Ledger', icon: BookUser },
    ],
  },
  {
    href: '/library',
    label: 'Library',
    icon: Library,
    roles: ['SuperAdmin', 'Admin', 'Librarian'],
  },
  {
    href: '/announcements',
    label: 'Announcements',
    icon: Megaphone,
    roles: ['SuperAdmin', 'Admin'],
  },
  {
    href: '/assets',
    label: 'Assets',
    icon: Archive,
    roles: ['SuperAdmin', 'Admin'],
  },
  {
    href: '/transport',
    label: 'Transport',
    icon: Bus,
    roles: ['SuperAdmin', 'Admin', 'Transport Manager'],
  },
   {
    href: '/permissions',
    label: 'Permissions',
    icon: ShieldCheck,
    roles: ['SuperAdmin'],
  },
];

const filterNavItemsByRole = (items: NavItem[], role: string): NavItem[] => {
  return items
    .map((item) => {
      // If the item has roles defined and the user's role is not included, filter it out.
      if (item.roles && !item.roles.includes(role)) {
        return null;
      }

      // If the item has sub-items, filter them recursively.
      if (item.subItems) {
        const filteredSubItems = filterNavItemsByRole(item.subItems, role);
        // If all sub-items are filtered out, don't show the parent.
        if (filteredSubItems.length === 0) {
          return null;
        }
        return { ...item, subItems: filteredSubItems };
      }

      return item;
    })
    .filter((item): item is NavItem => item !== null);
};

// Simulate getting the current user's role
const CURRENT_USER_ROLE = 'SuperAdmin'; // Change this to 'Admin', 'Accountant', etc. to test
export const NAV_ITEMS = filterNavItemsByRole(
  ALL_NAV_ITEMS,
  CURRENT_USER_ROLE
);
