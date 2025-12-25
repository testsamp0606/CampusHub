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
import { Eye, Search, BookPlus, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { booksData as initialBooksData, Book } from '@/lib/data';


const BOOKS_PER_PAGE = 5;

export default function LibraryPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedBooks = localStorage.getItem('booksData');
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    } else {
      setBooks(initialBooksData);
    }
    setIsLoading(false);
  }, []);

  const updateAndStoreBooks = (newBooks: Book[]) => {
    setBooks(newBooks);
    localStorage.setItem('booksData', JSON.stringify(newBooks));
  };


  const handleDelete = (bookId: string) => {
    const updatedBooks = books.filter(book => book.id !== bookId);
    updateAndStoreBooks(updatedBooks);
    
    toast({
      title: 'Book Deleted',
      variant: 'destructive',
      description: `Book with ID: ${bookId} has been permanently deleted.`,
    });
  };

  const handleEdit = (bookId: string) => {
    router.push(`/library/${bookId}/edit`);
  };

  const filteredBooks = useMemo(() => {
    if (!books) return [];
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
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center">Loading books...</TableCell>
                </TableRow>
              )}
              {!isLoading && paginatedBooks.map((book) => {
                const available = book.quantity - (book.issued || 0) - (book.lost || 0);
                return (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.id}</TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.category}</TableCell>
                    <TableCell>
                      <Badge variant={available > 0 ? 'success' : 'destructive'}>
                        {available > 0 ? `${available} Available` : 'Unavailable'}
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
                        <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(book.id)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(book.id)}
                          className="text-destructive hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {!isLoading && paginatedBooks.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    No books found.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
