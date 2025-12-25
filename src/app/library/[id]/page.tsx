'use client';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookCheck, BookUp, QrCode, DollarSign } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useMemo, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';
import { format, addDays, differenceInDays } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

type Book = {
    id: string;
    title: string;
    author: string;
    isbn: string;
    publisher: string;
    edition?: string;
    category: string;
    language: string;
    quantity: number;
    issued: number;
    lost: number;
    resourceType: string;
    barcode?: string;
    shelf?: string;
    rack?: string;
    coverImage: string;
};

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

type Student = {
    id: string;
    name: string;
}

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const bookId = params.id as string;
  
  const [issueStudentId, setIssueStudentId] = useState('');

  const bookDocRef = useMemoFirebase(() => (firestore ? doc(firestore, `schools/school-1/books/${bookId}`) : null), [firestore, bookId]);
  const { data: book, isLoading: bookLoading } = useDoc<Book>(bookDocRef);

  const issuesQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, `schools/school-1/bookIssues`), where('bookId', '==', bookId)) : null), [firestore, bookId]);
  const { data: issueHistory, isLoading: issuesLoading } = useCollection<BookIssue>(issuesQuery);

  const studentsQuery = useMemoFirebase(() => (firestore ? collection(firestore, `schools/school-1/students`) : null), [firestore]);
  const { data: students, isLoading: studentsLoading } = useCollection<Student>(studentsQuery);

  const studentOptions = useMemo(() => students?.map(s => ({ value: s.id, label: `${s.name} (${s.id})` })) || [], [students]);

  const handleIssueBook = () => {
    if (!issueStudentId) {
        toast({
            variant: 'destructive',
            title: 'Student not selected',
            description: 'Please select a student to issue the book to.',
        });
        return;
    }

    if(!firestore || !book) return;

    const availableCopies = (book.quantity || 0) - (book.issued || 0) - (book.lost || 0);
    if (availableCopies <= 0) {
         toast({
            variant: 'destructive',
            title: 'Book Unavailable',
            description: 'This book is currently unavailable for issue.',
        });
        return;
    }

    const issueId = `I${Date.now().toString().slice(-6)}`;
    const newIssue = {
        issueId,
        bookId: bookId,
        studentId: issueStudentId,
        issueDate: serverTimestamp(),
        dueDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
        returnDate: null,
        status: 'Issued' as 'Issued',
        fineAmount: 0,
        fineStatus: 'Unpaid' as 'Unpaid',
        schoolId: 'school-1'
    };

    const issuesCollection = collection(firestore, `schools/school-1/bookIssues`);
    addDocumentNonBlocking(issuesCollection, newIssue, issueId);

    const bookRef = doc(firestore, `schools/school-1/books/${bookId}`);
    setDocumentNonBlocking(bookRef, { issued: (book.issued || 0) + 1}, { merge: true });

    toast({
      title: 'Book Issued',
      description: `"${book.title}" has been issued to student ${issueStudentId}.`,
    });
    
    setIssueStudentId('');
  }

  const handleReturnBook = (issueId: string) => {
     if(!firestore || !issueHistory || !book) return;

     const targetIssue = issueHistory.find(i => i.issueId === issueId);
     if (!targetIssue || targetIssue.status !== 'Issued') {
         toast({ variant: 'destructive', title: 'Invalid Action', description: 'This book is not currently issued.' });
         return;
     }

     const returnDate = new Date();
     const dueDate = new Date(targetIssue.dueDate);
     const overdueDays = differenceInDays(returnDate, dueDate);
     let fineAmount = 0;

     if (overdueDays > 0) {
         fineAmount = overdueDays * 1; // $1 fine per day overdue
         toast({
             variant: 'destructive',
             title: 'Book Overdue',
             description: `A fine of $${fineAmount.toFixed(2)} has been applied for ${overdueDays} overdue day(s).`,
         });
     } else {
         toast({
            title: 'Book Returned',
            description: `"${book?.title}" has been successfully returned on time.`,
        });
     }

     const issueRef = doc(firestore, `schools/school-1/bookIssues/${issueId}`);
     setDocumentNonBlocking(issueRef, { 
         status: 'Returned',
         returnDate: serverTimestamp(),
         fineAmount: fineAmount,
         fineStatus: fineAmount > 0 ? 'Unpaid' : 'Paid',
     }, { merge: true });
     
     const bookRef = doc(firestore, `schools/school-1/books/${bookId}`);
     setDocumentNonBlocking(bookRef, { issued: Math.max(0, (book.issued || 0) - 1) }, { merge: true });
  }

  const handlePayFine = (issueId: string) => {
      router.push(`/library/fine/${issueId}/pay`);
  }

  const isLoading = bookLoading || issuesLoading || studentsLoading;

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Book not found.</p>
      </div>
    );
  }

  const availableCopies = (book.quantity || 0) - (book.issued || 0) - (book.lost || 0);

  return (
    <div className="space-y-4">
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
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Badge variant="secondary">{book.category}</Badge>
                         <Badge variant={availableCopies > 0 ? 'success' : 'destructive'}>
                            {availableCopies > 0 ? `${availableCopies} Available` : 'Unavailable'}
                        </Badge>
                        <Badge variant="outline">{book.resourceType}</Badge>
                        <Badge variant="outline">{book.language}</Badge>
                    </div>
                    <div className="mt-6 space-y-2 text-sm">
                        <div className="grid grid-cols-3 gap-x-4">
                            <p className="font-semibold">Book ID</p><p className="col-span-2">{book.id}</p>
                            <p className="font-semibold">ISBN</p><p className="col-span-2">{book.isbn}</p>
                            <p className="font-semibold">Publisher</p><p className="col-span-2">{book.publisher}</p>
                            <p className="font-semibold">Edition</p><p className="col-span-2">{book.edition || 'N/A'}</p>
                        </div>
                    </div>
                     {book.barcode && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                            <QrCode className="h-4 w-4" />
                            <span>{book.barcode}</span>
                        </div>
                    )}
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Inventory Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p className="font-medium">Total Copies:</p><p>{book.quantity || 0}</p>
                        <p className="font-medium">Issued Copies:</p><p>{book.issued || 0}</p>
                        <p className="font-medium">Lost Copies:</p><p>{book.lost || 0}</p>
                        <p className="font-medium">Available Copies:</p><p className="font-bold">{availableCopies}</p>
                    </div>
                </div>
                 <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Location</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p className="font-medium">Shelf:</p><p>{book.shelf || 'N/A'}</p>
                        <p className="font-medium">Rack:</p><p>{book.rack || 'N/A'}</p>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>

        {availableCopies > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle>Issue Book</CardTitle>
                    <CardDescription>Select a student to issue this book to. The due date will be set to 14 days from today.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:w-1/2">
                        <Label htmlFor="student-id">Student</Label>
                        <Combobox
                            options={studentOptions}
                            value={issueStudentId}
                            onChange={setIssueStudentId}
                            placeholder="Select a student..."
                            searchPlaceholder="Search students..."
                            emptyResultText="No student found."
                        />
                    </div>
                    <Button onClick={handleIssueBook}>
                        <BookCheck className="mr-2 h-4 w-4" />
                        Confirm Issue
                    </Button>
                </CardContent>
            </Card>
        )}

        <Card>
            <CardHeader>
                <CardTitle>Issue History</CardTitle>
                <CardDescription>A log of all times this book has been issued.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student ID</TableHead>
                            <TableHead>Issue Date</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Return Date</TableHead>
                            <TableHead>Status</TableHead>
                             <TableHead>Fine</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {issueHistory?.map(issue => (
                            <TableRow key={issue.issueId}>
                                <TableCell>{issue.studentId}</TableCell>
                                <TableCell>{issue.issueDate?.toDate().toLocaleDateString()}</TableCell>
                                <TableCell>{issue.dueDate}</TableCell>
                                <TableCell>{issue.returnDate?.toDate().toLocaleDateString() || 'N/A'}</TableCell>
                                <TableCell>
                                    <Badge variant={issue.status === 'Issued' ? 'warning' : 'success'}>
                                        {issue.status}
                                    </Badge>
                                </TableCell>
                                 <TableCell>
                                    {issue.fineAmount > 0 ? (
                                        <Badge variant={issue.fineStatus === 'Paid' ? 'success' : 'destructive'}>
                                            ${issue.fineAmount.toFixed(2)} - {issue.fineStatus}
                                        </Badge>
                                    ) : (
                                        'N/A'
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {issue.status === 'Issued' && (
                                        <Button size="sm" onClick={() => handleReturnBook(issue.issueId)}>
                                            <BookUp className="mr-2 h-4 w-4" />
                                            Return
                                        </Button>
                                    )}
                                    {issue.status === 'Returned' && issue.fineAmount > 0 && issue.fineStatus === 'Unpaid' && (
                                        <Button size="sm" variant="outline" onClick={() => handlePayFine(issue.issueId)}>
                                            <DollarSign className="mr-2 h-4 w-4" />
                                            Pay Fine
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                         {!issuesLoading && issueHistory?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24">No issue history for this book.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}

    