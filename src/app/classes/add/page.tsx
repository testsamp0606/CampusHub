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
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  classesData as initialClassesData,
  teachersData,
} from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ClassInfo = (typeof initialClassesData)[0];

const classFormSchema = z.object({
  id: z.string(),
  name: z.string().min(3, 'Class name must be at least 3 characters.'),
  teacherId: z.string({ required_error: 'Please select a class teacher.' }),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1.'),
  academicYear: z
    .string()
    .regex(/^\d{4}-\d{4}$/, 'Academic year must be in YYYY-YYYY format.'),
  status: z.enum(['Active', 'Archived', 'Completed']),
});

type ClassFormValues = z.infer<typeof classFormSchema>;

const defaultValues: Partial<ClassFormValues> = {
  id: '',
  name: '',
  teacherId: '',
  capacity: 30,
  academicYear: '2024-2025',
  status: 'Active',
};

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function AddClassPage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const uniqueId = `C${Date.now().toString().slice(-6)}`;
    form.setValue('id', uniqueId);
  }, [form]);

  function onSubmit(data: ClassFormValues) {
    const storedClasses = localStorage.getItem('classesData');
    const currentClasses: ClassInfo[] = storedClasses
      ? JSON.parse(storedClasses)
      : [];

    const newClass: ClassInfo = {
      ...data,
      studentCount: 0, // New classes start with 0 students
    };

    const updatedClasses = [...currentClasses, newClass];
    localStorage.setItem('classesData', JSON.stringify(updatedClasses));

    toast({
      title: 'Class Created',
      description: `Class "${data.name}" has been successfully created.`,
    });
    form.reset();
    router.push('/classes');
  }

  const teacherOptions = teachersData.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Add New Class</CardTitle>
        <CardDescription>
          Fill out the form to create a new class. Fields marked with{' '}
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
                    <FormLabel>Class ID</FormLabel>
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
                    <RequiredLabel>Class Name</RequiredLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Class VII - Section A"
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
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Class Teacher</RequiredLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teacherOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Capacity</RequiredLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="35"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      The maximum number of students in this class.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="academicYear"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Academic Year</RequiredLabel>
                    <FormControl>
                      <Input
                        placeholder="2024-2025"
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Status</RequiredLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit">Create Class</Button>
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
