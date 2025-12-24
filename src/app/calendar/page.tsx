'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  eventsData as initialEventsData,
  classesData,
  teachersData,
  timetablesData as initialTimetablesData,
  subjectsData,
} from '@/lib/data';
import { format, isValid, parseISO } from 'date-fns';
import type { DayProps } from 'react-day-picker';
import {
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  PartyPopper,
  PlusCircle,
  Save,
} from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { CalendarEvent, Teacher, TimetableEntry, FullTimetable } from '@/lib/data';

const periodTimes = [
  '09:00 - 09:45',
  '09:45 - 10:30',
  '11:00 - 11:45',
  '11:45 - 12:30',
  '13:30 - 14:15',
  '14:15 - 15:00',
];

const generateRandomTimetable = (classId: string, day: string): TimetableEntry[] => {
  return Array.from({ length: 6 }, (_, i) => ({
    period: i + 1,
    subject: subjectsData[Math.floor(Math.random() * subjectsData.length)].name,
    teacherId: teachersData[Math.floor(Math.random() * teachersData.length)].id,
    time: periodTimes[i],
  }));
};

const eventFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  date: z.date({ required_error: 'Please select a date for the event.' }),
  type: z.enum(['Holiday', 'Event', 'Exam']),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const eventTypeDetails: {
  [key in CalendarEvent['type']]: {
    color: string;
    dotColor: string;
    icon: React.ElementType;
  };
} = {
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

const WeeklyTimetable = () => {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState<string>(classesData[0].id);
  const [timetables, setTimetables] = useState<FullTimetable[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const storedTimetables = localStorage.getItem('timetablesData');
    if (storedTimetables) {
        setTimetables(JSON.parse(storedTimetables));
    } else {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const initialData = classesData.flatMap(cls => 
            days.map(day => ({
                classId: cls.id,
                day: day as any,
                entries: generateRandomTimetable(cls.id, day),
            }))
        );
      setTimetables(initialData);
      localStorage.setItem('timetablesData', JSON.stringify(initialData));
    }
  }, []);

  const classOptions = classesData.map((c) => ({ value: c.id, label: c.name }));
  const subjectOptions = subjectsData.map(s => ({ value: s.name, label: s.name }));
  const teacherOptions = teachersData.map(t => ({ value: t.id, label: t.name }));

  const classTimetable = useMemo(() => {
    return timetables.filter(t => t.classId === selectedClass);
  }, [timetables, selectedClass]);
  
  const handleTimetableChange = (day: string, period: number, field: 'subject' | 'teacherId', value: string) => {
    setTimetables(prev => {
        const newTimetables = [...prev];
        const timetableIndex = newTimetables.findIndex(t => t.classId === selectedClass && t.day === day);
        if (timetableIndex !== -1) {
            const entryIndex = newTimetables[timetableIndex].entries.findIndex(e => e.period === period);
            if (entryIndex !== -1) {
                (newTimetables[timetableIndex].entries[entryIndex] as any)[field] = value;
            }
        }
        return newTimetables;
    });
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    localStorage.setItem('timetablesData', JSON.stringify(timetables));
    setHasChanges(false);
    toast({
      title: 'Timetable Saved',
      description: 'Your changes to the timetable have been successfully saved.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <CardTitle>Weekly Class Timetable</CardTitle>
            <CardDescription>
              Select a class to view and edit its weekly schedule.
            </CardDescription>
          </div>
          <div className="flex gap-2 items-center mt-4 md:mt-0">
             <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full md:w-[280px]">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasChanges && (
                 <Button onClick={handleSaveChanges}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
              )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/6">Day</TableHead>
                {periodTimes.map((time, i) => (
                  <TableHead key={i} className="text-center">
                    Period {i+1}
                    <div className="text-xs font-normal text-muted-foreground">
                      {time}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                const dayEntries = classTimetable.find(t => t.day === day)?.entries || [];
                return (
                  <TableRow key={day}>
                    <TableCell className="font-semibold py-4">{day}</TableCell>
                    {Array.from({ length: 6 }).map((_, periodIndex) => {
                      const entry = dayEntries.find(e => e.period === periodIndex + 1);
                      return (
                        <TableCell key={periodIndex} className="text-center p-1">
                          <div className="flex flex-col gap-1">
                            <Select
                                value={entry?.subject}
                                onValueChange={(value) => handleTimetableChange(day, periodIndex + 1, 'subject', value)}
                            >
                                <SelectTrigger className="text-xs h-7">
                                    <SelectValue placeholder="Subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjectOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                             <Select
                                value={entry?.teacherId}
                                onValueChange={(value) => handleTimetableChange(day, periodIndex + 1, 'teacherId', value)}
                            >
                                <SelectTrigger className="text-xs h-7">
                                    <SelectValue placeholder="Teacher" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teacherOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CalendarPage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
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
    events.forEach((event) => {
      if (!event.date) return;
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

  const DayWithEvents = (props: DayProps) => {
    if (!isValid(props.date)) {
      return <></>;
    }
    const dateKey = format(props.date, 'yyyy-MM-dd');
    const dayEvents = eventsByDate[dateKey] || [];

    return (
      <div
        className={cn('h-full min-h-[120px] p-2 flex flex-col', {
          'bg-muted/50': props.date.getMonth() !== props.displayMonth.getMonth(),
        })}
      >
        <div className="flex justify-between items-center">
          <span
            className={cn('text-sm', {
              'text-muted-foreground':
                props.date.getMonth() !== props.displayMonth.getMonth(),
            })}
          >
            {format(props.date, 'd')}
          </span>
        </div>
        <ScrollArea className="flex-1 mt-1">
          <div className="space-y-1">
            {dayEvents.map((event, index) => {
              const details = eventTypeDetails[event.type];
              return (
                <div
                  key={index}
                  className={cn('text-xs rounded-sm px-1 truncate', details.color)}
                  title={event.title}
                >
                  <span
                    className={`w-2 h-2 rounded-full inline-block mr-1 ${details.dotColor}`}
                  ></span>
                  {event.title}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="monthly">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="monthly">Monthly Calendar</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Timetable</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Academic Calendar</CardTitle>
                <CardDescription>
                  A full view of all scheduled events, holidays, and exams.
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
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Annual Sports Day"
                                {...field}
                              />
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
                                    {field.value ? (
                                      format(field.value, 'PPP')
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
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
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
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

          <Card className="shadow-lg mt-6">
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
                classNames={{
                  months:
                    'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                  month: 'space-y-4 w-full',
                  table: 'w-full border-collapse space-y-1',
                  head_row: 'flex border-b',
                  head_cell:
                    'text-muted-foreground rounded-md w-full font-normal text-[0.8rem] justify-center flex p-2',
                  row: 'flex w-full mt-2',
                  cell: 'h-auto text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 w-full border',
                  day: 'h-full w-full p-0 font-normal aria-selected:opacity-100',
                  day_selected:
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                }}
                components={{ Day: DayWithEvents }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="weekly" className="mt-4">
          <WeeklyTimetable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
