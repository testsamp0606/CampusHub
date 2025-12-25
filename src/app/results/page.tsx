
'use client';
import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  Calculator,
  Download,
  Upload,
  Printer,
  FileCheck2,
  RotateCw,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ReportCard from './report-card';


type Assessment = {
    id: string;
    name: string;
    classId: string;
    date: string;
    status: 'Scheduled' | 'Completed' | 'Published';
    maxMarks: number;
};
type Mark = { 
    id: string;
    studentId: string;
    assessmentId: string;
    marks: number | string;
};
type Student = {
    id: string;
    name: string;
    classId: string;
    rollNumber?: string;
};
type ClassInfo = {
    id: string;
    name: string;
}
type FinalResult = {
    totalMarks: number;
    percentage: number;
    grade: string;
}

export default function ResultsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  
  const [resultClass, setResultClass] = useState<string>('');
  const [resultTerm, setResultTerm] = useState<string>('');
  const [weightages, setWeightages] = useState<Record<string, number>>({});
  const [finalResults, setFinalResults] = useState<Map<string, FinalResult>>(new Map());
  const [isPrinting, setIsPrinting] = useState(false);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);

  const classesQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'schools/school-1/classes') : null), [firestore]);
  const { data: classesData } = useCollection<ClassInfo>(classesQuery);

  const allAssessmentsQuery = useMemoFirebase(() => {
    if (!firestore || !resultClass) return null;
    return query(collection(firestore, 'schools/school-1/assessments'), where('classId', '==', resultClass), where('status', '==', 'Published'));
  }, [firestore, resultClass]);
  const { data: relevantAssessments } = useCollection<Assessment>(allAssessmentsQuery);

  const allMarksQuery = useMemoFirebase(() => {
    if (!firestore || !resultClass) return null;
    return collection(firestore, 'schools/school-1/marks');
  }, [firestore, resultClass]);
  const { data: allMarksData } = useCollection<Mark>(allMarksQuery);

  const studentsInResultClassQuery = useMemoFirebase(() => {
      if(!firestore || !resultClass) return null;
      return query(collection(firestore, 'schools/school-1/students'), where('classId', '==', resultClass))
  }, [firestore, resultClass]);
  const { data: studentsInResultClass } = useCollection<Student>(studentsInResultClassQuery);

  const classOptions = useMemo(() => classesData?.map(c => ({ value: c.id, label: c.name })) || [], [classesData]);
  const termOptions = ['Mid-Term Results', 'Final Results'];
  

  const handleWeightageChange = (assessmentId: string, value: string) => {
      const numValue = Number(value);
      if(!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
          setWeightages(prev => ({...prev, [assessmentId]: numValue}));
      }
  }
  
  const getGrade = (percentage: number): string => {
      if (percentage >= 90) return 'A+';
      if (percentage >= 80) return 'A';
      if (percentage >= 70) return 'B';
      if (percentage >= 60) return 'C';
      if (percentage >= 50) return 'D';
      return 'F';
  };

  const handleCalculateResults = () => {
      if(!studentsInResultClass || !allMarksData || !relevantAssessments) return;

      const totalWeightage = relevantAssessments.reduce((acc, assessment) => acc + (weightages[assessment.id] || 0), 0);
      if(totalWeightage !== 100) {
          toast({
              variant: 'destructive',
              title: 'Invalid Weightage',
              description: `Total weightage must sum to 100%. Current total is ${totalWeightage}%.`
          });
          return;
      }
      
      const newFinalResults = new Map<string, FinalResult>();
      
      studentsInResultClass.forEach(student => {
          let weightedTotal = 0;
          let totalPossibleWeightedMarks = 0;

          relevantAssessments.forEach(assessment => {
              const weight = weightages[assessment.id] || 0;
              const markRecord = allMarksData.find(m => m.studentId === student.id && m.assessmentId === assessment.id);
              const marks = typeof markRecord?.marks === 'number' ? markRecord.marks : 0;
              
              if(weight > 0) {
                  weightedTotal += (marks / assessment.maxMarks) * weight;
                  totalPossibleWeightedMarks += weight;
              }
          });

          const percentage = totalPossibleWeightedMarks > 0 ? (weightedTotal / totalPossibleWeightedMarks) * 100 : 0;
          const grade = getGrade(percentage);

          newFinalResults.set(student.id, {
              totalMarks: weightedTotal,
              percentage: parseFloat(percentage.toFixed(2)),
              grade,
          });
      });

      setFinalResults(newFinalResults);
      toast({
          title: 'Results Calculated',
          description: 'Final marks, percentages, and grades have been calculated.'
      })
  }

  const handlePrint = (student: Student) => {
    setSelectedStudentForReport(student);
  };

  const handlePublish = () => {
    toast({
        title: "Results Published",
        description: "The results have been published and are now visible to students and parents.",
    })
  }

  const handleReset = () => {
    setWeightages({});
    setFinalResults(new Map());
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Result Processing</h1>
      </div>

      <Tabs defaultValue="generate">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="generate">Generate Results</TabsTrigger>
          <TabsTrigger value="reports">Consolidated Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-4">
           <Card>
                <CardHeader>
                <CardTitle>Process Term Results</CardTitle>
                <CardDescription>
                    Configure weightages for published assessments, calculate final scores, and generate report cards.
                </CardDescription>
                </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <Select value={resultClass} onValueChange={setResultClass}>
                            <SelectTrigger className="w-full md:w-[280px]">
                                <SelectValue placeholder="Select a class..." />
                            </SelectTrigger>
                            <SelectContent>
                                {classOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={resultTerm} onValueChange={setResultTerm} disabled={!resultClass}>
                            <SelectTrigger className="w-full md:w-[280px]">
                                <SelectValue placeholder="Select Term/Exam..." />
                            </SelectTrigger>
                            <SelectContent>
                                {termOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                    {opt}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                 </CardContent>
            </Card>

            {resultClass && resultTerm && (
                <>
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Set Assessment Weightages</CardTitle>
                        <CardDescription>Define the weightage (%) for each published assessment for this term. The total must be 100%.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {relevantAssessments?.map(assessment => (
                            <div key={assessment.id} className="space-y-2">
                                <label className="text-sm font-medium">{assessment.name}</label>
                                <Input 
                                    type="number"
                                    value={weightages[assessment.id] || ''}
                                    onChange={e => handleWeightageChange(assessment.id, e.target.value)}
                                    placeholder="e.g., 20"
                                    min="0"
                                    max="100"
                                />
                            </div>
                        ))}
                         {relevantAssessments?.length === 0 && (
                            <p className="text-muted-foreground text-sm col-span-full">No published assessments found for this class.</p>
                         )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                         <Button onClick={handleCalculateResults} disabled={!relevantAssessments || relevantAssessments.length === 0}>
                            <Calculator className="mr-2 h-4 w-4" />
                            Calculate Final Results
                        </Button>
                        <Button onClick={handleReset} variant="ghost">
                            <RotateCw className="mr-2 h-4 w-4" /> Reset
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="mt-4">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Final Results for {classesData?.find(c=>c.id === resultClass)?.name}</CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" disabled><Upload className="mr-2 h-4 w-4"/> Import from Excel</Button>
                                <Button variant="outline" disabled><Download className="mr-2 h-4 w-4"/> Download Report</Button>
                                <Button onClick={handlePublish} disabled={finalResults.size === 0}><FileCheck2 className="mr-2 h-4 w-4"/> Publish Results</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    {relevantAssessments?.map(a => <TableHead key={a.id} className="text-center">{a.name} (Max {a.maxMarks})</TableHead>)}
                                    <TableHead className="text-center">Final %</TableHead>
                                    <TableHead className="text-center">Grade</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studentsInResultClass?.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.name}</TableCell>
                                        {relevantAssessments?.map(assessment => {
                                            const mark = allMarksData?.find(m => m.studentId === student.id && m.assessmentId === assessment.id);
                                            return <TableCell key={assessment.id} className="text-center">{mark ? mark.marks : 'N/A'}</TableCell>
                                        })}
                                        <TableCell className="font-semibold text-center">{finalResults.get(student.id)?.percentage || 'N/A'}</TableCell>
                                        <TableCell className="font-bold text-center">{finalResults.get(student.id)?.grade || 'N/A'}</TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => handlePrint(student)} disabled={!finalResults.has(student.id)}>
                                                        <Printer className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                 {selectedStudentForReport && selectedStudentForReport.id === student.id && (
                                                    <DialogContent className="max-w-4xl">
                                                        <DialogHeader>
                                                            <DialogTitle>Report Card</DialogTitle>
                                                        </DialogHeader>
                                                        <ReportCard 
                                                            student={selectedStudentForReport}
                                                            results={finalResults.get(student.id)!}
                                                            marks={allMarksData?.filter(m => m.studentId === student.id) || []}
                                                            assessments={relevantAssessments || []}
                                                        />
                                                    </DialogContent>
                                                )}
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {studentsInResultClass?.length === 0 && (
                             <p className="text-muted-foreground text-sm text-center py-10">No students found in this class.</p>
                         )}
                    </CardContent>
                </Card>
                </>
            )}
        </TabsContent>
        <TabsContent value="reports">
             <Card>
                <CardHeader>
                    <CardTitle>Consolidated Reports</CardTitle>
                    <CardDescription>View and download consolidated performance reports.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This feature is coming soon.</p>
                </CardContent>
             </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    