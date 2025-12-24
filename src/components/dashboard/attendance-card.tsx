import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AttendanceCardProps = {
  title: string;
  present: number;
  absent: number;
};

export default function AttendanceCard({
  title,
  present,
  absent,
}: AttendanceCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="font-headline">{title}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-green-100 p-4 text-center">
          <p className="text-sm text-green-700">Present</p>
          <p className="text-3xl font-bold text-green-900 font-headline">{present}</p>
        </div>
        <div className="rounded-lg bg-red-100 p-4 text-center">
          <p className="text-sm text-red-700">Absent</p>
          <p className="text-3xl font-bold text-red-900 font-headline">{absent}</p>
        </div>
      </CardContent>
    </Card>
  );
}
