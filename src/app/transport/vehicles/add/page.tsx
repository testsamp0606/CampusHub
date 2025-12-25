'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { vehiclesData as initialVehiclesData, Vehicle } from '@/lib/data';


const vehicleFormSchema = z.object({
  id: z.string(),
  vehicleNumber: z.string().min(5, 'Vehicle number must be at least 5 characters.'),
  type: z.string({ required_error: 'Please select a vehicle type.' }),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1.'),
  driverName: z.string().min(3, 'Driver name is required.'),
  driverContact: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits.'),
  status: z.enum(['Active', 'Maintenance']),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

const defaultValues: Partial<VehicleFormValues> = {
  id: '',
  vehicleNumber: '',
  type: 'Bus',
  capacity: 40,
  status: 'Active',
};

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function AddVehiclePage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const uniqueId = `V${Date.now().toString().slice(-6)}`;
    form.setValue('id', uniqueId);
  }, [form]);

  function onSubmit(data: VehicleFormValues) {
    const storedVehicles = localStorage.getItem('vehiclesData');
    const currentVehicles: Vehicle[] = storedVehicles ? JSON.parse(storedVehicles) : initialVehiclesData;
    
    const newVehicle: Vehicle = {
      ...data,
    };
    
    const updatedVehicles = [...currentVehicles, newVehicle];
    localStorage.setItem('vehiclesData', JSON.stringify(updatedVehicles));
    
    toast({
      title: 'Vehicle Added',
      description: `Vehicle "${data.vehicleNumber}" has been successfully added.`,
    });

    if (window.opener) {
        window.close();
    } else {
        router.push('/transport');
    }
  }

  return (
    <div className="p-4 bg-background h-screen">
        <Card className="shadow-lg max-w-4xl mx-auto border-none">
          <CardHeader>
            <CardTitle>Add New Vehicle</CardTitle>
            <CardDescription>
              Fill out the form below to add a new vehicle to the fleet. Fields marked with <span className="text-destructive">*</span> are required.
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
                        <FormLabel>Vehicle ID</FormLabel>
                        <FormControl>
                          <Input {...field} disabled value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vehicleNumber"
                    render={({ field }) => (
                      <FormItem>
                        <RequiredLabel>Vehicle Number</RequiredLabel>
                        <FormControl>
                          <Input placeholder="e.g., KA-01-AB-1234" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <RequiredLabel>Vehicle Type</RequiredLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Bus">Bus</SelectItem>
                            <SelectItem value="Van">Van</SelectItem>
                            <SelectItem value="Mini-bus">Mini-bus</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <RequiredLabel>Capacity</RequiredLabel>
                        <FormControl>
                          <Input type="number" placeholder="40" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="driverName"
                    render={({ field }) => (
                      <FormItem>
                        <RequiredLabel>Driver Name</RequiredLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="driverContact"
                    render={({ field }) => (
                      <FormItem>
                        <RequiredLabel>Driver Contact</RequiredLabel>
                        <FormControl>
                          <Input placeholder="9876543210" {...field} value={field.value || ''} />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit">Add Vehicle</Button>
                   <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.close()}
                  >
                    Close
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
    </div>
  );
}
