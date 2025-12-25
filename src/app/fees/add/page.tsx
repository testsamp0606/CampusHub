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
import { useEffect, useMemo, useState } from 'react';
import { Combobox } from '@/components/ui/combobox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { students as initialStudentsData, Fee, Student, feesData as initialFeesData } from '@/lib/data';


const feeFormSchema = z.object({
  invoiceId: z.string(),
  studentId: z.string({
    required_error: 'Please select a student.',
  }),
  feeType: z.string({ required_error: 'Please select a fee type.' }),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0.'),
  dueDate: z.date({
    required_error: 'A due date is required.',
  }),
  description: z.string().min(5, 'Description must be at least 5 characters.'),
});

type FeeFormValues = z.infer<typeof feeFormSchema>;

const defaultValues: Partial<FeeFormValues> = {
  invoiceId: '',
  feeType: '',
  amount: 0,
  description: '',
};

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function AddFeePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const storedStudents = localStorage.getItem('students');
    setStudents(storedStudents ? JSON.parse(storedStudents) : initialStudentsData);
  }, []);

  const form = useForm<FeeFormValues>({
    resolver: zodResolver(feeFormSchema),
    defaultValues,
  });

  useEffect(() => {
    // Generate a unique invoice ID when the component mounts
    const uniqueId = `INV${Date.now().toString().slice(-6)}`;
    form.setValue('invoiceId', uniqueId);
  }, [form]);

  function onSubmit(data: FeeFormValues) {
    if (!students) return;

    const student = students.find((s) => s.id === data.studentId);
    if (!student) return;

    const storedFees = localStorage.getItem('feesData');
    const currentFees: Fee[] = storedFees ? JSON.parse(storedFees) : initialFeesData;

    const newFee: Fee = {
        ...data,
        studentName: student.name,
        dueDate: format(data.dueDate, 'yyyy-MM-dd'),
        status: 'Unpaid',
        paymentDate: null,
        paymentMethod: null,
    };
    
    const updatedFees = [...currentFees, newFee];
    localStorage.setItem('feesData', JSON.stringify(updatedFees));
    
    toast({
      title: 'Invoice Generated',
      description: `A new fee invoice has been generated for ${student.name}.`,
    });
    form.reset();
    router.push('/fees');
  }

  const studentOptions = useMemo(() => students?.map((student) => ({
    value: student.id,
    label: `${student.name} (${student.id})`,
  })) || [], [students]);

  const feeTypeOptions = [
    { value: 'tuition', label: 'Monthly Tuition Fee' },
    { value: 'exam', label: 'Examination Fee' },
    { value: 'transport', label: 'Transport Fee' },
    { value: 'library', label: 'Library Fine' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Generate New Fee Invoice</CardTitle>
        <CardDescription>
          Fill out the form below to create a new fee invoice for a student. Fields marked with <span className="text-destructive">*</span> are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="invoiceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice ID</FormLabel>
                    <FormControl>
                      <Input placeholder="INV123456" {...field} disabled value={field.value || ''} />
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
                    <RequiredLabel>Select Student</RequiredLabel>
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
                      The student to whom this invoice will be assigned.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="feeType"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Fee Type</RequiredLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a fee type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {feeTypeOptions.map(opt => (
                           <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Amount</RequiredLabel>
                    <FormControl>
                      <Input type="number" placeholder="1500.00" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                     <RequiredLabel>Due Date</RequiredLabel>
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
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                     <RequiredLabel>Description</RequiredLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Monthly Tuition Fee for August"
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
              <Button type="submit">Generate Invoice</Button>
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
