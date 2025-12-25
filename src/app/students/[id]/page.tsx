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
import { Edit, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Student, students as initialStudentsData } from '@/lib/data';

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;
  const [student, setStudent] = useState<Student | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedStudents = localStorage.getItem('students');
    const students: Student[] = storedStudents ? JSON.parse(storedStudents) : initialStudentsData;
    const currentStudent = students.find((s) => s.id === studentId);
    setStudent(currentStudent);
    setIsLoading(false);
  }, [studentId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Student not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
          <Button asChild>
            <Link href={`/students/${studentId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
           <Button variant="outline" onClick={() => router.push('/students')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to List
           </Button>
        </div>
        <Card className="shadow-lg">
        <CardHeader>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-28 w-28">
                    {student.profilePhoto && (
                        <AvatarImage src={student.profilePhoto} alt={student.name} />
                    )}
                <AvatarFallback className="text-3xl">{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                    <CardTitle className="text-3xl">{student.name}</CardTitle>
                    <CardDescription className="text-lg">Student ID: {student.id}</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="space-y-4">
                <h3 className="font-semibold text-xl border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 text-sm">
                    <div>
                        <p className="font-medium text-muted-foreground">Date of Birth</p>
                        <p>{student.dateOfBirth}</p>
                    </div>
                    <div>
                        <p className="font-medium text-muted-foreground">Gender</p>
                        <p>{student.gender}</p>
                    </div>
                    <div>
                        <p className="font-medium text-muted-foreground">Phone</p>
                        <p>{student.phone}</p>
                    </div>
                    <div>
                        <p className="font-medium text-muted-foreground">Email</p>
                        <p>{student.email}</p>
                    </div>
                    <div className="col-span-2 md:col-span-4">
                        <p className="font-medium text-muted-foreground">Address</p>
                        <p>{student.permanentAddress}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-xl border-b pb-2">Academic Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 text-sm">
                    <div>
                        <p className="font-medium text-muted-foreground">Class</p>
                        <p>{student.classId}</p>
                    </div>
                     <div>
                        <p className="font-medium text-muted-foreground">Admission Date</p>
                        <p>{student.admissionDate}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-xl border-b pb-2">Parent Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 text-sm">
                    <div>
                        <p className="font-medium text-muted-foreground">Father's Name</p>
                        <p>{student.fatherName}</p>
                    </div>
                     <div>
                        <p className="font-medium text-muted-foreground">Father's Phone</p>
                        <p>{student.fatherMobile}</p>
                    </div>
                    <div>
                        <p className="font-medium text-muted-foreground">Mother's Name</p>
                        <p>{student.motherName}</p>
                    </div>
                    <div>
                        <p className="font-medium text-muted-foreground">Mother's Phone</p>
                        <p>{student.motherMobile}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="font-medium text-muted-foreground">Parent's Email</p>
                        <p>{student.parentEmail || 'N/A'}</p>
                    </div>
                </div>
            </div>
        </CardContent>
        </Card>
    </div>
  );
}
