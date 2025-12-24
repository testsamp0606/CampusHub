'use client';
import React from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const students = [
  {
    id: 'S001',
    name: 'John Doe',
    class: 'Class X',
    parentName: 'Jane Doe',
    admissionDate: '2023-04-15',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main St, Anytown, USA',
  },
  {
    id: 'S002',
    name: 'Jane Smith',
    class: 'Class IX',
    parentName: 'John Smith',
    admissionDate: '2023-05-20',
    email: 'jane.smith@example.com',
    phone: '123-456-7891',
    address: '456 Oak Ave, Anytown, USA',
  },
  {
    id: 'S003',
    name: 'Mike Johnson',
    class: 'Class X',
    parentName: 'Mary Johnson',
    admissionDate: '2023-04-18',
    email: 'mike.johnson@example.com',
    phone: '123-456-7892',
    address: '789 Pine Ln, Anytown, USA',
  },
  {
    id: 'S004',
    name: 'Emily White',
    class: 'Class VIII',
    parentName: 'David White',
    admissionDate: '2023-06-01',
    email: 'emily.white@example.com',
    phone: '123-456-7893',
    address: '101 Maple Dr, Anytown, USA',
  },
];

type Student = (typeof students)[0];

export default function StudentsPage() {
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };

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
        <h1 className="text-2xl font-bold">Students</h1>
        <Button>Add New Student</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>
            A list of all students in the school.
          </CardDescription>
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
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(student)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedStudent && (
            <>
              <DialogHeader>
                <DialogTitle>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {selectedStudent.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{selectedStudent.name}</p>
                      <p className="text-sm font-normal text-muted-foreground">
                        Student ID: {selectedStudent.id}
                      </p>
                    </div>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Detailed information for {selectedStudent.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 items-center gap-4">
                  <p className="font-semibold text-right">Class:</p>
                  <p>{selectedStudent.class}</p>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <p className="font-semibold text-right">Parent's Name:</p>
                  <p>{selectedStudent.parentName}</p>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <p className="font-semibold text-right">Admission Date:</p>
                  <p>{selectedStudent.admissionDate}</p>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <p className="font-semibold text-right">Email:</p>
                  <p>{selectedStudent.email}</p>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <p className="font-semibold text-right">Phone:</p>
                  <p>{selectedStudent.phone}</p>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <p className="font-semibold text-right">Address:</p>
                  <p>{selectedStudent.address}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}