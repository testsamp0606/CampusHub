'use client';
import { Pie, PieChart } from 'recharts';
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
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { useMemo } from 'react';

type Fee = {
  invoiceId: string;
  studentId: string;
  studentName: string;
  class: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  paymentDate: string | null;
  paymentMethod: string | null;
  description: string;
};

interface PaymentStatusChartProps {
  feesData: Fee[];
}

const chartConfig = {
  paid: {
    label: 'Paid',
    color: 'hsl(var(--chart-1))',
  },
  unpaid: {
    label: 'Unpaid',
    color: 'hsl(var(--chart-2))',
  },
  overdue: {
    label: 'Overdue',
    color: 'hsl(var(--chart-3))',
  },
};

export default function PaymentStatusChart({
  feesData,
}: PaymentStatusChartProps) {
  const chartData = useMemo(() => {
    const statusCounts = feesData.reduce(
      (acc, fee) => {
        if (fee.status === 'Paid') acc.paid += 1;
        else if (fee.status === 'Unpaid') acc.unpaid += 1;
        else if (fee.status === 'Overdue') acc.overdue += 1;
        return acc;
      },
      { paid: 0, unpaid: 0, overdue: 0 }
    );

    return [
      { status: 'paid', count: statusCounts.paid, fill: 'var(--color-paid)' },
      { status: 'unpaid', count: statusCounts.unpaid, fill: 'var(--color-unpaid)' },
      { status: 'overdue', count: statusCounts.overdue, fill: 'var(--color-overdue)' },
    ];
  }, [feesData]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Invoice Status Distribution</CardTitle>
        <CardDescription>
          A pie chart showing the proportion of paid, unpaid, and overdue invoices.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
