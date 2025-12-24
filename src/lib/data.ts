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
  id: string;
  name: string;
  studentCount: number;
  dailyAttendance: number;
  classTeacher: string;
};

export const classesData: ClassInfo[] = [
  {
    id: 'C001',
    name: 'Class I',
    studentCount: 30,
    dailyAttendance: 95,
    classTeacher: 'Mr. John Doe',
  },
  {
    id: 'C002',
    name: 'Class II',
    studentCount: 28,
    dailyAttendance: 98,
    classTeacher: 'Ms. Jane Smith',
  },
  {
    id: 'C003',
    name: 'Class III',
    studentCount: 32,
    dailyAttendance: 92,
    classTeacher: 'Mr. Robert Brown',
  },
  {
    id: 'C004',
    name: 'Class IV',
    studentCount: 29,
    dailyAttendance: 100,
    classTeacher: 'Ms. Emily White',
  },
  {
    id: 'C005',
    name: 'Class V',
    studentCount: 31,
    dailyAttendance: 94,
    classTeacher: 'Mr. Michael Green',
  },
  {
    id: 'C006',
    name: 'Class VI',
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
    class: 'Class IX',
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
    class: 'Class X',
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
    class: 'Class VIII',
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
    class: 'Class IX',
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
    { issueId: 'I003', bookId: 'B001', studentId: 'S003', issueDate: '2024-06-20 11:00', dueDate: '2024-07-04', returnDate: '2024-07-05 09:15', status: 'Returned' as 'Issued' | 'Returned', fineAmount: 1, fineStatus: 'Unpaid' as 'Paid' | 'Unpaid' },
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
