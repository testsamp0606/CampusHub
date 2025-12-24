'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { eventsData as initialEventsData } from '@/lib/data';
import { format, isValid, parseISO } from 'date-fns';
import type { DayProps } from 'react-day-picker';
import { BookOpen, Calendar as CalendarIcon, PartyPopper, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type CalendarEvent = (typeof initialEventsData)[0];

const eventFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  date: z.date({ required_error: 'Please select a date for the event.' }),
  type: z.enum(['Holiday', 'Event', 'Exam']),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const eventTypeDetails: { [key in CalendarEvent['type']]: { color: string; dotColor: string; icon: React.ElementType } } = {
  Holiday: {
    color: 'bg-red-100 text-red-800 border-red-200',
    dotColor: 'bg-red-500',
    icon: PartyPopper,
  },
  Event: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    dotColor: 'bg-blue-500',
    icon: CalendarIcon,
  },
  Exam: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    dotColor: 'bg-yellow-500',
    icon: BookOpen,
  },
};

export default function CalendarPage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
  });
  
  useEffect(() => {
    const storedEvents = localStorage.getItem('eventsData');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      setEvents(initialEventsData);
      localStorage.setItem('eventsData', JSON.stringify(initialEventsData));
    }
  }, []);

  useEffect(() => {
    form.reset({
      title: '',
      type: 'Event',
      date: selectedDate || new Date(),
    });
  }, [isFormOpen, selectedDate, form]);

  const eventsByDate = useMemo(() => {
    const grouped: { [key: string]: CalendarEvent[] } = {};
    events.forEach(event => {
      const eventDate = parseISO(event.date);
      if (isValid(eventDate)) {
        const dateKey = format(eventDate, 'yyyy-MM-dd');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(event);
      }
    });
    return grouped;
  }, [events]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate || !isValid(selectedDate)) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return eventsByDate[dateKey] || [];
  }, [selectedDate, eventsByDate]);

  function onSubmit(data: EventFormValues) {
    const newEvent: CalendarEvent = {
      ...data,
      date: format(data.date, 'yyyy-MM-dd'),
    };
    
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('eventsData', JSON.stringify(updatedEvents));
    
    toast({
      title: 'Event Created',
      description: `"${newEvent.title}" has been added to the calendar.`,
    });
    
    form.reset();
    setIsFormOpen(false);
  }

  const DayWithDot = (props: DayProps) => {
    if (!isValid(props.date)) {
      return <></>;
    }
    const dateKey = format(props.date, 'yyyy-MM-dd');
    const dayEvents = eventsByDate[dateKey];
    
    return (
      <div className="relative h-full w-full flex items-center justify-center">
        <span>{format(props.date, 'd')}</span>
        {dayEvents && dayEvents.length > 0 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1">
             {dayEvents.slice(0, 3).map((event, index) => (
                <span key={index} className={`h-1.5 w-1.5 rounded-full ${eventTypeDetails[event.type].dotColor}`}></span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Academic Calendar</CardTitle>
            <CardDescription>
              Select a date to view all associated events, holidays, and exams.
            </CardDescription>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
               <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new calendar event.
                </DialogDescription>
              </DialogHeader>
               <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Annual Sports Day" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Event Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an event type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Event">Event</SelectItem>
                            <SelectItem value="Holiday">Holiday</SelectItem>
                            <SelectItem value="Exam">Exam</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Create Event</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg">
          <CardContent className="p-0 flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full max-w-lg"
              components={{ Day: DayWithDot }}
            />
          </CardContent>
        </Card>
        
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>
                  Events for {selectedDate && isValid(selectedDate) ? format(selectedDate, 'MMMM d, yyyy') : '...'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDayEvents.length > 0 ? (
                  selectedDayEvents.map((event, index) => {
                    const details = eventTypeDetails[event.type];
                    const Icon = details.icon;
                    return (
                      <div key={index} className={`p-4 rounded-lg border ${details.color} flex items-center gap-4`}>
                          <div className={`p-2 rounded-full ${details.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold">{event.title}</p>
                            <p className="text-sm">{event.type}</p>
                          </div>
                      </div>
                    )
                  })
              ) : (
                  <div className="py-10 text-center text-muted-foreground">
                      <p>No events scheduled for this day.</p>
                  </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {Object.entries(eventTypeDetails).map(([type, { dotColor }]) => (
                      <div key={type} className="flex items-center gap-2">
                          <span className={`h-3 w-3 rounded-full ${dotColor}`}></span>
                          <span className="text-sm text-muted-foreground">{type}</span>
                      </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
