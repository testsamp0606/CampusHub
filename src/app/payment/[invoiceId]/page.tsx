'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { feesData } from '@/lib/data';
import { CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PaymentGatewayPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const invoiceId = params.invoiceId as string;
  const [isLoading, setIsLoading] = useState(false);

  const invoice = feesData.find((f) => f.invoiceId === invoiceId);

  if (!invoice) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Invoice not found or already paid.</p>
      </div>
    );
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast({
      title: 'Processing Payment...',
      description: 'Please wait while we securely process your payment.',
    });

    // Simulate payment processing delay
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, you would get a response from your payment provider.
      // Here, we'll just simulate a success.
      router.push(`/payment/success/${invoice.invoiceId}`);
    }, 3000);
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard /> Secure Payment
          </CardTitle>
          <CardDescription>
            Complete the payment for Invoice #{invoice.invoiceId}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePayment}>
          <CardContent className="space-y-6">
            <div className="text-center rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Amount to Pay</p>
              <p className="text-4xl font-bold">${invoice.amount.toFixed(2)}</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="0000 0000 0000 0000" required />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" required />
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input id="cardName" placeholder="John Doe" required />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${invoice.amount.toFixed(2)}`
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
