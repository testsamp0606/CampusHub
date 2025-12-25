
'use client';
import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FilePlus2,
  List,
  GraduationCap,
  ClipboardEdit,
  Printer,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Mock Data
const exams = [
  { id: 'EXM001', name: 'Mid-Term Examination 2024', type: 'Mid-Term', status: 'Published', dateRange: '2024-09-15 to 2024-09-25' },
  { id: 'EXM002', name: 'Annual Examination 2024', type: 'Annual', status: 'Scheduled', dateRange: '2025-03-10 to 2025-03-25' },
];

const timetable = [
    { id: 'TT01', class: 'Class X', subject: 'Mathematics', date: '2024-09-15', time: '10:00 AM - 01:00 PM', invigilator: 'Mr. Green' },
    { id: 'TT02', class: 'Class X', subject: 'Physics', date: '2024-09-17', time: '10:00 AM - 01:00 PM', invigilator: 'Dr. Reed' },
    { id: 'TT03', class: 'Class IX', subject: 'English', date: '2024-09-16', time: '10:00 AM - 01:00 PM', invigilator: 'Ms. Oswald' },
];


export default function ExaminationsPage() {

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'Scheduled': return 'warning';
        case 'Published': return 'success';
        case 'Completed': return 'default';
        default: return 'outline';
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Examinations</h1>
      </div>

      <Tabs defaultValue="schedule">
        <TabsList className="grid w-full grid-cols-4 md:w-[800px]">
          <TabsTrigger value="schedule">
            <List className="mr-2 h-4 w-4" /> Exam Schedule
          </TabsTrigger>
          <TabsTrigger value="timetable">
            <List className="mr-2 h-4 w-4" /> Exam Timetable
          </TabsTrigger>
          <TabsTrigger value="marks">
            <ClipboardEdit className="mr-2 h-4 w-4" /> Marks Entry
          </TabsTrigger>
          <TabsTrigger value="hall_tickets">
            <Printer className="mr-2 h-4 w-4" /> Hall Tickets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Exam Schedules</CardTitle>
                <Button asChild>
                    <Link href="/examinations/add">
                        <FilePlus2 className="mr-2 h-4 w-4" /> Create New Exam
                    </Link>
                </Button>
              </div>
              <CardDescription>
                List of all formal school examinations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.name}</TableCell>
                      <TableCell>{exam.type}</TableCell>
                      <TableCell>{exam.dateRange}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(exam.status)}>
                          {exam.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timetable" className="mt-4">
           <Card>
            <CardHeader>
                <CardTitle>Exam Timetable</CardTitle>
                <CardDescription>Detailed schedule for the ongoing/upcoming examination.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Class</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Invigilator</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {timetable.map(entry => (
                            <TableRow key={entry.id}>
                                <TableCell>{entry.class}</TableCell>
                                <TableCell>{entry.subject}</TableCell>
                                <TableCell>{entry.date}</TableCell>
                                <TableCell>{entry.time}</TableCell>
                                <TableCell>{entry.invigilator}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
           </Card>
        </TabsContent>
        
        <TabsContent value="marks" className="mt-4">
           <Card>
                <CardHeader>
                <CardTitle>Marks Entry</CardTitle>
                <CardDescription>Enter and manage student marks for completed exams.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center rounded-lg border border-dashed p-10">
                        <div className="text-center text-muted-foreground">
                            <p>This feature is coming soon.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="hall_tickets" className="mt-4">
             <Card>
                <CardHeader>
                <CardTitle>Hall Ticket Generation</CardTitle>
                <CardDescription>Generate and print hall tickets for students for a selected examination.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center rounded-lg border border-dashed p-10">
                        <div className="text-center text-muted-foreground">
                            <p>This feature is coming soon.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
