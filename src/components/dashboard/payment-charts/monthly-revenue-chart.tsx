'use client';

import { TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

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
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useMemo } from 'react';
import { format } from 'date-fns';

type Fee = {
  invoiceId: string;
  studentId: string;
  studentName: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  paymentDate: string | null;
  description: string;
};

interface MonthlyRevenueChartProps {
  feesData: Fee[];
}

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
};

export default function MonthlyRevenueChart({
  feesData,
}: MonthlyRevenueChartProps) {
  const chartData = useMemo(() => {
    if (!feesData) return [];
    const monthlyRevenue: { [key: string]: number } = {};

    feesData.forEach((fee) => {
      if (fee.status === 'Paid' && fee.paymentDate) {
        const month = format(new Date(fee.paymentDate), 'MMM yyyy');
        if (!monthlyRevenue[month]) {
          monthlyRevenue[month] = 0;
        }
        monthlyRevenue[month] += fee.amount;
      }
    });

    const sortedMonths = Object.keys(monthlyRevenue).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA.getTime() - dateB.getTime();
    });

    return sortedMonths.map(month => ({
        month,
        revenue: monthlyRevenue[month],
    }));

  }, [feesData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
        <CardDescription>
          A bar chart showing revenue collected per month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
