'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, Hourglass, AlertCircle } from 'lucide-react';
import MonthlyRevenueChart from '@/components/dashboard/payment-charts/monthly-revenue-chart';
import PaymentStatusChart from '@/components/dashboard/payment-charts/payment-status-chart';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

type Fee = {
  invoiceId: string;
  studentId: string;
  studentName: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  paymentDate: string | null;
  description: string;
};

export default function PaymentDashboardPage() {
  const firestore = useFirestore();
  const feesQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'schools/school-1/fees') : null), [firestore]);
  const { data: feesData, isLoading } = useCollection<Fee>(feesQuery);


  const stats = useMemo(() => {
    if (!feesData) return { totalRevenue: 0, totalDues: 0, totalOverdue: 0 };
    return feesData.reduce(
      (acc, fee) => {
        if (fee.status === 'Paid') {
          acc.totalRevenue += fee.amount;
        } else if (fee.status === 'Unpaid') {
          acc.totalDues += fee.amount;
        } else if (fee.status === 'Overdue') {
          acc.totalOverdue += fee.amount;
          acc.totalDues += fee.amount;
        }
        return acc;
      },
      { totalRevenue: 0, totalDues: 0, totalOverdue: 0 }
    );
  }, [feesData]);

  if(isLoading) {
      return <div>Loading payment data...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Payments Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total amount collected from paid invoices.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dues</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalDues.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total pending and overdue payments.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">${stats.totalOverdue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total amount from overdue invoices.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
          {feesData && <MonthlyRevenueChart feesData={feesData} />}
          {feesData && <PaymentStatusChart feesData={feesData} />}
      </div>
    </div>
  );
}
