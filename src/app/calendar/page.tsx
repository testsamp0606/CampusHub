'use client';
import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { eventsData } from '@/lib/data';
import { format, isSameDay } from 'date-fns';

type CalendarEvent = (typeof eventsData)[0];

const eventTypeColors: { [key in CalendarEvent['type']]: string } = {
  Holiday: 'bg-red-200 text-red-800 border-red-300',
  Event: 'bg-blue-200 text-blue-800 border-blue-300',
  Exam: 'bg-yellow-200 text-yellow-800 border-yellow-300',
};

const eventDotColors: { [key in CalendarEvent['type']]: string } = {
    Holiday: 'bg-red-500',
    Event: 'bg-blue-500',
    Exam: 'bg-yellow-500',
};

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const eventsByDate = useMemo(() => {
    const grouped: { [key: string]: CalendarEvent[] } = {};
    eventsData.forEach(event => {
      const dateKey = format(event.date, 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, []);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return eventsByDate[dateKey] || [];
  }, [selectedDate, eventsByDate]);

  const DayWithDot = ({ date, ...props }: { date: Date } & any) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayEvents = eventsByDate[dateKey];
    
    return (
      <div className="relative">
        {props.children}
        {dayEvents && dayEvents.length > 0 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1">
             {dayEvents.slice(0, 3).map((event, index) => (
                <span key={index} className={`h-1.5 w-1.5 rounded-full ${eventDotColors[event.type]}`}></span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Academic Calendar</h1>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-lg">
          <CardContent className="p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full"
              components={{
                Day: ({ date, displayMonth }) => {
                    const isOutside = props => props.displayMonth.getMonth() !== date.getMonth();
                    return <DayWithDot date={date}>{format(date, 'd')}</DayWithDot>
                }
              }}
               modifiers={{
                event: (date: Date) => {
                  const dateKey = format(date, 'yyyy-MM-dd');
                  return !!eventsByDate[dateKey];
                },
              }}
            />
          </CardContent>
        </Card>
        <Card className="shadow-lg">
           <CardHeader>
            <CardTitle>
                Events for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : '...'}
            </CardTitle>
            <CardDescription>
                A list of all events, holidays, and exams for the selected day.
            </CardDescription>
          </CardHeader>
           <CardContent className="space-y-4">
             {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map((event, index) => (
                   <div key={index} className={`p-3 rounded-lg border ${eventTypeColors[event.type]}`}>
                        <p className="font-semibold">{event.title}</p>
                        <p className="text-sm">{event.type}</p>
                   </div>
                ))
            ) : (
                <div className="py-10 text-center text-muted-foreground">
                    <p>No events scheduled for this day.</p>
                </div>
            )}

            <div className="pt-6 space-y-2">
                <h3 className="font-semibold">Legend</h3>
                <div className="flex flex-wrap gap-4">
                    {Object.entries(eventDotColors).map(([type, colorClass]) => (
                        <div key={type} className="flex items-center gap-2">
                            <span className={`h-3 w-3 rounded-full ${colorClass}`}></span>
                            <span className="text-sm text-muted-foreground">{type}</span>
                        </div>
                    ))}
                </div>
            </div>
           </CardContent>
        </Card>
       </div>
    </div>
  );
}
