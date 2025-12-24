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
import { Eye, Search, FilePlus2, Bell, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { feesData as initialFeesData } from '@/lib/data';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type Fee = (typeof initialFeesData)[0];
type Role = 'Admin' | 'Accountant' | 'SuperAdmin';

const FEES_PER_PAGE = 5;

export default function FeesPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [feesData, setFeesData] = useState<Fee[]>([]);
  const [userRole] = useState<Role>('Accountant'); // Simulating user role

  useEffect(() => {
    const storedFees = localStorage.getItem('feesData');
    if (storedFees) {
      setFeesData(JSON.parse(storedFees));
    } else {
      setFeesData(initialFeesData);
      localStorage.setItem('feesData', JSON.stringify(initialFeesData));
    }
  }, []);

  const updateAndStoreFees = (newFees: Fee[]) => {
    setFeesData(newFees);
    localStorage.setItem('feesData', JSON.stringify(newFees));
  };

  const handleRecordPayment = (invoiceId: string) => {
    const updatedFees = feesData.map((fee) => {
      if (fee.invoiceId === invoiceId) {
        return {
          ...fee,
          status: 'Paid' as 'Paid',
          paymentDate: format(new Date(), 'yyyy-MM-dd'),
          paymentMethod: 'Manual Record',
        };
      }
      return fee;
    });
    updateAndStoreFees(updatedFees);

    toast({
      title: 'Payment Recorded',
      description: `Payment for invoice ${invoiceId} has been successfully recorded.`,
    });
  };

  const handleSendReminder = (invoiceId: string) => {
    toast({
      title: 'Reminder Sent',
      description: `A fee reminder has been sent for invoice: ${invoiceId}.`,
    });
  };

  const filteredFees = useMemo(() => {
    return feesData.filter(
      (fee) =>
        fee.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fee.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fee.invoiceId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, feesData]);

  const totalPages = Math.ceil(filteredFees.length / FEES_PER_PAGE);

  const paginatedFees = useMemo(() => {
    const startIndex = (currentPage - 1) * FEES_PER_PAGE;
    const endIndex = startIndex + FEES_PER_PAGE;
    return filteredFees.slice(startIndex, endIndex);
  }, [filteredFees, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const canCreate = userRole === 'Accountant' || userRole === 'SuperAdmin';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Fee Management</h1>
        {canCreate && (
          <Button asChild>
            <Link href="/fees/add">
              <FilePlus2 className="mr-2 h-4 w-4" /> Generate New Invoice
            </Link>
          </Button>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>
            A list of all fee invoices for students.
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by Invoice ID, Student Name, or Student ID..."
              className="w-full rounded-lg bg-background pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on new search
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFees.map((fee) => (
                <TableRow key={fee.invoiceId}>
                  <TableCell className="font-medium">{fee.invoiceId}</TableCell>
                  <TableCell>
                    <div>{fee.studentName}</div>
                    <div className="text-xs text-muted-foreground">{fee.studentId}</div>
                  </TableCell>
                  <TableCell>${fee.amount.toFixed(2)}</TableCell>
                  <TableCell>{fee.dueDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        fee.status === 'Paid' ? 'success' :
                        fee.status === 'Overdue' ? 'destructive' : 'warning'
                      }
                      className="capitalize"
                    >
                      {fee.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button asChild variant="ghost" size="icon" title="View Details">
                        <Link href={`/fees/${fee.invoiceId}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      {canCreate && fee.status !== 'Paid' && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRecordPayment(fee.invoiceId)}
                            title="Record Payment"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Record Payment</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSendReminder(fee.invoiceId)}
                            title="Send Reminder"
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Send Reminder</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {paginatedFees.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              No invoices found.
            </div>
          )}
        </CardContent>
         <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{' '}
            <strong>
              {Math.min((currentPage - 1) * FEES_PER_PAGE + 1, filteredFees.length)}
            </strong>{' '}
            to{' '}
            <strong>
              {Math.min(currentPage * FEES_PER_PAGE, filteredFees.length)}
            </strong>{' '}
            of <strong>{filteredFees.length}</strong> invoices
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
