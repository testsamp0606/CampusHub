
'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, PlusCircle, Inbox } from 'lucide-react';
import { conversationsData as initialConversationsData } from '@/lib/data';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

type Conversation = (typeof initialConversationsData)[0];

export default function MessagesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const storedConversations = localStorage.getItem('conversationsData');
    const convos = storedConversations ? JSON.parse(storedConversations) : initialConversationsData;
    const sortedConvos = convos.sort((a: Conversation, b: Conversation) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime());
    setConversations(sortedConvos);
  }, []);

  const filteredConversations = conversations.filter(
    (convo) =>
      convo.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      convo.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Button asChild>
          <Link href="/messages/new">
            <PlusCircle className="mr-2 h-4 w-4" /> New Message
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>
            All your conversations are listed here.
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by subject or participant..."
              className="w-full rounded-lg bg-background pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredConversations.map((convo) => (
              <div
                key={convo.id}
                className={cn(
                    "flex items-start gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                    !convo.read && "bg-blue-50"
                )}
                onClick={() => router.push(`/messages/${convo.id}`)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{convo.participants.find(p => p.id !== 'user')?.name.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{convo.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {convo.participants.map(p => p.name).join(', ')}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(convo.lastMessageTimestamp), { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 truncate">{convo.lastMessage}</p>
                </div>
                {!convo.read && <div className="h-2 w-2 rounded-full bg-primary mt-1.5"></div>}
              </div>
            ))}
             {filteredConversations.length === 0 && (
                <div className="py-20 text-center text-muted-foreground flex flex-col items-center gap-2">
                    <Inbox className="h-10 w-10" />
                    <p>No messages found.</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
