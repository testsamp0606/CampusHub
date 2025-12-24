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
import { subjectsData as initialSubjectsData, teachersData } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Subject = (typeof initialSubjectsData)[0];

const subjectFormSchema = z.object({
  id: z.string(),
  name: z.string().min(3, 'Subject name must be at least 3 characters.'),
  code: z.string().min(3, 'Subject code must be at least 3 characters.'),
  teacherId: z.string({ required_error: 'Please assign a primary teacher.' }),
});

type SubjectFormValues = z.infer<typeof subjectFormSchema>;

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function EditSubjectPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const subjectId = params.id as string;
  
  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
  });

  useEffect(() => {
    const storedSubjects = localStorage.getItem('subjectsData');
    if (storedSubjects) {
        const subjects: Subject[] = JSON.parse(storedSubjects);
        const subjectToEdit = subjects.find(s => s.id === subjectId);
        if (subjectToEdit) {
            form.reset(subjectToEdit);
        } else {
            toast({ title: "Error", description: "Subject not found.", variant: "destructive"});
            router.push('/subjects');
        }
    }
  }, [subjectId, form, router, toast]);

  function onSubmit(data: SubjectFormValues) {
    const storedSubjects = localStorage.getItem('subjectsData');
    const currentSubjects: Subject[] = storedSubjects ? JSON.parse(storedSubjects) : [];

    const updatedSubjects = currentSubjects.map(subject => {
        if (subject.id === subjectId) {
            return data;
        }
        return subject;
    });

    localStorage.setItem('subjectsData', JSON.stringify(updatedSubjects));
    
    toast({
      title: 'Subject Updated',
      description: `Subject "${data.name}" has been successfully updated.`,
    });
    router.push('/subjects');
  }

  const teacherOptions = teachersData.map(t => ({ value: t.id, label: t.name }));

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Edit Subject</CardTitle>
        <CardDescription>
          Update the form below to modify the subject. Fields marked with <span className="text-destructive">*</span> are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
               <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Subject Name</RequiredLabel>
                    <FormControl>
                      <Input placeholder="e.g., Physics" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Subject Code</RequiredLabel>
                    <FormControl>
                      <Input placeholder="e.g., PHY101" {...field} value={field.value || ''} />
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
                    <RequiredLabel>Primary Teacher</RequiredLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teacherOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                     <FormDescription>The main teacher for this subject.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit">Update Subject</Button>
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
