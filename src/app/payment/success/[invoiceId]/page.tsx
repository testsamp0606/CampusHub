'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { feesData as initialFeesData } from '@/lib/data';
import { format } from 'date-fns';

type Fee = (typeof initialFeesData)[0];

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.invoiceId as string;

  useEffect(() => {
    const storedFees = localStorage.getItem('feesData');
    const fees: Fee[] = storedFees ? JSON.parse(storedFees) : initialFeesData;

    const updatedFees = fees.map(fee => {
      if (fee.invoiceId === invoiceId) {
        return {
          ...fee,
          status: 'Paid' as 'Paid',
          paymentDate: format(new Date(), 'yyyy-MM-dd'),
          paymentMethod: 'Credit Card (Online)',
        };
      }
      return fee;
    });

    localStorage.setItem('feesData', JSON.stringify(updatedFees));

  }, [invoiceId]);

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-green-100 rounded-full h-16 w-16 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="mt-4">Payment Successful!</CardTitle>
          <CardDescription>
            Your payment for Invoice #{invoiceId} has been completed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            A confirmation has been sent to your registered email address. You can view the updated invoice details now.
          </p>
        </CardContent>
        <CardContent className="flex flex-col gap-4">
           <Button asChild>
                <Link href={`/fees/${invoiceId}`}>View Invoice</Link>
           </Button>
           <Button variant="outline" onClick={() => router.push('/fees')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Invoices
           </Button>
        </CardContent>
      </Card>
    </div>
  );
}
