'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileSpreadsheet, Printer, Search } from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';

const DEFAULT_LOGO_BASE64 =
    'data:image/png;base64,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';

import type { IMasterInstitution, Institution } from '@/types/exam/exam-module/report';

interface ReportListProps {
    data: any[];
    institution: IMasterInstitution | Institution | null;
    subjectwise: boolean;
    reportParams: any;
}

export const ReportList: React.FC<ReportListProps> = ({ data, institution, subjectwise, reportParams }) => {
    const componentRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handlePrint = () => {
        const logoSrc = institution?.mI_Logo ? institution.mI_Logo : DEFAULT_LOGO_BASE64;

        const printWindow = window.open('', '', 'height=800,width=1200');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Toppers List Report</title>');
            printWindow.document.write(`
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap');
                    @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');
                    @page { size: auto; margin: 10mm; }
                    body { font-family: 'Times New Roman', serif; margin: 0; padding: 10px; }
                    .header-container { text-align: center; width: 100%; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px; }
                    .header-content { display: flex; align-items: center; justify-content: center; width: 100%; }
                    .logo-img { height: 90px; width: auto; object-fit: contain; }
                    .report-title { text-align: center; font-size: 16px; font-weight: bold; text-transform: uppercase; text-decoration: underline; margin-top: 15px; margin-bottom: 10px; }
                    table { width: 100%; border-collapse: collapse; font-size: 13px; }
                    th, td { border: 1px solid #000; padding: 6px; text-align: center; vertical-align: middle; }
                    th { font-weight: bold; background-color: transparent !important; color: #000 !important; }
                </style>
            `);
            printWindow.document.write('</head><body>');

            // Header
            printWindow.document.write(`
                <div class="header-container">
                    <div class="header-content">
                        <img src="${logoSrc}" class="logo-img" id="printLogo" alt="Logo" />
                    </div>
                </div>
                <div class="report-title">Toppers List</div>
            `);

            // Table
            const tableContent = componentRef.current?.querySelector('.table-responsive')?.innerHTML || '';
            printWindow.document.write(tableContent);

            // Script for logo loading
            printWindow.document.write(`
                <script>
                    const logo = document.getElementById('printLogo');
                    if (logo) {
                        const printFunc = () => { setTimeout(() => { window.print(); window.close(); }, 500); };
                        if (logo.complete) { printFunc(); }
                        else { logo.onload = printFunc; logo.onerror = printFunc; }
                    } else { setTimeout(() => { window.print(); window.close(); }, 500); }
                </script>
            `);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
        }
    };

    const handleExport = () => {
        const wsData: any[][] = [];

        // Header
        wsData.push([institution?.mI_Name || 'SCHOOL NAME']);
        if ((institution as Institution)?.mI_Address1) {
            wsData.push([(institution as Institution)?.mI_Address1]);
        }
        wsData.push(['Toppers List Report']);
        wsData.push([]);

        // Table Headers
        if (subjectwise) {
            wsData.push(['Sl No.', 'Student Name', 'Admn No', 'Class', 'Section', 'Maximum Marks', 'Obtained Marks', 'Section Highest']);
        } else {
            wsData.push(['Sl No.', 'Student Name', 'Admn No', 'Class', 'Section', 'Total Marks', 'Obtained Marks', 'Percentage', 'Rank']);
        }

        // Header Merges
        const merges: XLSX.Range[] = [];
        const colsCount = subjectwise ? 8 : 9;
        for (let i = 0; i < 4; i++) {
            merges.push({ s: { r: i, c: 0 }, e: { r: i, c: colsCount - 1 } });
        }

        // Data Rows
        filteredData.forEach((item, index) => {
            if (subjectwise) {
                wsData.push([
                    index + 1,
                    item.studentname,
                    item.admno,
                    item.classname,
                    item.sectionname,
                    item.totalmaxmarks,
                    item.totalobtmarks,
                    item.sectionrank
                ]);
            } else {
                wsData.push([
                    index + 1,
                    item.studentname,
                    item.admno,
                    item.classname,
                    item.sectionname,
                    item.totalmaxmarks,
                    item.totalobtmarks,
                    item.percentage,
                    item.sectionrank
                ]);
            }
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        ws['!merges'] = merges;

        // Auto-width logic roughly
        const wscols = Array(colsCount).fill({ wch: 15 });
        wscols[1] = { wch: 25 }; // Name
        ws['!cols'] = wscols;

        XLSX.utils.book_append_sheet(wb, ws, 'Toppers List');
        XLSX.writeFile(wb, 'ToppersListReport.xlsx');
    };

    // Filter Logic
    const filteredData = data.filter(
        (item) => item.studentname.toLowerCase().includes(searchTerm.toLowerCase()) || String(item.admno).toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!data || data.length === 0) return null;

    return (
        <Card className='mt-6 border-t-4 border-t-blue-600 shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between border-b bg-white pb-4'>
                <CardTitle className='font-bold text-blue-900 text-lg uppercase'>Toppers List</CardTitle>
                <div className='flex space-x-2'>
                    <Button
                        onClick={handleExport}
                        variant='outline'
                        className='flex h-8 items-center gap-2 border-green-600 bg-white text-green-700 hover:bg-gray-50'>
                        <FileSpreadsheet className='h-4 w-4' /> Excel
                    </Button>
                    <Button
                        onClick={handlePrint}
                        variant='outline'
                        className='flex h-8 items-center gap-2 border-blue-600 bg-white text-blue-700 hover:bg-gray-50'>
                        <Printer className='h-4 w-4' /> Print
                    </Button>
                </div>
            </CardHeader>
            <CardContent className='p-0'>
                <div className='flex justify-end border-gray-100 border-b bg-white p-4'>
                    <div className='relative w-full max-w-sm'>
                        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground'>
                            <Search className='h-4 w-4' />
                        </div>
                        <Input
                            type='text'
                            placeholder='Search Student...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='rounded-sm border-blue-200 pr-10 focus:border-blue-500'
                        />
                    </div>
                </div>

                <div ref={componentRef} className='bg-white p-4'>
                    <div className='table-responsive overflow-x-auto'>
                        <table className='w-full border-collapse border border-gray-300 text-sm'>
                            <thead className='bg-[#1976d2] text-white'>
                                <tr>
                                    <th className='border border-white/20 p-3 text-center font-semibold'>Sl No.</th>
                                    <th className='border border-white/20 p-3 text-center font-semibold'>Student Name</th>
                                    <th className='border border-white/20 p-3 text-center font-semibold'>Admn No</th>
                                    <th className='border border-white/20 p-3 text-center font-semibold'>Class</th>
                                    <th className='border border-white/20 p-3 text-center font-semibold'>Section</th>
                                    {subjectwise ? (
                                        <>
                                            <th className='border border-white/20 p-3 text-center font-semibold'>Total Marks</th>
                                            <th className='border border-white/20 p-3 text-center font-semibold'>Obtained Marks</th>
                                            <th className='border border-white/20 p-3 text-center font-semibold'>Rank</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className='border border-white/20 p-3 text-center font-semibold'>Total Marks</th>
                                            <th className='border border-white/20 p-3 text-center font-semibold'>Obtained Marks</th>
                                            <th className='border border-white/20 p-3 text-center font-semibold'>Percentage</th>
                                            <th className='border border-white/20 p-3 text-center font-semibold'>Rank</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr key={index} className='text-center hover:bg-accent/90'>
                                        <td className='border border-gray-300 p-2'>{index + 1}</td>
                                        <td className='border border-gray-300 p-2 text-left'>{item.studentname}</td>
                                        <td className='border border-gray-300 p-2'>{item.admno}</td>
                                        <td className='border border-gray-300 p-2'>{item.classname}</td>
                                        <td className='border border-gray-300 p-2'>{item.sectionname}</td>
                                        {subjectwise ? (
                                            <>
                                                <td className='border border-gray-300 p-2'>{item.totalmaxmarks}</td>
                                                <td className='border border-gray-300 p-2'>{item.totalobtmarks}</td>
                                                <td className='border border-gray-300 p-2'>{item.sectionrank}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td className='border border-gray-300 p-2'>{item.totalmaxmarks}</td>
                                                <td className='border border-gray-300 p-2'>{item.totalobtmarks}</td>
                                                <td className='border border-gray-300 p-2'>{item.percentage}</td>
                                                <td className='border border-gray-300 p-2'>{item.sectionrank}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
