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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { teachersData as initialTeachersData } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Teacher = (typeof initialTeachersData)[0];

const teacherFormSchema = z.object({
  id: z.string(),
  name: z.string().min(3, 'Teacher name must be at least 3 characters.'),
  department: z.string().min(3, 'Department is required.'),
  subjects: z.string().min(3, 'Subjects are required.'),
  role: z.string().min(3, 'Role is required.'),
  qualification: z.string().min(2, 'Qualification is required.'),
  experience: z.string().min(1, 'Experience is required.'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits.'),
  email: z.string().email('Invalid email address.'),
  status: z.enum(['Active', 'On Leave', 'Inactive']),
  profilePhoto: z.any().optional(),
});

type TeacherFormValues = z.infer<typeof teacherFormSchema>;

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function EditTeacherPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const teacherId = params.id as string;
  
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
  });

  useEffect(() => {
    const storedTeachers = localStorage.getItem('teachersData');
    if (storedTeachers) {
        const teachers: Teacher[] = JSON.parse(storedTeachers);
        const teacherToEdit = teachers.find(a => a.id === teacherId);
        if (teacherToEdit) {
            form.reset({
                ...teacherToEdit,
                phone: teacherToEdit.phone.replace(/[^0-9]/g, '').slice(-10),
                subjects: teacherToEdit.subjects.join(', '),
            });
        } else {
            toast({ title: "Error", description: "Teacher not found.", variant: "destructive"});
            router.push('/teachers');
        }
    }
  }, [teacherId, form, router, toast]);

  function onSubmit(data: TeacherFormValues) {
    const storedTeachers = localStorage.getItem('teachersData');
    const currentTeachers: Teacher[] = storedTeachers ? JSON.parse(storedTeachers) : [];

    const updatedTeachers = currentTeachers.map(teacher => {
        if (teacher.id === teacherId) {
            return {
                ...teacher, // Keep original photo if not changed
                ...data,
                subjects: data.subjects.split(',').map(s => s.trim()),
            };
        }
        return teacher;
    });

    localStorage.setItem('teachersData', JSON.stringify(updatedTeachers));
    
    toast({
      title: 'Teacher Updated',
      description: `Profile for "${data.name}" has been successfully updated.`,
    });
    router.push('/teachers');
  }

  const departmentOptions = ['Science', 'Mathematics', 'English', 'History', 'Computer Science', 'Arts'];
  const roleOptions = ['Teacher', 'Class Teacher', 'HOD', 'Professor', 'Lab Assistant'];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Edit Teacher Profile</CardTitle>
        <CardDescription>
          Update the form below to modify the faculty member's details. Fields marked with <span className="text-destructive">*</span> are required.
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
                    <FormLabel>Teacher ID</FormLabel>
                    <FormControl>
                      <Input {...field} disabled value={field.value || ''} />
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
                      <Input placeholder="e.g., Mr. John Doe" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Department</RequiredLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departmentOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Role</RequiredLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roleOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
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
                      <Input type="email" placeholder="teacher@example.com" {...field} value={field.value || ''} />
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
                      <Input type="tel" placeholder="9876543210" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Qualification</RequiredLabel>
                    <FormControl>
                      <Input placeholder="e.g., M.Sc. Physics" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Experience</RequiredLabel>
                    <FormControl>
                      <Input placeholder="e.g., 10 years" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="subjects"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                     <RequiredLabel>Subjects Taught</RequiredLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Physics, Chemistry, Algebra"
                        className="resize-none"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>Enter subjects separated by commas.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Status</RequiredLabel>
                     <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select teacher status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profilePhoto"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Profile Photo</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} {...field} />
                    </FormControl>
                    <FormDescription>
                      Upload a new profile picture to replace the current one.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit">Update Teacher</Button>
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
