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
import { Eye, Search } from 'lucide-react';
import { feesData as initialFeesData } from '@/lib/data';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

type Fee = (typeof initialFeesData)[0];

const PAYMENTS_PER_PAGE = 10;

export default function PaymentHistoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paidFees, setPaidFees] = useState<Fee[]>([]);

  useEffect(() => {
    const storedFees = localStorage.getItem('feesData');
    const fees: Fee[] = storedFees ? JSON.parse(storedFees) : initialFeesData;
    const paid = fees.filter(fee => fee.status === 'Paid');
    setPaidFees(paid);
  }, []);

  const filteredPayments = useMemo(() => {
    return paidFees.filter(
      (fee) =>
        fee.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fee.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fee.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fee.paymentMethod && fee.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, paidFees]);

  const totalPages = Math.ceil(filteredPayments.length / PAYMENTS_PER_PAGE);

  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * PAYMENTS_PER_PAGE;
    const endIndex = startIndex + PAYMENTS_PER_PAGE;
    return filteredPayments.slice(startIndex, endIndex);
  }, [filteredPayments, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            A record of all successful payment transactions.
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by Invoice ID, Student, or Payment Method..."
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
                <TableHead>Payment Date</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.map((fee) => (
                <TableRow key={fee.invoiceId}>
                  <TableCell className="font-medium">{fee.invoiceId}</TableCell>
                  <TableCell>
                    <div>{fee.studentName}</div>
                    <div className="text-xs text-muted-foreground">{fee.studentId}</div>
                  </TableCell>
                  <TableCell>${fee.amount.toFixed(2)}</TableCell>
                  <TableCell>{fee.paymentDate}</TableCell>
                  <TableCell>
                     <Badge variant="secondary" className="capitalize">
                      {fee.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     <Button asChild variant="ghost" size="icon" title="View Details">
                        <Link href={`/fees/${fee.invoiceId}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Invoice</span>
                        </Link>
                      </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {paginatedPayments.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              No payment records found.
            </div>
          )}
        </CardContent>
         <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{' '}
            <strong>
              {Math.min((currentPage - 1) * PAYMENTS_PER_PAGE + 1, filteredPayments.length)}
            </strong>{' '}
            to{' '}
            <strong>
              {Math.min(currentPage * PAYMENTS_PER_PAGE, filteredPayments.length)}
            </strong>{' '}
            of <strong>{filteredPayments.length}</strong> payments
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
