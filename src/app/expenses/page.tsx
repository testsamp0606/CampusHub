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
import { expensesData as initialExpensesData } from '@/lib/data';
import Link from 'next/link';

type Expense = (typeof initialExpensesData)[0];

const EXPENSES_PER_PAGE = 7;

export default function ExpensesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expensesData, setExpensesData] = useState<Expense[]>([]);

  useEffect(() => {
    // In a real app, you'd fetch this data. For now, we use localStorage.
    const storedExpenses = localStorage.getItem('expensesData');
    if (storedExpenses) {
      setExpensesData(JSON.parse(storedExpenses));
    } else {
      setExpensesData(initialExpensesData);
      localStorage.setItem('expensesData', JSON.stringify(initialExpensesData));
    }
  }, []);
  
  const stats = useMemo(() => {
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Expense Management</h1>
        <Button asChild>
          <Link href="/expenses/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Expense
          </Link>
        </Button>
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
                        {expense.status === 'Pending' && (
                            <>
                                 <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" title="Approve">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="sr-only">Approve</span>
                                </Button>
                                 <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Reject">
                                    <XCircle className="h-4 w-4" />
                                    <span className="sr-only">Reject</span>
                                </Button>
                            </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
           {paginatedExpenses.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              No expenses found.
            </div>
          )}
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
