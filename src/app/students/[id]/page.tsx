
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
import { useEffect, useState } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  permanentAddress: string;
  dateOfBirth: string;
  gender: string;
  classId: string;
  profilePhoto?: string;
};

export default function StudentProfilePage() {
  const params = useParams();
  const studentId = params.id as string;
  const firestore = useFirestore();

  const studentDocRef = useMemoFirebase(() => (
    firestore ? doc(firestore, 'schools/school-1/students', studentId) : null
  ), [firestore, studentId]);

  const { data: student, isLoading } = useDoc<Student>(studentDocRef);

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
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
                {student.profilePhoto && (
                    <AvatarImage src={student.profilePhoto} alt={student.name} />
                )}
              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl">{student.name}</CardTitle>
              <CardDescription>Student ID: {student.id}</CardDescription>
            </div>
          </div>
          <Button asChild>
            <Link href={`/students/${studentId}/edit`}>
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
            <p>{student.email}</p>
            <p className="font-medium text-muted-foreground">Phone</p>
            <p>{student.phone}</p>
            <p className="font-medium text-muted-foreground">Address</p>
            <p>{student.permanentAddress}</p>
            <p className="font-medium text-muted-foreground">Date of Birth</p>
            <p>{student.dateOfBirth}</p>
             <p className="font-medium text-muted-foreground">Gender</p>
            <p>{student.gender}</p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Academic Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p className="font-medium text-muted-foreground">Class</p>
            <p>{student.classId}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
