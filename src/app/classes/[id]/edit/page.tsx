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

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function EditClassPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
  });

  useEffect(() => {
    const storedClasses = localStorage.getItem('classesData');
    const classes: ClassInfo[] = storedClasses ? JSON.parse(storedClasses) : initialClassesData;
    
    const classToEdit = classes.find((c) => c.id === classId);
    if (classToEdit) {
      form.reset(classToEdit);
    } else {
      toast({
        title: 'Error',
        description: 'Class not found.',
        variant: 'destructive',
      });
      router.push('/classes');
    }
  }, [classId, form, router, toast]);

  function onSubmit(data: ClassFormValues) {
    const storedClasses = localStorage.getItem('classesData');
    const currentClasses: ClassInfo[] = storedClasses
      ? JSON.parse(storedClasses)
      : initialClassesData;

    const updatedClasses = currentClasses.map((cls) => {
      if (cls.id === classId) {
        return {
          ...cls, // preserve studentCount
          ...data,
        };
      }
      return cls;
    });

    localStorage.setItem('classesData', JSON.stringify(updatedClasses));

    toast({
      title: 'Class Updated',
      description: `Class "${data.name}" has been successfully updated.`,
    });
    router.push(`/classes/${classId}`);
  }

  const teacherOptions = teachersData.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Edit Class</CardTitle>
        <CardDescription>
          Update the form below to modify the class details. Fields marked with{' '}
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
              <Button type="submit">Update Class</Button>
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
