'use client';

import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { getClassWiseReport, getClassWiseReportDetails } from '@/server/timetable/reports/classwisett';
import { Download, Printer } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
//
import * as XLSX from 'xlsx';
import ClassWiseForm from './_components/classwise-form';

export default function ClassWiseReportPage() {
    const [initialData, setInitialData] = useState<any>({});
    const [reportData, setReportData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getClassWiseReportDetails({});
                if (data) {
                    setInitialData(data);
                } else {
                    setError('No data received from server.');
                }
            } catch (error: any) {
                ////console.error('Error fetching initial details', error);
                //setError(error.message || 'Failed to fetch report details.');
            }
        };
        fetchDetails();
    }, []);

    const handleFormSubmit = async (payload: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getClassWiseReport(payload);
            processReportData(response, payload.classarray, payload.sectionarray);
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

    const processReportData = (data: any, selectedClasses: any[], selectedSections: any[]) => {
        if (!data.tt || data.tt.length === 0) {
            setError('No TimeTable generated for the selected details.');
            setReportData([]);
            return;
        }

        const processedList: any[] = [];
        const periodList = data.periodslst || [];
        const breakList = data.tT_Break_list || [];
        const allBreakList = data.tT_Break_list_all || [];
        const gridWeeks = data.gridweeks || [];
        const timetable = data.tt || [];

        // Iterate through each selected class
        selectedClasses.forEach((cls: any) => {
            // Construct Period List with Breaks for this class
            const classPeriodList: any[] = [];
            periodList.forEach((period: any) => {
                let breakFlag = false;
                // Check if there is a break after this period for this class
                const breakItem = breakList.find(
                    (b: any) => b.asmcL_Id === cls.asmcL_Id && Number.parseFloat(period.ttmP_PeriodName) === b.ttmB_AfterPeriod
                );

                classPeriodList.push({ ped_id: period.ttmP_Id, ped_name: period.ttmP_PeriodName, is_break: false });

                if (breakItem) {
                    classPeriodList.push({ ped_id: 0, ped_name: 'Break', brk_name: breakItem.ttmB_BreakName, is_break: true });
                    breakFlag = true;
                }
            });

            // Iterate through each selected section
            selectedSections.forEach((sec: any) => {
                const tableRows: any[] = [];

                gridWeeks.forEach((day: any) => {
                    const rowCells: any[] = [];
                    classPeriodList.forEach((periodCol: any) => {
                        // Find timetable entry
                        let cellContent = '';
                        let cellColor = 'black';

                        if (!periodCol.is_break) {
                            const entries = timetable.filter(
                                (t: any) =>
                                    t.ttmP_Id === periodCol.ped_id &&
                                    t.ttmD_Id === day.ttmD_Id &&
                                    t.asmcL_Id === cls.asmcL_Id &&
                                    t.asmS_Id === sec.asmS_Id
                            );

                            if (entries.length > 0) {
                                cellContent = entries
                                    .map(
                                        (t: any) => `${t.asmcL_ClassName} : ${t.asmC_SectionName} : ${t.ismS_SubjectName} : ${t.staffName}`
                                    )
                                    .join(' && ');
                            }
                        } else {
                            // Handle Break
                            // Check if this specific break applies to this day
                            // AngularJS logic: check `tT_Break_list_all` for current day and class and after period
                            // current periodCol corresponds to a break. The PREVIOUS period was the trigger.
                            // But here we stored it as a separate item.
                            // We need to know which period this break is 'after'.
                            // However, in the loop above we just pushed it.
                            // Let's refine the loop strategy or look up 'allBreakList'.

                            // Re-implementing logic:
                            // We need to find if there is a break for THIS DAY, THIS CLASS, appearing after the previous period.
                            // But periodCol doesn't easily track 'previous period'.
                            // A simpler way: The break item in `classPeriodList` is static for the table header.
                            // But for the cell content, we check `tT_Break_list_all`.

                            const periodBeforeBreak = periodList.find(
                                (p: any) =>
                                    classPeriodList.indexOf(periodCol) > 0 &&
                                    classPeriodList[classPeriodList.indexOf(periodCol) - 1].ped_id === p.ttmP_Id
                            );

                            // Actually, in the construction above:
                            // classPeriodList.push({ ped_id: period.ttmP_Id ... })
                            // if(break) classPeriodList.push({ ped_id: 0 ... })

                            // So if this is a break col, the previous one in `classPeriodList` is the period it follows.
                            const prevIndex = classPeriodList.indexOf(periodCol) - 1;
                            const prevPeriodId = prevIndex >= 0 ? classPeriodList[prevIndex].ped_id : -1;

                            // Find if we have a break definition for this day
                            // Angular: if ($scope.day_list[j].ttmD_Id == promise.tT_Break_list_all[x].ttmD_Id && ... )
                            const dayBreak = allBreakList.find(
                                (b: any) =>
                                    b.ttmD_Id === day.ttmD_Id &&
                                    b.asmcL_Id === cls.asmcL_Id &&
                                    // We need to match period name to 'AfterPeriod' float comparison?
                                    // In construction we used `period.ttmP_PeriodName`.
                                    // Let's try to match by finding the period object for `prevPeriodId`
                                    periodList.some(
                                        (p: any) =>
                                            p.ttmP_Id === prevPeriodId && Number.parseFloat(p.ttmP_PeriodName) === b.ttmB_AfterPeriod
                                    )
                            );

                            if (dayBreak) {
                                cellContent = dayBreak.ttmB_BreakName;
                                cellColor = 'red';
                            }
                        }

                        rowCells.push({
                            ...periodCol,
                            dayId: day.ttmD_Id,
                            content: cellContent,
                            color: cellColor
                        });
                    });
                    tableRows.push({ dayName: day.ttmD_DayName, cells: rowCells });
                });

                processedList.push({
                    header: `Class : ${cls.asmcL_ClassName} & Section : ${sec.asmC_SectionName}`,
                    periodList: classPeriodList,
                    rows: tableRows
                });
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
                    <title>Class Wise TimeTable Report</title>
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
        // Simple export of the visible tables
        // Since we have multiple tables, we might need a different approach or export one by one.
        // For simplicity, we can create a workbook with multiple sheets or one big sheet.
        // Let's verify requirement: "Export to Excel" singular.

        // We can grab the HTML table and convert.
        if (componentRef.current) {
            const wb = XLSX.utils.table_to_book(componentRef.current);
            XLSX.writeFile(wb, 'ClassWiseTimeTable.xlsx');
        }
    };

    return (
        <div className='container space-y-4 p-1'>
            <CollapsibleSection title='Class Wise TimeTable Report' defaultOpen={true} variant='default' size='lg' className='shadow-lg'>
                <ClassWiseForm initialData={initialData} onSubmit={handleFormSubmit} onCancel={handleCancel} />
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
                        <Button
                            variant='outline'
                            //onClick={handlePrint}
                        >
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
                                            {table.periodList.map((p: any, pIdx: number) => (
                                                <th key={pIdx} className='border border-gray-300 p-2 text-center font-bold'>
                                                    {p.is_break ? 'Break' : `Period ${p.ped_name}`}
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
            <style jsx global>{`
                @media print {
                    .page-break-after-always {
                        page-break-after: always;
                    }
                }
            `}</style>
        </div>
    );
}
