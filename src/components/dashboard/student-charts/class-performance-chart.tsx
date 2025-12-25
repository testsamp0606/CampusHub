'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

const chartConfig = {
  passPercentage: {
    label: 'Pass %',
    color: 'hsl(var(--chart-2))',
  },
};

export default function ClassPerformanceChart() {
  const firestore = useFirestore();
  const classesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'schools', 'school-1', 'classes'), where('status', '==', 'Active'));
  }, [firestore]);

  const { data: classesData } = useCollection(classesQuery);

  const chartData = useMemo(() => {
    if (!classesData) return [];
    return classesData
      .filter((c: any) => c.passPercentage)
      .map((c: any) => ({
        class: c.name,
        passPercentage: c.passPercentage,
      }));
  }, [classesData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Performance (Last Year)</CardTitle>
        <CardDescription>
          A bar chart showing the pass percentage for each class from the previous academic year.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="class"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis unit="%" />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="passPercentage" fill="var(--color-passPercentage)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
