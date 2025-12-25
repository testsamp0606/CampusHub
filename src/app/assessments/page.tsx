
'use client';
import React, { useState, useMemo, useEffect } from 'react';
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
  FilePlus2,
  List,
  GraduationCap,
  ClipboardEdit,
  CheckCircle,
  Printer,
  Calculator,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ReportCard from './report-card';


type Assessment = {
    id: string;
    name: string;
    classId: string;
    date: string;
    status: 'Scheduled' | 'Completed' | 'Published';
    maxMarks: number;
    type: 'Unit Test' | 'Assignment' | 'Project' | 'Practical' | 'Oral' | 'Mid-Term' | 'Annual';
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

export default function AssessmentsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [marks, setMarks] = useState<Map<string, number | string>>(new Map());

  // State for results tab
  const [resultClass, setResultClass] = useState<string>('');
  const [weightages, setWeightages] = useState<Record<string, number>>({});
  const [finalResults, setFinalResults] = useState<Map<string, FinalResult>>(new Map());
  const [isPrinting, setIsPrinting] = useState(false);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);

  const assessmentsQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'schools/school-1/assessments') : null), [firestore]);
  const { data: assessmentsData } = useCollection<Assessment>(assessmentsQuery);
  
  const marksQuery = useMemoFirebase(() => {
    if (!firestore || !selectedAssessment) return null;
    return query(collection(firestore, 'schools/school-1/marks'), where('assessmentId', '==', selectedAssessment));
  }, [firestore, selectedAssessment]);
  const { data: marksData } = useCollection<Mark>(marksQuery);
  
  const classesQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'schools/school-1/classes') : null), [firestore]);
  const { data: classesData } = useCollection<ClassInfo>(classesQuery);

  const studentsQuery = useMemoFirebase(() => {
      if(!firestore || !selectedClass) return null;
      return query(collection(firestore, 'schools/school-1/students'), where('classId', '==', selectedClass))
  }, [firestore, selectedClass]);
  const { data: students } = useCollection<Student>(studentsQuery);
  
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

  useEffect(() => {
    if (marksData) {
      const newMarks = new Map<string, number | string>();
      marksData.forEach(mark => {
        newMarks.set(mark.studentId, mark.marks);
      });
      setMarks(newMarks);
    } else {
      setMarks(new Map());
    }
  }, [marksData]);

  const classOptions = useMemo(() => classesData?.map(c => ({ value: c.id, label: c.name })) || [], [classesData]);
  
  const assessmentOptions = useMemo(() => {
      if (selectedClass && assessmentsData) {
          return assessmentsData
            .filter(assessment => assessment.classId === selectedClass)
            .map(assessment => ({ value: assessment.id, label: assessment.name}));
      }
      return [];
  }, [selectedClass, assessmentsData]);

  const handleMarkChange = (studentId: string, value: string) => {
    const newMarks = new Map(marks);
    const numericValue = value === '' ? '' : Number(value);
    newMarks.set(studentId, numericValue);
    setMarks(newMarks);
  };

  const handleSaveMarks = () => {
    if (!firestore || !selectedAssessment || !students) return;

    const assessment = assessmentsData?.find(e => e.id === selectedAssessment);
    if (!assessment) return;

    let allMarksValid = true;

    students.forEach(student => {
      const markValue = marks.get(student.id);
      if (typeof markValue === 'number' && (markValue < 0 || markValue > assessment.maxMarks)) {
        toast({
            variant: 'destructive',
            title: 'Invalid Marks',
            description: `Marks for ${student.name} (${markValue}) cannot exceed the maximum of ${assessment.maxMarks}.`,
        });
        allMarksValid = false;
      }
    });

    if (!allMarksValid) return;

    students.forEach(student => {
        const markValue = marks.get(student.id);
        if (markValue !== undefined) {
            const markId = `${selectedAssessment}-${student.id}`;
            const markRef = doc(firestore, 'schools/school-1/marks', markId);
            setDocumentNonBlocking(markRef, {
                id: markId,
                assessmentId: selectedAssessment,
                studentId: student.id,
                marks: markValue,
                schoolId: 'school-1',
            }, { merge: true });
        }
    });
    
    toast({
        title: 'Marks Saved',
        description: 'Student marks have been saved successfully.',
    });
  };

  const handlePublishResults = () => {
    if (!selectedAssessment || !firestore) {
        toast({
            variant: 'destructive',
            title: 'No Assessment Selected',
            description: 'Please select an assessment to publish results.',
        });
        return;
    }
    const assessmentRef = doc(firestore, 'schools/school-1/assessments', selectedAssessment);
    setDocumentNonBlocking(assessmentRef, { status: 'Published' }, { merge: true });
    
    toast({
        title: 'Results Published',
        description: `Results for assessment ${assessmentOptions.find(e=>e.value === selectedAssessment)?.label} have been published.`,
    });
  };

  const getStatusBadgeVariant = (status: Assessment['status']) => {
    switch (status) {
        case 'Scheduled': return 'warning';
        case 'Completed': return 'secondary';
        case 'Published': return 'success';
        default: return 'outline';
    }
  }

  // --- Result Calculation Logic ---

  const relevantAssessments = useMemo(() => {
      return assessmentsData?.filter(a => a.classId === resultClass && a.status === 'Published') || [];
  }, [assessmentsData, resultClass]);

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
      if(!studentsInResultClass || !allMarksData) return;

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
              
              weightedTotal += (marks / assessment.maxMarks) * weight;
              totalPossibleWeightedMarks += weight;
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

  // --- End Result Calculation Logic ---


  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Assessments & Results</h1>
      </div>

      <Tabs defaultValue="schedule">
        <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
          <TabsTrigger value="schedule">
            <List className="mr-2 h-4 w-4" /> Assessment Schedule
          </TabsTrigger>
          <TabsTrigger value="marks">
            <ClipboardEdit className="mr-2 h-4 w-4" /> Manage Marks
          </TabsTrigger>
          <TabsTrigger value="results">
            <GraduationCap className="mr-2 h-4 w-4" /> Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Upcoming & Past Assessments</CardTitle>
                <Button asChild>
                    <Link href="/assessments/add">
                        <FilePlus2 className="mr-2 h-4 w-4" /> Add New Assessment
                    </Link>
                </Button>
              </div>
              <CardDescription>
                A list of all scheduled, completed, and published assessments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assessment Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Max Marks</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessmentsData?.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">{assessment.name}</TableCell>
                      <TableCell>{classesData?.find(c => c.id === assessment.classId)?.name || 'N/A'}</TableCell>
                      <TableCell>{assessment.date}</TableCell>
                       <TableCell>{assessment.maxMarks}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(assessment.status)}>
                          {assessment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                   {assessmentsData?.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">
                            No assessments scheduled.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marks" className="mt-4">
           <Card>
            <CardHeader>
              <CardTitle>Manage Student Marks</CardTitle>
              <CardDescription>
                Select a class and assessment to enter or update student marks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex flex-col gap-4 md:flex-row md:items-center">
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
                 <Select value={selectedAssessment} onValueChange={setSelectedAssessment} disabled={!selectedClass}>
                  <SelectTrigger className="w-full md:w-[280px]">
                    <SelectValue placeholder="Select an assessment" />
                  </SelectTrigger>
                  <SelectContent>
                    {assessmentOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
           </Card>

            {selectedAssessment && selectedClass && (
                <Card className="mt-4">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                             <CardTitle>Marks for {assessmentOptions.find(e => e.value === selectedAssessment)?.label}</CardTitle>
                             <div className="flex gap-2">
                                <Button variant="outline" onClick={handleSaveMarks}>Save Marks</Button>
                                <Button onClick={handlePublishResults}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Publish Results
                                </Button>
                             </div>
                        </div>
                        <CardDescription>Class: {classesData?.find(c => c.id === selectedClass)?.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student ID</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead className="w-1/4">Marks</TableHead>
                                </TableRow>
                            </TableHeader>
                             <TableBody>
                                {students?.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.id}</TableCell>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell>
                                            <Input 
                                                type="number" 
                                                value={marks.get(student.id) || ''}
                                                onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                                placeholder={`Max: ${assessmentsData?.find(e => e.id === selectedAssessment)?.maxMarks || 'N/A'}`}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {students?.length === 0 && (
                            <div className="py-10 text-center text-muted-foreground">
                            No students found for this class.
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </TabsContent>

        <TabsContent value="results" className="mt-4">
             <Card>
                <CardHeader>
                <CardTitle>Generate Final Results</CardTitle>
                <CardDescription>
                    Configure weightages, calculate final scores, and generate report cards.
                </CardDescription>
                </CardHeader>
                 <CardContent className="space-y-4">
                    <Select value={resultClass} onValueChange={setResultClass}>
                        <SelectTrigger className="w-full md:w-[280px]">
                            <SelectValue placeholder="Select a class to generate results" />
                        </SelectTrigger>
                        <SelectContent>
                            {classOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                 </CardContent>
            </Card>
            {resultClass && (
                <>
                <Card>
                    <CardHeader>
                        <CardTitle>Set Assessment Weightages</CardTitle>
                        <CardDescription>Define the weightage (%) for each published assessment. The total must be 100%.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {relevantAssessments.map(assessment => (
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
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleCalculateResults}>
                            <Calculator className="mr-2 h-4 w-4" />
                            Calculate Final Results
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Final Results for {classesData?.find(c=>c.id === resultClass)?.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student ID</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    {relevantAssessments.map(a => <TableHead key={a.id}>{a.name} (Max {a.maxMarks})</TableHead>)}
                                    <TableHead>Final %</TableHead>
                                    <TableHead>Grade</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studentsInResultClass?.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.id}</TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        {relevantAssessments.map(assessment => {
                                            const mark = allMarksData?.find(m => m.studentId === student.id && m.assessmentId === assessment.id);
                                            return <TableCell key={assessment.id}>{mark ? mark.marks : 'N/A'}</TableCell>
                                        })}
                                        <TableCell className="font-semibold">{finalResults.get(student.id)?.percentage || 'N/A'}</TableCell>
                                        <TableCell className="font-bold">{finalResults.get(student.id)?.grade || 'N/A'}</TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" onClick={() => handlePrint(student)} disabled={!finalResults.has(student.id)}>
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
                                                            assessments={relevantAssessments}
                                                        />
                                                    </DialogContent>
                                                )}
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                </>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
