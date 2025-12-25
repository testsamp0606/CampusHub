
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

const conversationsData = [
    {
        id: "CONV001",
        subject: "Mid-term exam schedule",
        participantIds: ["user", "T001"],
        lastMessage: "Sounds good, thank you for the update!",
        lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        readBy: ["user"],
    },
    {
        id: "CONV002",
        subject: "Question about physics homework",
        participantIds: ["user", "T001"],
        lastMessage: "I will check it and get back to you.",
        lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        readBy: [],
    }
];

const messagesData: Omit<Message, 'senderName'>[] = [
    { id: "MSG001", conversationId: "CONV001", senderId: "T001", content: "Dear Admin, the mid-term exams are scheduled for the second week of September.", timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
    { id: "MSG002", conversationId: "CONV001", senderId: "user", content: "Sounds good, thank you for the update!", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: "MSG003", conversationId: "CONV002", senderId: "user", content: "I have a question about the derivation in chapter 3.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
    { id: "MSG004", conversationId: "CONV002", senderId: "T001", content: "I will check it and get back to you.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
];

const usersData = [
    { id: "user", username: "Admin" },
    { id: "T001", username: "Dr. Evelyn Reed" }
];


export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const user = { uid: 'user', displayName: 'Admin' };
  const conversationId = params.id as string;
  
  const [reply, setReply] = useState('');
  const [conversation, setConversation] = useState<Conversation | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const allConversations = JSON.parse(localStorage.getItem('conversationsData') || JSON.stringify(conversationsData));
    const currentConvo = allConversations.find((c: Conversation) => c.id === conversationId);
    
    if (currentConvo) {
        const allMessages = JSON.parse(localStorage.getItem('messagesData') || JSON.stringify(messagesData));
        const convoMessages = allMessages.filter((m: Message) => m.conversationId === conversationId);
        
        const usersMap = new Map(usersData.map(u => [u.id, u.username]));

        setConversation({
            ...currentConvo,
            participants: currentConvo.participantIds.map((id: string) => ({
                id,
                name: usersMap.get(id) || 'Unknown User'
            }))
        });

        setMessages(convoMessages.map((msg: Message) => ({
            ...msg,
            senderName: usersMap.get(msg.senderId) || 'Unknown User',
            timestamp: new Date(msg.timestamp)
        })));

         // Mark as read
        if (user && !currentConvo.readBy?.includes(user.uid)) {
            const updatedConvos = allConversations.map((c: Conversation) => 
                c.id === conversationId ? { ...c, readBy: [...(c.readBy || []), user.uid] } : c
            );
            localStorage.setItem('conversationsData', JSON.stringify(updatedConvos));
        }

    }
  }, [conversationId, user]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendReply = () => {
    if (reply.trim() === '' || !user || !conversation) return;

    const allMessages = JSON.parse(localStorage.getItem('messagesData') || JSON.stringify(messagesData));

    const newMessage: Omit<Message, 'senderName'> = {
      id: `MSG${Date.now()}`,
      conversationId: conversationId,
      senderId: user.uid,
      content: reply,
      timestamp: new Date().toISOString(),
    };
    
    const updatedMessages = [...allMessages, newMessage];
    localStorage.setItem('messagesData', JSON.stringify(updatedMessages));
    
    const usersMap = new Map(usersData.map(u => [u.id, u.username]));
    setMessages(prev => [...prev, { ...newMessage, senderName: usersMap.get(newMessage.senderId) || 'Unknown', timestamp: new Date(newMessage.timestamp)} ]);

    // Update conversation's last message
    const allConversations = JSON.parse(localStorage.getItem('conversationsData') || JSON.stringify(conversationsData));
    const updatedConvos = allConversations.map((c: any) => 
        c.id === conversationId 
        ? { ...c, lastMessage: reply, lastMessageTimestamp: newMessage.timestamp, readBy: [user.uid] } 
        : c
    );
    localStorage.setItem('conversationsData', JSON.stringify(updatedConvos));
    
    setReply('');
    toast({ title: 'Reply Sent' });
  };

  if (!conversation) {
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
                 <h1 className="text-xl font-bold truncate">{conversation.subject}</h1>
                 <p className="text-sm text-muted-foreground truncate">
                    Participants: {conversation.participants.map(p => p.name).join(', ')}
                </p>
            </div>
            <Button variant="outline" onClick={() => router.push('/messages')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Inbox
            </Button>
        </div>
        <Card className="flex-1 flex flex-col">
            <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
                 {messages.map((msg) => {
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
                                    {format(msg.timestamp, 'MMM d, h:mm a')}
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
