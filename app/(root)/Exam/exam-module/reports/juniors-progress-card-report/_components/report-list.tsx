'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRef } from 'react';
import * as XLSX from 'xlsx';
import { Printer, Download } from 'lucide-react';

interface ReportListProps {
    data: any;
}

export const ReportList = ({ data }: ReportListProps) => {
    const componentRef = useRef<HTMLDivElement>(null);

    if (!data || !data.students || data.students.length === 0) {
        return null;
    }

    const handlePrint = () => {
        const printContent = componentRef.current?.innerHTML;
        const institution = data.institution;
        if (printContent) {
            const printWindow = window.open('', '', 'height=600,width=800');
            if (printWindow) {
                printWindow.document.write('<html><head><title>Juniors Progress Card</title>');
                // Add basic styling for print
                printWindow.document.write(`
            <style>
              body { font-family: Arial, sans-serif; }
              .page-break { page-break-after: always; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
              th, td { border: 1px solid black; padding: 6px; text-align: center; }
              th { background-color: #f2f2f2; }
              .text-left { text-align: left; }
              .header { text-align: center; margin-bottom: 20px; }
              .header img { max-width: 100px; height: auto; }
              .student-info { margin-bottom: 15px; }
              .student-info p { margin: 5px 0; font-weight: bold; }
            </style>
          `);
                printWindow.document.write('</head><body>');
                printWindow.document.write(printContent);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.print();
            }
        }
    };

    const handleExport = () => {
        // Flatten data for Excel export
        const flatData: any[] = [];
        data.students.forEach((student: any) => {
            const row: any = {
                'Adm No': student.amsT_AdmNo,
                'Student Name': student.studentname,
                Class: data.class,
                Section: data.section,
                Total: student.total,
                Percentage: student.percentage
            };
            student.subjects.forEach((sub: any) => {
                row[`${sub.name} Marks`] = sub.marks;
                row[`${sub.name} Grade`] = sub.grade;
            });
            flatData.push(row);
        });
        const ws = XLSX.utils.json_to_sheet(flatData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Progress Report');
        XLSX.writeFile(wb, 'Juniors_Progress_Card.xlsx');
    };

    return (
        <div className='space-y-4 bg-gray-200'>
            <div className="flex justify-end gap-2 py-2">
                <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-800 text-white flex w-fit">
                    <Printer className="h-4 w-4" />
                    <span>PRINT</span>
                </Button>

                <Button onClick={handleExport} className='bg-green-600 hover:bg-green-800 text-white w-fit'>
                    <Download className='h-4 w-4' />
                    Export to Excel
                </Button>
            </div>
            <div ref={componentRef} className='space-y-8'>
                {data.students.map((student: any, index: number) => (
                    <div key={student.amsT_Id} className='page-break rounded-lg border bg-white p-6 shadow-sm'>
                        {/* Header */}
                        <div className='header'>
                            {data.institution?.mI_Logo && (
                                <img
                                    src={data.institution.mI_Logo}
                                    alt={data.institution.mI_Name}
                                    className='mx-auto mb-2 h-16 w-auto'
                                />
                            )}
                            <h2 className='font-bold text-xl uppercase'>{data.institution?.mI_Name || "ST. THOMAS SCHOOL, HOWRAH"}</h2>
                            <h3 className='font-semibold text-lg uppercase'>Progress Report</h3>
                            <p className='text-sm'>Academic Year: {data.year}</p>
                        </div>

                        {/* Student Details */}
                        <div className='student-info mb-4 grid grid-cols-2 gap-4 border-b pb-4 text-sm'>
                            <div>
                                <p>
                                    <strong>Name:</strong> {student.studentname}
                                </p>
                                <p>
                                    <strong>Class:</strong> {data.class}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>Adm. No:</strong> {student.amsT_AdmNo || 'A00' + (index + 1)}
                                </p>
                                <p>
                                    <strong>Section:</strong> {data.section}
                                </p>
                            </div>
                        </div>

                        {/* Marks Table */}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='w-[40%] text-left'>Subject</TableHead>
                                    <TableHead>Marks</TableHead>
                                    <TableHead>Grade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {student.subjects.map((sub: any, idx: number) => (
                                    <TableRow key={idx}>
                                        <TableCell className='text-left font-medium'>{sub.name}</TableCell>
                                        <TableCell>{sub.marks}</TableCell>
                                        <TableCell>{sub.grade}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className='bg-gray-50 font-bold'>
                                    <TableCell className='text-left'>Total</TableCell>
                                    <TableCell colSpan={2}>
                                        {student.total} / {student.subjects.length * 100} ({student.percentage}%)
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        {/* Footer / Signatures */}
                        <div className='mt-12 flex justify-between border-t pt-4 font-semibold text-sm'>
                            <div className='text-center'>
                                <p>Class Teacher</p>
                            </div>
                            <div className='text-center'>
                                <p>Principal</p>
                            </div>
                            <div className='text-center'>
                                <p>Parent</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
