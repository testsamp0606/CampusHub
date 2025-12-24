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
import { bookIssueData as initialBookIssueData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

type BookIssue = (typeof initialBookIssueData)[0];

export default function FinePaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const issueId = params.issueId as string;
  const [bookId, setBookId] = useState<string | null>(null);

  useEffect(() => {
    const storedIssues = localStorage.getItem('bookIssueData');
    const issues: BookIssue[] = storedIssues ? JSON.parse(storedIssues) : initialBookIssueData;
    
    let targetBookId: string | null = null;
    const updatedIssues = issues.map(issue => {
      if (issue.issueId === issueId) {
        targetBookId = issue.bookId;
        return {
          ...issue,
          fineStatus: 'Paid' as const,
        };
      }
      return issue;
    });

    if(targetBookId) {
        setBookId(targetBookId);
        localStorage.setItem('bookIssueData', JSON.stringify(updatedIssues));
        toast({
            title: "Fine Paid",
            description: "The fine payment was successful.",
        });
    } else {
         toast({
            variant: "destructive",
            title: "Error",
            description: "Could not find the issue record to update.",
        });
    }

  }, [issueId, toast]);

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
