'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

type Asset = {
    id: string;
    name: string;
    category: string;
    status: 'In Use' | 'In Storage' | 'Under Maintenance' | 'Disposed';
    purchaseDate: string;
    warrantyEndDate?: string;
    value: number;
    assignedTo: string;
    notes?: string;
};


const assetFormSchema = z.object({
  id: z.string(),
  name: z.string().min(3, 'Asset name must be at least 3 characters.'),
  category: z.string().min(3, 'Category is required.'),
  status: z.enum(['In Use', 'In Storage', 'Under Maintenance', 'Disposed']),
  purchaseDate: z.date({ required_error: 'Purchase date is required.'}),
  warrantyEndDate: z.date().optional(),
  value: z.coerce.number().min(0, 'Value must be a positive number.'),
  assignedTo: z.string().min(3, 'Assignment location is required.'),
  notes: z.string().optional(),
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function EditAssetPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const assetId = params.id as string;
  
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
  });

  useEffect(() => {
    const storedAssets = localStorage.getItem('assetsData');
    if (storedAssets) {
        const assets: Asset[] = JSON.parse(storedAssets);
        const assetToEdit = assets.find(a => a.id === assetId);
        if (assetToEdit) {
            form.reset({
                ...assetToEdit,
                purchaseDate: parseISO(assetToEdit.purchaseDate),
                warrantyEndDate: assetToEdit.warrantyEndDate ? parseISO(assetToEdit.warrantyEndDate) : undefined,
            });
        } else {
            toast({ title: "Error", description: "Asset not found.", variant: "destructive"});
            router.push('/assets');
        }
    }
  }, [assetId, form, router, toast]);

  function onSubmit(data: AssetFormValues) {
    const storedAssets = localStorage.getItem('assetsData');
    const currentAssets: Asset[] = storedAssets ? JSON.parse(storedAssets) : [];

    const updatedAssets = currentAssets.map(asset => {
        if (asset.id === assetId) {
            return {
                ...data,
                purchaseDate: format(data.purchaseDate, 'yyyy-MM-dd'),
                warrantyEndDate: data.warrantyEndDate ? format(data.warrantyEndDate, 'yyyy-MM-dd') : '',
            };
        }
        return asset;
    });

    localStorage.setItem('assetsData', JSON.stringify(updatedAssets));
    
    toast({
      title: 'Asset Updated',
      description: `Asset "${data.name}" has been successfully updated.`,
    });
    router.push('/assets');
  }

  const categoryOptions = ['Electronics', 'Furniture', 'Lab Equipment', 'Sports Gear', 'Office Supplies', 'Other'];
  const departmentOptions = ['Computer Lab', 'Science Lab', 'Library', 'Staff Room', 'Office', 'Classroom 101', 'Sports Complex'];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Edit Asset</CardTitle>
        <CardDescription>
          Update the form below to modify the asset. Fields marked with <span className="text-destructive">*</span> are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset ID</FormLabel>
                    <FormControl>
                      <Input {...field} disabled value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Asset Name</RequiredLabel>
                    <FormControl>
                      <Input placeholder="e.g., Dell Laptop" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Category</RequiredLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Assigned To</RequiredLabel>
                     <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department/room" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                         {departmentOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormDescription>The department or location where the asset is assigned.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                     <RequiredLabel>Purchase Date</RequiredLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="warrantyEndDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                     <FormLabel>Warranty End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Purchase Value</RequiredLabel>
                    <FormControl>
                      <Input type="number" placeholder="1200.00" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Status</RequiredLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="In Use">In Use</SelectItem>
                        <SelectItem value="In Storage">In Storage</SelectItem>
                        <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                        <SelectItem value="Disposed">Disposed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                     <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional notes about the asset (e.g., condition, specific model details)"
                        className="resize-none"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit">Update Asset</Button>
               <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Close
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
