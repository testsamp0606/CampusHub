'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { booksData } from '@/lib/data';

const bookFormSchema = z.object({
  bookId: z.string(),
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  author: z.string().min(3, 'Author must be at least 3 characters.'),
  isbn: z.string().regex(/^(97(8|9))?\d{9}(\d|X)$/, 'Please enter a valid ISBN.'),
  genre: z.string().min(3, 'Genre is required.'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
  coverImage: z.any().optional(),
});

type BookFormValues = z.infer<typeof bookFormSchema>;
type Book = (typeof booksData)[0];


const defaultValues: Partial<BookFormValues> = {
  bookId: '',
  title: '',
  author: '',
  isbn: '',
  genre: '',
  quantity: 1,
};

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function AddBookPage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues,
  });

  useEffect(() => {
    // Generate a unique book ID when the component mounts
    const uniqueId = `B${Date.now().toString().slice(-6)}`;
    form.setValue('bookId', uniqueId);
  }, [form]);

  function onSubmit(data: BookFormValues) {
    const storedBooks = localStorage.getItem('booksData');
    const currentBooks: Book[] = storedBooks ? JSON.parse(storedBooks) : [];

    const newBook: Book = {
        id: data.bookId,
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        genre: data.genre,
        quantity: data.quantity,
        available: data.quantity, // Initially, all copies are available
        coverImage: `https://picsum.photos/seed/${data.bookId}/200/300`, // Placeholder image
    };

    const updatedBooks = [...currentBooks, newBook];
    localStorage.setItem('booksData', JSON.stringify(updatedBooks));
    
    toast({
      title: 'Book Added',
      description: `"${data.title}" has been successfully added to the library.`,
    });
    form.reset();
    router.push('/library');
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Add New Book</CardTitle>
        <CardDescription>
          Fill out the form below to add a new book to the library collection. Fields marked with <span className="text-destructive">*</span> are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="bookId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book ID</FormLabel>
                    <FormControl>
                      <Input placeholder="B123456" {...field} disabled value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Book Title</RequiredLabel>
                    <FormControl>
                      <Input placeholder="The Great Gatsby" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Author</RequiredLabel>
                    <FormControl>
                      <Input placeholder="F. Scott Fitzgerald" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>ISBN</RequiredLabel>
                    <FormControl>
                      <Input placeholder="978-0743273565" {...field} value={field.value || ''} />
                    </FormControl>
                     <FormDescription>
                      Enter the 10 or 13 digit ISBN without dashes.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Genre</RequiredLabel>
                    <FormControl>
                      <Input placeholder="Classic, Fiction, etc." {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Quantity</RequiredLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="coverImage"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} {...field} />
                    </FormControl>
                    <FormDescription>
                      Upload a cover image for the book. This is currently for UI purposes only.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <div className="flex gap-4">
              <Button type="submit">Add Book</Button>
               <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Close
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
