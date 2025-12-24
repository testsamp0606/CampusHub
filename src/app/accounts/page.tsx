'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  Scale,
} from 'lucide-react';
import { feesData as initialFeesData } from '@/lib/data';
import { expensesData as initialExpensesData } from '@/lib/data';
import { format } from 'date-fns';

type Fee = (typeof initialFeesData)[0];
type Expense = (typeof initialExpensesData)[0];

type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  category: string;
};

export default function AccountsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const storedFees = localStorage.getItem('feesData');
    const fees: Fee[] = storedFees
      ? JSON.parse(storedFees)
      : initialFeesData;

    const storedExpenses = localStorage.getItem('expensesData');
    const expenses: Expense[] = storedExpenses
      ? JSON.parse(storedExpenses)
      : initialExpensesData;

    const incomeTransactions: Transaction[] = fees
      .filter((fee) => fee.status === 'Paid' && fee.paymentDate)
      .map((fee) => ({
        id: `inc-${fee.invoiceId}`,
        date: fee.paymentDate!,
        description: `Fee collection: ${fee.description} (Student: ${fee.studentName})`,
        amount: fee.amount,
        type: 'Income',
        category: 'Fee Collection',
      }));

    const expenseTransactions: Transaction[] = expenses
      .filter((expense) => expense.status === 'Approved')
      .map((expense) => ({
        id: `exp-${expense.id}`,
        date: expense.date,
        description: expense.description,
        amount: expense.amount,
        type: 'Expense',
        category: expense.category,
      }));

    const allTransactions = [...incomeTransactions, ...expenseTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setTransactions(allTransactions);
  }, []);

  const stats = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'Income') {
          acc.totalIncome += transaction.amount;
        } else {
          acc.totalExpense += transaction.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 }
    );
  }, [transactions]);

  const netBalance = stats.totalIncome - stats.totalExpense;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Accounts Ledger</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats.totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total amount received from all sources.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${stats.totalExpense.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total amount spent on all categories.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                netBalance >= 0 ? 'text-blue-600' : 'text-yellow-600'
              }`}
            >
              ${netBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              The current financial balance.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Ledger</CardTitle>
          <CardDescription>
            A chronological list of all income and expense transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(new Date(transaction.date), 'yyyy-MM-dd')}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.description}
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.type === 'Income' ? 'success' : 'destructive'
                      }
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      transaction.type === 'Income'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'Income' ? '+' : '-'}$
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {transactions.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              No transactions found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
