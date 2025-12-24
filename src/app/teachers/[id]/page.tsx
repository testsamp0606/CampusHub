'use client';
import { useParams, useRouter } from 'next/navigation';
import { teachersData as initialTeachersData } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Teacher = (typeof initialTeachersData)[0];

export default function TeacherDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = params.id as string;
  
  const [teacher, setTeacher] = useState<Teacher | undefined>(undefined);

  useEffect(() => {
    const storedTeachers = localStorage.getItem('teachersData');
    const teachers: Teacher[] = storedTeachers ? JSON.parse(storedTeachers) : initialTeachersData;
    const currentTeacher = teachers.find((a) => a.id === teacherId);
    setTeacher(currentTeacher);
  }, [teacherId]);
  
  if (!teacher) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Teacher not found.</p>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: Teacher['status']) => {
    switch (status) {
        case 'Active': return 'success';
        case 'On Leave': return 'warning';
        case 'Inactive': return 'destructive';
        default: return 'outline';
    }
  }

  return (
    <div className="space-y-4">
        <div className="flex justify-end gap-2 mb-4">
             <Button asChild>
                <Link href={`/teachers/${teacherId}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                </Link>
            </Button>
            <Button variant="outline" onClick={() => router.push('/teachers')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to List
            </Button>
        </div>
        <Card className="shadow-lg max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={teacher.profilePhoto} alt={teacher.name} />
                    <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                    <CardTitle className="text-3xl">{teacher.name}</CardTitle>
                    <CardDescription className="text-lg">{teacher.role} - {teacher.department}</CardDescription>
                     <div className="mt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                        <Badge variant={getStatusBadgeVariant(teacher.status)}>{teacher.status}</Badge>
                        <Badge variant="secondary">ID: {teacher.id}</Badge>
                    </div>
                </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Professional Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p className="font-medium">Qualification</p><p>{teacher.qualification}</p>
                        <p className="font-medium">Experience</p><p>{teacher.experience}</p>
                        <p className="font-medium">Subjects</p>
                        <div className="flex flex-wrap gap-1">
                            {teacher.subjects.map(sub => <Badge key={sub} variant="outline">{sub}</Badge>)}
                        </div>
                    </div>
                </div>
                 <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p className="font-medium">Email</p><p>{teacher.email}</p>
                        <p className="font-medium">Phone</p><p>{teacher.phone}</p>
                    </div>
                </div>
             </div>
          </CardContent>
        </Card>
    </div>
  );
}
