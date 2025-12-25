'use client';

import { useEffect, useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

type BookIssue = {
    issueId: string;
    bookId: string;
    fineStatus: 'Paid' | 'Unpaid';
};


export default function FinePaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const issueId = params.issueId as string;
  const [bookId, setBookId] = useState<string | null>(null);

  const issueDocRef = useMemoFirebase(() => (firestore ? doc(firestore, `schools/school-1/bookIssues/${issueId}`) : null), [firestore, issueId]);
  const { data: issue } = useDoc<BookIssue>(issueDocRef);


  useEffect(() => {
    if(firestore && issue && issue.fineStatus === 'Unpaid') {
        const issueRef = doc(firestore, `schools/school-1/bookIssues/${issueId}`);
        setDocumentNonBlocking(issueRef, { fineStatus: 'Paid' }, { merge: true });
        setBookId(issue.bookId);
        toast({
            title: "Fine Paid",
            description: "The fine payment was successful.",
        });
    }
  }, [issueId, toast, firestore, issue]);

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-green-100 rounded-full h-16 w-16 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="mt-4">Payment Successful!</CardTitle>
          <CardDescription>
            Your fine payment for Issue #{issueId} has been completed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The issue record has been updated. You can now view the book details.
          </p>
        </CardContent>
        <CardContent className="flex flex-col gap-4">
           {bookId && (
            <Button asChild>
                <Link href={`/library/${bookId}`}>View Book Details</Link>
            </Button>
           )}
           <Button variant="outline" onClick={() => router.push('/library')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Library
           </Button>
        </CardContent>
      </Card>
    </div>
  );
}

    