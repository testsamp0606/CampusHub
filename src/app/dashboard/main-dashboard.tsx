
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from './stat-card';
import AttendanceCard from './attendance-card';
import ClassesTable from './classes-table';
import AnomalyDetector from './anomaly-detector';
import ClassPerformanceChart from './student-charts/class-performance-chart';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Briefcase, School2, Users, TrendingUp, UserCheck, UserX, UserPlus } from 'lucide-react';

export type StatCardData = {
  title: string;
  count: string;
  Icon: React.ElementType;
  color: string;
  bgColor: string;
};


export default function MainDashboard() {
  const firestore = useFirestore();

  const studentsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'schools/school-1/students') : null),
    [firestore]
  );
  const { data: students, isLoading: studentsLoading } = useCollection(studentsQuery);

  const teachersQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'schools/school-1/teachers') : null),
    [firestore]
  );
  const { data: teachers, isLoading: teachersLoading } = useCollection(teachersQuery);
  
  const classesQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'schools/school-1/classes') : null),
    [firestore]
  );
  const { data: classes, isLoading: classesLoading } = useCollection(classesQuery);


  const statCardsData: StatCardData[] = [
    {
      title: 'Total Students',
      count: studentsLoading ? '...' : students?.length.toString() || '0',
      Icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Teachers',
      count: teachersLoading ? '...' : teachers?.length.toString() || '0',
      Icon: Briefcase,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Classes Count',
      count: classesLoading ? '...' : classes?.length.toString() || '0',
      Icon: School2,
      color: 'text-pink-500',
      bgColor: 'bg-pink-100',
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              {statCardsData.map((card) => (
                <StatCard key={card.title} {...card} />
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <AttendanceCard title="Student Attendance" present={193} absent={10} />
              <AttendanceCard title="Teacher Attendance" present={24} absent={1} />
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
