import type { LucideIcon } from 'lucide-react';
import {
  Users,
  UserCheck,
  Briefcase,
  UserCog,
  ShieldCheck,
  ClipboardList,
  School2,
} from 'lucide-react';

export type StatCardData = {
  title: string;
  count: string;
  Icon: LucideIcon;
  color: string;
  bgColor: string;
};

export const statCardsData: StatCardData[] = [
  {
    title: 'Total Students',
    count: '203',
    Icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Total Teachers',
    count: '25',
    Icon: UserCheck,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Accountants',
    count: '10',
    Icon: Briefcase,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
  },
  {
    title: 'Other Staff',
    count: '10',
    Icon: UserCog,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Admins',
    count: '07',
    Icon: ShieldCheck,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
  },
  {
    title: 'Students Attendance',
    count: '95%',
    Icon: ClipboardList,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-100',
  },
  {
    title: 'Classes Count',
    count: '10',
    Icon: School2,
    color: 'text-pink-500',
    bgColor: 'bg-pink-100',
  },
];

export type ClassInfo = {
  class: string;
  studentCount: number;
  dailyAttendance: number;
  classTeacher: string;
};

export const classesData: ClassInfo[] = [
  {
    class: 'Class I',
    studentCount: 30,
    dailyAttendance: 95,
    classTeacher: 'Mr. John Doe',
  },
  {
    class: 'Class II',
    studentCount: 28,
    dailyAttendance: 98,
    classTeacher: 'Ms. Jane Smith',
  },
  {
    class: 'Class III',
    studentCount: 32,
    dailyAttendance: 92,
    classTeacher: 'Mr. Robert Brown',
  },
  {
    class: 'Class IV',
    studentCount: 29,
    dailyAttendance: 100,
    classTeacher: 'Ms. Emily White',
  },
  {
    class: 'Class V',
    studentCount: 31,
    dailyAttendance: 94,
    classTeacher: 'Mr. Michael Green',
  },
  {
    class: 'Class VI',
    studentCount: 25,
    dailyAttendance: 96,
    classTeacher: 'Ms. Sarah Black',
  },
];

export const attendanceData = [
  { studentId: 'S001', date: '2024-07-01', status: 'present' },
  { studentId: 'S002', date: '2024-07-01', status: 'present' },
  { studentId: 'S003', date: '2024-07-01', status: 'absent' },
  { studentId: 'S004', date: '2024-07-01', status: 'present' },
  { studentId: 'S001', date: '2024-07-02', status: 'present' },
  { studentId: 'S002', date: '2024-07-02', status: 'present' },
  { studentId: 'S003', date: '2024-07-02', status: 'absent' },
  { studentId: 'S004', date: '2024-07-02', status: 'present' },
  { studentId: 'S001', date: '2024-07-03', status: 'present' },
  { studentId: 'S002', date: '2024-07-03', status: 'present' },
  { studentId: 'S003', date: '2024-07-03', status: 'absent' },
  { studentId: 'S004', date: '2024-07-03', status: 'absent' },
  { studentId: 'S001', date: '2024-07-04', status: 'present' },
  { studentId: 'S002', date: '2024-07-04', status: 'present' },
  { studentId: 'S003', date: '2024-07-04', status: 'absent' },
  { studentId: 'S004', date: '2024-07-04', status: 'absent' },
  { studentId: 'S005', date: '2024-07-01', status: 'absent' },
  { studentId: 'S005', date: '2024-07-02', status: 'absent' },
  { studentId: 'S005', date: '2024-07-03', status: 'absent' },
  { studentId: 'S005', date: '2024-07-04', status: 'absent' },
  { studentId: 'S005', date: '2024-07-05', status: 'absent' },
];
