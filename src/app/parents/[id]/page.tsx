'use client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { parents } from '@/lib/data';
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

export default function ParentProfilePage() {
  const params = useParams();
  const parentId = params.id;

  const parent = parents.find((p) => p.id === parentId);

  if (!parent) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Parent not found.</p>
      </div>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                 <Avatar className="h-20 w-20">
                    <AvatarImage src={parent.profilePhoto} alt={parent.name} />
                    <AvatarFallback>{parent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-3xl">{parent.name}</CardTitle>
                    <CardDescription>Parent ID: {parent.id}</CardDescription>
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
                <p>{parent.email}</p>
                <p className="font-medium text-muted-foreground">Phone</p>
                <p>{parent.phone}</p>
                <p className="font-medium text-muted-foreground">Address</p>
                <p>{parent.address}</p>
                 <p className="font-medium text-muted-foreground">Occupation</p>
                <p>{parent.occupation}</p>
            </div>
        </div>
         <div className="space-y-4">
            <h3 className="font-semibold text-lg">Tagged Student Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <p className="font-medium text-muted-foreground">Student Name</p>
                <p>{parent.studentName}</p>
                <p className="font-medium text-muted-foreground">Student ID</p>
                 <Link href={`/students/${parent.studentId}`} className="text-primary hover:underline">
                    {parent.studentId}
                </Link>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
