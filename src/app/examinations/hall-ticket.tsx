
'use client';
import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

type Student = {
    id: string;
    name: string;
    classId: string;
    rollNumber?: string;
    profilePhoto?: string;
};
type Examination = {
    name: string;
};
type ExamTimetableEntry = {
    subject: string;
    date: string;
    time: string;
};

interface HallTicketProps {
    student: Student;
    exam: Examination;
    timetable: ExamTimetableEntry[];
}

const HallTicket: React.FC<HallTicketProps> = ({ student, exam, timetable }) => {
    const handlePrint = () => {
        const input = document.getElementById(`hall-ticket-${student.id}`);
        if(input) {
            html2canvas(input, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`hall-ticket-${student.id}.pdf`);
            });
        }
    };
    
    return (
        <div>
            <div id={`hall-ticket-${student.id}`} className="p-6 bg-white text-black">
                <header className="text-center mb-6 border-b-2 border-black pb-4">
                    <h1 className="text-2xl font-bold">St. Peter School</h1>
                    <p className="text-md">Hall Ticket - {exam.name}</p>
                </header>

                 <section className="mb-4 flex items-start gap-4">
                    <Avatar className="h-24 w-24 border">
                        {student.profilePhoto ? <AvatarImage src={student.profilePhoto} alt={student.name} /> : <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>}
                    </Avatar>
                     <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm flex-1">
                        <p><strong>Student Name:</strong></p><p>{student.name}</p>
                        <p><strong>Student ID:</strong></p><p>{student.id}</p>
                        <p><strong>Class:</strong></p><p>{student.classId}</p>
                        <p><strong>Roll No:</strong></p><p>{student.rollNumber || 'N/A'}</p>
                    </div>
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Examination Timetable</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-black">Subject</TableHead>
                                <TableHead className="text-black">Date</TableHead>
                                <TableHead className="text-black">Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {timetable.map((entry, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-black">{entry.subject}</TableCell>
                                    <TableCell className="text-black">{entry.date}</TableCell>
                                    <TableCell className="text-black">{entry.time}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </section>

                <section>
                    <h3 className="text-md font-semibold mb-2">Instructions for Candidates</h3>
                    <ul className="list-disc list-inside text-xs space-y-1">
                        <li>Candidates must be seated in the examination hall 15 minutes before the start of the examination.</li>
                        <li>No candidate will be allowed to enter the examination hall after 30 minutes of commencement of the examination.</li>
                        <li>Possession of any electronic device is strictly prohibited.</li>
                        <li>This hall ticket must be presented for verification.</li>
                    </ul>
                </section>
                
                <footer className="text-center mt-8 pt-4 border-t-2 border-black">
                     <div className="flex justify-between items-center text-xs">
                        <p className="font-semibold">Controller of Examinations</p>
                        <p className="font-semibold">Principal's Signature</p>
                     </div>
                </footer>
            </div>
             <div className="flex justify-end mt-4">
                <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Download as PDF</Button>
            </div>
        </div>
    );
};

export default HallTicket;
