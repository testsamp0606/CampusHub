
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
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import HallTicket from './hall-ticket';

type Examination = {
    id: string;
    name: string;
    type: 'Mid-Term' | 'Half-Yearly' | 'Annual';
    status: 'Draft' | 'Scheduled' | 'Published' | 'Completed';
    startDate: string;
    endDate: string;
};
type Mark = { 
    id: string;
    studentId: string;
    assessmentId: string; // Corresponds to examId
    marks: number | string;
};
type Student = {
    id: string;
    name: string;
    classId: string;
    rollNumber?: string;
    profilePhoto?: string;
};
type ClassInfo = {
    id: string;
    name: string;
}
type ExamTimetableEntry = { 
    id: string; 
    class: string; 
    subject: string; 
    date: string; 
    time: string; 
    invigilator: string 
};


const timetable: ExamTimetableEntry[] = [
    { id: 'TT01', class: 'Class X-A', subject: 'Mathematics', date: '2024-09-15', time: '10:00 AM - 01:00 PM', invigilator: 'Mr. Green' },
    { id: 'TT02', class: 'Class X-A', subject: 'Physics', date: '2024-09-17', time: '10:00 AM - 01:00 PM', invigilator: 'Dr. Reed' },
    { id: 'TT03', class: 'Class IX-B', subject: 'English', date: '2024-09-16', time: '10:00 AM - 01:00 PM', invigilator: 'Ms. Oswald' },
];


export default function ExaminationsPage() {
    const { toast } = useToast();
    const firestore = useFirestore();

    const [marksEntryClass, setMarksEntryClass] = useState<string>('');
    const [marksEntryExam, setMarksEntryExam] = useState<string>('');
    const [hallTicketClass, setHallTicketClass] = useState<string>('');
    const [hallTicketExam, setHallTicketExam] = useState<string>('');

    const [marks, setMarks] = useState<Map<string, number | string>>(new Map());

    const { data: examsData } = useCollection<Examination>(useMemoFirebase(() => firestore ? collection(firestore, 'schools/school-1/examinations') : null, [firestore]));
    const { data: classesData } = useCollection<ClassInfo>(useMemoFirebase(() => firestore ? collection(firestore, 'schools/school-1/classes') : null, [firestore]));

    const marksQuery = useMemoFirebase(() => {
        if (!firestore || !marksEntryExam) return null;
        return query(collection(firestore, 'schools/school-1/marks'), where('assessmentId', '==', marksEntryExam));
    }, [firestore, marksEntryExam]);
    const { data: marksData } = useCollection<Mark>(marksQuery);

    const studentsForMarksQuery = useMemoFirebase(() => {
      if(!firestore || !marksEntryClass) return null;
      return query(collection(firestore, 'schools/school-1/students'), where('classId', '==', marksEntryClass))
    }, [firestore, marksEntryClass]);
    const { data: studentsForMarks } = useCollection<Student>(studentsForMarksQuery);
    
    const studentsForHallTicketQuery = useMemoFirebase(() => {
      if(!firestore || !hallTicketClass) return null;
      return query(collection(firestore, 'schools/school-1/students'), where('classId', '==', hallTicketClass))
    }, [firestore, hallTicketClass]);
    const { data: studentsForHallTicket } = useCollection<Student>(studentsForHallTicketQuery);

    React.useEffect(() => {
        if (marksData) {
            const newMarks = new Map<string, number | string>();
            marksData.forEach(mark => {
                newMarks.set(mark.studentId, mark.marks);
            });
            setMarks(newMarks);
        } else {
            setMarks(new Map());
        }
    }, [marksData]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'Scheduled': return 'warning';
        case 'Published': return 'success';
        case 'Completed': return 'default';
        default: return 'outline';
    }
  }

  const handleMarkChange = (studentId: string, value: string) => {
    const newMarks = new Map(marks);
    const numericValue = value === '' ? '' : Number(value);
    newMarks.set(studentId, numericValue);
    setMarks(newMarks);
  };

  const handleSaveMarks = () => {
    if (!firestore || !marksEntryExam || !studentsForMarks) return;

    const exam = examsData?.find(e => e.id === marksEntryExam);
    if (!exam) return;

    studentsForMarks.forEach(student => {
        const markValue = marks.get(student.id);
        if (markValue !== undefined) {
            const markId = `${marksEntryExam}-${student.id}`;
            const markRef = doc(firestore, 'schools/school-1/marks', markId);
            setDocumentNonBlocking(markRef, {
                id: markId,
                assessmentId: marksEntryExam, // Using assessmentId for marks as in Assessment module
                studentId: student.id,
                marks: markValue,
                schoolId: 'school-1',
            }, { merge: true });
        }
    });
    
    toast({
        title: 'Marks Saved',
        description: 'Student marks have been saved successfully.',
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Examinations</h1>
      </div>

      <Tabs defaultValue="schedule">
        <TabsList>
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
                  {examsData?.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.name}</TableCell>
                      <TableCell>{exam.type}</TableCell>
                      <TableCell>{exam.startDate} to {exam.endDate}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(exam.status)}>
                          {exam.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {examsData?.length === 0 && (
                      <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">No exams scheduled.</TableCell>
                      </TableRow>
                  )}
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
                 <div className="flex flex-col gap-4 md:flex-row md:items-center pt-4">
                 <Select value={marksEntryClass} onValueChange={setMarksEntryClass}>
                  <SelectTrigger className="w-full md:w-[280px]">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classesData?.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 <Select value={marksEntryExam} onValueChange={setMarksEntryExam} disabled={!marksEntryClass}>
                  <SelectTrigger className="w-full md:w-[280px]">
                    <SelectValue placeholder="Select an examination" />
                  </SelectTrigger>
                  <SelectContent>
                    {examsData?.filter(e => e.status !== 'Draft').map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
                </CardHeader>
                <CardContent>
                     {marksEntryClass && marksEntryExam ? (
                        <div>
                             <div className="flex justify-end mb-4">
                                <Button onClick={handleSaveMarks}>Save Marks</Button>
                             </div>
                            <Table>
                                <TableHeader><TableRow><TableHead>Student</TableHead><TableHead className="w-1/4">Marks</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {studentsForMarks?.map(student => (
                                         <TableRow key={student.id}>
                                            <TableCell className="font-medium">{student.name} ({student.id})</TableCell>
                                            <TableCell>
                                                <Input 
                                                    type="number"
                                                    value={marks.get(student.id) || ''}
                                                    onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                                    placeholder={`Max: ${examsData?.find(e => e.id === marksEntryExam)?.type === 'Mid-Term' ? 50 : 100}`}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {studentsForMarks?.length === 0 && <TableRow><TableCell colSpan={2} className="h-24 text-center">No students found for this class.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center rounded-lg border border-dashed p-10">
                            <div className="text-center text-muted-foreground">
                                <p>Please select a class and an examination to enter marks.</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="hall_tickets" className="mt-4">
             <Card>
                <CardHeader>
                <CardTitle>Hall Ticket Generation</CardTitle>
                <CardDescription>Generate and print hall tickets for students for a selected examination.</CardDescription>
                 <div className="flex flex-col gap-4 md:flex-row md:items-center pt-4">
                 <Select value={hallTicketClass} onValueChange={setHallTicketClass}>
                  <SelectTrigger className="w-full md:w-[280px]">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classesData?.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 <Select value={hallTicketExam} onValueChange={setHallTicketExam} disabled={!hallTicketClass}>
                  <SelectTrigger className="w-full md:w-[280px]">
                    <SelectValue placeholder="Select an examination" />
                  </SelectTrigger>
                  <SelectContent>
                    {examsData?.filter(e => e.status === 'Published').map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
                </CardHeader>
                <CardContent>
                    {hallTicketClass && hallTicketExam ? (
                        <Table>
                             <TableHeader><TableRow><TableHead>Student</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                             <TableBody>
                                 {studentsForHallTicket?.map(student => (
                                     <TableRow key={student.id}>
                                         <TableCell className="font-medium flex items-center gap-2">
                                             <User className="h-4 w-4 text-muted-foreground"/>
                                             {student.name} ({student.id})
                                         </TableCell>
                                         <TableCell className="text-right">
                                             <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm"><Printer className="mr-2 h-4 w-4"/> View & Print</Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-3xl">
                                                    <DialogHeader>
                                                        <DialogTitle>Hall Ticket</DialogTitle>
                                                    </DialogHeader>
                                                    <HallTicket 
                                                        student={student}
                                                        exam={examsData?.find(e => e.id === hallTicketExam)!}
                                                        timetable={timetable.filter(t => t.class === classesData?.find(c => c.id === hallTicketClass)?.name)}
                                                    />
                                                </DialogContent>
                                            </Dialog>
                                         </TableCell>
                                     </TableRow>
                                 ))}
                                 {studentsForHallTicket?.length === 0 && <TableRow><TableCell colSpan={2} className="h-24 text-center">No students found for this class.</TableCell></TableRow>}
                             </TableBody>
                        </Table>
                    ) : (
                         <div className="flex items-center justify-center rounded-lg border border-dashed p-10">
                            <div className="text-center text-muted-foreground">
                                <p>Please select a class and an examination to generate hall tickets.</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
