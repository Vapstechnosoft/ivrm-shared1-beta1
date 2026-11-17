'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IStudentEligibleReportDetail } from '@/types/sports/reports/student-eligible-report';
import { format } from 'date-fns';

import * as XLSX from 'xlsx';

export const columns: ColumnDef<IStudentEligibleReportDetail>[] = [
    {
        accessorKey: 'serialNo',
        header: 'SL. No.',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'adm_no',
        header: 'Adm. No.',
    },
    {
        accessorKey: 'studentname',
        header: 'Student Name',
    },
    {
        accessorKey: 'classname',
        header: 'Class',
    },
    {
        accessorKey: 'sectionname',
        header: 'Section',
    },
    {
        accessorKey: 'spccE_StartDate',
        header: 'DOB',
        cell: ({ row }) => {
            const date = row.original.spccE_StartDate;
            return date ? format(new Date(date), 'dd/MM/yyyy') : '-';
        }
    },
    {
        accessorKey: 'pasR_Age',
        header: 'Age',
    },
    {
        accessorKey: 'amsT_FatherName',
        header: 'Father Name',
    },
    {
        accessorKey: 'amsT_MotherName',
        header: 'Mother Name',
    },
    {
        accessorKey: 'address',
        header: 'Address',
    }
];

export function printTable(headers: string[], rows: any[]) {
    const printWindow = window.open('', '', 'width=1200,height=800');
    if (!printWindow) return;

    const tableHead = headers.map((col) => `<th>${col}</th>`).join('');
    const tableRows = rows.map((row) => `<tr>${headers.map((col) => `<td>${row[col] ?? ''}</td>`).join('')}</tr>`).join('');

    printWindow.document.write(`
        <html>
        <head>
            <title>Student Eligible Report</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h2 { text-align: center; margin-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #333; padding: 6px; font-size: 12px; }
                th { background: #eaeaea; }
                tr:nth-child(even) td { background: #fafafa; }
                @media print {
                    body { margin: 0; }
                }
            </style>
        </head>
        <body>
            <h2>Student Eligible Report</h2>
            <table>
                <thead>
                    <tr>${tableHead}</tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}

export function exportToExcel(rows: any[], fileName: string) {
    if (!rows || rows.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

