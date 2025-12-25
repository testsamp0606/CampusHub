
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
import { useMemo, useState, useEffect } from 'react';
import { classesData as initialClassesData, ClassInfo } from '@/lib/data';

const chartConfig = {
  passPercentage: {
    label: 'Pass %',
    color: 'hsl(var(--chart-2))',
  },
};

export default function ClassPerformanceChart() {
  const [classesData, setClassesData] = useState<ClassInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedClasses = localStorage.getItem('classesData');
    if (storedClasses) {
        setClassesData(JSON.parse(storedClasses));
    } else {
        setClassesData(initialClassesData);
    }
    setIsLoading(false);
  }, []);

  const chartData = useMemo(() => {
    if (!classesData) return [];
    return classesData
      .filter((c: any) => c.passPercentage)
      .map((c: any) => ({
        class: c.name,
        passPercentage: c.passPercentage,
      }));
  }, [classesData]);

  if(isLoading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Class Performance (Last Year)</CardTitle>
                <CardDescription>Loading chart data...</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[350px]">
                <p>Loading...</p>
            </CardContent>
        </Card>
    );
  }

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

    