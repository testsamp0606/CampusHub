'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '../ui/progress';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { useMemo } from 'react';

type ClassInfo = {
    id: string;
    name: string;
    studentCount: number;
    teacherId: string;
    dailyAttendance?: number;
};

type Teacher = {
    id: string;
    name: string;
}

export default function ClassesTable() {
  const firestore = useFirestore();

  const classesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'schools', 'school-1', 'classes'));
  }, [firestore]);
  
  const { data: classesData, isLoading: classesLoading } = useCollection<ClassInfo>(classesQuery);

  const teachersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'schools', 'school-1', 'teachers'));
  }, [firestore]);

  const { data: teachersData, isLoading: teachersLoading } = useCollection<Teacher>(teachersQuery);

  const enrichedClasses = useMemo(() => {
    if (!classesData || !teachersData) return [];
    const teacherMap = new Map(teachersData.map(t => [t.id, t.name]));
    return classesData.map(c => ({
        ...c,
        classTeacher: teacherMap.get(c.teacherId) || 'N/A'
    }));
  }, [classesData, teachersData]);

  const isLoading = classesLoading || teachersLoading;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="font-headline">Classes Information</CardTitle>
        <CardDescription>
          Overview of daily attendance and class details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative max-h-[300px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead className="text-center">Student Count</TableHead>
                <TableHead>Daily Attendance</TableHead>
                <TableHead>Class Teacher</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {enrichedClasses?.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-center">
                    {item.studentCount}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={item.dailyAttendance || 0} className="w-[60%]" />
                      <span>{item.dailyAttendance || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.classTeacher}</TableCell>
                </TableRow>
              ))}
               {(!isLoading && (!enrichedClasses || enrichedClasses.length === 0)) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No classes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
