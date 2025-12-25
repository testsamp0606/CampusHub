
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
import { useMemo, useEffect, useState } from 'react';
import { teachersData as initialTeachersData } from '@/lib/data';

const usersData = [
    { id: "user", username: "Admin" },
    ...initialTeachersData.map(t => ({id: t.id, username: t.name}))
];

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
  const user = { uid: 'user' };

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues,
  });

  function onSubmit(data: MessageFormValues) {
    const recipient = usersData?.find(u => u.id === data.recipientId);
    if (!recipient) {
        toast({ variant: 'destructive', title: 'Error', description: 'Recipient not found.' });
        return;
    }

    const conversationsData = JSON.parse(localStorage.getItem('conversationsData') || '[]');
    const messagesData = JSON.parse(localStorage.getItem('messagesData') || '[]');
    
    const newConversationId = `CONV${Date.now()}`;

    const newConversation = {
        id: newConversationId,
        subject: data.subject,
        participantIds: [user.uid, data.recipientId],
        lastMessage: data.content,
        lastMessageTimestamp: new Date().toISOString(),
        readBy: [user.uid],
    };

    const newMessage = {
        id: `MSG${Date.now()}`,
        conversationId: newConversationId,
        senderId: user.uid,
        content: data.content,
        timestamp: new Date().toISOString(),
    };

    localStorage.setItem('conversationsData', JSON.stringify([...conversationsData, newConversation]));
    localStorage.setItem('messagesData', JSON.stringify([...messagesData, newMessage]));

    toast({
      title: 'Message Sent',
      description: `Your message has been sent to ${recipient.username}.`,
    });
    router.push(`/messages/${newConversation.id}`);
  }

  const userOptions = useMemo(() => {
      if (!usersData || !user) return [];
      return usersData
        .filter(u => u.id !== user.uid)
        .map((u) => ({
            value: u.id,
            label: `${u.username} (${u.id})`,
        }));
  }, [user]);

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
