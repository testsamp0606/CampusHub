'use client';
import { useParams, useRouter } from 'next/navigation';
import { feesData, students } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Printer, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const invoiceId = params.invoiceId;

  const invoice = feesData.find((f) => f.invoiceId === invoiceId);
  const student = invoice ? students.find(s => s.id === invoice.studentId) : null;

  if (!invoice || !student) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Invoice not found.</p>
      </div>
    );
  }

  const handlePrint = () => {
    toast({ title: 'Printing Invoice...', description: 'Your invoice is being sent to the printer.' });
    window.print();
  };

  const handlePayNow = () => {
    toast({ title: 'Redirecting to Payment', description: 'You will be redirected to the payment gateway.' });
  };

  return (
    <Card className="shadow-lg max-w-4xl mx-auto print:shadow-none print:border-none">
      <CardHeader className="print:hidden">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-3xl">Invoice #{invoice.invoiceId}</CardTitle>
                <CardDescription>
                    Status: <Badge
                        variant={
                            invoice.status === 'Paid' ? 'success' :
                            invoice.status === 'Overdue' ? 'destructive' : 'warning'
                        }
                        className="capitalize ml-1"
                        >
                        {invoice.status}
                    </Badge>
                </CardDescription>
            </div>
             <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to List
            </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <h3 className="font-semibold">Billed To:</h3>
                <p className="font-bold text-lg">{student.name}</p>
                <p className="text-sm text-muted-foreground">
                    {student.address}
                    <br/>
                    {student.email} | {student.phone}
                </p>
                <p className="text-sm text-muted-foreground">
                    Student ID: {student.id} | Class: {student.class}
                </p>
            </div>
             <div className="space-y-2 text-left md:text-right">
                <h3 className="font-semibold">Billed By:</h3>
                <p className="font-bold text-lg">St. Peter School</p>
                <p className="text-sm text-muted-foreground">
                    123 Education Lane, Knowledge City, 12345
                    <br/>
                    contact@stpeters.edu | (123) 456-7890
                </p>
            </div>
        </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                <p className="font-semibold">{invoice.dueDate}</p>
            </div>
            {invoice.paymentDate && (
                 <div className="space-y-1 text-left md:text-right">
                    <p className="text-sm font-medium text-muted-foreground">Payment Date</p>
                    <p className="font-semibold">{invoice.paymentDate}</p>
                </div>
            )}
        </div>

        <div>
             <h3 className="font-semibold mb-2">Invoice Summary</h3>
            <div className="border rounded-lg">
                <div className="flex justify-between items-center p-4">
                    <p>Description</p>
                    <p>Amount</p>
                </div>
                <div className="border-t"></div>
                <div className="flex justify-between items-center p-4">
                    <p className="text-muted-foreground">{invoice.description}</p>
                    <p className="font-semibold">${invoice.amount.toFixed(2)}</p>
                </div>
                <div className="border-t bg-muted"></div>
                 <div className="flex justify-between items-center p-4 font-bold text-lg">
                    <p>Total Amount</p>
                    <p>${invoice.amount.toFixed(2)}</p>
                </div>
            </div>
        </div>

        {invoice.status === 'Paid' && invoice.paymentMethod && (
             <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                <p className="font-semibold">{invoice.paymentMethod}</p>
            </div>
        )}

      </CardContent>
      <CardFooter className="flex justify-end gap-2 print:hidden">
        {invoice.status === 'Paid' && (
            <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print Invoice
            </Button>
        )}
        {invoice.status !== 'Paid' && (
             <Button onClick={handlePayNow}>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Now
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
