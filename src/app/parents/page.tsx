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
import { Edit, Eye, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { parents } from '@/lib/data';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Parent = (typeof parents)[0];

const PARENTS_PER_PAGE = 5;

export default function ParentsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleEdit = (parentId: string) => {
    router.push(`/parents/${parentId}/edit`);
  };

  const handleDelete = (parentId: string) => {
    toast({
      title: 'Delete Parent',
      variant: 'destructive',
      description: `Deleting parent with ID: ${parentId}`,
    });
  };

  const filteredParents = useMemo(() => {
    return parents.filter(
      (parent) =>
        parent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parent.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parent.studentName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredParents.length / PARENTS_PER_PAGE);

  const paginatedParents = useMemo(() => {
    const startIndex = (currentPage - 1) * PARENTS_PER_PAGE;
    const endIndex = startIndex + PARENTS_PER_PAGE;
    return filteredParents.slice(startIndex, endIndex);
  }, [filteredParents, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Parents</h1>
        <Button asChild>
          <Link href="/parents/add">Add New Parent</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Parents</CardTitle>
          <CardDescription>
            A list of all parents in the school.
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search parents by name, ID, or email..."
              className="w-full rounded-lg bg-background pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on new search
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parent ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Tagged Student</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedParents.map((parent) => (
                <TableRow key={parent.id}>
                  <TableCell>{parent.id}</TableCell>
                  <TableCell className="font-medium">{parent.name}</TableCell>
                  <TableCell>{parent.studentName}</TableCell>
                  <TableCell>{parent.phone}</TableCell>
                  <TableCell>{parent.email}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button asChild variant="ghost" size="icon">
                        <Link href={`/parents/${parent.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(parent.id)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(parent.id)}
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
           {paginatedParents.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              No parents found.
            </div>
          )}
        </CardContent>
         <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{' '}
            <strong>
              {Math.min((currentPage - 1) * PARENTS_PER_PAGE + 1, filteredParents.length)}
            </strong>{' '}
            to{' '}
            <strong>
              {Math.min(currentPage * PARENTS_PER_PAGE, filteredParents.length)}
            </strong>{' '}
            of <strong>{filteredParents.length}</strong> parents
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
