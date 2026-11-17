'use client';

import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { getSubjectWiseDetails, getSubjectWiseReport } from '@/server/timetable/reports/subjectwisett';
import { Download, Printer } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import SubjectWiseForm from './_components/subjectwise-form';

export default function SubjectWiseReportPage() {
    const [initialData, setInitialData] = useState<any>({});
    const [reportData, setReportData] = useState<any[]>([]);
    const [periodList, setPeriodList] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getSubjectWiseDetails({});
                if (data) {
                    // Map API response to expected form props
                    setInitialData({
                        acaYear: data.year,
                        classDrp: data.clsdrp,
                        subjectDrp: data.subdrp
                    });
                } else {
                    setError('No data received from server.');
                }
            } catch (error: any) {
                //console.error('Error fetching initial details', error);
                setError(error.message || 'Failed to fetch report details.');
            }
        };
        fetchDetails();
    }, []);

    const handleFormSubmit = async (payload: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getSubjectWiseReport(payload);
            processReportData(response, payload.subarray);
        } catch (error: any) {
            //console.error('Error generating report', error);
            setError(error.message || 'Failed to generate report.');
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setReportData([]);
        setError(null);
    };

    const processReportData = (data: any, selectedSubjects: any[]) => {
        if (!data.tt || data.tt.length === 0) {
            setError('No TimeTable generated for the selected details.');
            setReportData([]);
            return;
        }

        const processedList: any[] = [];
        const periodList = data.periodslst || [];
        setPeriodList(periodList);
        const gridWeeks = data.gridweeks || [];
        const timetable = data.tt || [];

        // Iterate through each selected subject
        selectedSubjects.forEach((sub: any) => {
            const tableRows: any[] = [];

            gridWeeks.forEach((day: any) => {
                const rowCells: any[] = [];
                periodList.forEach((period: any) => {
                    // Find timetable entry
                    let cellContent = '';
                    const cellColor = 'black';

                    // Filter logic from AngularJS:
                    // t.ttmP_Id == period.ttmP_Id && t.ttmD_Id == day.ttmD_Id && t.ismS_Id == sub.ismS_Id
                    const entries = timetable.filter(
                        (t: any) => t.ttmP_Id === period.ttmP_Id && t.ttmD_Id === day.ttmD_Id && t.ismS_Id === sub.ismS_Id
                    );

                    if (entries.length > 0) {
                        // value2 logic: Class : Section : Staff : Subject
                        cellContent = entries
                            .map((t: any) => `${t.asmcL_ClassName} : ${t.asmC_SectionName} : ${t.staffName} : ${t.ismS_SubjectName}`)
                            .join(' && ');
                        // TODO: Use specific color logic if available? AngularJS just says black or red if dayBreak (but break logic wasn't in the snippet provided for SubjectWise, only ClassWise. SubjectWise snippet has "color: 'black'" hardcoded mostly, except potentially breaks which aren't explicitly handled in the snippet loop but usually TT has breaks).
                        // The snippet uses 'color: black' and doesn't seem to have break logic inside the subject loop explicitly like classwise does.
                        // But if there's a break, it might be in the period list?
                        // For now, default to black.
                    }

                    rowCells.push({
                        ped_id: period.ttmP_Id,
                        ped_name: period.ttmP_PeriodName,
                        content: cellContent,
                        color: cellColor
                    });
                });
                tableRows.push({ dayName: day.ttmD_DayName, cells: rowCells });
            });

            processedList.push({
                header: sub.ismS_SubjectName,
                rows: tableRows
            });
        });

        setReportData(processedList);
    };

    const handlePrint = () => {
        if (!componentRef.current) return;

        const printWindow = window.open('', '', 'width=1200,height=800');
        if (!printWindow) return;

        const content = componentRef.current.innerHTML;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Subject Wise TimeTable Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        th, td { border: 1px solid #000; padding: 8px; text-align: center; font-size: 12px; }
                        th { background-color: #f3f3f3; font-weight: bold; }
                        h3 { text-align: center; color: green; margin-bottom: 10px; }
                        .page-break-after-always { page-break-after: always; }
                    </style>
                </head>
                <body>
                    ${content}
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    const handleExport = () => {
        if (componentRef.current) {
            const wb = XLSX.utils.book_new();

            // We can iterate reportData to make sheets
            reportData.forEach((table, idx) => {
                // Construct data for sheet
                // Header row
                const headerRow = ['Day / Period', ...periodList.map((p: any) => `Period ${p.ttmP_PeriodName}`)];

                const sheetData = [headerRow];

                table.rows.forEach((row: any) => {
                    const rowData = [row.dayName, ...row.cells.map((c: any) => c.content)];
                    sheetData.push(rowData);
                });

                const ws = XLSX.utils.aoa_to_sheet(sheetData);
                // Sheet name limited to 31 chars
                let sheetName = table.header.substring(0, 31).replace(/[:\/\\?*\[\]]/g, ''); // Remove invalid chars
                if (sheetName.length === 0) sheetName = `Sheet ${idx + 1}`;

                // Ensure unique sheet names
                let suffix = 1;
                const originalName = sheetName;
                while (wb.SheetNames.includes(sheetName)) {
                    sheetName = `${originalName.substring(0, 28)}_${suffix}`;
                    suffix++;
                }

                XLSX.utils.book_append_sheet(wb, ws, sheetName);
            });

            XLSX.writeFile(wb, 'SubjectWiseTimeTable.xlsx');
        }
    };

    return (
        <div className='container space-y-4 p-1'>
            <CollapsibleSection title='Subject Wise TimeTable Report' defaultOpen={true} variant='default' size='lg' className='shadow-lg'>
                <SubjectWiseForm initialData={initialData} onSubmit={handleFormSubmit} onCancel={handleCancel} />
                {/* {error && (
                    <div className='p-4 text-center text-red-500 text-sm'>
                        <p>{error}</p>
                    </div>
                )} */}
            </CollapsibleSection>

            {reportData.length > 0 && (
                <CollapsibleSection title='Report Grid' defaultOpen={true} variant='default' size='lg' className='shadow-lg'>
                    <div className='mb-4 flex justify-end space-x-2'>
                        <Button variant='outline' onClick={handleExport}>
                            <Download className='mr-2 h-4 w-4' />
                            Export to Excel
                        </Button>
                        <Button variant='outline' onClick={handlePrint}>
                            <Printer className='mr-2 h-4 w-4' />
                            Print
                        </Button>
                    </div>

                    <div className='overflow-x-auto rounded-lg bg-white p-4' ref={componentRef}>
                        {reportData.map((table, idx) => (
                            <div key={idx} className='page-break-after-always mb-8'>
                                <h3 className='mb-2 text-center font-bold text-green-700 text-lg'>{table.header}</h3>
                                <table className='w-full min-w-[800px] border-collapse border border-gray-300'>
                                    <thead>
                                        <tr className='bg-gray-100'>
                                            <th className='border border-gray-300 p-2 text-center font-bold'>Day / Period</th>
                                            {periodList.map((p: any, pIdx: number) => (
                                                <th key={pIdx} className='border border-gray-300 p-2 text-center font-bold'>
                                                    Period {p.ttmP_PeriodName}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {table.rows.map((row: any, rIdx: number) => (
                                            <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className='border border-gray-300 p-2 text-center font-medium text-blue-600'>
                                                    {row.dayName}
                                                </td>
                                                {row.cells.map((cell: any, cIdx: number) => (
                                                    <td
                                                        key={cIdx}
                                                        className='border border-gray-300 p-2 text-center text-sm'
                                                        style={{ color: cell.color }}>
                                                        {cell.content}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </CollapsibleSection>
            )}
        </div>
    );
}
