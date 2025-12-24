
'use client';
import { useParams, useRouter } from 'next/navigation';
import {
  conversationsData as initialConversationsData,
  messagesData as initialMessagesData,
  allUsers,
} from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type Conversation = (typeof initialConversationsData)[0];
type Message = (typeof initialMessagesData)[0];

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const conversationId = params.id as string;
  
  const [conversation, setConversation] = useState<Conversation | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedConvos = localStorage.getItem('conversationsData');
    const convos: Conversation[] = storedConvos ? JSON.parse(storedConvos) : initialConversationsData;
    const currentConvo = convos.find((c) => c.id === conversationId);
    setConversation(currentConvo);

    const storedMessages = localStorage.getItem('messagesData');
    const allMessages: Message[] = storedMessages ? JSON.parse(storedMessages) : initialMessagesData;
    const convoMessages = allMessages.filter(m => m.conversationId === conversationId).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    setMessages(convoMessages);

    // Mark as read
    if (currentConvo && !currentConvo.read) {
        const updatedConvos = convos.map(c => c.id === conversationId ? { ...c, read: true } : c);
        localStorage.setItem('conversationsData', JSON.stringify(updatedConvos));
    }
  }, [conversationId]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendReply = () => {
    if (reply.trim() === '') return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      conversationId: conversationId,
      senderId: 'user', // Assuming the current user is 'user'
      senderName: 'Admin',
      content: reply,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    const allStoredMessages = JSON.parse(localStorage.getItem('messagesData') || '[]');
    localStorage.setItem('messagesData', JSON.stringify([...allStoredMessages, newMessage]));

    const allStoredConvos: Conversation[] = JSON.parse(localStorage.getItem('conversationsData') || '[]');
    const updatedConvos = allStoredConvos.map(c => {
        if (c.id === conversationId) {
            return {
                ...c,
                lastMessage: reply,
                lastMessageTimestamp: newMessage.timestamp,
            }
        }
        return c;
    });
    localStorage.setItem('conversationsData', JSON.stringify(updatedConvos));

    setReply('');
    toast({ title: 'Reply Sent' });
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Conversation not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
        <div className="flex justify-between items-center mb-4">
            <div className='flex-1'>
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
                    const isUser = msg.senderId === 'user';
                    const sender = allUsers.find(u => u.id === msg.senderId);
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
                                    {format(new Date(msg.timestamp), 'MMM d, h:mm a')}
                                </p>
                            </div>
                             {isUser && (
                                 <Avatar className="h-8 w-8">
                                    <AvatarFallback>A</AvatarFallback>
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
