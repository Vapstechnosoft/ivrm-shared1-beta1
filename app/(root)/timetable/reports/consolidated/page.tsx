'use client';

import { DataTable } from '@/components/ui/data-table/data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { getConsolidatedReport, getConsolidatedReportDetails } from '@/server/timetable/reports/consolidated';
import type { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import ConsolidatedForm from './_components/consolidated-form';

export default function ConsolidatedReportPage() {
    const [initialData, setInitialData] = useState<any>({});
    const [reportData, setReportData] = useState<any[]>([]);
    const [columns, setColumns] = useState<ColumnDef<any>[]>([]);
    const [loading, setLoading] = useState(false);
    const [reportType, setReportType] = useState<string>('');

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getConsolidatedReportDetails({});
                if (data) {
                    setInitialData(data);
                } else {
                    setError('No data received from server.');
                }
            } catch (error: any) {
                // console.error('Error fetching initial details', error);
                // setError(error.message || 'Failed to fetch report details.');
                // Even on error, we keep potentially empty initialData to show the form
            }
        };
        fetchDetails();
    }, []);

    const handleFormSubmit = async (payload: any) => {
        setLoading(true);
        setReportType(payload.TYPE);
        try {
            const response = await getConsolidatedReport(payload);
            processReportData(payload.TYPE, response);
        } catch (error) {
            //console.error('Error generating report', error);
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };

    const processReportData = (type: string, data: any) => {
        // Based on legacy logic, format data and columns
        if (type === 'STD') {
            const staffList = data.stafflst || [];
            const timetableList = data.finaltable || [];
            const daysList = data.dayslst || [];

            // Process data for STD
            const processed = staffList.map((ss: any) => {
                const staffTt = timetableList.filter((tt: any) => tt.HRME_Id === ss.hrmE_Id);
                const total = staffTt.reduce((acc: number, curr: any) => acc + curr.PCOUNT, 0);

                // Construct row object with day counts
                const row: any = {
                    name: ss.empName,
                    abbr: ss.ttmsaB_Abbreviation,
                    total: total
                };

                // Count periods per day
                daysList.forEach((day: any) => {
                    const dayTt = staffTt.filter((tt: any) => tt.TTMD_Id === day.ttmD_Id);
                    const dayCount = dayTt.reduce((acc: number, curr: any) => acc + curr.PCOUNT, 0);
                    row[`day_${day.ttmD_Id}`] = dayCount > 0 ? dayCount : '-';
                });

                return row;
            });
            setReportData(processed);

            // columns
            const cols: ColumnDef<any>[] = [
                { accessorKey: 'name', header: 'Staff Name' },
                { accessorKey: 'abbr', header: 'Abbreviation' },
                ...daysList.map((d: any) => ({ accessorKey: `day_${d.ttmD_Id}`, header: d.ttmD_DayName })),
                { accessorKey: 'total', header: 'Total' }
            ];
            setColumns(cols);
        } else if (type === 'ST') {
            // Staff Wise Details - Pivot: Rows=Day/Period, Cols=Staff
            const staffList = data.stafflst || [];
            const daysList = data.dayslst || [];
            const periodList = data.periodslst || [];
            const timetableList = data.finaltable || [];

            const processed: any[] = [];

            daysList.forEach((day: any) => {
                periodList.forEach((period: any) => {
                    const row: any = {
                        dayperiod: `${day.ttmD_DayName} / ${period.ttmP_PeriodName}`,
                        dayName: day.ttmD_DayName,
                        periodName: period.ttmP_PeriodName
                    };

                    // Find data for this slot
                    const slotData = timetableList.filter((tt: any) => tt.TTMD_Id === day.ttmD_Id && tt.TTMP_Id === period.ttmP_Id);

                    staffList.forEach((staff: any) => {
                        // Find staff in this slot
                        const staffEntry = slotData.find((tt: any) => tt.HRME_Id === staff.hrmE_Id);
                        if (staffEntry) {
                            row[`staff_${staff.hrmE_Id}`] = staffEntry.StaffSubject || 'Allocated';
                        } else {
                            row[`staff_${staff.hrmE_Id}`] = '';
                        }
                    });

                    processed.push(row);
                });
            });

            setReportData(processed);

            const cols: ColumnDef<any>[] = [
                { accessorKey: 'dayperiod', header: 'Day / Period', minSize: 200 },
                ...staffList.map((s: any) => ({
                    accessorKey: `staff_${s.hrmE_Id}`,
                    header: s.ttmsaB_Abbreviation || s.empName,
                    minSize: 150
                }))
            ];
            setColumns(cols);
        } else if (type === 'CSUB') {
            // Class Subject Wise
            const subjectList = data.subjectlist || [];
            const classSectionList = data.class_sectons || [];
            const timetableList = data.finaltable || [];

            const processed = subjectList.map((sub: any) => {
                const subTt = timetableList.filter((tt: any) => tt.ISMS_Id === sub.ismS_Id);
                const total = subTt.reduce((acc: number, curr: any) => acc + curr.PCOUNT, 0);

                const row: any = {
                    subject: sub.ismS_SubjectName,
                    total: total
                };

                classSectionList.forEach((cls: any) => {
                    const clsTt = subTt.filter((tt: any) => tt.ASMCL_Id === cls.asmcL_Id && tt.ASMS_Id === cls.asmS_Id);
                    const count = clsTt.reduce((acc: number, curr: any) => acc + curr.PCOUNT, 0);
                    row[`cls_${cls.asmcL_Id}_${cls.asmS_Id}`] = count > 0 ? count : '-';
                });

                return row;
            });
            setReportData(processed);

            const cols: ColumnDef<any>[] = [
                { accessorKey: 'subject', header: 'Subject', minSize: 150 },
                ...classSectionList.map((c: any) => ({
                    accessorKey: `cls_${c.asmcL_Id}_${c.asmS_Id}`,
                    header: c.asmcL_ClassName,
                    minSize: 50
                })),
                { accessorKey: 'total', header: 'Total', minSize: 80 }
            ];
            setColumns(cols);
        } else if (type === 'STSUB') {
            // Staff Subject Wise
            const subjectList = data.subjectlist || [];
            const classSectionList = data.class_sectons || [];
            const timetableList = data.finaltable || [];

            const processed = subjectList.map((sub: any) => {
                const subTt = timetableList.filter((tt: any) => tt.ISMS_Id === sub.ismS_Id);

                const row: any = {
                    subject: sub.ismS_SubjectName
                };

                classSectionList.forEach((cls: any) => {
                    const clsTt = subTt.filter((tt: any) => tt.ASMCL_Id === cls.asmcL_Id && tt.ASMS_Id === cls.asmS_Id);
                    // For STSUB, it shows ENAME (Staff Name)
                    if (clsTt.length > 0) {
                        // Join multiple staff if any
                        row[`cls_${cls.asmcL_Id}_${cls.asmS_Id}`] = clsTt.map((t: any) => t.ENAME).join(', ');
                    } else {
                        row[`cls_${cls.asmcL_Id}_${cls.asmS_Id}`] = '';
                    }
                });

                return row;
            });
            setReportData(processed);

            const cols: ColumnDef<any>[] = [
                { accessorKey: 'subject', header: 'Subject', minSize: 150 },
                ...classSectionList.map((c: any) => ({
                    accessorKey: `cls_${c.asmcL_Id}_${c.asmS_Id}`,
                    header: c.asmcL_ClassName,
                    minSize: 100
                }))
            ];
            setColumns(cols);
        } else if (type === 'ATG') {
            // Simple grid
            setReportData(data.finaltable || []);
            const cols: ColumnDef<any>[] = [
                { accessorKey: 'ENAME', header: 'Staff' },
                { accessorKey: 'ASMCL_ClassName', header: 'Class' },
                { accessorKey: 'ASMC_SectionName', header: 'Section' },
                { accessorKey: 'ISMS_SubjectName', header: 'Subject' },
                { accessorKey: 'PCOUNT', header: 'Periods Count' }
            ];
            setColumns(cols);
        } else {
            // Fallback for other complex types
            if (data.finaltable && data.finaltable.length > 0) {
                setReportData(data.finaltable);
                const keys = Object.keys(data.finaltable[0]);
                const cols = keys.map((k) => ({ accessorKey: k, header: k }));
                setColumns(cols);
            } else {
                setReportData([]);
                setColumns([]);
            }
        }
    };

    return (
        <div className='container space-y-4 p-1'>
            <CollapsibleSection title='Consolidated Report' defaultOpen={true} variant='default' size='lg' className='shadow-lg'>
                <ConsolidatedForm initialData={initialData} onSubmit={handleFormSubmit} />
                {/* {error && (
                    <div className='p-4 text-center text-red-500 text-sm'>
                        <p>Note: Unable to fetch initial data. Error: {error}</p>
                    </div>
                )} */}
            </CollapsibleSection>

            {reportData.length > 0 && (
                <CollapsibleSection title='Report Grid' defaultOpen={true} variant='default' size='lg' className='shadow-lg'>
                    <div className='rounded-lg bg-white p-4'>
                        <DataTable columns={columns} data={reportData} totalItems={reportData.length} />
                    </div>
                </CollapsibleSection>
            )}
        </div>
    );
}
