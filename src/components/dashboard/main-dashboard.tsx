'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from './stat-card';
import { statCardsData, studentStatsData, teacherStatsData } from '@/lib/data';
import AttendanceCard from './attendance-card';
import ClassesTable from './classes-table';
import AnomalyDetector from './anomaly-detector';

export default function MainDashboard() {
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {studentStatsData.map((card) => (
              <StatCard key={card.title} {...card} />
            ))}
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
