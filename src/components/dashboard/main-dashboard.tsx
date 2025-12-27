
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from './stat-card';
import AttendanceCard from './attendance-card';
import ClassesTable from './classes-table';
import AnomalyDetector from './anomaly-detector';
import ClassPerformanceChart from './student-charts/class-performance-chart';
import {
  Briefcase,
  School2,
  Users,
  TrendingUp,
  UserCheck,
  UserX,
  UserPlus,
  DollarSign,
  TrendingDown,
  Scale,
  PlusCircle,
} from 'lucide-react';
import {
  students as initialStudentsData,
  teachersData as initialTeachersData,
  classesData as initialClassesData,
  feesData as initialFeesData,
  expensesData as initialExpensesData,
  Fee,
  Expense,
} from '@/lib/data';
import { Button } from '../ui/button';
import Link from 'next/link';

export type StatCardData = {
  title: string;
  count: string;
  Icon: React.ElementType;
  color: string;
  bgColor: string;
};

export default function MainDashboard() {
  const [students, setStudents] = useState(initialStudentsData);
  const [teachers, setTeachers] = useState(initialTeachersData);
  const [classes, setClasses] = useState(initialClassesData);
  const [fees, setFees] = useState(initialFeesData);
  const [expenses, setExpenses] = useState(initialExpensesData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const studentsData = localStorage.getItem('studentsData');
    if (studentsData) setStudents(JSON.parse(studentsData));

    const teachersData = localStorage.getItem('teachersData');
    if (teachersData) setTeachers(JSON.parse(teachersData));

    const classesData = localStorage.getItem('classesData');
    if (classesData) setClasses(JSON.parse(classesData));
    
    const feesData = localStorage.getItem('feesData');
    if (feesData) setFees(JSON.parse(feesData));

    const expensesData = localStorage.getItem('expensesData');
    if (expensesData) setExpenses(JSON.parse(expensesData));

    setIsLoading(false);
  }, []);

  const financeStats = useMemo(() => {
    const totalIncome = fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
    const totalExpense = expenses.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0);
    const netBalance = totalIncome - totalExpense;
    return { totalIncome, totalExpense, netBalance };
  }, [fees, expenses]);

  const statCardsData: StatCardData[] = [
    {
      title: 'Total Students',
      count: isLoading ? '...' : students?.length.toString() || '0',
      Icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Teachers',
      count: isLoading ? '...' : teachers?.length.toString() || '0',
      Icon: Briefcase,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Classes Count',
      count: isLoading ? '...' : classes?.length.toString() || '0',
      Icon: School2,
      color: 'text-pink-500',
      bgColor: 'bg-pink-100',
    },
    {
      title: 'Total Revenue',
      count: isLoading ? '...' : `$${financeStats.totalIncome.toLocaleString()}`,
      Icon: DollarSign,
      color: 'text-teal-500',
      bgColor: 'bg-teal-100',
    },
    {
      title: 'Total Expenses',
      count: isLoading ? '...' : `$${financeStats.totalExpense.toLocaleString()}`,
      Icon: TrendingDown,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Net Balance',
      count: isLoading ? '...' : `$${financeStats.netBalance.toLocaleString()}`,
      Icon: Scale,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
    },
  ];

  const studentStatsData: StatCardData[] = [
    {
      title: 'New Admissions',
      count: '15',
      Icon: UserPlus,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Transferred Out',
      count: '3',
      Icon: UserX,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Class Toppers',
      count: '12',
      Icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Overall Attendance',
      count: '95%',
      Icon: UserCheck,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100',
    },
  ];

  const teacherStatsData: StatCardData[] = [
    {
      title: 'On-Leave',
      count: '2',
      Icon: UserX,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'New Hires',
      count: '3',
      Icon: UserPlus,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Resigned',
      count: '1',
      Icon: UserX,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="information">
        <TabsList className="grid w-full grid-cols-4 md:w-[600px]">
          <TabsTrigger value="information">Information</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="status">AI Status</TabsTrigger>
        </TabsList>
        <TabsContent value="information">
          <div className="flex flex-col gap-6">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {statCardsData.map((card) => (
                <StatCard key={card.title} {...card} />
              ))}
            </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button asChild variant="outline"><Link href="/students/add"><UserPlus className="mr-2"/>Add Student</Link></Button>
                <Button asChild variant="outline"><Link href="/teachers/add"><UserPlus className="mr-2"/>Add Teacher</Link></Button>
                <Button asChild variant="outline"><Link href="/fees/add"><DollarSign className="mr-2"/>Generate Invoice</Link></Button>
                <Button asChild variant="outline"><Link href="/announcements/add"><PlusCircle className="mr-2"/>New Announcement</Link></Button>
             </div>
            <div className="grid gap-4 md:grid-cols-2">
              <AttendanceCard
                title="Student Attendance"
                present={193}
                absent={10}
              />
              <AttendanceCard
                title="Teacher Attendance"
                present={24}
                absent={1}
              />
            </div>
            <ClassesTable />
          </div>
        </TabsContent>
        <TabsContent value="students">
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {studentStatsData.map((card) => (
                <StatCard key={card.title} {...card} />
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-1">
              <ClassPerformanceChart />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="teachers">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {teacherStatsData.map((card) => (
              <StatCard key={card.title} {...card} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="status">
          <AnomalyDetector />
        </TabsContent>
      </Tabs>
    </div>
  );
}
