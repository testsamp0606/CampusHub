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
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';
import { vehiclesData as initialVehiclesData, routesData as initialRoutesData } from '@/lib/data';

type Vehicle = (typeof initialVehiclesData)[0];
type Route = (typeof initialRoutesData)[0];

const routeFormSchema = z.object({
  id: z.string(),
  routeName: z.string().min(3, 'Route name must be at least 3 characters.'),
  vehicleId: z.string({ required_error: 'Please select a vehicle.' }),
  stops: z.string().min(3, 'Please enter at least one stop.'),
});

type RouteFormValues = z.infer<typeof routeFormSchema>;

const defaultValues: Partial<RouteFormValues> = {
  id: '',
  routeName: '',
  vehicleId: '',
  stops: '',
};

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

export default function AddRoutePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVehicles = useCallback(() => {
    const storedVehicles = localStorage.getItem('vehiclesData');
    setVehicles(storedVehicles ? JSON.parse(storedVehicles) : initialVehiclesData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);


  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const uniqueId = `R${Date.now().toString().slice(-6)}`;
    form.setValue('id', uniqueId);
  }, [form]);

  function onSubmit(data: RouteFormValues) {
    const storedRoutes = localStorage.getItem('routesData');
    const currentRoutes: Route[] = storedRoutes ? JSON.parse(storedRoutes) : initialRoutesData;
    
    const newRoute: Route = {
        id: data.id,
        routeName: data.routeName,
        vehicleId: data.vehicleId,
        stops: data.stops.split(',').map(s => s.trim()).filter(s => s.length > 0),
    };

    const updatedRoutes = [...currentRoutes, newRoute];
    localStorage.setItem('routesData', JSON.stringify(updatedRoutes));
    
    toast({
      title: 'Route Added',
      description: `Route "${data.routeName}" has been successfully added.`,
    });
    form.reset();
    router.push('/transport');
  }

  const handleAddVehiclePopup = () => {
    const width = 800;
    const height = 700;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    const newWindow = window.open(
        '/transport/vehicles/add',
        'addVehicleWindow',
        `width=${width},height=${height},top=${top},left=${left},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
    );

    if (newWindow) {
      const timer = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(timer);
          fetchVehicles();
        }
      }, 500);
    }
  };

  const vehicleOptions = vehicles?.map(v => ({ value: v.id, label: `${v.vehicleNumber} (${v.type})`})) || [];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Add New Transport Route</CardTitle>
        <CardDescription>
          Fill out the form below to add a new route. Fields marked with <span className="text-destructive">*</span> are required.
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
                    <FormLabel>Route ID</FormLabel>
                    <FormControl>
                      <Input placeholder="R123456" {...field} disabled value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="routeName"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Route Name</RequiredLabel>
                    <FormControl>
                      <Input placeholder="e.g., City Center Loop" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <RequiredLabel>Assign Vehicle</RequiredLabel>
                <div className="flex gap-2 items-center">
                  <FormField
                    control={form.control}
                    name="vehicleId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={isLoading ? "Loading..." : "Select a vehicle"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vehicleOptions.map(opt => (
                               <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="outline" onClick={handleAddVehiclePopup}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Vehicle
                  </Button>
                </div>
              </div>
            </div>
             <FormField
                control={form.control}
                name="stops"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Stops</RequiredLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Central Station, City Market, Town Hall"
                        className="resize-none"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                     <FormDescription>
                      Enter the names of the stops, separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <div className="flex gap-4">
              <Button type="submit">Add Route</Button>
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
