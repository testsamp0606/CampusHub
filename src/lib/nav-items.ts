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
} from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  {
    href: '/students',
    label: 'Students',
    icon: Users2,
    subItems: [
      { href: '/students/add', label: 'Add' },
      { href: '/students/view', label: 'View' },
      { href: '/students/edit', label: 'Edit' },
    ],
  },
  {
    href: '/parents',
    label: 'Parents',
    icon: Contact,
    subItems: [
      { href: '/parents/add', label: 'Add' },
      { href: '/parents/view', label: 'View' },
      { href: '/parents/edit', label: 'Edit' },
    ],
  },
  {
    href: '/school',
    label: 'School',
    icon: School,
    subItems: [
      { href: '/school/add', label: 'Add' },
      { href: '/school/view', label: 'View' },
      { href: '/school/edit', label: 'Edit' },
    ],
  },
  {
    href: '/attendance',
    label: 'Attendance',
    icon: ClipboardCheck,
    subItems: [
      { href: '/attendance/add', label: 'Add' },
      { href: '/attendance/view', label: 'View' },
      { href: '/attendance/edit', label: 'Edit' },
    ],
  },
  {
    href: '/examinations',
    label: 'Examinations',
    icon: FileText,
    subItems: [
      { href: '/examinations/add', label: 'Add' },
      { href: '/examinations/view', label: 'View' },
      { href: '/examinations/edit', label: 'Edit' },
    ],
  },
  {
    href: '/fees',
    label: 'Student Fee',
    icon: CircleDollarSign,
    subItems: [
      { href: '/fees/add', label: 'Add' },
      { href: '/fees/view', label: 'View' },
      { href: '/fees/edit', label: 'Edit' },
    ],
  },
  { href: '/accounts', label: 'Accounts', icon: BookUser },
  { href: '/expenses', label: 'Expenses', icon: TrendingDown },
  { href: '/library', label: 'Library', icon: Library },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/assets', label: 'Assets', icon: Archive },
  { href: '/transport', label: 'Transport', icon: Bus },
];
