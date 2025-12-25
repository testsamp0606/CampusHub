
'use client';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { students as initialStudentsData, Student } from '@/lib/data';
import { useState, useEffect } from 'react';


export default function ParentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const parentId = params.id as string; //This is actually studentId
  const [student, setStudent] = useState<Student | undefined>(undefined);

  useEffect(() => {
    const storedStudents = localStorage.getItem('students');
    const students: Student[] = storedStudents ? JSON.parse(storedStudents) : initialStudentsData;
    const currentStudent = students.find((s) => s.id === parentId);
    setStudent(currentStudent);
  }, [parentId]);


  if (!student) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Parent/Student not found.</p>
      </div>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                 <Avatar className="h-20 w-20">
                    <AvatarFallback>{student.fatherName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-3xl">{student.fatherName}</CardTitle>
                    <CardDescription>Guardian of {student.name}</CardDescription>
                </div>
            </div>
            <Button asChild>
                <Link href={`/parents/${parentId}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                </Link>
            </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <p className="font-medium text-muted-foreground">Email</p>
                <p>{student.parentEmail || 'N/A'}</p>
                <p className="font-medium text-muted-foreground">Phone</p>
                <p>{student.fatherMobile}</p>
                <p className="font-medium text-muted-foreground">Address</p>
                <p>{student.permanentAddress}</p>
            </div>
        </div>
         <div className="space-y-4">
            <h3 className="font-semibold text-lg">Tagged Student Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <p className="font-medium text-muted-foreground">Student Name</p>
                <p>{student.name}</p>
                <p className="font-medium text-muted-foreground">Student ID</p>
                 <Link href={`/students/${student.id}`} className="text-primary hover:underline">
                    {student.id}
                </Link>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

    