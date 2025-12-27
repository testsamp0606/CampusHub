
'use client';
import React, { useState, useMemo, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { courseAssignmentsData as initialAssignmentsData, coursesData as initialCoursesData, classesData as initialClassesData } from '@/lib/data';
import type { CourseAssignment, Course, ClassInfo } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type EnrichedAssignment = CourseAssignment & {
    courseTitle: string;
    className: string;
};

export default function AssignmentsPage() {
    const [assignments, setAssignments] = useState<CourseAssignment[]>(initialAssignmentsData);
    const [courses, setCourses] = useState<Course[]>(initialCoursesData);
    const [classes, setClasses] = useState<ClassInfo[]>(initialClassesData);
    const [searchQuery, setSearchQuery] = useState('');

    const enrichedAssignments = useMemo(() => {
        const coursesMap = new Map(courses.map(c => [c.id, { title: c.title, classId: c.classId }]));
        const classesMap = new Map(classes.map(c => [c.id, c.name]));
        
        return assignments.map(assignment => {
            const course = coursesMap.get(assignment.courseId);
            const className = course ? classesMap.get(course.classId) : 'N/A';
            return {
                ...assignment,
                courseTitle: course?.title || 'Unknown Course',
                className: className || 'Unknown Class',
            };
        });
    }, [assignments, courses, classes]);
    
    const filteredAssignments = useMemo(() => {
        return enrichedAssignments.filter(a => 
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.className.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [enrichedAssignments, searchQuery]);

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">All Assignments</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Assignment List</CardTitle>
                    <CardDescription>A complete list of all assignments across all courses.</CardDescription>
                     <div className="relative mt-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                        type="search"
                        placeholder="Search by assignment, course, or class..."
                        className="w-full rounded-lg bg-background pl-8 md:w-1/3"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Assignment Title</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Max Marks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {filteredAssignments.map((assignment) => (
                                <TableRow key={assignment.id}>
                                    <TableCell className="font-medium">{assignment.title}</TableCell>
                                    <TableCell>{assignment.courseTitle}</TableCell>
                                    <TableCell>{assignment.className}</TableCell>
                                    <TableCell>{assignment.dueDate}</TableCell>
                                    <TableCell>{assignment.maxMarks}</TableCell>
                                </TableRow>
                            ))}
                            {filteredAssignments.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                    No assignments found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
