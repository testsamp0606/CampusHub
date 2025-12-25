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
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const studentFormSchema = z
  .object({
    id: z.string(),
    title: z.enum(['Mr', 'Mrs', 'Miss']),
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    email: z.string().email('Invalid email address.'),
    phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits.'),
    dob_year: z.string({ required_error: 'Year is required.' }),
    dob_month: z.string({ required_error: 'Month is required.' }),
    dob_day: z.string({ required_error: 'Day is required.' }),
    gender: z.enum(['Male', 'Female', 'Other']),
    permanentAddress: z
      .string()
      .min(10, 'Permanent Address must be at least 10 characters.'),
    classId: z.string({ required_error: 'Please select a class.' }),
  })
  .refine(
    (data) => {
      const { dob_year, dob_month, dob_day } = data;
      if (!dob_year || !dob_month || !dob_day) return false;
      const date = new Date(`${dob_year}-${dob_month}-${dob_day}`);
      return !isNaN(date.getTime());
    },
    {
      message: 'Invalid date of birth.',
      path: ['dob_day'],
    }
  );

type StudentFormValues = z.infer<typeof studentFormSchema>;

const defaultValues: Partial<StudentFormValues> = {
  id: '',
  title: 'Mr',
  name: '',
  email: '',
  phone: '',
  gender: 'Male',
};

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function AddStudentPage() {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const uniqueId = `S${Date.now().toString().slice(-6)}`;
    form.setValue('id', uniqueId);
  }, [form]);

  async function onSubmit(data: StudentFormValues) {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firestore is not available. Please try again later.',
      });
      return;
    }
    const studentsCollection = collection(
      firestore,
      'schools/school-1/students'
    );

    const newStudentData = {
      ...data,
      name: `${data.title} ${data.name}`,
      schoolId: 'school-1',
      dateOfBirth: format(
        new Date(
          `${data.dob_year}-${data.dob_month}-${data.dob_day}`
        ),
        'yyyy-MM-dd'
      ),
    };

    addDocumentNonBlocking(studentsCollection, newStudentData, data.id);

    toast({
      title: 'Student Registered',
      description: `${data.name} has been successfully registered.`,
    });
    form.reset();
    router.push('/students');
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: format(new Date(0, i), 'MMMM'),
  }));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Add New Student</CardTitle>
        <CardDescription>
          Fill out the form below to add a new student. Fields marked with{' '}
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
              <div className="md:col-span-1"></div>

              <div className="grid grid-cols-4 gap-4 md:col-span-2 items-end">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <RequiredLabel>Title</RequiredLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a title" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Mr">Mr</SelectItem>
                          <SelectItem value="Mrs">Mrs</SelectItem>
                          <SelectItem value="Miss">Miss</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
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
              </div>

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
              <div className="md:col-span-2">
                <RequiredLabel>Date of Birth</RequiredLabel>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="dob_day"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Day</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Day" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {days.map((day) => (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dob_month"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Month</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dob_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Year</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem
                                key={year}
                                value={year.toString()}
                              >
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                 <FormMessage>
                  {form.formState.errors.dob_day?.message}
                </FormMessage>
              </div>

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Gender</RequiredLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                      defaultValue={field.value}
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
              <Button type="submit">Add Student</Button>
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
