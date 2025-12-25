
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { coursesData as initialCoursesData, teachersData as initialTeachersData, classesData as initialClassesData, subjectsData as initialSubjectsData } from '@/lib/data';
import type { Course, Teacher, ClassInfo, Subject } from '@/lib/data';

const courseFormSchema = z.object({
  id: z.string(),
  title: z.string().min(5, 'Course title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  teacherId: z.string({ required_error: 'Please select a teacher.' }),
  classId: z.string({ required_error: 'Please select a class.' }),
  subjectId: z.string({ required_error: 'Please select a subject.' }),
  status: z.enum(['Draft', 'Published']),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

const defaultValues: Partial<CourseFormValues> = {
  id: '',
  title: '',
  description: '',
  status: 'Draft',
};

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function AddCoursePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    setTeachers(JSON.parse(localStorage.getItem('teachersData') || JSON.stringify(initialTeachersData)));
    setClasses(JSON.parse(localStorage.getItem('classesData') || JSON.stringify(initialClassesData)));
    setSubjects(JSON.parse(localStorage.getItem('subjectsData') || JSON.stringify(initialSubjectsData)));
  }, []);


  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const uniqueId = `CRS${Date.now().toString().slice(-6)}`;
    form.setValue('id', uniqueId);
  }, [form]);

  function onSubmit(data: CourseFormValues) {
    const storedData = localStorage.getItem('coursesData');
    const currentData: Course[] = storedData ? JSON.parse(storedData) : initialCoursesData;

    const newCourse: Course = {
        ...data,
        coverImage: `https://picsum.photos/seed/${data.id}/600/400`,
    };

    const updatedData = [...currentData, newCourse];
    localStorage.setItem('coursesData', JSON.stringify(updatedData));
    
    toast({
      title: 'Course Created',
      description: `Your course "${data.title}" has been successfully created as a draft.`,
    });
    router.push('/lms/courses');
  }
  
  const teacherOptions = teachers.map(t => ({ value: t.id, label: t.name }));
  const classOptions = classes.map(c => ({ value: c.id, label: c.name }));
  const subjectOptions = subjects.map(s => ({ value: s.id, label: s.name }));

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Create New Course</CardTitle>
        <CardDescription>
          Fill out the form below to create a new course. Fields marked with <span className="text-destructive">*</span> are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <RequiredLabel>Course Title</RequiredLabel>
                    <FormControl>
                      <Input placeholder="e.g., Introduction to Modern Physics" {...field} />
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
                    <RequiredLabel>Assign Teacher</RequiredLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teacherOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Assign Class</RequiredLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Assign Subject</RequiredLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjectOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
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
                          <SelectValue placeholder="Set course status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Draft courses are not visible to students.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <RequiredLabel>Course Description</RequiredLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write a detailed description of the course content and objectives..."
                        className="resize-y min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit">Create Course</Button>
               <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/lms/courses')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
