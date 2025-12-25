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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { teachersData as initialTeachersData, departmentsData as initialDepartmentsData, Teacher, Department, subjectsData as initialSubjectsData, Subject } from '@/lib/data';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

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

export default function EditDepartmentPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const departmentId = params.id as string;
  
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
  });

  useEffect(() => {
    const storedDepartments = localStorage.getItem('departmentsData');
    const depts: Department[] = storedDepartments ? JSON.parse(storedDepartments) : initialDepartmentsData;
    const departmentToEdit = depts.find(d => d.id === departmentId);

    const storedTeachers = localStorage.getItem('teachersData');
    setTeachers(storedTeachers ? JSON.parse(storedTeachers) : initialTeachersData);

    const storedSubjects = localStorage.getItem('subjectsData');
    setSubjects(storedSubjects ? JSON.parse(storedSubjects) : initialSubjectsData);

    if (departmentToEdit) {
      form.reset(departmentToEdit);
    } else {
      toast({ title: "Error", description: "Department not found.", variant: "destructive" });
      router.push('/departments');
    }
  }, [departmentId, form, router, toast]);

  function onSubmit(data: DepartmentFormValues) {
    const storedDepartments = localStorage.getItem('departmentsData');
    const currentDepartments: Department[] = storedDepartments ? JSON.parse(storedDepartments) : initialDepartmentsData;

    const updatedDepartments = currentDepartments.map(d => d.id === departmentId ? data : d);
    localStorage.setItem('departmentsData', JSON.stringify(updatedDepartments));
    
    toast({
      title: 'Department Updated',
      description: `Department "${data.name}" has been successfully updated.`,
    });
    router.push('/departments');
  }

  const teacherOptions = teachers?.map(t => ({ value: t.id, label: t.name })) || [];
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Edit Department</CardTitle>
        <CardDescription>
          Update the form below to modify the department. Fields marked with <span className="text-destructive">*</span> are required.
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="teacherIds"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Assign Teachers</FormLabel>
                      <FormDescription>Select the teachers who belong to this department.</FormDescription>
                    </div>
                    <ScrollArea className="h-48 w-full rounded-md border p-4">
                      {teachers.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="teacherIds"
                          render={({ field }) => (
                            <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0 my-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), item.id])
                                      : field.onChange(field.value?.filter((value) => value !== item.id));
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{item.name}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </ScrollArea>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="subjectIds"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Assign Subjects</FormLabel>
                      <FormDescription>Select the subjects managed by this department.</FormDescription>
                    </div>
                    <ScrollArea className="h-48 w-full rounded-md border p-4">
                      {subjects.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="subjectIds"
                          render={({ field }) => (
                            <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0 my-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), item.id])
                                      : field.onChange(field.value?.filter((value) => value !== item.id));
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{item.name}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </ScrollArea>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit">Update Department</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
