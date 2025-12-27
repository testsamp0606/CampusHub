
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { booksData as initialBooksData, Book } from '@/lib/data';


const bookFormSchema = z.object({
  id: z.string(),
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  author: z.string().min(3, 'Author must be at least 3 characters.'),
  isbn: z.string().regex(/^(97(8|9))?\d{9}(\d|X)$/, 'Please enter a valid ISBN.'),
  publisher: z.string().min(2, "Publisher is required."),
  edition: z.string().optional(),
  category: z.string().min(3, 'Category is required.'),
  language: z.string().min(2, "Language is required."),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
  lost: z.coerce.number().min(0).default(0),
  resourceType: z.string({ required_error: 'Please select a resource type.'}),
  barcode: z.string().optional(),
  shelf: z.string().optional(),
  rack: z.string().optional(),
  coverImage: z.any().optional(),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

const defaultValues: Partial<BookFormValues> = {
  id: '',
  title: '',
  author: '',
  isbn: '',
  publisher: '',
  edition: '',
  category: '',
  language: 'English',
  quantity: 1,
  lost: 0,
  resourceType: 'Book',
  barcode: '',
  shelf: '',
  rack: '',
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
    form.setValue('id', uniqueId);
  }, [form]);

  function onSubmit(data: BookFormValues) {
    const newBook: Book = {
        ...data,
        issued: 0,
        coverImage: `https://picsum.photos/seed/${data.id}/200/300`, // Placeholder image
    };
    
    // In a real app, you would save this to a database
    console.log('New book data:', newBook);
    
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
        <CardTitle>Add New Book or Resource</CardTitle>
        <CardDescription>
          Fill out the form below to add a new item to the library collection. Fields marked with <span className="text-destructive">*</span> are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <FormField
                control={form.control}
                name="id"
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
                    <RequiredLabel>Title</RequiredLabel>
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
                      <Input placeholder="9780743273565" {...field} value={field.value || ''} />
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
                name="publisher"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Publisher</RequiredLabel>
                    <FormControl>
                      <Input placeholder="Scribner" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="edition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edition</FormLabel>
                    <FormControl>
                      <Input placeholder="1st" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Category</RequiredLabel>
                    <FormControl>
                      <Input placeholder="Classic, Fiction, etc." {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Language</RequiredLabel>
                    <FormControl>
                      <Input placeholder="English" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="resourceType"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Resource Type</RequiredLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a resource type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Book">Book</SelectItem>
                        <SelectItem value="E-Book">E-Book</SelectItem>
                        <SelectItem value="Journal">Journal</SelectItem>
                        <SelectItem value="Reference Material">Reference Material</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Total Copies</RequiredLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="lost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lost Copies</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                 <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barcode / QR Code</FormLabel>
                        <FormControl>
                          <Input placeholder="1234567890" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shelf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shelf Location</FormLabel>
                        <FormControl>
                          <Input placeholder="A1" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rack"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rack Location</FormLabel>
                        <FormControl>
                          <Input placeholder="3" {...field} value={field.value || ''} />
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
                      Upload a cover image. If not provided, a placeholder will be used.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <div className="flex gap-4">
              <Button type="submit">Add Resource</Button>
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
