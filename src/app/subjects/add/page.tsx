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
import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';

type Teacher = {
    id: string;
    name: string;
}

const subjectFormSchema = z.object({
  id: z.string(),
  name: z.string().min(3, 'Subject name must be at least 3 characters.'),
  code: z.string().min(3, 'Subject code must be at least 3 characters.'),
  teacherId: z.string({ required_error: 'Please assign a primary teacher.' }),
});

type SubjectFormValues = z.infer<typeof subjectFormSchema>;

const defaultValues: Partial<SubjectFormValues> = {
  id: '',
  name: '',
  code: '',
  teacherId: '',
};

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function AddSubjectPage() {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  
  const teachersQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'schools/school-1/teachers') : null), [firestore]);
  const { data: teachersData } = useCollection<Teacher>(teachersQuery);

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const uniqueId = `SUB${Date.now().toString().slice(-6)}`;
    form.setValue('id', uniqueId);
  }, [form]);

  function onSubmit(data: SubjectFormValues) {
    if(!firestore) return;
    const subjectsCollection = collection(firestore, 'schools/school-1/subjects');
    const newSubject = { ...data, schoolId: 'school-1' };
    addDocumentNonBlocking(subjectsCollection, newSubject, data.id);
    
    toast({
      title: 'Subject Added',
      description: `Subject "${data.name}" has been successfully added.`,
    });
    form.reset();
    router.push('/subjects');
  }

  const teacherOptions = teachersData?.map(t => ({ value: t.id, label: t.name })) || [];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Add New Subject</CardTitle>
        <CardDescription>
          Fill out the form below to add a new subject. Fields marked with <span className="text-destructive">*</span> are required.
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
                    <FormDescription>The main teacher for this subject.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit">Add Subject</Button>
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
