
export type Student = {
  id: string;
  name: string;
  classId: string;
  parentName: string;
  admissionDate: string;
  email: string;
  profilePhoto?: string;
  dateOfBirth?: string;
  gender?: string;
  permanentAddress?: string;
  phone?: string;
  fatherName: string;
  motherName: string;
  fatherMobile: string;
  motherMobile: string;
  parentEmail?: string;
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
  classTeacher?: string;
  academicYear?: string;
  passPercentage?: number;
};

export type Subject = {
  id: string;
  name: string;
  code: string;
  teacherId: string;
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

export type Book = {
    id: string;
    title: string;
    author: string;
    isbn: string;
    publisher: string;
    edition?: string;
    category: string;
    language: string;
    quantity: number;
    issued: number;
    lost: number;
    resourceType: string;
    barcode?: string;
    shelf?: string;
    rack?: string;
    coverImage: string;
};

export type BookIssue = {
    issueId: string;
    bookId: string;
    studentId: string;
    issueDate: string;
    dueDate: string;
    returnDate: string | null;
    status: 'Issued' | 'Returned';
    fineAmount: number;
    fineStatus: 'Paid' | 'Unpaid';
};


export const students: Student[] = [
  {
    id: 'S001',
    name: 'Alice Johnson',
    classId: 'C001',
    parentName: 'John Johnson',
    admissionDate: '2023-04-15',
    email: 'alice.j@example.com',
    fatherName: 'John Johnson',
    motherName: 'Mary Johnson',
    fatherMobile: '1234567890',
    motherMobile: '0987654321',
    permanentAddress: '123 Maple St, Springfield',
    phone: '1112223333',
    dateOfBirth: '2010-05-20',
    gender: 'Female',
    parentEmail: 'john.j@example.com',
  },
  {
    id: 'S002',
    name: 'Bob Williams',
    classId: 'C002',
    parentName: 'Robert Williams',
    admissionDate: '2023-04-16',
    email: 'bob.w@example.com',
    fatherName: 'Robert Williams',
    motherName: 'Susan Williams',
    fatherMobile: '1234567891',
    motherMobile: '0987654322',
    permanentAddress: '456 Oak Ave, Springfield',
    phone: '2223334444',
    dateOfBirth: '2011-02-15',
    gender: 'Male',
  },
  {
    id: 'S003',
    name: 'Charlie Brown',
    classId: 'C001',
    parentName: 'Charles Brown',
    admissionDate: '2023-04-17',
    email: 'charlie.b@example.com',
    fatherName: 'Charles Brown',
    motherName: 'Patricia Brown',
    fatherMobile: '1234567892',
    motherMobile: '0987654323',
    permanentAddress: '789 Pine Ln, Springfield',
    phone: '3334445555',
    dateOfBirth: '2010-08-10',
    gender: 'Male',
  },
    {
    id: 'S004',
    name: 'Diana Prince',
    classId: 'C003',
    parentName: 'Queen Hippolyta',
    admissionDate: '2023-05-01',
    email: 'diana.p@example.com',
    fatherName: 'Zeus',
    motherName: 'Queen Hippolyta',
    fatherMobile: '1234567893',
    motherMobile: '0987654324',
    permanentAddress: 'Themyscira',
    phone: '4445556666',
    dateOfBirth: '2009-11-22',
    gender: 'Female',
  },
  {
    id: 'S005',
    name: 'Ethan Hunt',
    classId: 'C002',
    parentName: 'Mr. Hunt',
    admissionDate: '2023-05-02',
    email: 'ethan.h@example.com',
    fatherName: 'Mr. Hunt',
    motherName: 'Mrs. Hunt',
    fatherMobile: '1234567894',
    motherMobile: '0987654325',
    permanentAddress: '456 Mission St, San Francisco',
    phone: '5556667777',
    dateOfBirth: '2011-01-30',
    gender: 'Male',
  },
];

export const teachersData: Teacher[] = [
    {
        id: 'T001',
        name: 'Dr. Evelyn Reed',
        department: 'Science',
        subjects: ['Physics', 'Chemistry'],
        role: 'HOD',
        qualification: 'Ph.D. in Physics',
        experience: '15 years',
        phone: '123-456-7890',
        email: 'e.reed@school.edu',
        status: 'Active',
        profilePhoto: 'https://picsum.photos/seed/T001/200/200'
    },
    {
        id: 'T002',
        name: 'Mr. Samuel Green',
        department: 'Mathematics',
        subjects: ['Algebra', 'Calculus'],
        role: 'Class Teacher',
        qualification: 'M.Sc. in Mathematics',
        experience: '10 years',
        phone: '123-456-7891',
        email: 's.green@school.edu',
        status: 'Active',
        profilePhoto: 'https://picsum.photos/seed/T002/200/200'
    },
    {
        id: 'T003',
        name: 'Ms. Clara Oswald',
        department: 'English',
        subjects: ['Literature', 'Grammar'],
        role: 'Teacher',
        qualification: 'M.A. in English',
        experience: '8 years',
        phone: '123-456-7892',
        email: 'c.oswald@school.edu',
        status: 'On Leave',
        profilePhoto: 'https://picsum.photos/seed/T003/200/200'
    },
    {
        id: 'T004',
        name: 'Mr. Albus Dumbledore',
        department: 'Arts',
        subjects: ['Transfiguration'],
        role: 'Professor',
        qualification: 'Order of Merlin, First Class',
        experience: '100+ years',
        phone: '123-456-7893',
        email: 'a.dumbledore@school.edu',
        status: 'Active',
        profilePhoto: 'https://picsum.photos/seed/T004/200/200'
    },
];

export const classesData: ClassInfo[] = [
  {
    id: 'C001',
    name: 'Class X-A',
    teacherId: 'T002',
    studentCount: 30,
    capacity: 35,
    status: 'Active',
    dailyAttendance: 95,
    passPercentage: 88,
  },
  {
    id: 'C002',
    name: 'Class IX-B',
    teacherId: 'T003',
    studentCount: 28,
    capacity: 30,
    status: 'Active',
    dailyAttendance: 92,
    passPercentage: 91,
  },
    {
    id: 'C003',
    name: 'Class VIII-A',
    teacherId: 'T001',
    studentCount: 32,
    capacity: 35,
    status: 'Active',
    dailyAttendance: 98,
    passPercentage: 95,
  },
];

export const subjectsData: Subject[] = [
    { id: 'SUB001', name: 'Physics', code: 'PHY101', teacherId: 'T001' },
    { id: 'SUB002', name: 'Mathematics', code: 'MAT101', teacherId: 'T002' },
    { id: 'SUB003', name: 'English', code: 'ENG101', teacherId: 'T003' },
    { id: 'SUB004', name: 'Transfiguration', code: 'TRN101', teacherId: 'T004' },
    { id: 'SUB005', name: 'Chemistry', code: 'CHM101', teacherId: 'T001' },
];

export const feesData: Fee[] = [
    { invoiceId: 'INV001', studentId: 'S001', studentName: 'Alice Johnson', amount: 1500, dueDate: '2024-08-10', status: 'Paid', paymentDate: '2024-08-05', paymentMethod: 'Credit Card', description: 'Monthly Tuition Fee for August' },
    { invoiceId: 'INV002', studentId: 'S002', studentName: 'Bob Williams', amount: 1500, dueDate: '2024-08-10', status: 'Unpaid', paymentDate: null, paymentMethod: null, description: 'Monthly Tuition Fee for August' },
    { invoiceId: 'INV003', studentId: 'S003', studentName: 'Charlie Brown', amount: 200, dueDate: '2024-07-15', status: 'Overdue', paymentDate: null, paymentMethod: null, description: 'Library Fine for "1984"' },
    { invoiceId: 'INV004', studentId: 'S004', studentName: 'Diana Prince', amount: 1800, dueDate: '2024-08-10', status: 'Unpaid', paymentDate: null, paymentMethod: null, description: 'Monthly Tuition Fee for August' },
    { invoiceId: 'INV005', studentId: 'S001', studentName: 'Alice Johnson', amount: 500, dueDate: '2024-08-15', status: 'Paid', paymentDate: '2024-08-01', paymentMethod: 'Bank Transfer', description: 'Transport Fee for August' },
];

export const expensesData: Expense[] = [
    { id: 'EXP001', date: '2024-07-28', description: 'New lab equipment', amount: 5000, category: 'Academics', department: 'Science', status: 'Approved' },
    { id: 'EXP002', date: '2024-07-29', description: 'Office stationery', amount: 300, category: 'Supplies', department: 'Admin', status: 'Pending' },
    { id: 'EXP003', date: '2024-07-25', description: 'Sports day event expenses', amount: 1200, category: 'Events', department: 'Sports', status: 'Rejected' },
    { id: 'EXP004', date: '2024-08-01', description: 'Monthly internet bill', amount: 800, category: 'Utilities', department: 'Admin', status: 'Approved' },
];

export const assetsData: Asset[] = [
    { id: 'ASSET001', name: 'Dell Latitude 5420', category: 'Electronics', status: 'In Use', purchaseDate: '2023-01-15', value: 1200, assignedTo: 'Computer Lab', warrantyEndDate: '2026-01-14' },
    { id: 'ASSET002', name: 'Wooden Desk', category: 'Furniture', status: 'In Storage', purchaseDate: '2022-05-20', value: 150, assignedTo: 'Storeroom B' },
    { id: 'ASSET003', name: 'Microscope Olympus CX23', category: 'Lab Equipment', status: 'Under Maintenance', purchaseDate: '2023-03-10', value: 800, assignedTo: 'Science Lab' },
    { id: 'ASSET004', name: 'Basketballs (Set of 10)', category: 'Sports Gear', status: 'In Use', purchaseDate: '2024-02-01', value: 250, assignedTo: 'Sports Complex' },
];

export const announcementsData: Announcement[] = [
    { id: 'ANN001', title: 'Annual Sports Day Rescheduled', content: 'The annual sports day has been rescheduled to August 30th due to weather conditions.', author: 'Principal\'s Office', date: '2024-07-28', audience: 'All' },
    { id: 'ANN002', title: 'Parent-Teacher Meeting', content: 'A parent-teacher meeting will be held on August 15th for classes IX and X.', author: 'Academic Head', date: '2024-07-25', audience: 'Parents' },
    { id: 'ANN003', title: 'Science Fair Submissions', content: 'The last date for submitting projects for the science fair is August 20th. All interested students should register with the science department.', author: 'Admin Office', date: '2024-08-02', audience: 'Students' },
];

export const booksData: Book[] = [
    { id: 'B001', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', publisher: 'Scribner', category: 'Classic', language: 'English', quantity: 5, issued: 2, lost: 0, resourceType: 'Book', coverImage: 'https://picsum.photos/seed/B001/200/300' },
    { id: 'B002', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780061120084', publisher: 'Harper Perennial', category: 'Fiction', language: 'English', quantity: 3, issued: 3, lost: 0, resourceType: 'Book', coverImage: 'https://picsum.photos/seed/B002/200/300' },
    { id: 'B003', title: '1984', author: 'George Orwell', isbn: '9780451524935', publisher: 'Signet Classic', category: 'Dystopian', language: 'English', quantity: 4, issued: 1, lost: 1, resourceType: 'Book', coverImage: 'https://picsum.photos/seed/B003/200/300' },
    { id: 'B004', title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '9780553380163', publisher: 'Bantam', category: 'Science', language: 'English', quantity: 2, issued: 0, lost: 0, resourceType: 'Book', coverImage: 'https://picsum.photos/seed/B004/200/300' },
];

export const bookIssuesData: BookIssue[] = [
    { issueId: 'I001', bookId: 'B001', studentId: 'S001', issueDate: '2024-07-15', dueDate: '2024-07-29', returnDate: null, status: 'Issued', fineAmount: 0, fineStatus: 'Unpaid' },
    { issueId: 'I002', bookId: 'B002', studentId: 'S002', issueDate: '2024-07-10', dueDate: '2024-07-24', returnDate: '2024-07-28', status: 'Returned', fineAmount: 4, fineStatus: 'Unpaid' },
    { issueId: 'I003', bookId: 'B002', studentId: 'S003', issueDate: '2024-08-01', dueDate: '2024-08-15', returnDate: null, status: 'Issued', fineAmount: 0, fineStatus: 'Unpaid' },
];

export const routesData = [
  { id: 'R001', routeName: 'City Center Loop', vehicleId: 'V001', stops: ['Central Station', 'City Market', 'Town Hall', 'Library Park'] },
  { id: 'R002', routeName: 'Suburb Express', vehicleId: 'V002', stops: ['Suburb A', 'Suburb B', 'Suburb C', 'Green Valley'] },
  { id: 'R003', routeName: 'North Side Connector', vehicleId: 'V003', stops: ['North Point', 'River Side', 'Uptown Mall'] },
];

export const vehiclesData = [
  { id: 'V001', vehicleNumber: 'KA-01-AB-1234', type: 'Bus', capacity: 40, driverName: 'John Doe', driverContact: '9876543210', status: 'Active' },
  { id: 'V002', vehicleNumber: 'KA-01-CD-5678', type: 'Van', capacity: 15, driverName: 'Jane Smith', driverContact: '9876543211', status: 'Maintenance' },
  { id: 'V003', vehicleNumber: 'KA-01-EF-9101', type: 'Bus', capacity: 50, driverName: 'Mike Ross', driverContact: '9876543212', status: 'Active' },
];

export const studentTransportData = [
  { allocationId: 'ST001', studentId: 'S001', routeId: 'R001', stop: 'City Market', feeStatus: 'Paid' },
  { allocationId: 'ST002', studentId: 'S002', routeId: 'R002', stop: 'Suburb B', feeStatus: 'Unpaid' },
  { allocationId: 'ST003', studentId: 'S004', routeId: 'R001', stop: 'Town Hall', feeStatus: 'Paid' },
  { allocationId: 'ST004', studentId: 'S005', routeId: 'R003', stop: 'River Side', feeStatus: 'Unpaid' },
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

export type Permission = 'V' | 'C' | 'E' | 'A';

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
