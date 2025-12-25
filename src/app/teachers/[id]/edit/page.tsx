
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
import { teachersData as initialTeachersData, Teacher, classesData as initialClassesData, ClassInfo, subjectsData as initialSubjectsData } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

const teacherFormSchema = z.object({
  // Personal Details
  id: z.string(),
  firstName: z.string().min(2, 'First name is required.'),
  lastName: z.string().min(2, 'Last name is required.'),
  gender: z.enum(['Male', 'Female', 'Other']),
  dateOfBirth: z.date().optional(),
  bloodGroup: z.string().optional(),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']).optional(),
  nationality: z.string().optional(),
  aadhaar: z.string().regex(/^\d{12}$/, { message: "Aadhaar must be 12 digits."}).optional().or(z.literal('')),
  profilePhoto: z.any().optional(),

  // Contact Details
  mobileNumber: z.string().regex(/^\d{10}$/, { message: "Mobile number must be 10 digits."}),
  alternateMobileNumber: z.string().optional(),
  email: z.string().email('Invalid email address.'),
  emergencyContactName: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
  currentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  sameAsCurrent: z.boolean().default(false),
  
  // Qualification & Experience
  highestQualification: z.string().optional(),
  subjectSpecialization: z.string().optional(),
  university: z.string().optional(),
  yearOfPassing: z.coerce.number().optional(),
  teachingExperience: z.coerce.number().optional(),
  previousSchool: z.string().optional(),
  certifications: z.string().optional(),
  
  // School Academic Assignment
  academicYear: z.string().optional(),
  isClassTeacher: z.boolean().default(false),
  assignedClassId: z.string().optional(),
  assignedSubjects: z.array(z.string()).optional(),
  department: z.enum(['Primary', 'Secondary', 'Higher Secondary']).optional(),

  // Employment Details
  employmentType: z.enum(['Permanent', 'Contract', 'Guest']),
  joiningDate: z.date().optional(),
  staffCategory: z.enum(['Teaching', 'Non-Teaching']),
  bankAccountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'Invalid PAN number format.'}).optional().or(z.literal('')),
  status: z.enum(['Active', 'On Leave', 'Inactive']),

  // Document Uploads
  aadhaarCard: z.any().optional(),
  educationalCertificates: z.any().optional(),
  experienceCertificates: z.any().optional(),
  appointmentLetter: z.any().optional(),
  resume: z.any().optional(),
  bankPassbook: z.any().optional(),
});

type TeacherFormValues = z.infer<typeof teacherFormSchema>;

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function EditTeacherPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const teacherId = params.id as string;
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
  });
  
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  useEffect(() => {
    const storedTeachers = localStorage.getItem('teachersData');
    if (storedTeachers) {
        const teachers: Teacher[] = JSON.parse(storedTeachers);
        const teacherToEdit = teachers.find(a => a.id === teacherId);
        if (teacherToEdit) {
            form.reset({
                ...teacherToEdit,
                dateOfBirth: teacherToEdit.dateOfBirth ? parseISO(teacherToEdit.dateOfBirth) : undefined,
                joiningDate: teacherToEdit.joiningDate ? parseISO(teacherToEdit.joiningDate) : undefined,
            });
        } else {
            toast({ title: "Error", description: "Teacher not found.", variant: "destructive"});
            router.push('/teachers');
        }
    }
    const storedClasses = localStorage.getItem('classesData');
    setClasses(storedClasses ? JSON.parse(storedClasses) : initialClassesData);
  }, [teacherId, form, router, toast]);

  function onSubmit(data: TeacherFormValues) {
    const storedTeachers = localStorage.getItem('teachersData');
    const currentTeachers: Teacher[] = storedTeachers ? JSON.parse(storedTeachers) : initialTeachersData;

    const updatedTeachers = currentTeachers.map(teacher => {
        if (teacher.id === teacherId) {
             const updatedTeacher: any = {
                ...teacher,
                ...data,
                name: `${data.firstName} ${data.lastName}`,
                dateOfBirth: data.dateOfBirth ? format(data.dateOfBirth, 'yyyy-MM-dd') : undefined,
                joiningDate: data.joiningDate ? format(data.joiningDate, 'yyyy-MM-dd') : undefined,
                subjects: data.assignedSubjects || [],
                // Compatibility fields
                role: data.isClassTeacher ? 'Class Teacher' : 'Teacher',
                experience: `${data.teachingExperience || 0} years`,
                phone: data.mobileNumber,
                qualification: data.highestQualification || '',
                department: data.department || '',
            };
            return updatedTeacher;
        }
        return teacher;
    });

    localStorage.setItem('teachersData', JSON.stringify(updatedTeachers));
    
    toast({
      title: 'Teacher Updated',
      description: `Profile for "${data.firstName} ${data.lastName}" has been successfully updated.`,
    });
    router.push('/teachers');
  }
  
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const allSubjects = initialSubjectsData.map(s => s.name);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Edit Teacher Profile</CardTitle>
        <CardDescription>
          Update the form below to modify the faculty member's details. Fields marked with <span className="text-destructive">*</span> are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Accordion type="multiple" defaultValue={['personal_details']} className="w-full">
              {/* Personal Details */}
              <AccordionItem value="personal_details">
                <AccordionTrigger>1. Teacher Personal Details</AccordionTrigger>
                <AccordionContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                   <FormField control={form.control} name="id" render={({ field }) => ( <FormItem><FormLabel>Teacher ID</FormLabel><FormControl><Input {...field} disabled value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                   <FormField control={form.control} name="firstName" render={({ field }) => ( <FormItem><RequiredLabel>First Name</RequiredLabel><FormControl><Input placeholder="e.g., John" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                   <FormField control={form.control} name="lastName" render={({ field }) => ( <FormItem><RequiredLabel>Last Name</RequiredLabel><FormControl><Input placeholder="e.g., Doe" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                   <FormField control={form.control} name="gender" render={({ field }) => ( <FormItem><RequiredLabel>Gender</RequiredLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select><FormMessage/></FormItem> )}/>
                   <FormField control={form.control} name="dateOfBirth" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date of Birth</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn('font-normal', !field.value && 'text-muted-foreground')}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1960} toYear={2010} initialFocus/></PopoverContent></Popover><FormMessage /></FormItem>)}/>
                   <FormField control={form.control} name="bloodGroup" render={({ field }) => ( <FormItem><FormLabel>Blood Group</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select blood group"/></SelectTrigger></FormControl><SelectContent>{bloodGroups.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select><FormMessage/></FormItem> )}/>
                   <FormField control={form.control} name="maritalStatus" render={({ field }) => ( <FormItem><FormLabel>Marital Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status"/></SelectTrigger></FormControl><SelectContent><SelectItem value="Single">Single</SelectItem><SelectItem value="Married">Married</SelectItem><SelectItem value="Divorced">Divorced</SelectItem><SelectItem value="Widowed">Widowed</SelectItem></SelectContent></Select><FormMessage/></FormItem> )}/>
                   <FormField control={form.control} name="nationality" render={({ field }) => ( <FormItem><FormLabel>Nationality</FormLabel><FormControl><Input placeholder="e.g., Indian" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                   <FormField control={form.control} name="aadhaar" render={({ field }) => ( <FormItem><FormLabel>Aadhaar / National ID</FormLabel><FormControl><Input type="number" placeholder="e.g., 123456789012" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                   <FormField control={form.control} name="profilePhoto" render={({ field }) => (<FormItem><FormLabel>Teacher Photograph</FormLabel><FormControl><Input type="file" accept="image/*"/></FormControl><FormMessage /></FormItem>)}/>
                </AccordionContent>
              </AccordionItem>
              
              {/* Contact Details */}
              <AccordionItem value="contact_details">
                <AccordionTrigger>2. Contact Details</AccordionTrigger>
                <AccordionContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="mobileNumber" render={({ field }) => ( <FormItem><RequiredLabel>Mobile Number</RequiredLabel><FormControl><Input type="tel" placeholder="e.g., 9876543210" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="alternateMobileNumber" render={({ field }) => ( <FormItem><FormLabel>Alternate Mobile Number</FormLabel><FormControl><Input type="tel" placeholder="e.g., 9876543211" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><RequiredLabel>Email ID (Login)</RequiredLabel><FormControl><Input type="email" placeholder="e.g., user@example.com" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="emergencyContactName" render={({ field }) => ( <FormItem><FormLabel>Emergency Contact Name</FormLabel><FormControl><Input placeholder="e.g., Jane Doe" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="emergencyContactNumber" render={({ field }) => ( <FormItem><FormLabel>Emergency Contact Number</FormLabel><FormControl><Input type="tel" placeholder="e.g., 9876543212" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="currentAddress" render={({ field }) => ( <FormItem><FormLabel>Current Address</FormLabel><FormControl><Textarea placeholder="Current residential address" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                    <div className="space-y-2"><FormField control={form.control} name="permanentAddress" render={({ field }) => ( <FormItem><FormLabel>Permanent Address</FormLabel><FormControl><Textarea placeholder="Permanent residential address" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/><FormField control={form.control} name="sameAsCurrent" render={({ field }) => ( <FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Same as Current Address</FormLabel></div></FormItem> )}/></div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Qualification & Experience */}
              <AccordionItem value="qualification_experience">
                 <AccordionTrigger>3. Qualification & Experience</AccordionTrigger>
                 <AccordionContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="highestQualification" render={({ field }) => ( <FormItem><FormLabel>Highest Qualification</FormLabel><FormControl><Input placeholder="e.g., M.Sc. Physics" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="subjectSpecialization" render={({ field }) => ( <FormItem><FormLabel>Subject Specialization</FormLabel><FormControl><Input placeholder="e.g., Quantum Mechanics" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="university" render={({ field }) => ( <FormItem><FormLabel>University / Board</FormLabel><FormControl><Input placeholder="e.g., University of Example" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="yearOfPassing" render={({ field }) => ( <FormItem><FormLabel>Year of Passing</FormLabel><FormControl><Input type="number" placeholder="e.g., 2010" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="teachingExperience" render={({ field }) => ( <FormItem><FormLabel>Teaching Experience (Years)</FormLabel><FormControl><Input type="number" placeholder="e.g., 5" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="previousSchool" render={({ field }) => ( <FormItem><FormLabel>Previous School</FormLabel><FormControl><Input placeholder="e.g., Example High School" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="certifications" render={({ field }) => ( <FormItem className="md:col-span-3"><FormLabel>Certifications (if any)</FormLabel><FormControl><Textarea placeholder="e.g., Certified Professional Teacher, etc." {...field} value={field.value || ''} /></FormControl></FormItem> )}/>
                 </AccordionContent>
              </AccordionItem>

               {/* School Academic Assignment */}
              <AccordionItem value="academic_assignment">
                 <AccordionTrigger>4. School Academic Assignment</AccordionTrigger>
                 <AccordionContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="academicYear" render={({ field }) => ( <FormItem><FormLabel>Academic Year</FormLabel><FormControl><Input {...field} defaultValue="2024-2025" value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="isClassTeacher" render={({ field }) => ( <FormItem className="flex items-center space-x-2 pt-8"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Is Class Teacher?</FormLabel></FormItem> )}/>
                    <FormField control={form.control} name="assignedClassId" render={({ field }) => ( <FormItem><FormLabel>Assigned Class & Section</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Class"/></SelectTrigger></FormControl><SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage/></FormItem> )}/>
                    <FormField control={form.control} name="department" render={({ field }) => ( <FormItem><FormLabel>Department / Grade Level</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Department"/></SelectTrigger></FormControl><SelectContent><SelectItem value="Primary">Primary</SelectItem><SelectItem value="Secondary">Secondary</SelectItem><SelectItem value="Higher Secondary">Higher Secondary</SelectItem></SelectContent></Select><FormMessage /></FormItem> )}/>
                     <FormField
                        control={form.control}
                        name="assignedSubjects"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                            <FormLabel>Assigned Subjects</FormLabel>
                            <div className="grid grid-cols-3 gap-2">
                                {allSubjects.map(subject => (
                                    <FormField
                                        key={subject}
                                        control={form.control}
                                        name="assignedSubjects"
                                        render={({ field }) => {
                                            return (
                                            <FormItem key={subject} className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(subject)}
                                                    onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([...(field.value || []), subject])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                            (value) => value !== subject
                                                            )
                                                        )
                                                    }}
                                                />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                {subject}
                                                </FormLabel>
                                            </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                 </AccordionContent>
              </AccordionItem>
              
               {/* Employment Details */}
              <AccordionItem value="employment_details">
                 <AccordionTrigger>5. Employment Details</AccordionTrigger>
                 <AccordionContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="employmentType" render={({ field }) => ( <FormItem><RequiredLabel>Employment Type</RequiredLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Permanent">Permanent</SelectItem><SelectItem value="Contract">Contract</SelectItem><SelectItem value="Guest">Guest</SelectItem></SelectContent></Select><FormMessage/></FormItem> )}/>
                    <FormField control={form.control} name="joiningDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Joining Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn('font-normal', !field.value && 'text-muted-foreground')}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)}/>
                    <FormField control={form.control} name="staffCategory" render={({ field }) => ( <FormItem><RequiredLabel>Staff Category</RequiredLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Teaching">Teaching</SelectItem><SelectItem value="Non-Teaching">Non-Teaching</SelectItem></SelectContent></Select><FormMessage/></FormItem> )}/>
                     <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                        <FormItem>
                            <RequiredLabel>Status</RequiredLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select teacher status" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="On Leave">On Leave</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField control={form.control} name="bankAccountNumber" render={({ field }) => ( <FormItem><FormLabel>Bank Account Number</FormLabel><FormControl><Input placeholder="e.g., 1234567890" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="ifscCode" render={({ field }) => ( <FormItem><FormLabel>IFSC Code</FormLabel><FormControl><Input placeholder="e.g., SBIN0001234" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="panNumber" render={({ field }) => ( <FormItem><FormLabel>PAN Number</FormLabel><FormControl><Input placeholder="e.g., ABCDE1234F" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )}/>
                 </AccordionContent>
              </AccordionItem>
              
              {/* Document Uploads */}
              <AccordionItem value="document_uploads">
                <AccordionTrigger>6. Document Uploads</AccordionTrigger>
                <AccordionContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="aadhaarCard" render={({ field }) => ( <FormItem><FormLabel>Aadhaar / ID Proof</FormLabel><FormControl><Input type="file" /></FormControl></FormItem> )}/>
                    <FormField control={form.control} name="educationalCertificates" render={({ field }) => ( <FormItem><FormLabel>Educational Certificates</FormLabel><FormControl><Input type="file" /></FormControl></FormItem> )}/>
                    <FormField control={form.control} name="experienceCertificates" render={({ field }) => ( <FormItem><FormLabel>Experience Certificates</FormLabel><FormControl><Input type="file" /></FormControl></FormItem> )}/>
                    <FormField control={form.control} name="appointmentLetter" render={({ field }) => ( <FormItem><FormLabel>Appointment Letter</FormLabel><FormControl><Input type="file" /></FormControl></FormItem> )}/>
                    <FormField control={form.control} name="resume" render={({ field }) => ( <FormItem><FormLabel>Resume / CV</FormLabel><FormControl><Input type="file" /></FormControl></FormItem> )}/>
                    <FormField control={form.control} name="bankPassbook" render={({ field }) => ( <FormItem><FormLabel>Bank Passbook / Cancelled Cheque</FormLabel><FormControl><Input type="file" /></FormControl></FormItem> )}/>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex gap-4">
              <Button type="submit">Update Teacher</Button>
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
