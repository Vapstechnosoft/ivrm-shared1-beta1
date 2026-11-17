'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { StudentPerformance } from '@/types/exam/exam-module/ai-analysis';

interface StudentTableProps {
    students: StudentPerformance[];
}

export function StudentTable({ students }: StudentTableProps) {
    if (!students.length) return null;

    // Get subjects from the first student to build headers
    const subjects = students[0].subjects.map((s) => s.subject);

    return (
        <div className='rounded-md border'>
            <ScrollArea className='h-[400px] w-full'>
                <Table>
                    <TableHeader className='sticky top-0 z-10 bg-muted/50'>
                        <TableRow>
                            <TableHead className='w-[50px] font-bold'>#</TableHead>
                            <TableHead className='min-w-[150px] font-bold'>Student Name</TableHead>
                            {subjects.map((subject, i) => (
                                <TableHead key={i} className='min-w-[100px] text-center'>
                                    {subject}
                                </TableHead>
                            ))}
                            <TableHead className='text-center font-bold'>Total</TableHead>
                            <TableHead className='text-center font-bold'>Avg %</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map((student, idx) => (
                            <TableRow key={idx}>
                                <TableCell className='font-medium'>{idx + 1}</TableCell>
                                <TableCell className='font-medium'>{student.name}</TableCell>
                                {student.subjects.map((s, i) => (
                                    <TableCell key={i} className='text-center'>
                                        {s.score}
                                    </TableCell>
                                ))}
                                <TableCell className='text-center font-bold'>{student.totalScore}</TableCell>
                                <TableCell className='text-center font-bold'>{student.averageScore}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    );
}
