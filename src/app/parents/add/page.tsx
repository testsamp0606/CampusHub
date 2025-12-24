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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { students } from '@/lib/data';
import { useEffect } from 'react';

const parentFormSchema = z.object({
  parentId: z.string(),
  firstName: z.string().min(2, 'First name must be at least 2 characters.'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters.'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'You need to select a gender.',
  }),
  occupation: z.string().min(2, 'Occupation is required.'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits.'),
  email: z.string().email('Invalid email address.'),
  address: z.string().min(10, 'Address must be at least 10 characters.'),
  studentId: z.string({
    required_error: 'Please select a student to tag.',
  }),
  profilePhoto: z.any().optional(),
});

type ParentFormValues = z.infer<typeof parentFormSchema>;

const defaultValues: Partial<ParentFormValues> = {
  parentId: '',
  firstName: '',
  lastName: '',
  occupation: '',
  phone: '',
  email: '',
  address: '',
};

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function AddParentPage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<ParentFormValues>({
    resolver: zodResolver(parentFormSchema),
    defaultValues,
  });

  useEffect(() => {
    // Generate a unique parent ID when the component mounts
    const uniqueId = `P${Date.now().toString().slice(-6)}`;
    form.setValue('parentId', uniqueId);
  }, [form]);

  function onSubmit(data: ParentFormValues) {
    console.log(data);
    const studentName =
      students.find((s) => s.id === data.studentId)?.name || 'a student';
    toast({
      title: 'Parent Registered',
      description: `${data.firstName} ${data.lastName} has been successfully registered and tagged with ${studentName}.`,
    });
    form.reset();
    router.push('/parents');
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Add New Parent</CardTitle>
        <CardDescription>
          Fill out the form below to register a new parent and tag a student. Fields marked with <span className="text-destructive">*</span> are required.
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
              <div />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>First Name</RequiredLabel>
                    <FormControl>
                      <Input placeholder="Jane" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Last Name</RequiredLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <RequiredLabel>Gender</RequiredLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">Female</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                          <FormLabel className="font-normal">Other</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Occupation</RequiredLabel>
                    <FormControl>
                      <Input placeholder="Engineer" {...field} value={field.value || ''} />
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
                      <Input placeholder="9876543210" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Email</RequiredLabel>
                    <FormControl>
                      <Input placeholder="parent@example.com" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <RequiredLabel>Address</RequiredLabel>
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
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Tag a Student</RequiredLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} ({student.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Link this parent to an existing student.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="profilePhoto"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Profile Photo</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} {...field} />
                    </FormControl>
                    <FormDescription>
                      Upload a profile picture for the parent.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit">Add Parent</Button>
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
