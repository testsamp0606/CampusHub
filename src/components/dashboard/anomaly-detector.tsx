'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { detectAttendanceAnomalies } from '@/ai/flows/detect-attendance-anomalies';
import { attendanceData } from '@/lib/data';
import { Loader2, AlertTriangle, ListChecks } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export default function AnomalyDetector() {
  const [loading, setLoading] = useState(false);
  const [anomalies, setAnomalies] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDetectAnomalies = async () => {
    setLoading(true);
    setError(null);
    setAnomalies([]);
    try {
      const result = await detectAttendanceAnomalies({
        attendanceData: JSON.stringify(attendanceData),
        threshold: 3,
      });
      setAnomalies(result.anomalies);
      if (result.anomalies.length === 0) {
        setError('No significant anomalies were detected based on the current criteria.');
      }
    } catch (e) {
      setError('Failed to detect anomalies. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="font-headline">Attendance Anomaly Detection</CardTitle>
        <CardDescription>
          Use AI to analyze attendance records and identify unusual patterns like
          extended absences or sudden drops in attendance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center rounded-lg border border-dashed p-10">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="font-medium">Analyzing data...</span>
            </div>
          </div>
        ) : anomalies.length > 0 ? (
          <div className="space-y-4">
             <Alert>
              <ListChecks className="h-4 w-4" />
              <AlertTitle>Anomalies Detected</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                    {anomalies.map((anomaly, index) => (
                    <li key={index}>{anomaly}</li>
                    ))}
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-lg border border-dashed p-10">
            <div className="text-center text-muted-foreground">
              <p>Click the button to start anomaly detection.</p>
              {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleDetectAnomalies} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Detect Anomalies'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
