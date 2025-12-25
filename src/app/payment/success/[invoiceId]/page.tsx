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
import { format } from 'date-fns';
import { useFirestore, setDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

type Fee = {
    invoiceId: string;
    status: 'Paid' | 'Unpaid' | 'Overdue';
}

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.invoiceId as string;
  const firestore = useFirestore();

  const feeDocRef = useMemoFirebase(() => (firestore ? doc(firestore, 'schools/school-1/fees', invoiceId) : null), [firestore, invoiceId]);
  const { data: fee } = useDoc<Fee>(feeDocRef);


  useEffect(() => {
    if (firestore && fee && fee.status !== 'Paid') {
        const feeRef = doc(firestore, 'schools/school-1/fees', invoiceId);
        setDocumentNonBlocking(feeRef, {
            status: 'Paid',
            paymentDate: format(new Date(), 'yyyy-MM-dd'),
            paymentMethod: 'Credit Card (Online)',
        }, { merge: true });
    }
  }, [invoiceId, firestore, fee]);

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
