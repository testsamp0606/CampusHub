
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
import { Combobox } from '@/components/ui/combobox';
import { Textarea } from '@/components/ui/textarea';
import { useCollection, useFirestore, useUser, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import { useMemo } from 'react';

const messageFormSchema = z.object({
  recipientId: z.string({ required_error: 'Please select a recipient.' }),
  subject: z.string().min(3, 'Subject must be at least 3 characters.'),
  content: z.string().min(10, 'Message content must be at least 10 characters.'),
});

type MessageFormValues = z.infer<typeof messageFormSchema>;

const defaultValues: Partial<MessageFormValues> = {
  subject: '',
  content: '',
};

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function NewMessagePage() {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();

  const usersQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'schools/school-1/users') : null), [firestore]);
  const { data: usersData } = useCollection<{id: string; username: string}>(usersQuery);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues,
  });

  async function onSubmit(data: MessageFormValues) {
    if (!firestore || !user) {
        toast({ variant: 'destructive', title: 'Error', description: 'User or database not available.' });
        return;
    }
    
    const recipient = usersData?.find(u => u.id === data.recipientId);
    if (!recipient) {
        toast({ variant: 'destructive', title: 'Error', description: 'Recipient not found.' });
        return;
    }

    try {
        const conversationsCollection = collection(firestore, 'schools/school-1/conversations');
        const newConversationRef = doc(conversationsCollection); // Create a new doc ref with an auto-generated ID

        const newConversation = {
            id: newConversationRef.id,
            subject: data.subject,
            participantIds: [user.uid, data.recipientId],
            lastMessage: data.content,
            lastMessageTimestamp: serverTimestamp(),
            readBy: [user.uid],
            schoolId: 'school-1',
        };
        addDocumentNonBlocking(conversationsCollection, newConversation);

        const messagesCollection = collection(firestore, `schools/school-1/conversations/${newConversation.id}/messages`);
        const newMessage = {
            conversationId: newConversation.id,
            senderId: user.uid,
            content: data.content,
            timestamp: serverTimestamp(),
            schoolId: 'school-1',
        };
        addDocumentNonBlocking(messagesCollection, newMessage);

        toast({
          title: 'Message Sent',
          description: `Your message has been sent to ${recipient.username}.`,
        });
        router.push(`/messages/${newConversation.id}`);
    } catch (error) {
        console.error("Error creating conversation:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to send message.' });
    }
  }

  const userOptions = useMemo(() => {
      if (!usersData || !user) return [];
      return usersData
        .filter(u => u.id !== user.uid)
        .map((u) => ({
            value: u.id,
            label: `${u.username} (${u.id})`,
        }));
  }, [usersData, user]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Compose New Message</CardTitle>
        <CardDescription>
          Fill out the form below to send a new message. Fields marked with <span className="text-destructive">*</span> are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="recipientId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <RequiredLabel>Recipient</RequiredLabel>
                    <FormControl>
                      <Combobox
                        options={userOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select a recipient..."
                        searchPlaceholder="Search users..."
                        emptyResultText="No user found."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Subject</RequiredLabel>
                    <FormControl>
                      <Input placeholder="e.g., Query about upcoming exam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Message</RequiredLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your message here..."
                        className="resize-y min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <div className="flex gap-4">
              <Button type="submit">Send Message</Button>
               <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/messages')}
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

    