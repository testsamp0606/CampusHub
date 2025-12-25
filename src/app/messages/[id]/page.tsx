
'use client';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useRef, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';

type Participant = { id: string; name: string };
type Conversation = {
    id: string;
    subject: string;
    participantIds: string[];
    participants: Participant[]; // Enriched
    readBy: string[];
};
type Message = {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string; // Enriched
    content: string;
    timestamp: any; // Can be Date or server timestamp
};

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const conversationId = params.id as string;
  
  const [reply, setReply] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationDocRef = useMemoFirebase(() => (firestore ? doc(firestore, `schools/school-1/conversations/${conversationId}`) : null), [firestore, conversationId]);
  const { data: conversationData } = useDoc<Conversation>(conversationDocRef);
  
  const messagesQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, `schools/school-1/conversations/${conversationId}/messages`), orderBy('timestamp', 'asc')) : null), [firestore, conversationId]);
  const { data: messagesData } = useCollection<Message>(messagesQuery);
  
  const usersQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'schools/school-1/users') : null), [firestore]);
  const { data: usersData } = useCollection<{id: string, username: string}>(usersQuery);

  const enrichedConversation = useMemo(() => {
    if (!conversationData || !usersData) return undefined;
    const usersMap = new Map(usersData.map(u => [u.id, u.username]));
    return {
        ...conversationData,
        participants: conversationData.participantIds.map(id => ({
            id,
            name: usersMap.get(id) || 'Unknown User'
        }))
    }
  }, [conversationData, usersData]);

  const enrichedMessages = useMemo(() => {
      if (!messagesData || !usersData) return [];
      const usersMap = new Map(usersData.map(u => [u.id, u.username]));
      return messagesData.map(msg => ({
          ...msg,
          senderName: usersMap.get(msg.senderId) || 'Unknown User'
      }));
  }, [messagesData, usersData]);

  useEffect(() => {
    // Mark as read
    if (conversationDocRef && user && conversationData && !conversationData.readBy?.includes(user.uid)) {
        setDocumentNonBlocking(conversationDocRef, {
            readBy: [...(conversationData.readBy || []), user.uid]
        }, { merge: true });
    }
  }, [conversationDocRef, user, conversationData]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [enrichedMessages]);

  const handleSendReply = () => {
    if (reply.trim() === '' || !firestore || !user) return;

    const messagesCollection = collection(firestore, `schools/school-1/conversations/${conversationId}/messages`);
    const newMessage = {
      conversationId: conversationId,
      senderId: user.uid,
      content: reply,
      timestamp: serverTimestamp(),
      schoolId: 'school-1',
    };
    addDocumentNonBlocking(messagesCollection, newMessage);

    // Update conversation's last message
    if (conversationDocRef) {
        setDocumentNonBlocking(conversationDocRef, {
            lastMessage: reply,
            lastMessageTimestamp: serverTimestamp(),
            readBy: [user.uid] // The sender has read it
        }, { merge: true });
    }

    setReply('');
    toast({ title: 'Reply Sent' });
  };

  if (!enrichedConversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
        <div className="flex justify-between items-center mb-4">
            <div className='flex-1 overflow-hidden'>
                 <h1 className="text-xl font-bold truncate">{enrichedConversation.subject}</h1>
                 <p className="text-sm text-muted-foreground truncate">
                    Participants: {enrichedConversation.participants.map(p => p.name).join(', ')}
                </p>
            </div>
            <Button variant="outline" onClick={() => router.push('/messages')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Inbox
            </Button>
        </div>
        <Card className="flex-1 flex flex-col">
            <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
                 {enrichedMessages.map((msg) => {
                    const isUser = msg.senderId === user?.uid;
                    return (
                        <div key={msg.id} className={cn("flex items-end gap-2", isUser ? 'justify-end' : 'justify-start')}>
                             {!isUser && (
                                 <Avatar className="h-8 w-8">
                                    <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                                 </Avatar>
                             )}
                            <div className={cn(
                                "max-w-md rounded-lg p-3", 
                                isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            )}>
                                <p className="text-sm">{msg.content}</p>
                                <p className={cn("text-xs mt-1", isUser ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                                    {msg.timestamp?.toDate ? format(msg.timestamp.toDate(), 'MMM d, h:mm a') : 'sending...'}
                                </p>
                            </div>
                             {isUser && (
                                 <Avatar className="h-8 w-8">
                                    <AvatarFallback>{user?.displayName?.charAt(0) || 'A'}</AvatarFallback>
                                 </Avatar>
                             )}
                        </div>
                    );
                 })}
                 <div ref={messagesEndRef} />
            </CardContent>
            <CardFooter className="p-4 border-t">
                <div className="flex w-full items-center gap-2">
                    <Textarea 
                        placeholder="Type your reply here..."
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        className="resize-none min-h-[40px]"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendReply();
                            }
                        }}
                    />
                    <Button onClick={handleSendReply}>
                        <Send className="mr-2 h-4 w-4" />
                        Send
                    </Button>
                </div>
            </CardFooter>
        </Card>
    </div>
  );
}

    