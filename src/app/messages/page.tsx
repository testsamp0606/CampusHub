
'use client';
import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, PlusCircle, Inbox } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';

type Participant = { id: string; name: string };
type Conversation = {
    id: string;
    subject: string;
    participantIds: string[];
    participants: Participant[]; // This will be enriched
    lastMessage: string;
    lastMessageTimestamp: any; // Can be a server timestamp
    readBy: string[];
    read: boolean; // This will be enriched
};

export default function MessagesPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');

  const conversationsQuery = useMemoFirebase(
    () =>
      firestore && user
        ? query(
            collection(firestore, 'schools/school-1/conversations'),
            where('participantIds', 'array-contains', user.uid),
            orderBy('lastMessageTimestamp', 'desc')
          )
        : null,
    [firestore, user]
  );
  const { data: conversationsData, isLoading: conversationsLoading } = useCollection<Conversation>(conversationsQuery);
  
  const usersQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'schools/school-1/users') : null),
    [firestore]
  );
  const { data: usersData } = useCollection<{id: string, username: string}>(usersQuery);


  const enrichedConversations = useMemo(() => {
    if (!conversationsData || !usersData || !user) return [];
    
    const usersMap = new Map(usersData.map(u => [u.id, u.username]));

    return conversationsData.map(convo => ({
        ...convo,
        participants: convo.participantIds.map(id => ({
            id,
            name: usersMap.get(id) || 'Unknown User'
        })),
        read: convo.readBy?.includes(user.uid),
        // Ensure timestamp is a Date object for formatDistanceToNow
        lastMessageTimestamp: convo.lastMessageTimestamp?.toDate ? convo.lastMessageTimestamp.toDate() : new Date(),
    }));
  }, [conversationsData, usersData, user]);


  const filteredConversations = useMemo(() => {
      if (!enrichedConversations) return [];
      return enrichedConversations.filter(
        (convo) =>
          convo.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          convo.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }, [enrichedConversations, searchQuery]);

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
          <TooltipProvider>
            <div className="divide-y">
              {conversationsLoading && <div className="py-10 text-center text-muted-foreground">Loading conversations...</div>}
              {!conversationsLoading && filteredConversations.map((convo) => {
                const participant = convo.participants.find(p => p.id !== user?.uid);
                return (
                <div
                  key={convo.id}
                  className={cn(
                      "flex items-start gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                      !convo.read && "bg-blue-50"
                  )}
                  onClick={() => router.push(`/messages/${convo.id}`)}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{participant?.name.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{participant?.name} ({participant?.id})</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold truncate">{convo.subject}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {convo.participants.map(p => p.name).join(', ')}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(convo.lastMessageTimestamp, { addSuffix: true })}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 truncate">{convo.lastMessage}</p>
                  </div>
                  {!convo.read && <div className="h-2 w-2 rounded-full bg-primary mt-1.5"></div>}
                </div>
              )})}
              {!conversationsLoading && filteredConversations.length === 0 && (
                  <div className="py-20 text-center text-muted-foreground flex flex-col items-center gap-2">
                      <Inbox className="h-10 w-10" />
                      <p>No messages found.</p>
                  </div>
              )}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}
