'use client';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, User, Users, Book, Building, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { departmentsData as initialDepartmentsData, teachersData as initialTeachersData, subjectsData as initialSubjectsData, expensesData as initialExpensesData, Department, Teacher, Subject, Expense } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function DepartmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const departmentId = params.id as string;
  
  const [department, setDepartment] = useState<Department | undefined>();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const storedDepartments = localStorage.getItem('departmentsData');
    const depts: Department[] = storedDepartments ? JSON.parse(storedDepartments) : initialDepartmentsData;
    setDepartment(depts.find(d => d.id === departmentId));

    const storedTeachers = localStorage.getItem('teachersData');
    setTeachers(storedTeachers ? JSON.parse(storedTeachers) : initialTeachersData);
    
    const storedSubjects = localStorage.getItem('subjectsData');
    setSubjects(storedSubjects ? JSON.parse(storedSubjects) : initialSubjectsData);

    const storedExpenses = localStorage.getItem('expensesData');
    setExpenses(storedExpenses ? JSON.parse(storedExpenses) : initialExpensesData);

  }, [departmentId]);

  const departmentDetails = useMemo(() => {
    if (!department) return null;

    const hod = teachers.find(t => t.id === department.hodId);
    const assignedTeachers = teachers.filter(t => department.teacherIds?.includes(t.id));
    const assignedSubjects = subjects.filter(s => department.subjectIds?.includes(s.id));
    const departmentExpenses = expenses.filter(e => e.department.toLowerCase() === department.name.toLowerCase());

    return {
      ...department,
      hodName: hod?.name || 'N/A',
      assignedTeachers,
      assignedSubjects,
      departmentExpenses,
    };
  }, [department, teachers, subjects, expenses]);
  
  if (!departmentDetails) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Department not found.</p>
      </div>
    );
  }

  const handleExpenseApproval = (expenseId: string, status: 'Approved' | 'Rejected') => {
    const updatedExpenses = expenses.map(e => e.id === expenseId ? {...e, status} : e);
    setExpenses(updatedExpenses);
    localStorage.setItem('expensesData', JSON.stringify(updatedExpenses));
    toast({
        title: `Expense ${status}`,
        description: `Expense ID ${expenseId} has been marked as ${status}.`
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Department Details</h1>
        <div className="flex justify-end gap-2">
          <Button asChild>
            <Link href={`/departments/${departmentId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Department
            </Link>
          </Button>
          <Button variant="outline" onClick={() => router.push('/departments')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        </div>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Building /> {departmentDetails.name}
              </CardTitle>
              <CardDescription>
                {departmentDetails.description}
              </CardDescription>
            </div>
            <Badge variant={departmentDetails.type === 'Academic' ? 'default' : 'secondary'} className="text-md">
              {departmentDetails.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col gap-1 p-4 border rounded-lg">
                    <p className="font-medium text-muted-foreground">Head of Department (HOD)</p>
                    <p className="font-semibold text-lg">{departmentDetails.hodName}</p>
                </div>
                 <div className="flex flex-col gap-1 p-4 border rounded-lg">
                    <p className="font-medium text-muted-foreground">Annual Budget</p>
                    <p className="font-semibold text-lg">${departmentDetails.budget.toLocaleString()}</p>
                </div>
                 <div className="flex flex-col gap-1 p-4 border rounded-lg">
                    <p className="font-medium text-muted-foreground">Faculty Count</p>
                    <p className="font-semibold text-lg">{departmentDetails.assignedTeachers.length}</p>
                </div>
            </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users /> Assigned Teachers</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {departmentDetails.assignedTeachers.map(t => (
                            <TableRow key={t.id}><TableCell>{t.name}</TableCell><TableCell>{t.email}</TableCell></TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Book /> Assigned Subjects</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Code</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {departmentDetails.assignedSubjects.map(s => (
                            <TableRow key={s.id}><TableCell>{s.name}</TableCell><TableCell>{s.code}</TableCell></TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Department Expense Approvals</CardTitle>
            <CardDescription>Review and approve expenses submitted by this department.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                    {departmentDetails.departmentExpenses.filter(e => e.status === 'Pending').map(exp => (
                        <TableRow key={exp.id}>
                            <TableCell>{exp.date}</TableCell>
                            <TableCell>{exp.description}</TableCell>
                            <TableCell>${exp.amount.toFixed(2)}</TableCell>
                            <TableCell><Badge variant="warning">{exp.status}</Badge></TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" variant="ghost" className="text-green-600" onClick={() => handleExpenseApproval(exp.id, 'Approved')}><CheckCircle className="h-4 w-4" /></Button>
                                <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleExpenseApproval(exp.id, 'Rejected')}><XCircle className="h-4 w-4" /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {departmentDetails.departmentExpenses.filter(e => e.status === 'Pending').length === 0 && (
                        <TableRow><TableCell colSpan={5} className="text-center h-24">No pending expenses for this department.</TableCell></TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
       </Card>

    </div>
  );
}
