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
import { format, isValid } from 'date-fns';
import type { DayProps } from 'react-day-picker';
import { BookOpen, Calendar as CalendarIcon, PartyPopper } from 'lucide-react';

type CalendarEvent = (typeof eventsData)[0];

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const eventsByDate = useMemo(() => {
    const grouped: { [key: string]: CalendarEvent[] } = {};
    eventsData.forEach(event => {
      const eventDate = new Date(event.date);
      if (isValid(eventDate)) {
        const dateKey = format(eventDate, 'yyyy-MM-dd');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(event);
      }
    });
    return grouped;
  }, []);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate || !isValid(selectedDate)) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return eventsByDate[dateKey] || [];
  }, [selectedDate, eventsByDate]);

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
        <CardHeader>
          <CardTitle>Academic Calendar</CardTitle>
          <CardDescription>
            Select a date to view all associated events, holidays, and exams.
          </CardDescription>
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
