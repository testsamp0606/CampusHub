
'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, BookCopy, User, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { coursesData as initialCoursesData, teachersData as initialTeachersData, subjectsData as initialSubjectsData, classesData as initialClassesData } from '@/lib/data';
import type { Course, Teacher, Subject, ClassInfo } from '@/lib/data';

type EnrichedCourse = Course & {
    teacherName: string;
    subjectName: string;
    className: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<EnrichedCourse[]>([]);

  useEffect(() => {
    const storedCourses = initialCoursesData;
    const storedTeachers = initialTeachersData;
    const storedSubjects = initialSubjectsData;
    const storedClasses = initialClassesData;
    
    const teachersMap = new Map(storedTeachers.map((t: Teacher) => [t.id, t.name]));
    const subjectsMap = new Map(storedSubjects.map((s: Subject) => [s.id, s.name]));
    const classesMap = new Map(storedClasses.map((c: ClassInfo) => [c.id, c.name]));

    const enriched = storedCourses.map((course: Course) => ({
        ...course,
        teacherName: teachersMap.get(course.teacherId) || 'N/A',
        subjectName: subjectsMap.get(course.subjectId) || 'N/A',
        className: classesMap.get(course.classId) || 'N/A',
    }));
    
    setCourses(enriched);
  }, []);


  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Button asChild>
          <Link href="/lms/courses/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Course
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses
          .map((course) => (
            <Card key={course.id} className="shadow-sm hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader className="p-0">
                 {course.coverImage && (
                    <Image 
                        src={course.coverImage} 
                        alt={course.title}
                        width={600}
                        height={400}
                        className="rounded-t-lg aspect-video object-cover"
                    />
                 )}
              </CardHeader>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <Badge variant={course.status === 'Published' ? 'success' : 'outline'}>
                        {course.status}
                    </Badge>
                </div>
                 <CardDescription className="text-xs flex-1">{course.description}</CardDescription>
                
                 <div className="mt-4 text-xs text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2"><User className="h-4 w-4" /><span>{course.teacherName}</span></div>
                    <div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /><span>{course.subjectName}</span></div>
                    <div className="flex items-center gap-2"><BookCopy className="h-4 w-4" /><span>{course.className}</span></div>
                 </div>
              </div>
              <CardFooter className="p-6 pt-0">
                  <Button asChild className="w-full">
                    <Link href={`/lms/courses/${course.id}`}>Manage Course</Link>
                </Button>
              </CardFooter>
            </Card>
        ))}

        {courses.length === 0 && (
             <Card className="md:col-span-3">
                <CardContent className="py-20 text-center text-muted-foreground">
                    No courses found. Get started by creating a new course.
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
