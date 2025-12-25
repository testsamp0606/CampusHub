'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { Label } from '@/components/ui/label';
import { CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

type BookIssue = {
    issueId: string;
    bookId: string;
    studentId: string;
    issueDate: any;
    dueDate: string;
    returnDate: any;
    status: 'Issued' | 'Returned';
    fineAmount: number;
    fineStatus: 'Paid' | 'Unpaid';
};


export default function FinePaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const issueId = params.issueId as string;
  const [isLoading, setIsLoading] = useState(false);
  
  const issueDocRef = useMemoFirebase(() => (firestore ? doc(firestore, `schools/school-1/bookIssues/${issueId}`) : null), [firestore, issueId]);
  const { data: issue, isLoading: issueLoading } = useDoc<BookIssue>(issueDocRef);


  useEffect(() => {
    if (!issueLoading && issue) {
        if(issue.fineStatus !== 'Unpaid' || issue.fineAmount <= 0) {
            toast({
                variant: "destructive",
                title: "Invalid Fine",
                description: "This fine is not available for payment or has already been paid.",
            });
            router.back();
        }
    }
  }, [issueId, router, toast, issue, issueLoading]);

  if (issueLoading || !issue) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast({
      title: 'Processing Payment...',
      description: 'Please wait while we securely process your payment.',
    });

    setTimeout(() => {
      setIsLoading(false);
      router.push(`/library/fine/success/${issue.issueId}`);
    }, 3000);
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard /> Library Fine Payment
          </CardTitle>
          <CardDescription>
            Complete the payment for fine on Issue ID #{issue.issueId}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePayment}>
          <CardContent className="space-y-6">
            <div className="text-center rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Fine Amount to Pay</p>
              <p className="text-4xl font-bold">${issue.fineAmount.toFixed(2)}</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="0000 0000 0000 0000" required />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" required />
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input id="cardName" placeholder="John Doe" required />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${issue.fineAmount.toFixed(2)}`
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

    