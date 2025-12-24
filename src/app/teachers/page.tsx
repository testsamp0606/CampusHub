
'use client';
import React, { useState, useMemo } from 'react';
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
import { Edit, Eye, Trash2, Search, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { teachersData } from '@/lib/data';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Teacher = (typeof teachersData)[0];

const TEACHERS_PER_PAGE = 5;

export default function TeachersPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleEdit = (teacherId: string) => {
    // router.push(`/teachers/${teacherId}/edit`);
    toast({ title: "Coming Soon!", description: "Edit functionality will be available soon."})
  };

  const handleDelete = (teacherId: string) => {
    toast({
      title: 'Delete Teacher',
      variant: 'destructive',
      description: `Deleting teacher with ID: ${teacherId}`,
    });
  };

   const getStatusBadgeVariant = (status: Teacher['status']) => {
    switch (status) {
        case 'Active': return 'success';
        case 'On Leave': return 'warning';
        case 'Inactive': return 'destructive';
        default: return 'outline';
    }
  }

  const filteredTeachers = useMemo(() => {
    return teachersData.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredTeachers.length / TEACHERS_PER_PAGE);

  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * TEACHERS_PER_PAGE;
    const endIndex = startIndex + TEACHERS_PER_PAGE;
    return filteredTeachers.slice(startIndex, endIndex);
  }, [filteredTeachers, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Faculty Management</h1>
        <Button asChild>
          <Link href="#">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Teacher
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Teachers</CardTitle>
          <CardDescription>
            A list of all teachers in the institution.
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, ID, department, or role..."
              className="w-full rounded-lg bg-background pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher.id}</TableCell>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.department}</TableCell>
                   <TableCell>{teacher.role}</TableCell>
                  <TableCell>
                     <Badge variant={getStatusBadgeVariant(teacher.status)}>
                        {teacher.status}
                      </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button asChild variant="ghost" size="icon" title="View Details">
                        <Link href="#">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit"
                        onClick={() => handleEdit(teacher.id)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        onClick={() => handleDelete(teacher.id)}
                        className="text-destructive hover:text-destructive"
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
           {paginatedTeachers.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              No teachers found.
            </div>
          )}
        </CardContent>
         <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{' '}
            <strong>
              {Math.min((currentPage - 1) * TEACHERS_PER_PAGE + 1, filteredTeachers.length)}
            </strong>{' '}
            to{' '}
            <strong>
              {Math.min(currentPage * TEACHERS_PER_PAGE, filteredTeachers.length)}
            </strong>{' '}
            of <strong>{filteredTeachers.length}</strong> teachers
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

