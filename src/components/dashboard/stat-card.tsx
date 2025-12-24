import type { StatCardData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function StatCard({
  title,
  count,
  Icon,
  color,
  bgColor,
}: StatCardData) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="text-4xl font-bold font-headline">{count}</div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', bgColor)}>
          <Icon className={cn('h-6 w-6', color)} />
        </div>
      </CardContent>
    </Card>
  );
}
