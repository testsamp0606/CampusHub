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
import { examsData as initialExamsData, classesData } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

type Exam = (typeof initialExamsData)[0];

const examFormSchema = z.object({
  id: z.string(),
  name: z.string().min(3, 'Exam name must be at least 3 characters.'),
  classId: z.string({ required_error: 'Please select a class.' }),
  date: z.date({ required_error: 'Exam date is required.'}),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  maxMarks: z.coerce.number().min(1, 'Max marks must be greater than 0.'),
  description: z.string().optional(),
});

type ExamFormValues = z.infer<typeof examFormSchema>;

const defaultValues: Partial<ExamFormValues> = {
  id: '',
  name: '',
  classId: '',
  maxMarks: 100,
};

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function AddExamPage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const uniqueId = `EX${Date.now().toString().slice(-6)}`;
    form.setValue('id', uniqueId);
  }, [form]);

  function onSubmit(data: ExamFormValues) {
    const storedExams = localStorage.getItem('examsData');
    const currentExams: Exam[] = storedExams ? JSON.parse(storedExams) : [];

    const newExam: Exam = {
        id: data.id,
        name: data.name,
        classId: data.classId,
        date: format(data.date, 'yyyy-MM-dd'),
        status: 'Scheduled',
    };

    const updatedExams = [...currentExams, newExam];
    localStorage.setItem('examsData', JSON.stringify(updatedExams));
    
    toast({
      title: 'Exam Scheduled',
      description: `Exam "${data.name}" has been successfully created.`,
    });
    form.reset();
    router.push('/examinations');
  }

  const classOptions = classesData.map(c => ({ value: c.id, label: c.name }));

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Schedule New Exam</CardTitle>
        <CardDescription>
          Fill out the form to create a new exam. Fields marked with <span className="text-destructive">*</span> are required.
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
                    <FormLabel>Exam ID</FormLabel>
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
                    <RequiredLabel>Exam Name</RequiredLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mid-Term Mathematics" {...field} value={field.value || ''} />
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
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                     <RequiredLabel>Exam Date</RequiredLabel>
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
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="maxMarks"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Maximum Marks</RequiredLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                     <FormLabel>Description / Syllabus</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional instructions or syllabus details for the exam."
                        className="resize-none"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit">Schedule Exam</Button>
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
