
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { students as initialStudents } from '@/lib/data';

const studentFormSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits.'),
  dateOfBirth: z.date({
    required_error: 'A date of birth is required.',
  }),
  gender: z.enum(['Male', 'Female', 'Other']),
  permanentAddress: z
    .string()
    .min(10, 'Permanent Address must be at least 10 characters.'),
  classId: z.string({ required_error: 'Please select a class.' }),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

type Student = StudentFormValues & {
  schoolId: string;
}

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function EditStudentPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  const [student, setStudent] = useState<Student | undefined>(undefined);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
  });

  useEffect(() => {
    const storedStudents = localStorage.getItem('studentsData');
    if (storedStudents) {
      const students: Student[] = JSON.parse(storedStudents);
      const studentToEdit = students.find(s => s.id === studentId);
      if (studentToEdit) {
        setStudent(studentToEdit);
        form.reset({
          ...studentToEdit,
          dateOfBirth: studentToEdit.dateOfBirth ? parseISO(studentToEdit.dateOfBirth) : new Date(),
        });
      }
    } else {
        const studentToEdit = initialStudents.find(s => s.id === studentId);
        if (studentToEdit) {
            setStudent(studentToEdit as any);
             form.reset({
                id: studentToEdit.id,
                name: studentToEdit.name,
                email: studentToEdit.email,
                phone: studentToEdit.phone,
                dateOfBirth: new Date(),
                gender: 'Male',
                permanentAddress: studentToEdit.address,
                classId: studentToEdit.classId
            });
        }
    }
  }, [studentId, form]);

  function onSubmit(data: StudentFormValues) {
    const storedStudents = localStorage.getItem('studentsData');
    const students: Student[] = storedStudents ? JSON.parse(storedStudents) : initialStudents;

    const updatedStudents = students.map(s => {
        if (s.id === studentId) {
            return {
                ...s,
                ...data,
                dateOfBirth: format(data.dateOfBirth, 'yyyy-MM-dd')
            };
        }
        return s;
    });

    localStorage.setItem('studentsData', JSON.stringify(updatedStudents));

    toast({
      title: 'Student Updated',
      description: `${data.name} has been successfully updated.`,
    });
    router.push('/students');
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Edit Student</CardTitle>
        <CardDescription>
          Update the student's information below. Fields marked with{' '}
          <span className="text-destructive">*</span> are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="S123456"
                        {...field}
                        disabled
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Full Name</RequiredLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Email</RequiredLabel>
                    <FormControl>
                      <Input
                        placeholder="student@example.com"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Phone Number</RequiredLabel>
                    <FormControl>
                      <Input
                        placeholder="9876543210"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <RequiredLabel>Date of Birth</RequiredLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Gender</RequiredLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="permanentAddress"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Permanent Address</RequiredLabel>
                    <FormControl>
                      <Textarea
                        placeholder="123 Main St, Anytown, USA"
                        className="resize-none"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Class</RequiredLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="C001">Class X</SelectItem>
                        <SelectItem value="C002">Class IX</SelectItem>
                        <SelectItem value="C003">Class VIII</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit">Update Student</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Close
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
