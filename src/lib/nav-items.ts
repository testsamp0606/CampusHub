
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
  MessageSquare,
  Building,
  Video,
  File,
  ClipboardList,
  AreaChart,
  Notebook,
  GraduationCap as ResultsIcon,
  BookA,
  DollarSign,
  Wallet,
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
    label: 'Academics',
    icon: School,
    roles: ['SuperAdmin', 'Admin'],
    subItems: [
      { href: '/classes', label: 'Classes', icon: BookCopy },
      { href: '/subjects', label: 'Subjects', icon: Book },
      { href: '/departments', label: 'Departments', icon: Building },
      { href: '/calendar', label: 'Calendar', icon: Calendar },
    ],
  },
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
    label: 'Examinations',
    icon: BookA,
    roles: ['SuperAdmin', 'Admin'],
    subItems: [
      { href: '/examinations', label: 'Exam Schedule', icon: FileText },
      { href: '/assessments', label: 'Assessments', icon: Notebook },
      { href: '/results', label: 'Results', icon: ResultsIcon },
      { href: '/attendance', label: 'Attendance', icon: ClipboardCheck },
    ],
  },
  {
    label: 'Finance',
    icon: DollarSign,
    roles: ['SuperAdmin', 'Admin', 'Accountant'],
    subItems: [
      { href: '/fees', label: 'Fee Collection', icon: CreditCard },
      { href: '/expenses', label: 'Expenses', icon: TrendingDown },
      { href: '/accounts', label: 'Ledger', icon: BookUser },
    ],
  },
  {
    label: 'E-Learning',
    icon: Video,
    roles: ['SuperAdmin', 'Admin'],
    subItems: [
      { href: '/lms/courses', label: 'Courses', icon: BookCopy },
      { href: '/lms/content', label: 'Content', icon: File },
      { href: '/lms/assignments', label: 'Assignments', icon: ClipboardList },
    ],
  },
  {
    label: 'Facilities',
    icon: Building,
    roles: ['SuperAdmin', 'Admin'],
    subItems: [
      { href: '/library', label: 'Library', icon: Library },
      { href: '/transport', label: 'Transport', icon: Bus },
      { href: '/assets', label: 'Assets', icon: Archive },
    ],
  },
  {
    label: 'Communication',
    icon: Megaphone,
    roles: ['SuperAdmin', 'Admin'],
    subItems: [
      { href: '/messages', label: 'Messages', icon: MessageSquare },
      { href: '/announcements', label: 'Announcements', icon: Megaphone },
    ],
  },
  {
    label: 'Admin',
    icon: ShieldCheck,
    roles: ['SuperAdmin'],
    subItems: [
      { href: '/permissions', label: 'Permissions', icon: ShieldCheck },
      { href: '/school', label: 'School Settings', icon: Settings },
    ],
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
