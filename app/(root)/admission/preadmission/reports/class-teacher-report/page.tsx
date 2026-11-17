'use client';

import { Button } from '@/components/ui/button';
import type { DataTableRef } from '@/components/ui/data-table/data-table';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { Label } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/admission/preadmission/useMasters';
import { useClassTeacherReport } from '@/hooks/admission/preadmission/useReports';
import { getExcelClassTeacherReport } from '@/server/admission/preadmission/reports/month_end_report';
import { GetClassTeacherReport } from '@/server/admission/preadmission/reports/student_yearly_attendance';
import type { IClassTeacherReportList } from '@/types/admission/preadmission/reports';
import { FileText, Printer, RotateCcw, X } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';
import { ClassTeacherReportPrint } from './_components/class-teacher-report-print';
import { getClassTeacherReportColumns } from './_components/columns';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function ClassTeacherReportPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = (React as any).use(props.searchParams);
    const tableRef = useRef<DataTableRef>(null);
    const componentRef = useRef<HTMLDivElement>(null);

    const { data: academicYearOptions, isLoading: academicYearLoading, isError: academicYearError } = useAcademicYearDropdown();

    const [academicYearId, setAcademicYearId] = useState(0);
    const [reportType, setReportType] = useState('class_teacher');
    const [showReport, setShowReport] = useState(false);

    const [selectedStudents, setSelectedStudents] = useState<IClassTeacherReportList[]>([]);
    const [printData, setPrintData] = useState<IClassTeacherReportList[]>([]);

    const flagMapping = {
        class_teacher: 3,
        class_teacher_attendance: 1,
        subject_teacher_attendance: 2
    };

    const flag = flagMapping[reportType as keyof typeof flagMapping];

    const {
        data: response,
        isLoading,
        error,
        refetch: refetchAdmissionStudents
    } = useClassTeacherReport(academicYearId, Number(flag), searchParams);

    const columns = useMemo(() => getClassTeacherReportColumns(reportType), [reportType]);

    const tableProps = useDataTableProps({
        ...response,
        data: (response?.data as any)?.searchstudentDetails || []
    });

    useEffect(() => {
        if ((academicYearId ?? 0) === 0 && academicYearOptions?.data && academicYearOptions.data.length > 0) {
            setAcademicYearId(Number(academicYearOptions.asmaY_Id));
        }
    }, [academicYearOptions, academicYearId]);

    const handleFilterChange = (filterType: string, value: number) => {
        if (filterType === 'academic_year') {
            setAcademicYearId(value);
            setShowReport(false);
        }
    };

    const handleReportTypeChange = (value: string) => {
        setReportType(value);
        setShowReport(false);
    };

    const handleSelectStudent = (selectedRows: IClassTeacherReportList[]) => {
        setSelectedStudents(selectedRows);
    };

    const downloadExcel = async () => {
        try {
            if (!academicYearId || !Number(flag)) {
                toast.error('Please fill all required fields!');
                return;
            }

            const response = await getExcelClassTeacherReport(academicYearId, Number(flag));

            // Ensure we have a Blob
            const blob =
                response instanceof Blob
                    ? response
                    : new Blob([new Uint8Array(response)], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    });

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'ClassTeacherReport.xlsx';
            document.body.appendChild(link);
            link.click();

            // Cleanup
            setTimeout(() => {
                link.remove();
                window.URL.revokeObjectURL(url);
            }, 100);

            setShowReport(false);

            toast.success('Excel downloaded successfully');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download Excel');
        }
    };

    const handleReset = () => {
        if (academicYearOptions?.data && academicYearOptions.data.length > 0) {
            setAcademicYearId(Number(academicYearOptions.data[0].asmaY_Id));
        } else {
            setAcademicYearId(0);
        }
        setReportType('class_teacher');
        setSelectedStudents([]);
        setShowReport(false);
        tableRef.current?.resetSelection();
        toast.success('Filters reset successfully');
    };

    const handleCancel = () => {
        setShowReport(false);
        setSelectedStudents([]);
        tableRef.current?.resetSelection();
        toast.info('Report cancelled');
    };

    const handleReport = () => {
        if (!academicYearId || academicYearId === 0) {
            toast.error('Please select Academic Year');
            return;
        }

        setShowReport(true);
        refetchAdmissionStudents();
        toast.success('Generating report...');
    };

    const handlePrintContent = useReactToPrint({
        contentRef: componentRef,
        documentTitle: 'Class_Teacher_Report'
    });

    const handlePrint = async () => {
        const studentDetails = (response?.data as any)?.searchstudentDetails;
        if (!studentDetails || studentDetails.length === 0) {
            toast.error('No data available to print');
            return;
        }

        if (selectedStudents.length > 0) {
            setPrintData(selectedStudents);
            toast.info(`Preparing print for ${selectedStudents.length} selected record(s)...`);
        } else {
            try {
                toast.loading('Fetching all records for print...', { id: 'print-fetch' });
                const allDataResponse = await GetClassTeacherReport(academicYearId, Number(flag), { page_size: 100000 });
                const allData = (allDataResponse?.data as any)?.searchstudentDetails || [];

                if (allData.length === 0) {
                    toast.dismiss('print-fetch');
                    toast.error('Failed to fetch print data');
                    return;
                }

                setPrintData(allData);
                toast.dismiss('print-fetch');
                toast.success(`Ready to print ${allData.length} records`);
            } catch (error) {
                console.error('Print fetch error:', error);
                toast.dismiss('print-fetch');
                toast.error('Error fetching print data');
                return;
            }
        }

        // Give React time to re-render the print component with selected data
        setTimeout(() => {
            handlePrintContent();
        }, 500);
    };

    return (
        <div className='min-h-screen p-8'>
            <CollapsibleSection
                title='Class Teacher Report'
                defaultOpen={true}
                variant='outline'
                size='md'
                className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                <div className='space-y-6'>
                    <div className='flex justify-center'>
                        <div className='w-full max-w-xs space-y-2'>
                            <Label htmlFor='academic-year' className='font-medium text-gray-900 text-sm'>
                                Academic Year <span className='text-red-500'>*</span>
                            </Label>

                            <Select
                                onValueChange={(value) => handleFilterChange('academic_year', Number(value))}
                                value={academicYearId !== 0 ? academicYearId?.toString() : undefined}>
                                <SelectTrigger id='academic-year' className='w-full'>
                                    <SelectValue placeholder='Select Academic Year' />
                                </SelectTrigger>

                                <SelectContent>
                                    {academicYearLoading ? (
                                        <SelectItem value='loading' disabled>
                                            Loading...
                                        </SelectItem>
                                    ) : academicYearError ? (
                                        <SelectItem value='error' disabled>
                                            Error loading
                                        </SelectItem>
                                    ) : (
                                        academicYearOptions?.data?.map((item) => (
                                            <SelectItem key={item.asmaY_Id} value={String(item.asmaY_Id)}>
                                                {item.asmaY_Year}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className='flex flex-col items-center gap-3'>
                        <RadioGroup
                            value={reportType}
                            onValueChange={handleReportTypeChange}
                            className='flex flex-wrap items-center justify-center gap-6'>
                            <div className='flex items-center gap-2'>
                                <RadioGroupItem value='class_teacher' id='report-class-teacher' />
                                <Label htmlFor='report-class-teacher' className='cursor-pointer'>
                                    Class Teacher
                                </Label>
                            </div>

                            <div className='flex items-center gap-2'>
                                <RadioGroupItem value='class_teacher_attendance' id='report-class-attendance' />
                                <Label htmlFor='report-class-attendance' className='cursor-pointer'>
                                    Class Teacher having Attendance Privilege
                                </Label>
                            </div>

                            <div className='flex items-center gap-2'>
                                <RadioGroupItem value='subject_teacher_attendance' id='report-subject-attendance' />
                                <Label htmlFor='report-subject-attendance' className='cursor-pointer'>
                                    Subject Teacher having Attendance Privilege
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
                        <Button
                            type='button'
                            onClick={handleReport}
                            className='w-full transition-all duration-200 hover:scale-105 sm:w-fit'>
                            <FileText className='mr-2 h-4 w-4' />
                            Report
                        </Button>

                        <Button
                            type='button'
                            variant='outline'
                            onClick={handleReset}
                            className='w-full transition-all duration-200 hover:scale-105 sm:w-fit'>
                            <RotateCcw className='mr-2 h-4 w-4' />
                            Reset
                        </Button>

                        <Button
                            variant='outline'
                            className='w-full transition-all duration-200 hover:scale-105 sm:w-fit'
                            onClick={handleCancel}>
                            <X className='mr-2 h-4 w-4' />
                            Cancel
                        </Button>

                        {showReport &&
                            (response?.data as any)?.searchstudentDetails &&
                            (response?.data as any)?.searchstudentDetails.length > 0 && (
                                <>
                                    <Button onClick={downloadExcel} className='w-fit'>
                                        Export to Excel
                                    </Button>
                                    <Button
                                        variant='outline'
                                        className='w-full transition-all duration-200 hover:scale-105 sm:w-fit'
                                        onClick={handlePrint}>
                                        <Printer className='mr-2 h-4 w-4' />
                                        Print
                                    </Button>
                                </>
                            )}
                    </div>
                </div>
            </CollapsibleSection>

            {showReport &&
                (response?.data as any)?.searchstudentDetails &&
                (response?.data as any)?.searchstudentDetails.length > 0 && (
                    <div id='printable-report'>
                        <CollapsibleSection
                            title='Class Teacher Report Results'
                            defaultOpen={true}
                            variant='outline'
                            size='md'
                            className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                            <GenericDataTable<IClassTeacherReportList>
                                {...tableProps}
                                ref={tableRef}
                                columns={columns}
                                isLoading={isLoading}
                                error={error}
                                showViewOptions={false}
                                loadingMessage='Loading class teacher reports...'
                                noDataTitle='No Data Found'
                                noDataDescription='No class teacher reports found.'
                                errorTitle='Error Loading Class Teacher Reports'
                                onRowSelectionChange={handleSelectStudent}
                            />
                        </CollapsibleSection>
                    </div>
                )}

            {/* Hidden Print Component */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0,
                    overflow: 'visible',
                    opacity: 0,
                    pointerEvents: 'none',
                    zIndex: -1
                }}>
                <ClassTeacherReportPrint
                    ref={componentRef}
                    data={printData}
                    reportType={reportType}
                />
            </div>
        </div>
    );
}
