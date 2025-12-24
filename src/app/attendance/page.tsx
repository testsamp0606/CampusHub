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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { attendanceData, students, classesData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

type AttendanceStatus = 'present' | 'absent' | 'leave';

type AttendanceRecord = {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
};

export default function AttendancePage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('C001');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const classOptions = classesData.map((c) => ({ value: c.id, label: c.name }));

  const fetchAttendance = () => {
    if (selectedDate && selectedClass) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const existingRecords = attendanceData.filter(
        (rec) => rec.date === dateStr && rec.classId === selectedClass
      );

      const classStudents = students.filter(
        (s) => s.classId === selectedClass
      );

      const records: AttendanceRecord[] = classStudents.map((student) => {
        const existing = existingRecords.find(
          (rec) => rec.studentId === student.id
        );
        return {
          studentId: student.id,
          studentName: student.name,
          status: (existing?.status as AttendanceStatus) || 'present',
        };
      });

      setAttendance(records);
      setIsEditing(records.length > 0);
    }
  };

  React.useEffect(() => {
    fetchAttendance();
  }, [selectedDate, selectedClass]);
  
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) =>
      prev.map((rec) =>
        rec.studentId === studentId ? { ...rec, status } : rec
      )
    );
  };

  const handleSaveAttendance = () => {
    if (selectedDate) {
        console.log('Saving attendance:', {
            date: format(selectedDate, 'yyyy-MM-dd'),
            classId: selectedClass,
            records: attendance,
        });
        toast({
            title: 'Attendance Saved',
            description: `Attendance for ${classesData.find(c => c.id === selectedClass)?.name} on ${format(selectedDate, 'PPP')} has been saved as a draft.`,
        });
    }
  };

   const handleSubmitAttendance = () => {
    if (selectedDate) {
      console.log('Submitting attendance:', {
        date: format(selectedDate, 'yyyy-MM-dd'),
        classId: selectedClass,
        records: attendance,
      });
      toast({
        title: 'Attendance Submitted',
        description: `Attendance for ${
          classesData.find((c) => c.id === selectedClass)?.name
        } on ${format(selectedDate, 'PPP')} has been finalized.`,
      });
    }
  };

  const filteredAttendance = useMemo(() => {
    return attendance.filter(
      (record) =>
        record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, attendance]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Attendance Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Take/View Attendance</CardTitle>
          <CardDescription>
            Select a date and class to view or update attendance records.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal md:w-[280px]',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={fetchAttendance} className="w-full md:w-auto">
              Take/Edit Attendance
            </Button>
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <Card>
          <CardHeader>
             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <CardTitle>
                        Attendance for {classesData.find(c => c.id === selectedClass)?.name}
                    </CardTitle>
                    <CardDescription>
                        Date: {selectedDate ? format(selectedDate, 'PPP') : ''}
                    </CardDescription>
                </div>
                 <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search students..."
                        className="w-full rounded-lg bg-background pl-8 md:w-[250px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((record) => (
                  <TableRow key={record.studentId}>
                    <TableCell>{record.studentId}</TableCell>
                    <TableCell className="font-medium">
                      {record.studentName}
                    </TableCell>
                    <TableCell className="text-right">
                      <RadioGroup
                        value={record.status}
                        onValueChange={(value) =>
                          handleStatusChange(
                            record.studentId,
                            value as AttendanceStatus
                          )
                        }
                        className="flex justify-end gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="present" id={`p-${record.studentId}`} />
                          <Label htmlFor={`p-${record.studentId}`} className="text-green-600">Present</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                          <RadioGroupItem value="absent" id={`a-${record.studentId}`} />
                          <Label htmlFor={`a-${record.studentId}`} className="text-red-600">Absent</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="leave" id={`l-${record.studentId}`} />
                          <Label htmlFor={`l-${record.studentId}`} className="text-yellow-600">Leave</Label>
                        </div>
                      </RadioGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             {filteredAttendance.length === 0 && (
                <div className="py-10 text-center text-muted-foreground">
                No students found for this class or search query.
                </div>
            )}
          </CardContent>
           <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleSaveAttendance}>Save as Draft</Button>
                <Button onClick={handleSubmitAttendance}>Submit Attendance</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
