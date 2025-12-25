'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, PlusCircle, User, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';

type ClassInfo = {
  id: string;
  name: string;
  teacherId: string;
  studentCount: number;
  capacity: number;
  status: 'Active' | 'Archived' | 'Completed';
  classTeacher?: string; // Optional because we'll add it
};

type Teacher = {
  id: string;
  name: string;
};

export default function ClassesPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const firestore = useFirestore();

  const classesQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'schools/school-1/classes') : null),
    [firestore]
  );
  const { data: classesData, isLoading: classesLoading } = useCollection<ClassInfo>(classesQuery);

  const teachersQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'schools/school-1/teachers') : null),
    [firestore]
  );
  const { data: teachersData, isLoading: teachersLoading } = useCollection<Teacher>(teachersQuery);

  const enrichedClasses = useMemo(() => {
    if (!classesData || !teachersData) return [];

    const teachersMap = new Map(teachersData.map(t => [t.id, t.name]));

    return classesData.map((cls) => ({
      ...cls,
      classTeacher: teachersMap.get(cls.teacherId) || 'N/A',
    }));
  }, [classesData, teachersData]);

  const filteredClasses = useMemo(() => {
    return enrichedClasses.filter(
      (cls) =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cls.classTeacher &&
          cls.classTeacher.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, enrichedClasses]);

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
  
  const isLoading = classesLoading || teachersLoading;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Class Management</h1>
        <Button asChild>
          <Link href="/classes/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Class
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Classes</CardTitle>
          <CardDescription>
            A list of all classes in the institution.
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by class name or teacher..."
              className="w-full rounded-lg bg-background pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Name</TableHead>
                <TableHead>Class Teacher</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                 <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                </TableRow>
              )}
              {!isLoading && filteredClasses.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {cls.classTeacher}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {cls.studentCount} / {cls.capacity}
                        </span>
                      </div>
                      <Progress
                        value={(cls.studentCount / cls.capacity) * 100}
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(cls.status)}>
                      {cls.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/classes/${cls.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && filteredClasses.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    No classes found.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
