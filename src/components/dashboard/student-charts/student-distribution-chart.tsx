
'use client';

import { TrendingUp } from 'lucide-react';
import { Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useMemo } from 'react';

const chartConfig = {
  students: {
    label: 'Students',
  },
  'C001': {
    label: 'Class X-A',
    color: 'hsl(var(--chart-1))',
  },
  'C002': {
    label: 'Class IX-B',
    color: 'hsl(var(--chart-2))',
  },
  'C003': {
    label: 'Class VIII-A',
    color: 'hsl(var(--chart-3))',
  },
};

export default function StudentDistributionChart() {
  const firestore = useFirestore();
  const classesQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'schools/school-1/classes') : null), [firestore]);
  const { data: classesData, isLoading } = useCollection<{id:string, name:string, studentCount: number}>(classesQuery);

  const chartData = useMemo(() => {
    if (!classesData) return [];
    return classesData.map(c => ({
        class: c.id,
        students: c.studentCount,
        fill: `var(--color-${c.id})`,
    }));
  }, [classesData]);

  if(isLoading) {
      return (
        <Card>
            <CardHeader>
                <CardTitle>Student Distribution by Class</CardTitle>
                <CardDescription>Loading chart data...</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px]">
                <p>Loading...</p>
            </CardContent>
        </Card>
      )
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Student Distribution by Class</CardTitle>
        <CardDescription>
          A pie chart showing the distribution of students across different classes.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="students" hideLabel />}
            />
            <Pie data={chartData} dataKey="students" nameKey="class" innerRadius={60} strokeWidth={5} />
            <ChartLegend
              content={<ChartLegendContent nameKey="class" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
