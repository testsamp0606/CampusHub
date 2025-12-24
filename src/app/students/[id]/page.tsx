'use client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { students } from '@/lib/data';
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

export default function StudentProfilePage() {
  const params = useParams();
  const studentId = params.id;

  const student = students.find((s) => s.id === studentId);

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
                    <AvatarImage src={student.profilePhoto} alt={student.name} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-3xl">{student.name}</CardTitle>
                    <CardDescription>Student ID: {student.id}</CardDescription>
                </div>
            </div>
            <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
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
                <p>{student.address}</p>
                 <p className="font-medium text-muted-foreground">Aadhar No.</p>
                <p>{student.aadhar}</p>
            </div>
        </div>
         <div className="space-y-4">
            <h3 className="font-semibold text-lg">Academic Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <p className="font-medium text-muted-foreground">Class</p>
                <p>{student.class}</p>
                <p className="font-medium text-muted-foreground">Parent's Name</p>
                <p>{student.parentName}</p>
                 <p className="font-medium text-muted-foreground">Joining Date</p>
                <p>{student.admissionDate}</p>
                 <p className="font-medium text-muted-foreground">Hobbies</p>
                <p>{student.hobbies}</p>
            </div>
        </div>
        <div className="md:col-span-2 space-y-2">
             <h3 className="font-semibold text-lg">Academic Background</h3>
             <p className="text-sm text-muted-foreground">{student.academicBackground}</p>
        </div>
      </CardContent>
    </Card>
  );
}
