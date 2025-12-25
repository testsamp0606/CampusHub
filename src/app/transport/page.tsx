'use client';
import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bus,
  Map as MapIcon,
  Users,
  Search,
  PlusCircle,
  Truck,
  MapPin,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

type Route = {
  id: string;
  routeName: string;
  vehicleId: string;
  stops: string[];
};

type Vehicle = {
  id: string;
  vehicleNumber: string;
  type: string;
  capacity: number;
  driverName: string;
  driverContact: string;
  status: 'Active' | 'Maintenance';
};

type Student = {
  id: string;
  name: string;
  classId: string;
}

type StudentTransport = {
  allocationId: string;
  studentId: string;
  routeId: string;
  stop: string;
  feeStatus: 'Paid' | 'Unpaid';
};

type EnrichedAllocation = StudentTransport & { 
  studentName: string, 
  className: string, 
  routeName: string, 
  vehicleNumber: string 
};


export default function TransportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const firestore = useFirestore();

  const routesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'schools/school-1/routes') : null, [firestore]);
  const { data: routesData, isLoading: routesLoading } = useCollection<Route>(routesQuery);

  const vehiclesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'schools/school-1/vehicles') : null, [firestore]);
  const { data: vehiclesData, isLoading: vehiclesLoading } = useCollection<Vehicle>(vehiclesQuery);

  const allocationsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'schools/school-1/studentTransports') : null, [firestore]);
  const { data: studentTransportData, isLoading: allocationsLoading } = useCollection<StudentTransport>(allocationsQuery);

  const studentsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'schools/school-1/students') : null, [firestore]);
  const { data: studentsData, isLoading: studentsLoading } = useCollection<Student>(studentsQuery);

  const enrichedAllocations = useMemo(() => {
    if (!studentTransportData || !studentsData || !routesData || !vehiclesData) return [];

    const studentsMap = new Map(studentsData.map(s => [s.id, { name: s.name, className: s.classId }]));
    const routesMap = new Map(routesData.map(r => [r.id, { routeName: r.routeName, vehicleId: r.vehicleId }]));
    const vehiclesMap = new Map(vehiclesData.map(v => [v.id, v.vehicleNumber]));

    return studentTransportData.map((allocation) => {
      const student = studentsMap.get(allocation.studentId);
      const route = routesMap.get(allocation.routeId);
      const vehicleNumber = route ? vehiclesMap.get(route.vehicleId) : 'N/A';
      return {
        ...allocation,
        studentName: student?.name || 'N/A',
        className: student?.className || 'N/A',
        routeName: route?.routeName || 'N/A',
        vehicleNumber: vehicleNumber || 'N/A',
      };
    });
  }, [studentTransportData, studentsData, routesData, vehiclesData]);

  const filteredAllocations = useMemo(() => {
    return enrichedAllocations.filter(
      item =>
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.routeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, enrichedAllocations]);

  const isLoading = routesLoading || vehiclesLoading || allocationsLoading || studentsLoading;

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transport Management</h1>
      </div>

      <Tabs defaultValue="routes">
        <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
          <TabsTrigger value="routes">
            <MapIcon className="mr-2 h-4 w-4" /> Routes
          </TabsTrigger>
          <TabsTrigger value="vehicles">
            <Bus className="mr-2 h-4 w-4" /> Vehicles
          </TabsTrigger>
          <TabsTrigger value="allocations">
            <Users className="mr-2 h-4 w-4" /> Student Allocation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Transport Routes</CardTitle>
                <Button asChild>
                  <Link href="/transport/routes/add">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Route
                  </Link>
                </Button>
              </div>
              <CardDescription>
                Manage all transport routes and the vehicles assigned to them.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {routesData?.map(route => {
                const vehicle = vehiclesData?.find(
                  v => v.id === route.vehicleId
                );
                return (
                  <Card key={route.id} className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapIcon /> {route.routeName}
                      </CardTitle>
                      <CardDescription>
                        Vehicle: {vehicle?.vehicleNumber || 'Not Assigned'} (
                        {vehicle?.type})
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-semibold mb-2">Stops:</h4>
                      <div className="flex flex-wrap gap-2">
                        {route.stops.map((stop, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <MapPin className="h-3 w-3" />
                            {stop}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Vehicles</CardTitle>
                 <Button asChild>
                  <Link href="/transport/vehicles/add">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Vehicle
                  </Link>
                </Button>
              </div>
              <CardDescription>
                A list of all vehicles in the transport fleet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle No.</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehiclesData?.map(vehicle => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        {vehicle.vehicleNumber}
                      </TableCell>
                      <TableCell>{vehicle.type}</TableCell>
                      <TableCell>{vehicle.capacity}</TableCell>
                      <TableCell>
                        <div>{vehicle.driverName}</div>
                        <div className="text-xs text-muted-foreground">
                          {vehicle.driverContact}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            vehicle.status === 'Active'
                              ? 'success'
                              : 'destructive'
                          }
                        >
                          {vehicle.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Transport Allocation</CardTitle>
              <CardDescription>
                View and search student transport details.
              </CardDescription>
              <div className="relative mt-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by student name, ID, or route..."
                  className="w-full rounded-lg bg-background pl-8"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Stop</TableHead>
                    <TableHead>Vehicle No.</TableHead>
                    <TableHead>Fee Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAllocations.map(item => (
                    <TableRow key={item.allocationId}>
                      <TableCell>
                        <div>{item.studentName}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.studentId} | {item.className}
                        </div>
                      </TableCell>
                      <TableCell>{item.routeName}</TableCell>
                      <TableCell>{item.stop}</TableCell>
                      <TableCell>{item.vehicleNumber}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.feeStatus === 'Paid' ? 'success' : 'warning'
                          }
                        >
                          {item.feeStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredAllocations.length === 0 && (
                <div className="py-10 text-center text-muted-foreground">
                  No matching allocations found.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
