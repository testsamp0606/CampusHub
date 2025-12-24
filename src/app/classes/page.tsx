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
import {
  classesData as initialClassesData,
  teachersData,
} from '@/lib/data';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

type ClassInfo = (typeof initialClassesData)[0];

export default function ClassesPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [classesData, setClassesData] = useState<ClassInfo[]>([]);

  useEffect(() => {
    const storedClasses = localStorage.getItem('classesData');
    const enrichedClasses = (
      storedClasses ? JSON.parse(storedClasses) : initialClassesData
    ).map((cls: ClassInfo) => {
      const teacher = teachersData.find((t) => t.id === cls.teacherId);
      return {
        ...cls,
        classTeacher: teacher ? teacher.name : 'N/A',
      };
    });
    setClassesData(enrichedClasses);
  }, []);

  const filteredClasses = useMemo(() => {
    return classesData.filter(
      (cls) =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cls.classTeacher &&
          cls.classTeacher.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, classesData]);

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
              {filteredClasses.map((cls) => (
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
            </TableBody>
          </Table>
          {filteredClasses.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              No classes found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
