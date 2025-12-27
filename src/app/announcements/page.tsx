
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, User, Calendar } from 'lucide-react';
import Link from 'next/link';
import { announcementsData as initialAnnouncementsData, Announcement } from '@/lib/data';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncementsData);

  const getAudienceBadgeVariant = (audience: Announcement['audience']) => {
    switch (audience) {
      case 'All':
        return 'default';
      case 'Teachers':
        return 'warning';
      case 'Students':
        return 'success';
      case 'Parents':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <Button asChild>
          <Link href="/announcements/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Announcement
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        {announcements
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((item) => (
            <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle>{item.title}</CardTitle>
                    <Badge variant={getAudienceBadgeVariant(item.audience)}>
                        For {item.audience}
                    </Badge>
                </div>
                <CardDescription className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                   <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                   </span>
                   <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Posted by: {item.author}
                   </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.content}</p>
              </CardContent>
            </Card>
        ))}

        {announcements.length === 0 && (
             <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                    No announcements found.
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
