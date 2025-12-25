
export type Student = {
  id: string;
  name: string;
  class: string;
  parentName: string;
  admissionDate: string;
  email: string;
  phone: string;
  address: string;
  profilePhoto: string;
  classId: string;
};

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

export type ClassInfo = {
  id: string;
  name: string;
  teacherId: string;
  studentCount: number;
  capacity: number;
  status: 'Active' | 'Archived' | 'Completed';
  dailyAttendance?: number;
  passPercentage?: number;
};

export type Fee = {
  invoiceId: string;
  studentId: string;
  studentName: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  paymentDate: string | null;
  paymentMethod: string | null;
  description: string;
};

export type Expense = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  department: string;
  status: 'Approved' | 'Pending' | 'Rejected';
};

export type Asset = {
    id: string;
    name: string;
    category: string;
    status: 'In Use' | 'In Storage' | 'Under Maintenance' | 'Disposed';
    purchaseDate: string;
    warrantyEndDate?: string;
    value: number;
    assignedTo: string;
    notes?: string;
};

export type Announcement = {
    id: string;
    title: string;
    content: string;
    author: string;
    date: string;
    audience: 'All' | 'Teachers' | 'Students' | 'Parents';
};

export type CalendarEvent = {
  title: string;
  date: string;
  type: 'Holiday' | 'Event' | 'Exam';
};

export type Subject = {
  id: string,
  name: string,
  code: string,
  teacherId: string
}

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

export type Permission = 'V' | 'C' | 'E' | 'A';


export const students: Student[] = [
  {
    id: 'S001',
    name: 'John Doe',
    class: 'Class X',
    parentName: 'Richard Doe',
    admissionDate: '2023-04-15',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main St, Anytown, USA',
    profilePhoto: 'https://picsum.photos/seed/S001/200/200',
    classId: 'C001'
  },
  {
    id: 'S002',
    name: 'Jane Smith',
    class: 'Class IX',
    parentName: 'Robert Smith',
    admissionDate: '2023-04-16',
    email: 'jane.smith@example.com',
    phone: '123-456-7891',
    address: '456 Oak Ave, Anytown, USA',
    profilePhoto: 'https://picsum.photos/seed/S002/200/200',
    classId: 'C002'
  },
  {
    id: 'S003',
    name: 'Mike Johnson',
    class: 'Class X',
    parentName: 'Michael Johnson',
    admissionDate: '2023-04-17',
    email: 'mike.johnson@example.com',
    phone: '123-456-7892',
    address: '789 Pine Dr, Anytown, USA',
    profilePhoto: 'https://picsum.photos/seed/S003/200/200',
    classId: 'C001'
  },
];

export const teachersData: Teacher[] = [
  {
    id: 'T001',
    name: 'Mr. Robert Downy',
    department: 'Science',
    subjects: ['Physics', 'Chemistry'],
    role: 'HOD',
    qualification: 'M.Sc. Physics',
    experience: '10 years',
    phone: '123-456-7890',
    email: 'robert.downy@example.com',
    status: 'Active',
    profilePhoto: 'https://picsum.photos/seed/T001/200/200',
  },
  {
    id: 'T002',
    name: 'Ms. Emily Blunt',
    department: 'Mathematics',
    subjects: ['Algebra', 'Geometry'],
    role: 'Teacher',
    qualification: 'M.Sc. Mathematics',
    experience: '5 years',
    phone: '123-456-7891',
    email: 'emily.blunt@example.com',
    status: 'Active',
    profilePhoto: 'https://picsum.photos/seed/T002/200/200',
  },
];

export const classesData: ClassInfo[] = [
    { id: 'C001', name: 'Class X', teacherId: 'T001', studentCount: 45, capacity: 50, status: 'Active', dailyAttendance: 95, passPercentage: 88 },
    { id: 'C002', name: 'Class IX', teacherId: 'T002', studentCount: 42, capacity: 50, status: 'Active', dailyAttendance: 92, passPercentage: 91 },
    { id: 'C003', name: 'Class VIII', teacherId: 'T001', studentCount: 48, capacity: 50, status: 'Active', dailyAttendance: 98, passPercentage: 95 },
];

export const feesData: Fee[] = [
    { invoiceId: 'INV001', studentId: 'S001', studentName: 'John Doe', amount: 1500, dueDate: '2024-07-25', status: 'Paid', paymentDate: '2024-07-20', paymentMethod: 'Credit Card', description: 'July Tuition Fee' },
    { invoiceId: 'INV002', studentId: 'S002', studentName: 'Jane Smith', amount: 1500, dueDate: '2024-07-25', status: 'Unpaid', paymentDate: null, paymentMethod: null, description: 'July Tuition Fee' },
    { invoiceId: 'INV003', studentId: 'S003', studentName: 'Mike Johnson', amount: 1500, dueDate: '2024-06-25', status: 'Overdue', paymentDate: null, paymentMethod: null, description: 'June Tuition Fee' },
];

export const expensesData: Expense[] = [
    { id: 'EXP001', date: '2024-07-15', description: 'New computers for lab', amount: 5000, category: 'Technology', department: 'IT', status: 'Approved' },
    { id: 'EXP002', date: '2024-07-18', description: 'Sports equipment', amount: 1200, category: 'Sports', department: 'Physical Education', status: 'Pending' },
    { id: 'EXP003', date: '2024-07-20', description: 'Office supplies', amount: 300, category: 'Supplies', department: 'Administration', status: 'Rejected' },
];

export const assetsData: Asset[] = [
    { id: 'ASSET001', name: 'Dell Laptop', category: 'Electronics', status: 'In Use', purchaseDate: '2023-01-10', warrantyEndDate: '2026-01-10', value: 1200, assignedTo: 'Computer Lab', notes: 'Model XPS 15' },
    { id: 'ASSET002', name: 'Classroom Projector', category: 'Electronics', status: 'In Use', purchaseDate: '2022-08-20', value: 800, assignedTo: 'Classroom 101' },
    { id: 'ASSET003', name: 'Library Desk', category: 'Furniture', status: 'In Storage', purchaseDate: '2020-05-15', value: 300, assignedTo: 'Library' },
];

export const announcementsData: Announcement[] = [
    { id: 'ANN001', title: 'Annual Sports Day Postponed', content: 'The annual sports day scheduled for this Friday has been postponed to next Friday due to expected bad weather.', author: 'Sports Department', date: '2024-07-22', audience: 'All' },
    { id: 'ANN002', title: 'Parent-Teacher Meeting', content: 'A parent-teacher meeting will be held on Saturday to discuss student progress.', author: 'Admin Office', date: '2024-07-20', audience: 'Parents' },
];

export const eventsData: CalendarEvent[] = [
  { title: 'Summer Vacation', date: '2024-07-01', type: 'Holiday' },
  { title: 'Mid-term Exams', date: '2024-09-15', type: 'Exam' },
  { title: 'Annual Sports Day', date: '2024-10-20', type: 'Event' },
];

export const subjectsData: Subject[] = [
  { id: 'SUB001', name: 'Mathematics', code: 'MATH101', teacherId: 'T002' },
  { id: 'SUB002', name: 'Physics', code: 'PHY101', teacherId: 'T001' },
  { id: 'SUB003', name: 'Chemistry', code: 'CHEM101', teacherId: 'T001' },
];

export const examsData = [
  { id: 'EX001', name: 'Mathematics Mid-Term', classId: 'C001', date: '2024-09-15', status: 'Scheduled' as 'Scheduled' | 'Completed' | 'Published' },
  { id: 'EX002', name: 'Physics Mid-Term', classId: 'C001', date: '2024-09-17', status: 'Scheduled' as 'Scheduled' | 'Completed' | 'Published' },
  { id: 'EX003', name: 'English Final', classId: 'C002', date: '2024-05-20', status: 'Published' as 'Scheduled' | 'Completed' | 'Published' },
];

export const marksData = [
  { studentId: 'S001', examId: 'EX003', subject: 'English', marks: 85 },
  { studentId: 'S002', examId: 'EX003', subject: 'English', marks: 92 },
];

export const timetablesData: FullTimetable[] = [
    {
        classId: 'C001',
        day: 'Monday',
        entries: [
            { period: 1, subject: 'Mathematics', teacherId: 'T002', time: '09:00 - 09:45' },
            { period: 2, subject: 'Physics', teacherId: 'T001', time: '09:45 - 10:30' },
        ]
    }
];

export const roles: string[] = [
  'SuperAdmin',
  'Admin',
  'Accountant',
  'Teacher',
  'Student',
  'Parent',
];

export const modules: string[] = [
  'Dashboard',
  'Students',
  'Teachers',
  'Parents',
  'Classes',
  'Subjects',
  'Attendance',
  'Examinations',
  'Fees',
  'Expenses',
  'Library',
  'Transport',
  'Assets',
  'Messages',
  'Announcements',
];

export const permissionsData: { [key: string]: { [key: string]: Permission[] } } = {
  Dashboard: { SuperAdmin: ['V'], Admin: ['V'] },
  Students: { SuperAdmin: ['V', 'C', 'E'], Admin: ['V', 'C', 'E'] },
  Teachers: { SuperAdmin: ['V', 'C', 'E'], Admin: ['V', 'C', 'E'] },
  Parents: { SuperAdmin: ['V', 'C', 'E'], Admin: ['V', 'C', 'E'] },
  Classes: { SuperAdmin: ['V', 'C', 'E'], Admin: ['V', 'C', 'E'] },
  Subjects: { SuperAdmin: ['V', 'C', 'E'], Admin: ['V', 'C', 'E'] },
  Attendance: { SuperAdmin: ['V', 'C', 'E', 'A'], Admin: ['V', 'C', 'E'], Teacher: ['V', 'C'] },
  Examinations: { SuperAdmin: ['V', 'C', 'E', 'A'], Admin: ['V', 'C', 'E'], Teacher: ['V'] },
  Fees: { SuperAdmin: ['V', 'C', 'E'], Admin: ['V', 'C', 'E'], Accountant: ['V', 'C'] },
  Expenses: { SuperAdmin: ['V', 'C', 'E', 'A'], Admin: ['V', 'A'], Accountant: ['V', 'C'] },
  Library: { SuperAdmin: ['V', 'C', 'E'], Admin: ['V', 'C', 'E'] },
  Transport: { SuperAdmin: ['V', 'C', 'E'], Admin: ['V', 'C', 'E'] },
};
