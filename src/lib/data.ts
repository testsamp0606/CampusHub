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

export const students = [
  {
    id: 'S001',
    name: 'John Doe',
    class: 'Class X',
    parentName: 'Jane Doe',
    admissionDate: '2023-04-15',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main St, Anytown, USA',
    aadhar: '1234 5678 9012',
    academicBackground: 'Completed middle school with honors.',
    hobbies: 'Cricket, Reading',
    profilePhoto: 'https://picsum.photos/seed/1/200/200',
  },
  {
    id: 'S002',
    name: 'Jane Smith',
    class: 'Class IX',
    parentName: 'John Smith',
    admissionDate: '2023-05-20',
    email: 'jane.smith@example.com',
    phone: '123-456-7891',
    address: '456 Oak Ave, Anytown, USA',
    aadhar: '2345 6789 0123',
    academicBackground: 'Top performer in science subjects.',
    hobbies: 'Painting, Chess',
    profilePhoto: 'https://picsum.photos/seed/2/200/200',
  },
  {
    id: 'S003',
    name: 'Mike Johnson',
    class: 'Class X',
    parentName: 'Mary Johnson',
    admissionDate: '2023-04-18',
    email: 'mike.johnson@example.com',
    phone: '123-456-7892',
    address: '789 Pine Ln, Anytown, USA',
    aadhar: '3456 7890 1234',
    academicBackground: 'Active in school sports teams.',
    hobbies: 'Soccer, Video Games',
    profilePhoto: 'https://picsum.photos/seed/3/200/200',
  },
  {
    id: 'S004',
    name: 'Emily White',
    class: 'Class VIII',
    parentName: 'David White',
    admissionDate: '2023-06-01',
    email: 'emily.white@example.com',
    phone: '123-456-7893',
    address: '101 Maple Dr, Anytown, USA',
    aadhar: '4567 8901 2345',
    academicBackground: 'Excels in mathematics and languages.',
    hobbies: 'Dancing, Singing',
    profilePhoto: 'https://picsum.photos/seed/4/200/200',
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
