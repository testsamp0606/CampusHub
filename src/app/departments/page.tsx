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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, PlusCircle, Building, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { departmentsData as initialDepartmentsData, teachersData as initialTeachersData, Department, Teacher } from '@/lib/data';
import { Input } from '@/components/ui/input';

export default function DepartmentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentsData, setDepartmentsData] = useState<Department[]>([]);
  const [teachersData, setTeachersData] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedDepartments = localStorage.getItem('departmentsData');
    setDepartmentsData(storedDepartments ? JSON.parse(storedDepartments) : initialDepartmentsData);

    const storedTeachers = localStorage.getItem('teachersData');
    setTeachersData(storedTeachers ? JSON.parse(storedTeachers) : initialTeachersData);

    setIsLoading(false);
  }, []);

  const enrichedDepartments = useMemo(() => {
    if (!departmentsData || !teachersData) return [];
    const teachersMap = new Map(teachersData.map(t => [t.id, t.name]));
    return departmentsData.map(d => ({
      ...d,
      hodName: teachersMap.get(d.hodId) || 'N/A',
    }));
  }, [departmentsData, teachersData]);

  const filteredDepartments = useMemo(() => {
    return enrichedDepartments.filter(
      d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.hodName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, enrichedDepartments]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Department Management</h1>
        <Button asChild>
          <Link href="/departments/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Department
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
          <CardDescription>
            A list of all academic and non-academic departments.
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by department or HOD..."
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
                <TableHead>Department Name</TableHead>
                <TableHead>Head of Dept. (HOD)</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Teachers</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Loading departments...</TableCell>
                </TableRow>
              )}
              {!isLoading && filteredDepartments.map(dept => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    {dept.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {dept.hodName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={dept.type === 'Academic' ? 'default' : 'secondary'}>{dept.type}</Badge>
                  </TableCell>
                  <TableCell>{dept.teacherIds?.length || 0}</TableCell>
                  <TableCell className="text-right">${dept.budget.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/departments/${dept.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && filteredDepartments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    No departments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
