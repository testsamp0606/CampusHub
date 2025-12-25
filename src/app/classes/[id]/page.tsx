'use client';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Edit,
  User,
  Users,
  ChevronUp,
  Trash2,
  BookOpen,
  Clock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';

type ClassInfo = {
  id: string;
  name: string;
  teacherId: string;
  capacity: number;
  academicYear: string;
  status: 'Active' | 'Archived' | 'Completed';
  studentCount: number;
  classTeacher?: string;
};
type Student = {
    id: string;
    name: string;
    email: string;
    parentName: string;
};
type Teacher = { id: string; name: string };

const periodTimes = [
  '09:00 - 09:45',
  '09:45 - 10:30',
  '11:00 - 11:45',
  '11:45 - 12:30',
  '13:30 - 14:15',
  '14:15 - 15:00',
];

type TimetableEntry = {
  period: number;
  subject: string;
  teacher: string;
  time: string;
};

const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
  'Geography',
  'Computer Science',
];

const generateRandomTimetable = (teachers: Teacher[]): TimetableEntry[] => {
  if (!teachers || teachers.length === 0) return [];
  return Array.from({ length: 6 }, (_, i) => ({
    period: i + 1,
    subject: subjects[Math.floor(Math.random() * subjects.length)],
    teacher: teachers[Math.floor(Math.random() * teachers.length)].name,
    time: periodTimes[i],
  }));
};

export default function ClassDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;
  const firestore = useFirestore();

  const classDocRef = useMemoFirebase(() => (firestore ? doc(firestore, 'schools/school-1/classes', classId) : null), [firestore, classId]);
  const { data: classData, isLoading: classLoading } = useDoc<ClassInfo>(classDocRef);
  
  const teacherDocRef = useMemoFirebase(() => (firestore && classData ? doc(firestore, 'schools/school-1/teachers', classData.teacherId) : null), [firestore, classData]);
  const { data: teacherData } = useDoc<Teacher>(teacherDocRef);

  const studentsQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, 'schools/school-1/students'), where('classId', '==', classId)) : null), [firestore, classId]);
  const { data: students, isLoading: studentsLoading } = useCollection<Student>(studentsQuery);

  const allTeachersQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'schools/school-1/teachers') : null), [firestore]);
  const { data: allTeachers } = useCollection<Teacher>(allTeachersQuery);

  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);

  const cls = useMemo(() => {
    if (!classData) return undefined;
    return {
      ...classData,
      classTeacher: teacherData?.name || 'N/A',
    };
  }, [classData, teacherData]);

  useEffect(() => {
    if (allTeachers) {
      setTimetable(generateRandomTimetable(allTeachers));
    }
  }, [allTeachers]);


  if (classLoading || studentsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  if (!cls) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Class not found.</p>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: ClassInfo['status']) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Archived':
        return 'secondary';
      case 'Completed':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Class Details</h1>
        <div className="flex justify-end gap-2">
          <Button asChild>
            <Link href={`/classes/${classId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Class
            </Link>
          </Button>
          <Button variant="outline" onClick={() => router.push('/classes')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        </div>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl">{cls.name}</CardTitle>
              <CardDescription>
                Academic Year: {cls.academicYear} | Class ID: {cls.id}
              </CardDescription>
            </div>
            <Badge
              variant={getStatusBadgeVariant(cls.status)}
              className="text-lg"
            >
              {cls.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class Teacher</p>
                <p className="font-semibold text-lg">{cls.classTeacher}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Student Enrollment
                </p>
                <p className="font-semibold text-lg">
                  {cls.studentCount} / {cls.capacity}
                </p>
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-1 flex items-center gap-4 rounded-lg border p-4">
              <div className="w-full">
                <p className="text-sm text-muted-foreground mb-2">
                  Class Capacity
                </p>
                <Progress value={(cls.studentCount / cls.capacity) * 100} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Class Timetable</CardTitle>
          <CardDescription>
            A sample daily routine for {cls.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timetable.map((entry) => (
                <TableRow key={entry.period}>
                  <TableCell className="font-medium py-4">
                    Period {entry.period}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {entry.time}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                     <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        {entry.subject}
                     </div>
                  </TableCell>
                  <TableCell className="py-4">{entry.teacher}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Enrolled Students</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">
                <ChevronUp className="mr-2 h-4 w-4" /> Promote Class
              </Button>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Archive Class
              </Button>
            </div>
          </div>
          <CardDescription>
            List of all students currently enrolled in {cls.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Parent Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students && students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="py-4">{student.id}</TableCell>
                  <TableCell className="font-medium py-4">{student.name}</TableCell>
                  <TableCell className="py-4">{student.email}</TableCell>
                  <TableCell className="py-4">{student.parentName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {(!students || students.length === 0) && (
            <div className="py-10 text-center text-muted-foreground">
              No students enrolled in this class yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
