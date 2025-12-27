
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
import { teachersData as initialTeachersData, departmentsData as initialDepartmentsData, Teacher, Department } from '@/lib/data';
import { Checkbox } from '@/components/ui/checkbox';

const departmentFormSchema = z.object({
  id: z.string(),
  name: z.string().min(3, 'Department name must be at least 3 characters.'),
  description: z.string().optional(),
  hodId: z.string({ required_error: 'Please select a Head of Department.' }),
  type: z.enum(['Academic', 'Non-Academic'], { required_error: 'Please select a department type.'}),
  budget: z.coerce.number().min(0, 'Budget must be a positive number.'),
  teacherIds: z.array(z.string()).optional(),
  subjectIds: z.array(z.string()).optional(),
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function AddDepartmentPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachersData);

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      teacherIds: [],
      subjectIds: [],
    },
  });

  useEffect(() => {
    const uniqueId = `DEPT${Date.now().toString().slice(-6)}`;
    form.setValue('id', uniqueId);
  }, [form]);

  function onSubmit(data: DepartmentFormValues) {
    const newDepartment: Department = { ...data };
    
    // In a real app you'd save this to a database
    console.log(newDepartment);
    
    toast({
      title: 'Department Created',
      description: `Department "${data.name}" has been successfully created.`,
    });
    router.push('/departments');
  }

  const teacherOptions = teachers?.map(t => ({ value: t.id, label: t.name })) || [];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Create New Department</CardTitle>
        <CardDescription>
          Fill out the form below to create a new department. Fields marked with <span className="text-destructive">*</span> are required.
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
                    <RequiredLabel>Department Name</RequiredLabel>
                    <FormControl>
                      <Input placeholder="e.g., Science Department" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Department Type</RequiredLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="Non-Academic">Non-Academic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hodId"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Head of Department (HOD)</RequiredLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a HOD" />
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
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Annual Budget</RequiredLabel>
                    <FormControl>
                      <Input type="number" placeholder="50000" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A brief description of the department's role and responsibilities." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit">Create Department</Button>
              <Button type="button" variant="outline" onClick={() => router.push('/departments')}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
