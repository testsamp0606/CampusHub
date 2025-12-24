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
import { Badge } from '@/components/ui/badge';
import { Eye, Search, BookPlus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { booksData as initialBooksData } from '@/lib/data';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Book = (typeof initialBooksData)[0];

const BOOKS_PER_PAGE = 5;

export default function LibraryPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const storedBooks = localStorage.getItem('booksData');
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    } else {
      setBooks(initialBooksData);
      localStorage.setItem('booksData', JSON.stringify(initialBooksData));
    }
  }, []);

  const updateAndStoreBooks = (newBooks: Book[]) => {
    setBooks(newBooks);
    localStorage.setItem('booksData', JSON.stringify(newBooks));
  };


  const handleDelete = (bookId: string) => {
    toast({
      title: 'Delete Book',
      variant: 'destructive',
      description: `This will permanently delete book with ID: ${bookId}. This action is not yet implemented.`,
    });
  };

  const filteredBooks = useMemo(() => {
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, books]);

  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);

  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    const endIndex = startIndex + BOOKS_PER_PAGE;
    return filteredBooks.slice(startIndex, endIndex);
  }, [filteredBooks, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Library Management</h1>
        <Button asChild>
          <Link href="/library/add">
            <BookPlus className="mr-2 h-4 w-4" /> Add New Book
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Book Collection</CardTitle>
          <CardDescription>
            A list of all books available in the library.
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title, author, or ISBN..."
              className="w-full rounded-lg bg-background pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.id}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>
                    <Badge variant={book.available > 0 ? 'success' : 'destructive'}>
                      {book.available > 0 ? `${book.available} Available` : 'Unavailable'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button asChild variant="ghost" size="icon" title="View Details">
                        <Link href={`/library/${book.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(book.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {paginatedBooks.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              No books found.
            </div>
          )}
        </CardContent>
         <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{' '}
            <strong>
              {Math.min((currentPage - 1) * BOOKS_PER_PAGE + 1, filteredBooks.length)}
            </strong>{' '}
            to{' '}
            <strong>
              {Math.min(currentPage * BOOKS_PER_PAGE, filteredBooks.length)}
            </strong>{' '}
            of <strong>{filteredBooks.length}</strong> books
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
