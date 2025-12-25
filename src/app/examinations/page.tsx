'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  CheckCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

type Exam = {
    id: string;
    name: string;
    classId: string;
    date: string;
    status: 'Scheduled' | 'Completed' | 'Published';
};
type Mark = { 
    id: string;
    studentId: string;
    examId: string;
    marks: number | string;
};
type Student = {
    id: string;
    name: string;
    classId: string;
};
type ClassInfo = {
    id: string;
    name: string;
}

export default function ExaminationsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');

  const examsQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'schools/school-1/exams') : null), [firestore]);
  const { data: examsData } = useCollection<Exam>(examsQuery);
  
  const marksQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'schools/school-1/marks') : null), [firestore]);
  const { data: marksData } = useCollection<Mark>(marksQuery);
  
  const classesQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'schools/school-1/classes') : null), [firestore]);
  const { data: classesData } = useCollection<ClassInfo>(classesQuery);

  const studentsQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'schools/school-1/students') : null), [firestore]);
  const { data: students } = useCollection<Student>(studentsQuery);


  const classOptions = useMemo(() => classesData?.map(c => ({ value: c.id, label: c.name })) || [], [classesData]);
  
  const examOptions = useMemo(() => {
      if (selectedClass && examsData) {
          return examsData
            .filter(exam => exam.classId === selectedClass)
            .map(exam => ({ value: exam.id, label: exam.name}));
      }
      return [];
  }, [selectedClass, examsData]);

  const filteredMarks = useMemo(() => {
    if (!selectedExam || !selectedClass || !students || !marksData) return [];
    
    const examStudents = students.filter(s => s.classId === selectedClass);
    return examStudents.map(student => {
        const mark = marksData.find(m => m.studentId === student.id && m.examId === selectedExam);
        return {
            studentId: student.id,
            studentName: student.name,
            examId: selectedExam,
            marks: mark?.marks ?? 'N/A',
        };
    });
  }, [selectedExam, selectedClass, marksData, students]);

  const handlePublishResults = () => {
    if (!selectedExam) {
        toast({
            variant: 'destructive',
            title: 'No Exam Selected',
            description: 'Please select an exam to publish results.',
        });
        return;
    }
    toast({
        title: 'Results Published',
        description: `Results for exam ${selectedExam} have been published successfully.`,
    });
  };

  const getStatusBadgeVariant = (status: Exam['status']) => {
    switch (status) {
        case 'Scheduled': return 'warning';
        case 'Completed': return 'secondary';
        case 'Published': return 'success';
        default: return 'outline';
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Examinations & Assessments</h1>
      </div>

      <Tabs defaultValue="schedule">
        <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
          <TabsTrigger value="schedule">
            <List className="mr-2 h-4 w-4" /> Exam Schedule
          </TabsTrigger>
          <TabsTrigger value="marks">
            <ClipboardEdit className="mr-2 h-4 w-4" /> Manage Marks
          </TabsTrigger>
          <TabsTrigger value="results">
            <GraduationCap className="mr-2 h-4 w-4" /> Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Upcoming & Past Exams</CardTitle>
                <Button asChild>
                    <Link href="/examinations/add">
                        <FilePlus2 className="mr-2 h-4 w-4" /> Add New Exam
                    </Link>
                </Button>
              </div>
              <CardDescription>
                A list of all scheduled, completed, and published exams.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examsData?.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.name}</TableCell>
                      <TableCell>{classesData?.find(c => c.id === exam.classId)?.name || 'N/A'}</TableCell>
                      <TableCell>{exam.date}</TableCell>
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

        <TabsContent value="marks" className="mt-4">
           <Card>
            <CardHeader>
              <CardTitle>Manage Student Marks</CardTitle>
              <CardDescription>
                Select a class and exam to enter or update student marks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex flex-col gap-4 md:flex-row md:items-center">
                 <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-full md:w-[280px]">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 <Select value={selectedExam} onValueChange={setSelectedExam} disabled={!selectedClass}>
                  <SelectTrigger className="w-full md:w-[280px]">
                    <SelectValue placeholder="Select an exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {examOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
           </Card>

            {selectedExam && selectedClass && (
                <Card className="mt-4">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                             <CardTitle>Marks for {examOptions.find(e => e.value === selectedExam)?.label}</CardTitle>
                            <Button onClick={handlePublishResults}>
                                <CheckCircle className="mr-2 h-4 w-4" /> Publish Results
                            </Button>
                        </div>
                        <CardDescription>Class: {classesData?.find(c => c.id === selectedClass)?.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student ID</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead className="w-1/4">Marks</TableHead>
                                </TableRow>
                            </TableHeader>
                             <TableBody>
                                {filteredMarks.map(mark => (
                                    <TableRow key={mark.studentId}>
                                        <TableCell>{mark.studentId}</TableCell>
                                        <TableCell className="font-medium">{mark.studentName}</TableCell>
                                        <TableCell>
                                            <Input type="number" defaultValue={typeof mark.marks === 'number' ? mark.marks : ''} placeholder="Enter marks"/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {filteredMarks.length === 0 && (
                            <div className="py-10 text-center text-muted-foreground">
                            No students found for this class.
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </TabsContent>

        <TabsContent value="results" className="mt-4">
             <Card>
                <CardHeader>
                <CardTitle>View Results</CardTitle>
                <CardDescription>
                    Select a class and exam to view the published results.
                </CardDescription>
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
