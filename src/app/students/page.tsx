'use client';
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
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const students = [
  {
    id: 'S001',
    name: 'John Doe',
    class: 'Class X',
    parentName: 'Jane Doe',
    admissionDate: '2023-04-15',
  },
  {
    id: 'S002',
    name: 'Jane Smith',
    class: 'Class IX',
    parentName: 'John Smith',
    admissionDate: '2023-05-20',
  },
  {
    id: 'S003',
    name: 'Mike Johnson',
    class: 'Class X',
    parentName: 'Mary Johnson',
    admissionDate: '2023-04-18',
  },
  {
    id: 'S004',
    name: 'Emily White',
    class: 'Class VIII',
    parentName: 'David White',
    admissionDate: '2023-06-01',
  },
];

export default function StudentsPage() {
  const { toast } = useToast();

  const handleEdit = (studentId: string) => {
    toast({
      title: 'Edit Student',
      description: `Editing student with ID: ${studentId}`,
    });
  };

  const handleDelete = (studentId: string) => {
    toast({
      title: 'Delete Student',
      variant: 'destructive',
      description: `Deleting student with ID: ${studentId}`,
    });
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Students</h1>
        <Button>Add New Student</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>A list of all students in the school.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Parent Name</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.parentName}</TableCell>
                  <TableCell>{student.admissionDate}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(student.id)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(student.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
