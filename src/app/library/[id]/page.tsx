'use client';
import { useParams, useRouter } from 'next/navigation';
import { booksData } from '@/lib/data';
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
import { ArrowLeft, BookCheck, BookX } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const bookId = params.id;

  const book = booksData.find((b) => b.id === bookId);

  if (!book) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Book not found.</p>
      </div>
    );
  }

  const handleIssueBook = () => {
    toast({
      title: 'Issue Book',
      description: `Functionality to issue "${book.title}" is not yet implemented.`,
    });
  }

  const handleReturnBook = () => {
     toast({
      title: 'Return Book',
      description: `Functionality to return "${book.title}" is not yet implemented.`,
    });
  }

  return (
    <div>
        <div className="flex justify-end gap-2 mb-4">
            <Button variant="outline" onClick={() => router.push('/library')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to List
            </Button>
        </div>
        <Card className="shadow-lg max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-6">
                <Image 
                    src={book.coverImage} 
                    alt={book.title}
                    width={200}
                    height={300}
                    className="rounded-md shadow-md object-cover"
                />
                <div className="flex-1">
                    <CardTitle className="text-3xl">{book.title}</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">{book.author}</CardDescription>
                    <div className="mt-4 flex gap-2">
                        <Badge variant="secondary">{book.genre}</Badge>
                         <Badge variant={book.available > 0 ? 'success' : 'destructive'}>
                            {book.available > 0 ? `${book.available} Available` : 'Unavailable'}
                        </Badge>
                    </div>
                     <div className="mt-6 space-y-2 text-sm">
                        <div className="grid grid-cols-2">
                            <p className="font-semibold">ISBN</p>
                            <p>{book.isbn}</p>
                        </div>
                        <div className="grid grid-cols-2">
                            <p className="font-semibold">Book ID</p>
                            <p>{book.id}</p>
                        </div>
                         <div className="grid grid-cols-2">
                            <p className="font-semibold">Total Copies</p>
                            <p>{book.quantity}</p>
                        </div>
                    </div>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Future content like issue history can go here */}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button onClick={handleReturnBook} variant="outline">
                <BookX className="mr-2 h-4 w-4" />
                Return Book
            </Button>
            <Button onClick={handleIssueBook} disabled={book.available === 0}>
                <BookCheck className="mr-2 h-4 w-4" />
                Issue Book
            </Button>
          </CardFooter>
        </Card>
    </div>
  );
}
