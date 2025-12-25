
'use client';

import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer } from 'lucide-react';

type Student = {
    id: string;
    name: string;
    rollNumber?: string;
    classId: string;
};
type Assessment = {
    id: string;
    name: string;
    maxMarks: number;
};
type Mark = {
    assessmentId: string;
    marks: number | string;
};
type FinalResult = {
    totalMarks: number;
    percentage: number;
    grade: string;
};

interface ReportCardProps {
    student: Student;
    results: FinalResult;
    marks: Mark[];
    assessments: Assessment[];
}

const ReportCard: React.FC<ReportCardProps> = ({ student, results, marks, assessments }) => {

    const handlePrint = () => {
        const input = document.getElementById(`report-card-${student.id}`);
        if(input) {
            html2canvas(input, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`report-card-${student.id}.pdf`);
            });
        }
    };
    
    return (
        <div>
            <div id={`report-card-${student.id}`} className="p-8 bg-white text-black">
                <header className="text-center mb-8 border-b-2 border-black pb-4">
                    <h1 className="text-3xl font-bold">St. Peter School</h1>
                    <p className="text-lg">Academic Report Card 2024-2025</p>
                </header>

                <section className="mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p><strong>Student Name:</strong> {student.name}</p>
                            <p><strong>Student ID:</strong> {student.id}</p>
                        </div>
                        <div>
                            <p><strong>Class:</strong> {student.classId}</p>
                            <p><strong>Roll No:</strong> {student.rollNumber || 'N/A'}</p>
                        </div>
                    </div>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 border-b border-gray-300 pb-1">Marks Obtained</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Assessment</TableHead>
                                <TableHead>Maximum Marks</TableHead>
                                <TableHead>Marks Obtained</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assessments.map(assessment => {
                                const mark = marks.find(m => m.assessmentId === assessment.id);
                                return (
                                    <TableRow key={assessment.id}>
                                        <TableCell>{assessment.name}</TableCell>
                                        <TableCell>{assessment.maxMarks}</TableCell>
                                        <TableCell>{mark ? mark.marks : 'N/A'}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </section>
                
                <section className="mb-6 bg-gray-100 p-4 rounded-lg">
                     <h2 className="text-xl font-semibold mb-2">Final Result</h2>
                     <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-sm text-gray-600">Total Marks</p>
                            <p className="text-2xl font-bold">{results.totalMarks.toFixed(2)}</p>
                        </div>
                         <div>
                            <p className="text-sm text-gray-600">Percentage</p>
                            <p className="text-2xl font-bold">{results.percentage}%</p>
                        </div>
                         <div>
                            <p className="text-sm text-gray-600">Grade</p>
                            <p className="text-2xl font-bold">{results.grade}</p>
                        </div>
                     </div>
                </section>

                <footer className="text-center mt-10 pt-4 border-t-2 border-black">
                     <div className="grid grid-cols-2 gap-4">
                        <p className="text-sm">Class Teacher's Signature</p>
                        <p className="text-sm">Principal's Signature</p>
                     </div>
                </footer>
            </div>
             <div className="flex justify-end mt-4">
                <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Download as PDF</Button>
            </div>
        </div>
    );
};

export default ReportCard;
