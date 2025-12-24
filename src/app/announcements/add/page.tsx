'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { announcementsData as initialData } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

type Announcement = (typeof initialData)[0];

const announcementFormSchema = z.object({
  id: z.string(),
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  content: z.string().min(20, 'Content must be at least 20 characters.'),
  author: z.string().min(3, 'Author is required.'),
  audience: z.enum(['All', 'Teachers', 'Students', 'Parents']),
});

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

const defaultValues: Partial<AnnouncementFormValues> = {
  id: '',
  title: '',
  content: '',
  author: 'Admin Office',
  audience: 'All',
};

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function AddAnnouncementPage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const uniqueId = `ANN${Date.now().toString().slice(-6)}`;
    form.setValue('id', uniqueId);
  }, [form]);

  function onSubmit(data: AnnouncementFormValues) {
    const storedData = localStorage.getItem('announcementsData');
    const currentData: Announcement[] = storedData ? JSON.parse(storedData) : [];

    const newAnnouncement: Announcement = {
        ...data,
        date: format(new Date(), 'yyyy-MM-dd'),
    };

    const updatedData = [...currentData, newAnnouncement];
    localStorage.setItem('announcementsData', JSON.stringify(updatedData));
    
    toast({
      title: 'Announcement Posted',
      description: `Your announcement "${data.title}" has been successfully posted.`,
    });
    router.push('/announcements');
  }
  
  const audienceOptions: Announcement['audience'][] = ['All', 'Teachers', 'Students', 'Parents'];
  const authorOptions = ['Principal\'s Office', 'Admin Office', 'Academic Head', 'Sports Department'];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Create New Announcement</CardTitle>
        <CardDescription>
          Fill out the form below to post a new announcement. Fields marked with <span className="text-destructive">*</span> are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <RequiredLabel>Title</RequiredLabel>
                    <FormControl>
                      <Input placeholder="e.g., Annual Sports Day Rescheduled" {...field} />
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
                    <RequiredLabel>Author / Department</RequiredLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an author" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {authorOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="audience"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Audience</RequiredLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the audience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {audienceOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <RequiredLabel>Content</RequiredLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write the full content of the announcement here..."
                        className="resize-y min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit">Post Announcement</Button>
               <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/announcements')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
