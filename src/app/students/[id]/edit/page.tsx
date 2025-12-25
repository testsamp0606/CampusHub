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
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Student, students as initialStudentsData } from '@/lib/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

const studentFormSchema = z
  .object({
    // Student Details
    id: z.string(),
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    gender: z.enum(['Male', 'Female', 'Other']),
    dateOfBirth: z.string().optional(),
    bloodGroup: z.string().optional(),
    category: z.string().optional(),
    aadhaar: z.string().optional(),
    studentPhoto: z.any().optional(),

    // Academic Details
    academicYear: z.string().min(4, 'Academic Year is required.'),
    classId: z.string({ required_error: 'Please select a class.' }),
    section: z.string().optional(),
    rollNumber: z.string().optional(),
    mediumOfInstruction: z.string().optional(),
    previousSchool: z.string().optional(),
    previousBoard: z.string().optional(),

    // Parent / Guardian Details
    fatherName: z.string().min(2, "Father's name is required."),
    motherName: z.string().min(2, "Mother's name is required."),
    fatherMobile: z
      .string()
      .regex(/^\d{10}$/, 'Phone number must be 10 digits.'),
    motherMobile: z
      .string()
      .regex(/^\d{10}$/, 'Phone number must be 10 digits.'),
    parentEmail: z.string().email('Invalid email address.').optional(),
    fatherOccupation: z.string().optional(),
    motherOccupation: z.string().optional(),
    fatherAnnualIncome: z.coerce.number().optional(),
    motherAnnualIncome: z.coerce.number().optional(),

    // Address & Contact
    currentAddress: z.string().min(10, 'Current address is required.'),
    permanentAddress: z.string().min(10, 'Permanent address is required.'),
    sameAsPermanent: z.boolean().default(false),
    emergencyContact: z
      .string()
      .regex(/^\d{10}$/, 'Phone number must be 10 digits.'),

  });

type StudentFormValues = z.infer<typeof studentFormSchema>;

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function EditStudentPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
  });

  useEffect(() => {
    const storedStudents = localStorage.getItem('students');
    const students: Student[] = storedStudents ? JSON.parse(storedStudents) : initialStudentsData;
    setAllStudents(students);
    const studentToEdit = students.find(s => s.id === studentId);

    if (studentToEdit) {
      form.reset(studentToEdit);
    } else if (studentId) {
      toast({ title: "Error", description: "Student not found.", variant: "destructive" });
      router.push('/students');
    }
    setIsLoading(false);
  }, [studentId, form, router, toast]);

    const permanentAddress = form.watch('permanentAddress');
    const sameAsPermanent = form.watch('sameAsPermanent');

    useEffect(() => {
        if (sameAsPermanent) {
        form.setValue('currentAddress', permanentAddress);
        }
    }, [sameAsPermanent, permanentAddress, form]);


  function onSubmit(data: StudentFormValues) {
    const updatedStudents = allStudents.map(s => {
      if (s.id === studentId) {
        const originalStudent = allStudents.find(orig => orig.id === studentId) || {};
        return { ...originalStudent, ...data };
      }
      return s;
    });

    localStorage.setItem('students', JSON.stringify(updatedStudents));

    toast({
      title: 'Student Updated',
      description: `${data.name} has been successfully updated.`,
    });
    router.push(`/students/${studentId}`);
  }

  if (isLoading) {
    return <div>Loading student data...</div>;
  }
  
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: format(new Date(0, i), 'MMMM'),
  }));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Edit Student Information</CardTitle>
        <CardDescription>
          Update the details for {form.getValues('name') || 'the student'}. Fields marked with <span className="text-destructive">*</span> are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Accordion
              type="single"
              collapsible
              defaultValue="student_details"
              className="w-full"
            >
              <AccordionItem value="student_details">
                <AccordionTrigger>Student Details</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4">
                    <FormField
                      control={form.control}
                      name="id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admission Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="md:col-span-3">
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
                    
                    <div className="md:col-span-4">
                      <FormLabel>Date of Birth</FormLabel>
                      <div className="grid grid-cols-3 gap-4">
                          <Select>
                              <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
                              <SelectContent>{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                          </Select>
                          <Select>
                              <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                              <SelectContent>{months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                          </Select>
                          <Select>
                              <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                              <SelectContent>{years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
                          </Select>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <RequiredLabel>Gender</RequiredLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
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
                      name="bloodGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Group</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select blood group" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {bloodGroups.map((group) => (
                                <SelectItem key={group} value={group}>
                                  {group}
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
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., General"
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
                      name="aadhaar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aadhaar Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="1234 5678 9012"
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
                      name="studentPhoto"
                      render={({
                        field: { value, onChange, ...field },
                      }) => (
                        <FormItem>
                          <FormLabel>Student Photo</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                onChange(e.target.files?.[0])
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="academic_details">
                <AccordionTrigger>Academic Details</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                    <FormField
                      control={form.control}
                      name="academicYear"
                      render={({ field }) => (
                        <FormItem>
                          <RequiredLabel>Academic Year</RequiredLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ''} />
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
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="C001">Class X-A</SelectItem>
                              <SelectItem value="C002">Class IX-B</SelectItem>
                              <SelectItem value="C003">Class VIII-A</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="section"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="A"
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
                      name="rollNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roll Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 25"
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
                      name="mediumOfInstruction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medium</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="English"
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
                      name="previousSchool"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Previous School</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Name of previous school"
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
                      name="previousBoard"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Previous Board</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., CBSE"
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="parent_details">
                <AccordionTrigger>Parent / Guardian Details</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                    <FormField
                      control={form.control}
                      name="fatherName"
                      render={({ field }) => (
                        <FormItem>
                          <RequiredLabel>Father's Name</RequiredLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="motherName"
                      render={({ field }) => (
                        <FormItem>
                          <RequiredLabel>Mother's Name</RequiredLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fatherMobile"
                      render={({ field }) => (
                        <FormItem>
                          <RequiredLabel>Father's Mobile</RequiredLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="motherMobile"
                      render={({ field }) => (
                        <FormItem>
                          <RequiredLabel>Mother's Mobile</RequiredLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="parentEmail"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Parent Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
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
                      name="fatherOccupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Father's Occupation</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="motherOccupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mother's Occupation</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fatherAnnualIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Father's Annual Income</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="motherAnnualIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mother's Annual Income</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="address_details">
                <AccordionTrigger>Address & Contact</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                    <FormField
                      control={form.control}
                      name="permanentAddress"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <RequiredLabel>Permanent Address</RequiredLabel>
                          <FormControl>
                            <Textarea
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
                      name="sameAsPermanent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 md:col-span-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Current address is same as permanent address
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currentAddress"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <RequiredLabel>Current Address</RequiredLabel>
                          <FormControl>
                            <Textarea
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
                      name="emergencyContact"
                      render={({ field }) => (
                        <FormItem>
                          <RequiredLabel>Emergency Contact</RequiredLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex gap-4 pt-6">
              <Button type="submit">Update Student</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
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
