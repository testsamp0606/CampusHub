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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox } from '@/components/ui/combobox';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

const parentFormSchema = z.object({
  parentId: z.string(),
  fatherName: z.string().min(2, 'Father name must be at least 2 characters.'),
  fatherOccupation: z.string().min(2, 'Father occupation is required.'),
  fatherPhone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits.'),
  fatherMonthlyIncome: z.coerce.number().min(0, 'Income must be a positive number.').optional(),
  motherName: z.string().min(2, 'Mother name must be at least 2 characters.'),
  motherOccupation: z.string().min(2, 'Mother occupation is required.'),
  motherPhone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits.'),
  motherMonthlyIncome: z.coerce.number().min(0, 'Income must be a positive number.').optional(),
  permanentAddress: z.string().min(10, 'Permanent address must be at least 10 characters.'),
  temporaryAddress: z.string().optional(),
  sameAsStudentAddress: z.boolean().default(false),
  studentId: z.string({
    required_error: 'Please select a student to tag.',
  }),
  profilePhoto: z.any().optional(),
  getUpdates: z.boolean().default(false),
  getResults: z.boolean().default(false),
  getComplaints: z.boolean().default(false),
});

type ParentFormValues = z.infer<typeof parentFormSchema>;

const defaultValues: Partial<ParentFormValues> = {
  parentId: '',
  fatherName: '',
  fatherOccupation: '',
  fatherPhone: '',
  fatherMonthlyIncome: 0,
  motherName: '',
  motherOccupation: '',
  motherPhone: '',
  motherMonthlyIncome: 0,
  permanentAddress: '',
  temporaryAddress: '',
  sameAsStudentAddress: false,
  getUpdates: false,
  getResults: false,
  getComplaints: false,
};

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function AddParentPage() {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();

  const studentsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'schools/school-1/students') : null),
    [firestore]
  );
  const { data: studentsData } = useCollection<{id: string, name: string, address: string}>(studentsQuery);

  const form = useForm<ParentFormValues>({
    resolver: zodResolver(parentFormSchema),
    defaultValues,
  });

  const studentId = form.watch('studentId');
  const sameAsStudentAddress = form.watch('sameAsStudentAddress');
  const fatherIncome = form.watch('fatherMonthlyIncome') || 0;
  const motherIncome = form.watch('motherMonthlyIncome') || 0;

  const familyIncome = useMemo(() => fatherIncome + motherIncome, [fatherIncome, motherIncome]);


  useEffect(() => {
    // Generate a unique parent ID when the component mounts
    const uniqueId = `P${Date.now().toString().slice(-6)}`;
    form.setValue('parentId', uniqueId);
  }, [form]);
  
  useEffect(() => {
    if (sameAsStudentAddress && studentId && studentsData) {
      const student = studentsData.find((s) => s.id === studentId);
      if (student) {
        form.setValue('permanentAddress', student.address);
      }
    }
  }, [sameAsStudentAddress, studentId, form, studentsData]);

  function onSubmit(data: ParentFormValues) {
    if (!studentsData) return;
    const studentName =
      studentsData.find((s) => s.id === data.studentId)?.name || 'a student';
    toast({
      title: 'Parent Registered',
      description: `Parents of ${studentName} have been successfully registered.`,
    });
    form.reset();
    router.push('/parents');
  }

  const studentOptions = useMemo(() => {
    if (!studentsData) return [];
    return studentsData.map((student) => ({
      value: student.id,
      label: `${student.name} (${student.id})`,
    }))
  }, [studentsData]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Add New Parent/Guardian</CardTitle>
        <CardDescription>
          Fill out the form below to register new parents and tag a student. Fields marked with <span className="text-destructive">*</span> are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent ID</FormLabel>
                    <FormControl>
                      <Input placeholder="P123456" {...field} disabled value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <RequiredLabel>Tag a Student</RequiredLabel>
                    <FormControl>
                      <Combobox
                        options={studentOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select a student..."
                        searchPlaceholder="Search students..."
                        emptyResultText="No student found."
                      />
                    </FormControl>
                    <FormDescription>
                      Link this parent to an existing student.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 rounded-md border p-4">
                <h3 className="font-semibold">Father's Details</h3>
                 <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="fatherName"
                        render={({ field }) => (
                        <FormItem>
                            <RequiredLabel>Father's Name</RequiredLabel>
                            <FormControl>
                            <Input placeholder="John Doe" {...field} value={field.value || ''} />
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
                            <RequiredLabel>Father's Occupation</RequiredLabel>
                            <FormControl>
                            <Input placeholder="Engineer" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="fatherPhone"
                        render={({ field }) => (
                        <FormItem>
                            <RequiredLabel>Father's Phone</RequiredLabel>
                            <FormControl>
                            <Input placeholder="9876543210" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="fatherMonthlyIncome"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Father's Monthly Income</FormLabel>
                            <FormControl>
                            <Input type="number" placeholder="30000" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </div>

             <div className="space-y-4 rounded-md border p-4">
                <h3 className="font-semibold">Mother's Details</h3>
                 <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="motherName"
                        render={({ field }) => (
                        <FormItem>
                            <RequiredLabel>Mother's Name</RequiredLabel>
                            <FormControl>
                            <Input placeholder="Jane Doe" {...field} value={field.value || ''} />
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
                            <RequiredLabel>Mother's Occupation</RequiredLabel>
                            <FormControl>
                            <Input placeholder="Doctor" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="motherPhone"
                        render={({ field }) => (
                        <FormItem>
                            <RequiredLabel>Mother's Phone</RequiredLabel>
                            <FormControl>
                            <Input placeholder="9876543211" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="motherMonthlyIncome"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mother's Monthly Income</FormLabel>
                            <FormControl>
                            <Input type="number" placeholder="20000" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                 <FormItem>
                    <FormLabel>Total Family Income</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="50000" value={familyIncome} disabled />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </div>
            
             <FormField
                control={form.control}
                name="sameAsStudentAddress"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Same Address as Student
                      </FormLabel>
                      <FormDescription>
                        Select this if the parents' address is the same as the student's permanent address.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
                    name="temporaryAddress"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Temporary Address</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="456 Park Ave, Anytown, USA"
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

            <div className="space-y-4 rounded-md border p-4">
                 <FormLabel>Communication Preferences</FormLabel>
                 <FormDescription>Select how you'd like to be updated.</FormDescription>
                 <div className="flex flex-col space-y-2 pt-2">
                     <FormField
                        control={form.control}
                        name="getUpdates"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                                Get child updates regularly
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="getResults"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                                Get test results
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="getComplaints"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                                Receive any complaints
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                 </div>
            </div>

            <FormField
            control={form.control}
            name="profilePhoto"
            render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                <FormLabel>Parents' Photo</FormLabel>
                <FormControl>
                    <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} {...field} />
                </FormControl>
                <FormDescription>
                    Upload a profile picture for the parents.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />

            <div className="flex gap-4">
              <Button type="submit">Add Parents</Button>
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
