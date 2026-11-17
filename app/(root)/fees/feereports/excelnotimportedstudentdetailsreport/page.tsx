'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { excelImportNotDoneReportSchema } from '@/schemas/fees/reports';
import { getexcelnotimportedstudentdetailsreport } from '@/server/fees/reports/excelnotimportedstudentdetailsreport';
import type { ExcelNotImportedStudentDetailsReport } from '@/types/fees/reports/reports';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { Input } from 'react-aria-components';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { excelnotimportedstudentColumns, printTable } from './_components/columns';
import DeleteExcelNotImportedForm from './_components/deleteform';

type FormFields = z.infer<typeof excelImportNotDoneReportSchema.addOrUpdate>;

interface IAcademicYear {
    asmaY_Id: string | number;
    asmaY_Year: string;
    asmaY_Order?: number;
}

function ExcelNotImportedReportContent() {
    const [filters, setFilters] = useState({
        fromDate: new Date(),
        toDate: new Date(),
        breakdown: 'ALL',
        academicYearId: ''
    });

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(excelImportNotDoneReportSchema.addOrUpdate),
        defaultValues: {
            academicYearId: '',
            fromDate: new Date(),
            toDate: new Date()
        }
    });

    const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [reportData, setReportData] = useState<ExcelNotImportedStudentDetailsReport[]>([]);

    const deletedIdsRef = useRef<Set<number>>(new Set());

    const { isDeleteFormOpen, selectedRow, closeToggleForm } = useFormContext<ExcelNotImportedStudentDetailsReport>();
    const academicYearId = watch('academicYearId');

    const tableProps = {
        data: reportData,
        totalCount: reportData.length,
        pageSize: 10,
        currentPage: 1,
        totalPages: Math.ceil(reportData.length / 10)
    };

    // Hooks
    const { data: academicData, isLoading: loadingAcademic, error: academicError } = useAcademicYearDropdown();

    useEffect(() => {
        if (academicError) {
            toast.error(academicError?.message || 'Failed to load academic years');
            setAcademicYears([]);
            return;
        }
        if (academicData?.data && Array.isArray(academicData.data)) {
            const formatted: IAcademicYear[] = academicData.data.map((item: any) => ({
                asmaY_Id: item.asmaY_Id ?? '',
                asmaY_Year: item.asmaY_Year ?? 'Unknown Year',
                asmaY_Order: item.asmaY_Order ?? 0
            }));
            setAcademicYears(formatted);
        }
    }, [academicData, academicError]);

    const handleCancel = () => {
        setReportData([]);
        setIsGeneratingReport(false);
        deletedIdsRef.current.clear();
        academicYearId && reset({ academicYearId: academicYearId.toString() });
    };

    const handlePrint = () => {
        const columns = [
            { key: 'slNo', label: 'Sl No' },
            { key: 'asmaY_Year', label: 'Academic Year' },
            { key: 'amsT_AdmNo', label: 'Admission No' },
            { key: 'feipsT_Date', label: 'Paid Date' },
            { key: 'feipsT_PayementMode', label: 'Payment Mode' },
            { key: 'feipsT_Amount', label: 'Amount' },
            { key: 'feipsT_Remarks', label: 'Remarks' }
        ];
        const rowsToPrint = reportData.map((row, index) => ({
            ...row,
            feipsT_Date: new Date(row.feipsT_Date).toLocaleDateString('en-GB'),
            slNo: index + 1
        }));
        printTable(columns, rowsToPrint);
    };

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        const Report = async () => {
            setIsGeneratingReport(true);
            const formattedFromDate = format(filters.fromDate!.toString(), 'yyyy-MM-dd');
            const formattedToDate = format(filters.toDate!.toString(), 'yyyy-MM-dd');
            try {
                const response = await getexcelnotimportedstudentdetailsreport(
                    Number(data.academicYearId),
                    formattedFromDate,
                    formattedToDate
                );
                setReportData(response.data || []);
                if (response.success === true) {
                    toast.success(response.message);
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.error('Failed to Delete Records:', error);
            } finally {
                setIsGeneratingReport(false);
            }
        };
        Report();
    };

    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='mx-auto max-w-7xl'>
                    <Card className='border-0 shadow-xl'>
                        <div className='p-8'>
                            <div className='space-y-8'>
                                <div className='flex flex-col items-center justify-center gap-8'>
                                    {/* Academic Year */}
                                    <div className='flex min-w-[500px] items-center gap-3'>
                                        <Label>
                                            Academic Year :<span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='academicYearId'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    key={field.value || 'empty'}
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                        setFilters((prev) => ({
                                                            ...prev,
                                                            academicYearId: value
                                                        }));
                                                    }}
                                                    value={field.value?.toString() || undefined}
                                                    disabled={loadingAcademic || isGeneratingReport}>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue
                                                            placeholder={loadingAcademic ? 'Loading...' : 'Select Academic Year'}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadingAcademic ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading...
                                                            </SelectItem>
                                                        ) : academicError ? (
                                                            <SelectItem value='error' disabled>
                                                                Failed to load years
                                                            </SelectItem>
                                                        ) : (
                                                            academicYears.map((item) => (
                                                                <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                                    {item.asmaY_Year}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.academicYearId && <FormError>{errors.academicYearId.message}</FormError>}
                                    </div>
                                </div>

                                <div className='mt-4 flex items-center justify-center rounded border bg-gray-50 p-4 shadow-sm'>
                                    <div className='flex items-center gap-6'>
                                        <div className='flex items-center gap-2'>
                                            <Label htmlFor='fromDate' className='font-medium'>
                                                From Date: <span className='text-red-500'>*</span>
                                            </Label>
                                            <Input
                                                id='fromDate'
                                                type='date'
                                                value={format(filters.fromDate, 'yyyy-MM-dd')}
                                                onChange={(e) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        fromDate: new Date(format(e.target.value, 'yyyy-MM-dd'))
                                                    }))
                                                }
                                                className='rounded border px-3 py-1'
                                                disabled={isGeneratingReport}
                                            />
                                        </div>

                                        <div className='flex items-center gap-2'>
                                            <Label htmlFor='toDate' className='font-medium'>
                                                To Date: <span className='text-red-500'>*</span>
                                            </Label>
                                            <Input
                                                id='toDate'
                                                type='date'
                                                value={format(filters.toDate, 'yyyy-MM-dd')}
                                                onChange={(e) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        toDate: new Date(format(e.target.value, 'yyyy-MM-dd'))
                                                    }))
                                                }
                                                className='rounded border px-3 py-1'
                                                disabled={isGeneratingReport}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className='flex justify-end gap-4 border-t pt-8'>
                                        <div className='min-w-0 flex-1'>
                                            <Button
                                                size='lg'
                                                variant='outline'
                                                className='w-full px-8'
                                                onClick={() => handleCancel()}
                                                disabled={isGeneratingReport}>
                                                Cancel
                                            </Button>
                                        </div>
                                        <div className='min-w-0 flex-1'>
                                            <Button type='submit' disabled={isSubmitting || isGeneratingReport} className='w-full px-12'>
                                                {isGeneratingReport ? 'Generating...' : 'Report'}
                                            </Button>
                                        </div>
                                        {!isGeneratingReport && reportData.length > 0 && (
                                            <div className='min-w-0 flex-1'>
                                                <Button
                                                    variant='outline'
                                                    className='w-full transition-all duration-200 hover:scale-105'
                                                    onClick={handlePrint}>
                                                    Print
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Loading state */}
                                {isGeneratingReport && (
                                    <div className='mt-8'>
                                        <CollapsibleSection defaultOpen={true}>
                                            <div className='flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white'>
                                                <div className='text-center'>
                                                    <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent' />
                                                    <p className='mt-4 font-medium text-gray-700 text-lg'>Generating report...</p>
                                                </div>
                                            </div>
                                        </CollapsibleSection>
                                    </div>
                                )}

                                {reportData.length > 0 && (
                                    <CollapsibleSection defaultOpen={true}>
                                        <GenericDataTable<ExcelNotImportedStudentDetailsReport>
                                            {...tableProps}
                                            columns={excelnotimportedstudentColumns}
                                            isLoading={false}
                                            error={null}
                                            columnPinning={{ right: ['actions'] }}
                                            loadingMessage='Loading Excel Not Imported Student Data...'
                                            noDataTitle='No Excel Not Imported Student Data Found'
                                            noDataDescription=''
                                            errorTitle='Error Loading Excel Not Imported Student Data'
                                            isPaginationRequired={false}
                                            isSearchRequired={false}
                                        />
                                    </CollapsibleSection>
                                )}

                                {isDeleteFormOpen && selectedRow && (
                                    <DeleteExcelNotImportedForm rowData={selectedRow} onClose={closeToggleForm} />
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </form>
        </div>
    );
}

export default function ExcelNotImportedReport() {
    return (
        <FormProvider<ExcelNotImportedStudentDetailsReport>>
            <ExcelNotImportedReportContent />
        </FormProvider>
    );
}
