import type { LucideIcon } from 'lucide-react';
import {
  Users,
  UserCheck,
  Briefcase,
  UserCog,
  ShieldCheck,
  ClipboardList,
  School2,
  Wallet,
  BookUp,
  UserX,
  Building,
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
    Icon: Briefcase,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Accountants',
    count: '10',
    Icon: UserCog,
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

export const studentStatsData: StatCardData[] = [
  {
    title: 'Total Students',
    count: '203',
    Icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'New Admissions',
    count: '15',
    Icon: UserCheck,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Overdue Fees',
    count: '5',
    Icon: Wallet,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
  },
  {
    title: 'Overall Attendance',
    count: '95%',
    Icon: ClipboardList,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-100',
  }
];

export const teacherStatsData: StatCardData[] = [
  {
    title: 'Total Teachers',
    count: '25',
    Icon: Briefcase,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Teachers on Leave',
    count: '2',
    Icon: UserX,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
  },
  {
    title: 'Total Departments',
    count: '6',
    Icon: Building,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Avg. Workload',
    count: '15h/w',
    Icon: BookUp,
    color: 'text-sky-500',
    bgColor: 'bg-sky-100',
  },
];

export type ClassInfo = {
  id: string;
  name: string;
  teacherId: string;
  studentCount: number;
  capacity: number;
  academicYear: string;
  status: 'Active' | 'Archived' | 'Completed';
  dailyAttendance?: number;
  classTeacher?: string;
  passPercentage?: number;
};

export const classesData: ClassInfo[] = [
  {
    id: 'C001',
    name: 'Class I',
    teacherId: 'T001',
    studentCount: 30,
    capacity: 35,
    academicYear: '2024-2025',
    status: 'Active',
    dailyAttendance: 95,
    classTeacher: 'Mr. John Doe',
    passPercentage: 92,
  },
  {
    id: 'C002',
    name: 'Class II',
    teacherId: 'T002',
    studentCount: 28,
    capacity: 30,
    academicYear: '2024-2025',
    status: 'Active',
    dailyAttendance: 98,
    classTeacher: 'Ms. Jane Smith',
    passPercentage: 95,
  },
  {
    id: 'C003',
    name: 'Class III',
    teacherId: 'T003',
    studentCount: 32,
    capacity: 35,
    academicYear: '2024-2025',
    status: 'Active',
    dailyAttendance: 92,
    classTeacher: 'Mr. Robert Brown',
    passPercentage: 88,
  },
  {
    id: 'C004',
    name: 'Class IV',
    teacherId: 'T004',
    studentCount: 29,
    capacity: 30,
    academicYear: '2024-2025',
    status: 'Active',
    dailyAttendance: 100,
    classTeacher: 'Ms. Emily White',
    passPercentage: 98,
  },
  {
    id: 'C005',
    name: 'Class V',
    teacherId: 'T005',
    studentCount: 31,
    capacity: 35,
    academicYear: '2024-2025',
    status: 'Active',
    dailyAttendance: 94,
    classTeacher: 'Mr. Michael Green',
    passPercentage: 91,
  },
  {
    id: 'C006',
    name: 'Class VI',
    teacherId: 'T001',
    studentCount: 25,
    capacity: 30,
    academicYear: '2024-2025',
    status: 'Archived',
    dailyAttendance: 96,
    classTeacher: 'Ms. Sarah Black',
    passPercentage: 94,
  },
];

export const students = [
  {
    id: 'S001',
    name: 'John Doe',
    class: 'Class I',
    classId: 'C001',
    parentName: 'Jane Doe',
    admissionDate: '2023-04-15',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main St, Anytown, USA',
    temporaryAddress: '',
    aadhar: '123456789012',
    academicBackground: 'Completed middle school with honors.',
    hobbies: 'Cricket, Reading',
    profilePhoto: 'https://picsum.photos/seed/1/200/200',
  },
  {
    id: 'S002',
    name: 'Jane Smith',
    class: 'Class II',
    classId: 'C002',
    parentName: 'John Smith',
    admissionDate: '2023-05-20',
    email: 'jane.smith@example.com',
    phone: '123-456-7891',
    address: '456 Oak Ave, Anytown, USA',
    temporaryAddress: '',
    aadhar: '234567890123',
    academicBackground: 'Top performer in science subjects.',
    hobbies: 'Painting, Chess',
    profilePhoto: 'https://picsum.photos/seed/2/200/200',
  },
  {
    id: 'S003',
    name: 'Mike Johnson',
    class: 'Class I',
    classId: 'C001',
    parentName: 'Mary Johnson',
    admissionDate: '2023-04-18',
    email: 'mike.johnson@example.com',
    phone: '123-456-7892',
    address: '789 Pine Ln, Anytown, USA',
    temporaryAddress: '',
    aadhar: '345678901234',
    academicBackground: 'Active in school sports teams.',
    hobbies: 'Soccer, Video Games',
    profilePhoto: 'https://picsum.photos/seed/3/200/200',
  },
  {
    id: 'S004',
    name: 'Emily White',
    class: 'Class III',
    classId: 'C003',
    parentName: 'David White',
    admissionDate: '2023-06-01',
    email: 'emily.white@example.com',
    phone: '123-456-7893',
    address: '101 Maple Dr, Anytown, USA',
    temporaryAddress: '',
    aadhar: '456789012345',
    academicBackground: 'Excels in mathematics and languages.',
    hobbies: 'Dancing, Singing',
    profilePhoto: 'https://picsum.photos/seed/4/200/200',
  },
    {
    id: 'S005',
    name: 'Chris Green',
    class: 'Class II',
    classId: 'C002',
    parentName: 'Laura Green',
    admissionDate: '2023-05-22',
    email: 'chris.green@example.com',
    phone: '123-456-7894',
    address: '212 Birch Rd, Anytown, USA',
    temporaryAddress: '',
    aadhar: '567890123456',
    academicBackground: 'Good in arts and crafts.',
    hobbies: 'Guitar, Drawing',
    profilePhoto: 'https://picsum.photos/seed/9/200/200',
  },
];


export const parents = [
  {
    id: 'P001',
    name: 'Jane Doe',
    studentName: 'John Doe',
    studentId: 'S001',
    occupation: 'Lawyer',
    phone: '987-654-3210',
    email: 'jane.doe@example.com',
    address: '123 Main St, Anytown, USA',
    profilePhoto: 'https://picsum.photos/seed/5/200/200',
  },
    {
    id: 'P002',
    name: 'John Smith',
    studentName: 'Jane Smith',
    studentId: 'S002',
    occupation: 'Doctor',
    phone: '987-654-3211',
    email: 'john.smith@example.com',
    address: '456 Oak Ave, Anytown, USA',
    profilePhoto: 'https://picsum.photos/seed/6/200/200',
  },
  {
    id: 'P003',
    name: 'Mary Johnson',
    studentName: 'Mike Johnson',
    studentId: 'S003',
    occupation: 'Teacher',
    phone: '987-654-3212',
    email: 'mary.johnson@example.com',
    address: '789 Pine Ln, Anytown, USA',
    profilePhoto: 'https://picsum.photos/seed/7/200/200',
  },
    {
    id: 'P004',
    name: 'David White',
    studentName: 'Emily White',
    studentId: 'S004',
    occupation: 'Artist',
    phone: '987-654-3213',
    email: 'david.white@example.com',
    address: '101 Maple Dr, Anytown, USA',
    profilePhoto: 'https://picsum.photos/seed/8/200/200',
  },
];


export const attendanceData = [
  { studentId: 'S001', studentName: 'John Doe', classId: 'C001', date: '2024-07-01', status: 'present' },
  { studentId: 'S002', studentName: 'Jane Smith', classId: 'C002', date: '2024-07-01', status: 'present' },
  { studentId: 'S003', studentName: 'Mike Johnson', classId: 'C001', date: '2024-07-01', status: 'absent' },
  { studentId: 'S004', studentName: 'Emily White', classId: 'C003', date: '2024-07-01', status: 'present' },
  { studentId: 'S001', studentName: 'John Doe', classId: 'C001', date: '2024-07-02', status: 'present' },
  { studentId: 'S002', studentName: 'Jane Smith', classId: 'C002', date: '2024-07-02', status: 'present' },
  { studentId: 'S003', studentName: 'Mike Johnson', classId: 'C001', date: '2024-07-02', status: 'absent' },
  { studentId: 'S004', studentName: 'Emily White', classId: 'C003', date: '2024-07-02', status: 'present' },
  { studentId: 'S001', studentName: 'John Doe', classId: 'C001', date: '2024-07-03', status: 'present' },
  { studentId: 'S002', studentName: 'Jane Smith', classId: 'C002', date: '2024-07-03', status: 'present' },
  { studentId: 'S003', studentName: 'Mike Johnson', classId: 'C001', date: '2024-07-03', status: 'absent' },
  { studentId: 'S004', studentName: 'Emily White', classId: 'C003', date: '2024-07-03', status: 'absent' },
  { studentId: 'S001', studentName: 'John Doe', classId: 'C001', date: '2024-07-04', status: 'present' },
  { studentId: 'S002', studentName: 'Jane Smith', classId: 'C002', date: '2024-07-04', status: 'present' },
  { studentId: 'S003', studentName: 'Mike Johnson', classId: 'C001', date: '2024-07-04', status: 'absent' },
  { studentId: 'S004', studentName: 'Emily White', classId: 'C003', date: '2024-07-04', status: 'absent' },
  { studentId: 'S005', studentName: 'Chris Green', classId: 'C002', date: '2024-07-01', status: 'absent' },
  { studentId: 'S005', studentName: 'Chris Green', classId: 'C002', date: '2024-07-02', status: 'absent' },
  { studentId: 'S005', studentName: 'Chris Green', classId: 'C002', date: '2024-07-03', status: 'absent' },
  { studentId: 'S005', studentName: 'Chris Green', classId: 'C002', date: '2024-07-04', status: 'absent' },
  { studentId: 'S005', studentName: 'Chris Green', classId: 'C002', date: '2024-07-05', status: 'absent' },
];

export const feesData = [
  {
    invoiceId: 'INV001',
    studentId: 'S001',
    studentName: 'John Doe',
    class: 'Class X',
    amount: 1500,
    dueDate: '2024-08-01',
    status: 'Paid' as 'Paid' | 'Unpaid' | 'Overdue',
    paymentDate: '2024-07-25',
    paymentMethod: 'Credit Card',
    description: 'Monthly Tuition Fee for July'
  },
  {
    invoiceId: 'INV002',
    studentId: 'S002',
    studentName: 'Jane Smith',
    class: 'Class IX',
    amount: 1200,
    dueDate: '2024-08-01',
    status: 'Unpaid' as 'Paid' | 'Unpaid' | 'Overdue',
    paymentDate: null,
    paymentMethod: null,
    description: 'Monthly Tuition Fee for July'
  },
  {
    invoiceId: 'INV003',
    studentId: 'S003',
    studentName: 'Mike Johnson',
    class: 'Class X',
    amount: 1500,
    dueDate: '2024-07-01',
    status: 'Overdue' as 'Paid' | 'Unpaid' | 'Overdue',
    paymentDate: null,
    paymentMethod: null,
    description: 'Monthly Tuition Fee for June'
  },
  {
    invoiceId: 'INV004',
    studentId: 'S004',
    studentName: 'Emily White',
    class: 'Class VIII',
    amount: 1000,
    dueDate: '2024-08-01',
    status: 'Paid' as 'Paid' | 'Unpaid' | 'Overdue',
    paymentDate: '2024-07-20',
    paymentMethod: 'Bank Transfer',
    description: 'Monthly Tuition Fee for July'
  },
  {
    invoiceId: 'INV005',
    studentId: 'S001',
    studentName: 'John Doe',
    class: 'Class X',
    amount: 250,
    dueDate: '2024-08-10',
    status: 'Unpaid' as 'Paid' | 'Unpaid' | 'Overdue',
    paymentDate: null,
    paymentMethod: null,
    description: 'Exam Fee - Mid Term'
  },
];

export const booksData = [
  {
    id: 'B001',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    publisher: 'Scribner',
    edition: '1st',
    category: 'Classic',
    language: 'English',
    quantity: 5,
    issued: 2,
    lost: 0,
    coverImage: 'https://picsum.photos/seed/book1/200/300',
    resourceType: 'Book',
    barcode: '1234567890123',
    shelf: 'A1',
    rack: '3',
  },
  {
    id: 'B002',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780061120084',
    publisher: 'J. B. Lippincott & Co.',
    edition: '1st',
    category: 'Fiction',
    language: 'English',
    quantity: 3,
    issued: 0,
    lost: 0,
    coverImage: 'https://picsum.photos/seed/book2/200/300',
    resourceType: 'Book',
    barcode: '1234567890124',
    shelf: 'A1',
    rack: '3',
  },
  {
    id: 'B003',
    title: '1984',
    author: 'George Orwell',
    isbn: '9780451524935',
    publisher: 'Secker & Warburg',
    edition: '1st',
    category: 'Dystopian',
    language: 'English',
    quantity: 7,
    issued: 2,
    lost: 1,
    coverImage: 'https://picsum.photos/seed/book3/200/300',
    resourceType: 'Book',
    barcode: '1234567890125',
    shelf: 'B2',
    rack: '1',
  },
  {
    id: 'B004',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '9780141439518',
    publisher: 'T. Egerton, Whitehall',
    edition: '1st',
    category: 'Romance',
    language: 'English',
    quantity: 4,
    issued: 3,
    lost: 0,
    coverImage: 'https://picsum.photos/seed/book4/200/300',
    resourceType: 'Book',
    barcode: '1234567890126',
    shelf: 'C3',
    rack: '2',
  },
  {
    id: 'B005',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '9780345339683',
    publisher: 'George Allen & Unwin',
    edition: '1st',
    category: 'Fantasy',
    language: 'English',
    quantity: 6,
    issued: 0,
    lost: 0,
    coverImage: 'https://picsum.photos/seed/book5/200/300',
    resourceType: 'Book',
    barcode: '1234567890127',
    shelf: 'D4',
    rack: '4',
  },
];

export const bookIssueData = [
    { issueId: 'I001', bookId: 'B001', studentId: 'S001', issueDate: '2024-07-10 10:30', dueDate: '2024-07-24', returnDate: null, status: 'Issued' as 'Issued' | 'Returned', fineAmount: 0, fineStatus: 'Unpaid' as 'Paid' | 'Unpaid' },
    { issueId: 'I002', bookId: 'B004', studentId: 'S002', issueDate: '2024-07-15 14:00', dueDate: '2024-07-29', returnDate: null, status: 'Issued' as 'Issued' | 'Returned', fineAmount: 0, fineStatus: 'Unpaid' as 'Paid' | 'Unpaid' },
    { issueId: 'I003', bookId: 'B001', studentId: 'S003', issueDate: '2024-06-20 11:00', dueDate: '2024-07-04', returnDate: '2024-07-05 09:15', status: 'Returned' as 'Issued' | 'Returned', fineAmount: 1, fineStatus: 'Paid' as 'Paid' | 'Unpaid' },
];

export const vehiclesData = [
  {
    id: 'V001',
    vehicleNumber: 'KA-01-AB-1234',
    type: 'Bus',
    capacity: 40,
    driverName: 'Ramesh Kumar',
    driverContact: '9876543210',
    status: 'Active' as 'Active' | 'Maintenance',
  },
  {
    id: 'V002',
    vehicleNumber: 'KA-01-CD-5678',
    type: 'Bus',
    capacity: 40,
    driverName: 'Suresh Singh',
    driverContact: '9876543211',
    status: 'Active' as 'Active' | 'Maintenance',
  },
  {
    id: 'V003',
    vehicleNumber: 'KA-01-EF-9101',
    type: 'Van',
    capacity: 12,
    driverName: 'Mahesh Patil',
    driverContact: '9876543212',
    status: 'Maintenance' as 'Active' | 'Maintenance',
  },
];

export const routesData = [
    {
        id: 'R001',
        routeName: 'City Center Route',
        vehicleId: 'V001',
        stops: ['Central Station', 'City Market', 'Town Hall', 'Green Park'],
    },
    {
        id: 'R002',
        routeName: 'Suburb Route',
        vehicleId: 'V002',
        stops: ['Suburb Square', 'Lake View', 'West End', 'North Point'],
    },
    {
        id: 'R003',
        routeName: 'Express Route',
        vehicleId: 'V003',
        stops: ['Highway Junction', 'Tech Park', 'East Gate'],
    }
];


export const studentTransportData = [
    { allocationId: 'T001', studentId: 'S001', routeId: 'R001', stop: 'City Market', feeStatus: 'Paid' },
    { allocationId: 'T002', studentId: 'S002', routeId: 'R002', stop: 'Lake View', feeStatus: 'Paid' },
    { allocationId: 'T003', studentId: 'S003', routeId: 'R001', stop: 'Green Park', feeStatus: 'Unpaid' },
    { allocationId: 'T004', studentId: 'S004', routeId: 'R002', stop: 'North Point', feeStatus: 'Paid' },
    { allocationId: 'T005', studentId: 'S005', routeId: 'R001', stop: 'Central Station', feeStatus: 'Unpaid' },
];

export const assetsData = [
  {
    id: 'ASSET001',
    name: 'Dell Latitude 5420',
    category: 'Electronics',
    status: 'In Use' as 'In Use' | 'In Storage' | 'Under Maintenance' | 'Disposed',
    purchaseDate: '2023-01-15',
    warrantyEndDate: '2026-01-14',
    value: 1200,
    assignedTo: 'Computer Lab',
    notes: 'Primary laptop for the main computer lab.',
  },
  {
    id: 'ASSET002',
    name: 'Epson Projector',
    category: 'Electronics',
    status: 'In Use' as 'In Use' | 'In Storage' | 'Under Maintenance' | 'Disposed',
    purchaseDate: '2022-11-20',
    warrantyEndDate: '2024-11-19',
    value: 800,
    assignedTo: 'Classroom 101',
    notes: 'Ceiling mounted projector.',
  },
  {
    id: 'ASSET003',
    name: 'Student Desk',
    category: 'Furniture',
    status: 'In Storage' as 'In Use' | 'In Storage' | 'Under Maintenance' | 'Disposed',
    purchaseDate: '2021-05-10',
    warrantyEndDate: '',
    value: 150,
    assignedTo: 'Storage Room B',
    notes: '2-seater student desk. 10 units in storage.',
  },
  {
    id: 'ASSET004',
    name: 'HP LaserJet Printer',
    category: 'Electronics',
    status: 'Under Maintenance' as 'In Use' | 'In Storage' | 'Under Maintenance' | 'Disposed',
    purchaseDate: '2022-08-30',
    warrantyEndDate: '2024-08-29',
    value: 450,
    assignedTo: 'Staff Room',
    notes: 'Paper jam issue. Sent for repair on 2024-07-20.',
  },
  {
    id: 'ASSET005',
    name: 'Whiteboard',
    category: 'Office Supplies',
    status: 'Disposed' as 'In Use' | 'In Storage' | 'Under Maintenance' | 'Disposed',
    purchaseDate: '2020-02-28',
    warrantyEndDate: '',
    value: 100,
    assignedTo: 'Classroom 103',
    notes: 'Surface damaged. Disposed on 2024-06-15.',
  },
];

export const expensesData = [
    {
        id: 'EXP001',
        category: 'Utilities',
        amount: 500,
        date: '2024-07-15',
        status: 'Approved' as 'Approved' | 'Pending' | 'Rejected',
        department: 'Administration',
        description: 'Monthly Electricity Bill'
    },
    {
        id: 'EXP002',
        category: 'Supplies',
        amount: 250,
        date: '2024-07-20',
        status: 'Pending' as 'Approved' | 'Pending' | 'Rejected',
        department: 'Academics',
        description: 'Purchase of stationery for exams'
    },
    {
        id: 'EXP003',
        category: 'Maintenance',
        amount: 1200,
        date: '2024-07-18',
        status: 'Approved' as 'Approved' | 'Pending' | 'Rejected',
        department: 'Infrastructure',
        description: 'Repair of classroom furniture'
    },
    {
        id: 'EXP004',
        category: 'Transport',
        amount: 300,
        date: '2024-07-22',
        status: 'Rejected' as 'Approved' | 'Pending' | 'Rejected',
        department: 'Transport',
        description: 'Fuel for school bus V003 (Not in service)'
    },
    {
        id: 'EXP005',
        category: 'Events',
        amount: 800,
        date: '2024-06-30',
        status: 'Approved' as 'Approved' | 'Pending' | 'Rejected',
        department: 'Administration',
        description: 'Annual Day celebration expenses'
    },
     {
        id: 'EXP006',
        category: 'Salaries',
        amount: 25000,
        date: '2024-07-31',
        status: 'Pending' as 'Approved' | 'Pending' | 'Rejected',
        department: 'HR',
        description: 'Monthly staff salaries'
    }
];

export const examsData = [
    { id: 'EX001', name: 'Mid-Term Exam', classId: 'C001', date: '2024-09-15', status: 'Scheduled' as 'Scheduled' | 'Completed' | 'Published' },
    { id: 'EX002', name: 'Unit Test 1', classId: 'C002', date: '2024-08-10', status: 'Completed' as 'Scheduled' | 'Completed' | 'Published' },
    { id: 'EX003', name: 'Final Exam', classId: 'C003', date: '2024-12-05', status: 'Scheduled' as 'Scheduled' | 'Completed' | 'Published' },
    { id: 'EX004', name: 'Mid-Term Exam', classId: 'C002', date: '2024-09-15', status: 'Published' as 'Scheduled' | 'Completed' | 'Published' },
];

export const marksData = [
    { markId: 'M001', examId: 'EX002', studentId: 'S002', subject: 'Mathematics', marks: 85 },
    { markId: 'M002', examId: 'EX002', studentId: 'S002', subject: 'Science', marks: 92 },
    { markId: 'M003', examId: 'EX002', studentId: 'S005', subject: 'Mathematics', marks: 78 },
    { markId: 'M004', examId: 'EX002', studentId: 'S005', subject: 'Science', marks: 81 },
    { markId: 'M005', examId: 'EX004', studentId: 'S002', subject: 'English', marks: 95 },
    { markId: 'M006', examId: 'EX004', studentId: 'S005', subject: 'English', marks: 88 },
];

export type Teacher = {
    id: string;
    name: string;
    department: string;
    subjects: string[];
    role: string;
    qualification: string;
    experience: string;
    phone: string;
    email: string;
    status: 'Active' | 'On Leave' | 'Inactive';
    profilePhoto: string;
};

export const teachersData: Teacher[] = [
    {
        id: 'T001',
        name: 'Mr. John Doe',
        department: 'Science',
        subjects: ['Physics', 'Chemistry'],
        role: 'Class Teacher',
        qualification: 'M.Sc. Physics',
        experience: '10 years',
        phone: '111-222-3333',
        email: 'john.doe.teacher@example.com',
        status: 'Active',
        profilePhoto: 'https://picsum.photos/seed/teacher1/200/200',
    },
    {
        id: 'T002',
        name: 'Ms. Jane Smith',
        department: 'Mathematics',
        subjects: ['Algebra', 'Geometry'],
        role: 'HOD',
        qualification: 'M.Sc. Mathematics',
        experience: '15 years',
        phone: '222-333-4444',
        email: 'jane.smith.teacher@example.com',
        status: 'Active',
        profilePhoto: 'https://picsum.photos/seed/teacher2/200/200',
    },
    {
        id: 'T003',
        name: 'Mr. Robert Brown',
        department: 'English',
        subjects: ['Literature', 'Grammar'],
        role: 'Professor',
        qualification: 'M.A. English',
        experience: '12 years',
        phone: '333-444-5555',
        email: 'robert.brown.teacher@example.com',
        status: 'On Leave',
        profilePhoto: 'https://picsum.photos/seed/teacher3/200/200',
    },
    {
        id: 'T004',
        name: 'Ms. Emily White',
        department: 'History',
        subjects: ['World History', 'Civics'],
        role: 'Teacher',
        qualification: 'M.A. History',
        experience: '8 years',
        phone: '444-555-6666',
        email: 'emily.white.teacher@example.com',
        status: 'Active',
        profilePhoto: 'https://picsum.photos/seed/teacher4/200/200',
    },
    {
        id: 'T005',
        name: 'Mr. Michael Green',
        department: 'Computer Science',
        subjects: ['Programming', 'Data Structures'],
        role: 'Teacher',
        qualification: 'M.Tech CSE',
        experience: '5 years',
        phone: '555-666-7777',
        email: 'michael.green.teacher@example.com',
        status: 'Inactive',
        profilePhoto: 'https://picsum.photos/seed/teacher5/200/200',
    }
];

export type CalendarEvent = {
  date: string;
  title: string;
  type: 'Holiday' | 'Event' | 'Exam';
};

export const eventsData: CalendarEvent[] = [
  { date: '2024-08-15', title: 'Independence Day', type: 'Holiday' },
  { date: '2024-08-26', title: 'Raksha Bandhan', type: 'Holiday' },
  { date: '2024-09-05', title: 'Teachers\' Day', type: 'Event' },
  { date: '2024-09-15', title: 'Mid-Term Exams Start', type: 'Exam' },
  { date: '2024-09-22', title: 'Mid-Term Exams End', type: 'Exam' },
  { date: '2024-10-02', title: 'Gandhi Jayanti', type: 'Holiday' },
  { date: '2024-10-15', title: 'Annual Sports Day', type: 'Event' },
  { date: '2024-11-01', title: 'Diwali Break Starts', type: 'Holiday' },
  { date: '2024-11-05', title: 'Diwali Break Ends', type: 'Holiday' },
  { date: '2024-12-25', title: 'Christmas Day', type: 'Holiday' },
  { date: '2024-12-31', title: 'New Year\'s Eve', type: 'Holiday' },
  { date: '2025-01-26', title: 'Republic Day', type: 'Holiday' },
];

export const subjectOptions = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
  'Geography',
  'Computer Science',
  'Art',
  'Music',
  'Physical Education'
];

export type Subject = {
  id: string;
  name: string;
  code: string;
  teacherId: string;
};

export const subjectsData: Subject[] = [
    { id: 'SUB01', name: 'Mathematics', code: 'MATH101', teacherId: 'T002' },
    { id: 'SUB02', name: 'Physics', code: 'PHY101', teacherId: 'T001' },
    { id: 'SUB03', name: 'Chemistry', code: 'CHEM101', teacherId: 'T001' },
    { id: 'SUB04', name: 'English', code: 'ENG101', teacherId: 'T003' },
    { id: 'SUB05', name: 'History', code: 'HIST101', teacherId: 'T004' },
    { id: 'SUB06', name: 'Computer Science', code: 'CS101', teacherId: 'T005' },
];


export type TimetableEntry = {
  period: number;
  subject: string;
  teacherId: string;
  time: string;
};

export type FullTimetable = {
    classId: string;
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
    entries: TimetableEntry[];
}

export const timetablesData: FullTimetable[] = [];

export type Announcement = {
    id: string;
    title: string;
    content: string;
    date: string;
    author: string;
    audience: 'All' | 'Teachers' | 'Students' | 'Parents';
};

export const announcementsData: Announcement[] = [
    {
        id: 'ANN001',
        title: 'Mid-Term Exam Schedule',
        content: 'The mid-term examinations for classes IX to XII will commence from September 15th. The detailed schedule has been uploaded to the student portal.',
        date: '2024-08-20',
        author: 'Principal\'s Office',
        audience: 'All'
    },
    {
        id: 'ANN002',
        title: 'Parent-Teacher Meeting',
        content: 'A parent-teacher meeting is scheduled for Saturday, August 31st, from 9:00 AM to 1:00 PM to discuss the students\' progress.',
        date: '2024-08-18',
        author: 'Admin Office',
        audience: 'Parents'
    },
    {
        id: 'ANN003',
        title: 'Faculty Development Program',
        content: 'A workshop on "Modern Teaching Methodologies" will be held on August 24th for all faculty members. Attendance is mandatory.',
        date: '2024-08-15',
        author: 'Academic Head',
        audience: 'Teachers'
    }
];

export type Permission = 'V' | 'C' | 'E' | 'A';

export const roles = [
  'Super Admin',
  'Admin / Principal',
  'Academic Admin / HOD',
  'Teacher / Faculty',
  'Accountant / Finance Officer',
  'Librarian',
  'Transport Manager',
  'Student',
  'Parent',
];

export const modules = [
  'Students',
  'Teachers',
  'Classes / Courses',
  'Attendance',
  'Examinations',
  'Student Fee',
  'Accounts',
  'Expenses',
  'Library',
  'Calendar / Events',
  'Assets',
  'Transport',
];

export const permissionsData: {
  [module: string]: { [role: string]: Permission[] };
} = {
  Students: {
    'Super Admin': ['V', 'C', 'E', 'A'],
    'Admin / Principal': ['V', 'C', 'E'],
    'Academic Admin / HOD': ['V', 'C', 'E'],
    'Teacher / Faculty': ['V'],
    'Accountant / Finance Officer': ['V'],
    Librarian: [],
    'Transport Manager': [],
    Student: ['V'],
    Parent: ['V'],
  },
  Teachers: {
    'Super Admin': ['V', 'C', 'E', 'A'],
    'Admin / Principal': ['V', 'C', 'E'],
    'Academic Admin / HOD': ['V', 'C', 'E'],
    'Teacher / Faculty': ['V'],
    'Accountant / Finance Officer': [],
    Librarian: [],
    'Transport Manager': [],
    Student: [],
    Parent: [],
  },
  'Classes / Courses': {
    'Super Admin': ['V', 'C', 'E', 'A'],
    'Admin / Principal': ['V', 'C', 'E'],
    'Academic Admin / HOD': ['V', 'C', 'E'],
    'Teacher / Faculty': ['V'],
    'Accountant / Finance Officer': [],
    Librarian: [],
    'Transport Manager': [],
    Student: ['V'],
    Parent: ['V'],
  },
  Attendance: {
    'Super Admin': ['V', 'C', 'E'],
    'Admin / Principal': ['V', 'C', 'E'],
    'Academic Admin / HOD': ['V'],
    'Teacher / Faculty': ['C', 'E'],
    'Accountant / Finance Officer': [],
    Librarian: [],
    'Transport Manager': [],
    Student: ['V'],
    Parent: ['V'],
  },
  Examinations: {
    'Super Admin': ['V', 'C', 'E', 'A'],
    'Admin / Principal': ['V', 'C', 'E'],
    'Academic Admin / HOD': ['V', 'C', 'E'],
    'Teacher / Faculty': ['C', 'E'],
    'Accountant / Finance Officer': [],
    Librarian: [],
    'Transport Manager': [],
    Student: ['V'],
    Parent: ['V'],
  },
  'Student Fee': {
    'Super Admin': ['V', 'C', 'E', 'A'],
    'Admin / Principal': ['V'],
    'Academic Admin / HOD': [],
    'Teacher / Faculty': [],
    'Accountant / Finance Officer': ['V', 'C', 'E'],
    Librarian: [],
    'Transport Manager': [],
    Student: ['V'],
    Parent: ['V'],
  },
  Accounts: {
    'Super Admin': ['V', 'C', 'E', 'A'],
    'Admin / Principal': ['V'],
    'Academic Admin / HOD': [],
    'Teacher / Faculty': [],
    'Accountant / Finance Officer': ['V', 'C', 'E'],
    Librarian: [],
    'Transport Manager': [],
    Student: [],
    Parent: [],
  },
  Expenses: {
    'Super Admin': ['V', 'C', 'E', 'A'],
    'Admin / Principal': ['V', 'A'],
    'Academic Admin / HOD': ['C'],
    'Teacher / Faculty': ['C'],
    'Accountant / Finance Officer': ['V', 'C', 'E'],
    Librarian: [],
    'Transport Manager': [],
    Student: [],
    Parent: [],
  },
  Library: {
    'Super Admin': ['V', 'C', 'E'],
    'Admin / Principal': ['V'],
    'Academic Admin / HOD': [],
    'Teacher / Faculty': ['V'],
    'Accountant / Finance Officer': [],
    Librarian: ['V', 'C', 'E'],
    'Transport Manager': [],
    Student: ['V'],
    Parent: ['V'],
  },
  'Calendar / Events': {
    'Super Admin': ['V', 'C', 'E', 'A'],
    'Admin / Principal': ['V', 'C', 'E'],
    'Academic Admin / HOD': ['C'],
    'Teacher / Faculty': ['C'],
    'Accountant / Finance Officer': [],
    Librarian: [],
    'Transport Manager': [],
    Student: ['V'],
    Parent: ['V'],
  },
  Assets: {
    'Super Admin': ['V', 'C', 'E', 'A'],
    'Admin / Principal': ['V'],
    'Academic Admin / HOD': [],
    'Teacher / Faculty': [],
    'Accountant / Finance Officer': ['V'],
    Librarian: [],
    'Transport Manager': [],
    Student: [],
    Parent: [],
  },
  Transport: {
    'Super Admin': ['V', 'C', 'E'],
    'Admin / Principal': ['V'],
    'Academic Admin / HOD': [],
    'Teacher / Faculty': [],
    'Accountant / Finance Officer': [],
    Librarian: [],
    'Transport Manager': ['V', 'C', 'E'],
    Student: ['V'],
    Parent: ['V'],
  },
};

export type Message = {
    id: string;
    conversationId: string;
    senderId: string; // 'user' or a person's ID
    senderName: string;
    content: string;
    timestamp: string;
};

export type Conversation = {
    id: string;
    subject: string;
    participants: { id: string, name: string }[];
    lastMessage: string;
    lastMessageTimestamp: string;
    read: boolean;
};

export const messagesData: Message[] = [
    { id: 'm1', conversationId: 'c1', senderId: 'T002', senderName: 'Ms. Jane Smith', content: 'Hi Admin, I wanted to discuss the curriculum for the next semester. When would be a good time to connect?', timestamp: '2024-07-28T10:00:00Z' },
    { id: 'm2', conversationId: 'c1', senderId: 'user', senderName: 'Admin', content: 'Hello Ms. Smith. I am available tomorrow at 11 AM. Does that work for you?', timestamp: '2024-07-28T10:05:00Z' },
    { id: 'm3', conversationId: 'c1', senderId: 'T002', senderName: 'Ms. Jane Smith', content: 'Yes, that sounds perfect. I will send a calendar invite. Thank you!', timestamp: '2024-07-28T10:06:00Z' },
    { id: 'm4', conversationId: 'c2', senderId: 'P001', senderName: 'Jane Doe', content: 'Dear Admin, I have a query regarding the fee payment for my son, John Doe.', timestamp: '2024-07-27T15:30:00Z' },
    { id: 'm5', conversationId: 'c2', senderId: 'user', senderName: 'Admin', content: 'Hello Mrs. Doe, please let me know how I can assist you.', timestamp: '2024-07-27T15:32:00Z' },
    { id: 'm6', conversationId: 'c3', senderId: 'T005', senderName: 'Mr. Michael Green', content: 'Requesting access to the updated software for the computer lab.', timestamp: '2024-07-26T09:00:00Z' },
];

export const conversationsData: Conversation[] = [
    {
        id: 'c1',
        subject: 'Curriculum Discussion for Next Semester',
        participants: [{ id: 'user', name: 'Admin'}, { id: 'T002', name: 'Ms. Jane Smith' }],
        lastMessage: 'Yes, that sounds perfect. I will send a calendar invite. Thank you!',
        lastMessageTimestamp: '2024-07-28T10:06:00Z',
        read: false,
    },
    {
        id: 'c2',
        subject: 'Query Regarding Fee Payment',
        participants: [{ id: 'user', name: 'Admin'}, { id: 'P001', name: 'Jane Doe' }],
        lastMessage: 'Hello Mrs. Doe, please let me know how I can assist you.',
        lastMessageTimestamp: '2024-07-27T15:32:00Z',
        read: true,
    },
    {
        id: 'c3',
        subject: 'Access for Lab Software',
        participants: [{ id: 'user', name: 'Admin'}, { id: 'T005', name: 'Mr. Michael Green' }],
        lastMessage: 'Requesting access to the updated software for the computer lab.',
        lastMessageTimestamp: '2024-07-26T09:00:00Z',
        read: true,
    },
];

export const allUsers = [...teachersData, ...parents, ...students];
