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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, PlusCircle, Trash2, Edit, Book } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { subjectsData as initialSubjectsData, teachersData } from '@/lib/data';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Subject = (typeof initialSubjectsData)[0];

export default function SubjectsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const storedSubjects = localStorage.getItem('subjectsData');
    if (storedSubjects) {
      setSubjects(JSON.parse(storedSubjects));
    } else {
      setSubjects(initialSubjectsData);
      localStorage.setItem('subjectsData', JSON.stringify(initialSubjectsData));
    }
  }, []);

  const updateAndStoreSubjects = (newSubjects: Subject[]) => {
    setSubjects(newSubjects);
    localStorage.setItem('subjectsData', JSON.stringify(newSubjects));
  };


  const handleDelete = (subjectId: string) => {
    const updatedSubjects = subjects.filter(subject => subject.id !== subjectId);
    updateAndStoreSubjects(updatedSubjects);
    toast({
      title: 'Subject Deleted',
      variant: 'destructive',
      description: `Subject with ID: ${subjectId} has been permanently deleted.`,
    });
  };

  const filteredSubjects = useMemo(() => {
    return subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, subjects]);

  const getTeacherName = (teacherId: string) => {
    return teachersData.find(t => t.id === teacherId)?.name || 'N/A';
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subject Management</h1>
        <Button asChild>
          <Link href="/subjects/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Subject
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Subjects</CardTitle>
          <CardDescription>
            A list of all subjects offered by the institution.
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by subject name or code..."
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
                <TableHead>Subject Code</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Primary Teacher</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.code}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Book className="h-4 w-4 text-muted-foreground" />
                            {subject.name}
                        </div>
                    </TableCell>
                    <TableCell>{getTeacherName(subject.teacherId)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="icon" title="Edit">
                             <Link href={`/subjects/${subject.id}/edit`}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                            </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(subject.id)}
                          className="text-destructive hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
           {filteredSubjects.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              No subjects found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
