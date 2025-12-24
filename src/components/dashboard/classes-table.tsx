import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { classesData } from '@/lib/data';
import { Progress } from '../ui/progress';

export default function ClassesTable() {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="font-headline">Classes Information</CardTitle>
        <CardDescription>
          Overview of daily attendance and class details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative max-h-[300px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead className="text-center">Student Count</TableHead>
                <TableHead>Daily Attendance</TableHead>
                <TableHead>Class Teacher</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classesData.map((item) => (
                <TableRow key={item.class}>
                  <TableCell className="font-medium">{item.class}</TableCell>
                  <TableCell className="text-center">
                    {item.studentCount}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={item.dailyAttendance} className="w-[60%]" />
                      <span>{item.dailyAttendance}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.classTeacher}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
