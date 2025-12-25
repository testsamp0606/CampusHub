
'use client';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">LMS Reports</h1>
      <Card>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
          <CardDescription>
            Detailed reports on student and course performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground p-12 text-center h-96">
            <Construction className="h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-muted-foreground">
              Feature Under Construction
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This reporting and analytics section is coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
