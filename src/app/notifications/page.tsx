'use client';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bell,
  UserPlus,
  AlertCircle,
  FileWarning,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const notifications = [
  {
    id: 1,
    icon: UserPlus,
    color: 'text-green-500',
    title: 'New student registered',
    description: 'John Doe has been admitted to Class I.',
    time: '10 minutes ago',
    read: false,
  },
  {
    id: 2,
    icon: FileWarning,
    color: 'text-yellow-500',
    title: 'Fee Payment Overdue',
    description: 'Invoice INV003 for Mike Johnson is overdue.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    icon: AlertCircle,
    color: 'text-red-500',
    title: 'Maintenance Alert',
    description: 'Vehicle V003 reported for maintenance.',
    time: '3 hours ago',
    read: true,
  },
  {
    id: 4,
    icon: UserPlus,
    color: 'text-green-500',
    title: 'New student registered',
    description: 'Emily White has been admitted to Class III.',
    time: '1 day ago',
    read: true,
  },
];

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Notifications</h1>
        <Button variant="outline">
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Here is a list of your recent notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {notifications.map((item, index) => (
              <React.Fragment key={item.id}>
                <div
                  className={`p-6 flex items-start gap-4 ${
                    !item.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="mt-1">
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {item.time}
                    </p>
                    {!item.read && (
                      <Badge variant="default" className="mt-2">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
                {index < notifications.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
