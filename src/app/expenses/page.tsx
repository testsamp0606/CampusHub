'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  Search,
  PlusCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  Clock,
  CircleOff,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useCollection, useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

type Expense = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  department: string;
  status: 'Approved' | 'Pending' | 'Rejected';
};

type Role = 'Admin' | 'Accountant' | 'SuperAdmin';

const EXPENSES_PER_PAGE = 7;

export default function ExpensesPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole] = useState<Role>('SuperAdmin'); // Simulating user role

  const expensesCol = useMemo(
    () => (firestore ? collection(firestore, 'schools/school-1/expenses') : null),
    [firestore]
  );
  const { data: expensesData, isLoading } = useCollection<Expense>(expensesCol);

  const stats = useMemo(() => {
    if (!expensesData) return { totalAmount: 0, pending: 0, rejected: 0 };
    return expensesData.reduce(
      (acc, expense) => {
        acc.totalAmount += expense.amount;
        if (expense.status === 'Pending') {
          acc.pending += 1;
        } else if (expense.status === 'Rejected') {
          acc.rejected += 1;
        }
        return acc;
      },
      { totalAmount: 0, pending: 0, rejected: 0 }
    );
  }, [expensesData]);


  const filteredExpenses = useMemo(() => {
    if (!expensesData) return [];
    return expensesData.filter(
      (expense) =>
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, expensesData]);

  const totalPages = Math.ceil(filteredExpenses.length / EXPENSES_PER_PAGE);

  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * EXPENSES_PER_PAGE;
    const endIndex = startIndex + EXPENSES_PER_PAGE;
    return filteredExpenses.slice(startIndex, endIndex);
  }, [filteredExpenses, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  
    const getStatusBadgeVariant = (status: Expense['status']) => {
    switch (status) {
        case 'Approved': return 'success';
        case 'Pending': return 'warning';
        case 'Rejected': return 'destructive';
        default: return 'outline';
    }
  }

  const handleStatusUpdate = (expenseId: string, newStatus: 'Approved' | 'Rejected') => {
    if (!firestore) return;
    const expenseRef = doc(firestore, 'schools/school-1/expenses', expenseId);
    setDocumentNonBlocking(expenseRef, { status: newStatus }, { merge: true });
    toast({
        title: `Expense ${newStatus}`,
        description: `Expense with ID ${expenseId} has been ${newStatus.toLowerCase()}.`
    });
  }

  const canCreate = userRole === 'Accountant' || userRole === 'SuperAdmin';
  const canApprove = userRole === 'Admin' || userRole === 'SuperAdmin';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Expense Management</h1>
        {canCreate && (
            <Button asChild>
                <Link href="/expenses/add">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Expense
                </Link>
            </Button>
        )}
      </div>

       <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total amount of all expenses recorded.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Number of expenses waiting for approval.
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Expenses</CardTitle>
            <CircleOff className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">
             Number of expenses that have been rejected.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <CardDescription>
            A list of all expenses recorded for the institution.
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by description, category, or department..."
              className="w-full rounded-lg bg-background pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                 <TableRow>
                  <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                </TableRow>
              )}
              {paginatedExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>${expense.amount.toFixed(2)}</TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>{expense.department}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(expense.status)}>
                        {expense.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                         <Button variant="ghost" size="icon" title="View Details">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                        </Button>
                        {canApprove && expense.status === 'Pending' && (
                            <>
                                 <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" title="Approve" onClick={() => handleStatusUpdate(expense.id, 'Approved')}>
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="sr-only">Approve</span>
                                </Button>
                                 <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Reject" onClick={() => handleStatusUpdate(expense.id, 'Rejected')}>
                                    <XCircle className="h-4 w-4" />
                                    <span className="sr-only">Reject</span>
                                </Button>
                            </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
              ))}
              {!isLoading && paginatedExpenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    No expenses found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
         <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{' '}
            <strong>
              {Math.min((currentPage - 1) * EXPENSES_PER_PAGE + 1, filteredExpenses.length)}
            </strong>{' '}
            to{' '}
            <strong>
              {Math.min(currentPage * EXPENSES_PER_PAGE, filteredExpenses.length)}
            </strong>{' '}
            of <strong>{filteredExpenses.length}</strong> expenses
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
