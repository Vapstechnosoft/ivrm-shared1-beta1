'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/admission/preadmission/useMasters';
import { useTotalStrengthReport } from '@/hooks/admission/preadmission/useReports';
import { usePreadmissionClassDropdown1, useadmissionSectionDropdown } from '@/hooks/admission/preadmission/useTransactions';
import { cn } from '@/lib/utils';
import { TotalStrengthSchema } from '@/schemas/admission/preadmission/reports';
import { getExcelTotalStrengthReport } from '@/server/admission/preadmission/reports/month_end_report';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, FileSpreadsheet, FileText, Printer, RotateCcw, Square } from 'lucide-react';
import { Fragment, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof TotalStrengthSchema>;

interface ElectiveItem {
    ismS_Id: number;
    ismS_SubjectName: string;
}

export default function TotalStrengthPage() {
    const { data: academicYear, isLoading: ayLoading } = useAcademicYearDropdown();
    const [showReport, setShowReport] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [classId, setClassId] = useState<number>(0);
    const [reportParams, setReportParams] = useState<{
        asmay_Id: number;
        asmcL_Id: number;
        amC_Id: number;
        statusFlag: string;
        amsT_SOL: string;
        withtc: string;
        withdeactive: string;
        electivearray: ElectiveItem[];
    } | null>(null);

    const {
        data: preadmissionClass,
        isLoading: preadmissionClassLoading,
        isError: preadmissionClassError
    } = usePreadmissionClassDropdown1();

    const {
        data: admissionSection,
        isLoading: admissionSectionLoading,
        isError: admissionSectionError
    } = useadmissionSectionDropdown(classId);

    const {
        data: response,
        isLoading,
        error
    } = useTotalStrengthReport(
        reportParams?.asmay_Id || 0,
        reportParams?.asmcL_Id || 0,
        reportParams?.amC_Id || 0,
        reportParams?.statusFlag || '',
        reportParams?.amsT_SOL || '',
        reportParams?.withtc || '',
        reportParams?.withdeactive || '',
        reportParams?.electivearray || []
    );

    const {
        control,
        watch,
        setValue,
        reset,
        trigger,
        formState: { errors }
    } = useForm<FormFields>({
        resolver: zodResolver(TotalStrengthSchema),
        defaultValues: {
            reportType: 'All',
            status: 'Present',
            withTc: false,
            withDeactive: false,
            academicYear: 0,
            class: '',
            section: ''
        }
    });

    const reportType = watch('reportType');
    const status = watch('status');

    const showCheckboxes = status === 'Present';

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
    };

    const handleReport = async () => {
        const isValid = await trigger();
        if (isValid) {
            const formData = watch();

            const statusFlag = formData.reportType === 'All' ? 'all' : 'indi';

            let amsT_SOL = 'S';
            if (formData.status === 'Left') {
                amsT_SOL = 'S';
            } else if (formData.status === 'Deactive') {
                amsT_SOL = 'S';
            }

            const withtc = formData.withTc ? 'N' : 'N';
            const withdeactive = formData.withDeactive ? 'N' : 'N';

            const electivearray: ElectiveItem[] = selectAll ? [{ ismS_Id: 0, ismS_SubjectName: '0' }] : [];

            setReportParams({
                asmay_Id: formData.academicYear,
                asmcL_Id: formData.class ? Number(formData.class) : 0,
                amC_Id: formData.section ? Number(formData.section) : 0,
                statusFlag,
                amsT_SOL,
                withtc,
                withdeactive,
                electivearray
            });

            setShowReport(true);
        }
    };

    const handleReset = () => {
        reset({
            reportType: 'All',
            status: 'Present',
            withTc: false,
            withDeactive: false,
            academicYear: 0,
            class: '',
            section: ''
        });
        setSelectAll(false);
        setShowReport(false);
        setClassId(0);
        setReportParams(null);
    };

    const groupedData = () => {
        if (!response?.data || !Array.isArray((response.data as any).studentlist)) return {};

        const grouped: Record<number, any[]> = {};
        ((response.data as any).studentlist as any[]).forEach((item: any) => {
            const rowNum = item.RowNumber || item.rowNumber || 0;
            if (!grouped[rowNum]) {
                grouped[rowNum] = [];
            }
            grouped[rowNum].push(item);
        });
        return grouped;
    };

    const calculateClassTotal = (rowNumber: number) => {
        const items = groupedData()[rowNumber] || [];
        return items.reduce((sum, item) => sum + (item.totalstudents || 0), 0);
    };

    const calculateGrandTotal = () => {
        if (!response?.data || !Array.isArray((response.data as any).studentlist)) return 0;
        return ((response.data as any).studentlist as any[]).reduce((sum: number, item: any) => sum + (item.totalstudents || 0), 0);
    };

    const downloadExcel = async () => {
        try {
            if (!reportParams) {
                toast.error('Please fill all required fields!');
                return;
            }

            const response = await getExcelTotalStrengthReport(reportParams);

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
            link.download = 'TotalStrengthReport.xlsx';
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

    const handlePrint = () => {
        if (!response?.data || !Array.isArray((response.data as any).studentlist)) {
            toast.error('No data available to print');
            return;
        }
        window.print();
    };

    return (
        <div className='min-h-screen'>
            <style>
                {`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-report, #printable-report * {
              visibility: visible;
            }
            #printable-report {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
            </style>
            <div className='container space-y-4 p-1'>
                <div className='space-y-4'>
                    <CollapsibleSection
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        title='Total Strength'
                        className='no-print shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                        <div className='space-y-6 p-4'>
                            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                                <div className='space-y-4 rounded-lg border border-gray-200 p-4'>
                                    <div className='space-y-2'>
                                        <Controller
                                            name='reportType'
                                            control={control}
                                            render={({ field }) => (
                                                <RadioGroup
                                                    value={field.value}
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                        if (value === 'All') {
                                                            setValue('class', '');
                                                            setValue('section', '');
                                                            setClassId(0);
                                                        }
                                                    }}
                                                    className='flex items-center justify-center space-x-6'>
                                                    <div className='flex items-center space-x-2'>
                                                        <RadioGroupItem value='All' id='all-type' />
                                                        <label htmlFor='all-type' className='cursor-pointer text-sm'>
                                                            All
                                                        </label>
                                                    </div>
                                                    <div className='flex items-center space-x-2'>
                                                        <RadioGroupItem value='Individual' id='individual-type' />
                                                        <label htmlFor='individual-type' className='cursor-pointer text-sm'>
                                                            Individual
                                                        </label>
                                                    </div>
                                                </RadioGroup>
                                            )}
                                        />
                                    </div>

                                    <div className='space-y-2'>
                                        <Controller
                                            name='status'
                                            control={control}
                                            render={({ field }) => (
                                                <RadioGroup
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    className='flex items-center justify-center space-x-6'>
                                                    <div className='flex items-center space-x-2'>
                                                        <RadioGroupItem value='Present' id='present' />
                                                        <label htmlFor='present' className='cursor-pointer text-sm'>
                                                            Present
                                                        </label>
                                                    </div>
                                                    <div className='flex items-center space-x-2'>
                                                        <RadioGroupItem value='Left' id='left' />
                                                        <label htmlFor='left' className='cursor-pointer text-sm'>
                                                            Left
                                                        </label>
                                                    </div>
                                                    <div className='flex items-center space-x-2'>
                                                        <RadioGroupItem value='Deactive' id='deactive' />
                                                        <label htmlFor='deactive' className='cursor-pointer text-sm'>
                                                            Deactive
                                                        </label>
                                                    </div>
                                                </RadioGroup>
                                            )}
                                        />
                                        {errors.status && <FormError>{errors.status.message}</FormError>}
                                    </div>

                                    {showCheckboxes && (
                                        <div className='space-y-2'>
                                            <div className='flex items-center justify-center space-x-6'>
                                                <Controller
                                                    name='withTc'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className='flex items-center space-x-2'>
                                                            <Checkbox id='withTc' checked={field.value} onCheckedChange={field.onChange} />
                                                            <label htmlFor='withTc' className='cursor-pointer text-sm'>
                                                                With TC
                                                            </label>
                                                        </div>
                                                    )}
                                                />
                                                <Controller
                                                    name='withDeactive'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className='flex items-center space-x-2'>
                                                            <Checkbox
                                                                id='withDeactive'
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                            <label htmlFor='withDeactive' className='cursor-pointer text-sm'>
                                                                With Deactive
                                                            </label>
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className='space-y-4 rounded-lg border border-gray-200 p-4'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='academicYear' className='font-medium'>
                                            Academic Year <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='academicYear'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value > 0 ? field.value.toString() : ''}
                                                    onValueChange={(value) => field.onChange(Number(value))}>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select Academic Year' />
                                                    </SelectTrigger>
                                                    <SelectContent className='max-h-60'>
                                                        {ayLoading ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading...
                                                            </SelectItem>
                                                        ) : (
                                                            academicYear?.data?.map((y) => (
                                                                <SelectItem key={y.asmaY_Id} value={y.asmaY_Id.toString()}>
                                                                    {y.asmaY_Year}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.academicYear && <FormError>{errors.academicYear.message}</FormError>}
                                    </div>

                                    <div className='space-y-2'>
                                        <Label className='font-medium'>
                                            Elective <span className='text-red-500'>*</span>
                                        </Label>
                                        <div
                                            onClick={handleSelectAll}
                                            className={cn(
                                                'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2.5 font-medium text-sm transition-all',
                                                selectAll
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-gray-300 hover:border-primary/40'
                                            )}>
                                            {selectAll ? (
                                                <CheckSquare className='h-4 w-4 text-primary' />
                                            ) : (
                                                <Square className='h-4 w-4 text-gray-400' />
                                            )}
                                            <span>Select All</span>
                                        </div>
                                    </div>

                                    {reportType === 'Individual' && (
                                        <>
                                            <div className='space-y-2'>
                                                <Label htmlFor='class' className='font-medium'>
                                                    Class <span className='text-red-500'>*</span>
                                                </Label>
                                                <Controller
                                                    name='class'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            value={field.value}
                                                            onValueChange={(value) => {
                                                                field.onChange(value);
                                                                setClassId(Number(value));
                                                                setValue('section', '');
                                                            }}>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder='Select Class' />
                                                            </SelectTrigger>
                                                            <SelectContent className='max-h-60'>
                                                                {preadmissionClassLoading ? (
                                                                    <SelectItem value='loading' disabled>
                                                                        Loading...
                                                                    </SelectItem>
                                                                ) : preadmissionClassError ? (
                                                                    <SelectItem value='error' disabled>
                                                                        Error loading
                                                                    </SelectItem>
                                                                ) : (
                                                                    preadmissionClass?.data?.map((item) => (
                                                                        <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                                                            {item.asmcL_ClassName}
                                                                        </SelectItem>
                                                                    ))
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.class && <FormError>{errors.class.message}</FormError>}
                                            </div>

                                            <div className='space-y-2'>
                                                <Label htmlFor='section' className='font-medium'>
                                                    Section <span className='text-red-500'>*</span>
                                                </Label>
                                                <Controller
                                                    name='section'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select value={field.value} onValueChange={field.onChange} disabled={!classId}>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder='Select Section' />
                                                            </SelectTrigger>
                                                            <SelectContent className='max-h-60'>
                                                                {admissionSectionLoading ? (
                                                                    <SelectItem value='loading' disabled>
                                                                        Loading...
                                                                    </SelectItem>
                                                                ) : admissionSectionError ? (
                                                                    <SelectItem value='error' disabled>
                                                                        Error loading
                                                                    </SelectItem>
                                                                ) : (
                                                                    admissionSection?.data?.map((item: any) => (
                                                                        <SelectItem key={item.asmS_Id} value={item.asmS_Id.toString()}>
                                                                            {item.asmC_SectionName}
                                                                        </SelectItem>
                                                                    ))
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.section && <FormError>{errors.section.message}</FormError>}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={handleReset}
                                    className='w-full transition-all duration-200 hover:scale-105 sm:w-fit'>
                                    <RotateCcw className='mr-2 h-4 w-4' />
                                    Reset
                                </Button>
                                <Button
                                    type='button'
                                    onClick={handleReport}
                                    className='w-full transition-all duration-200 hover:scale-105 sm:w-fit'
                                    disabled={isLoading}>
                                    <FileText className='mr-2 h-4 w-4' />
                                    {isLoading ? 'Loading...' : 'Report'}
                                </Button>
                                <div className='flex gap-3'>
                                    <Button variant='outline' className='w-fit' onClick={downloadExcel}>
                                        <FileSpreadsheet className='mr-2 h-4 w-4' />
                                        Export to Excel
                                    </Button>
                                    <Button variant='outline' className='w-fit' onClick={handlePrint}>
                                        <Printer className='mr-2 h-4 w-4' />
                                        Print
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CollapsibleSection>

                    {showReport && (
                        <div id='printable-report'>
                            <CollapsibleSection
                                defaultOpen={true}
                                variant='default'
                                size='lg'
                                title='Total Strength Report'
                                className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                                <div className='space-y-4 p-4'>
                                    {isLoading ? (
                                        <div className='flex items-center justify-center py-8'>
                                            <p className='text-gray-500'>Loading report data...</p>
                                        </div>
                                    ) : error ? (
                                        <div className='flex items-center justify-center py-8'>
                                            <p className='text-red-500'>Error loading report data</p>
                                        </div>
                                    ) : (
                                        <div className='overflow-x-auto'>
                                            <table className='w-full border-collapse border border-gray-300'>
                                                <thead>
                                                    <tr className='bg-gray-100'>
                                                        <th className='border border-gray-300 px-4 py-2 text-left font-semibold'>Sl.No</th>
                                                        <th className='border border-gray-300 px-4 py-2 text-left font-semibold'>Class</th>
                                                        <th className='border border-gray-300 px-4 py-2 text-left font-semibold'>Section</th>
                                                        <th className='border border-gray-300 px-4 py-2 text-right font-semibold'>Total</th>
                                                        <th className='border border-gray-300 px-4 py-2 text-right font-semibold'>
                                                            New Admission
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.entries(groupedData())
                                                        .sort(([a], [b]) => Number(a) - Number(b))
                                                        .map(([rowNumber, sections], index) => (
                                                            <Fragment key={rowNumber}>
                                                                {sections.map((item: any, sectionIndex) => (
                                                                    <tr
                                                                        key={`${rowNumber}-${item.sectionname}-${sectionIndex}`}
                                                                        className='hover:bg-gray-50'>
                                                                        <td className='border border-gray-300 px-4 py-2'>
                                                                            {sectionIndex === 0 ? index + 1 : ''}
                                                                        </td>
                                                                        <td className='border border-gray-300 px-4 py-2'>
                                                                            {sectionIndex === 0 ? item.classname : ''}
                                                                        </td>
                                                                        <td className='border border-gray-300 px-4 py-2'>{item.sectionname}</td>
                                                                        <td className='border border-gray-300 px-4 py-2 text-right'>
                                                                            {item.totalstudents}
                                                                        </td>
                                                                        <td className='border border-gray-300 px-4 py-2 text-right'>
                                                                            {item.newAdmission || ''}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                <tr key={`total-${rowNumber}`} className='bg-white font-semibold'>
                                                                    <td colSpan={3} className='border border-gray-300 px-4 py-2 text-right'>
                                                                        Total {sections[0]?.classname}
                                                                    </td>
                                                                    <td className='border border-gray-300 px-4 py-2 text-right'>
                                                                        {calculateClassTotal(Number(rowNumber))}
                                                                    </td>
                                                                    <td className='border border-gray-300 px-4 py-2 text-right' />
                                                                </tr>
                                                            </Fragment>
                                                        ))}
                                                    <tr className='bg-green-100 font-bold'>
                                                        <td colSpan={3} className='border border-gray-300 px-4 py-2 text-right'>
                                                            Grand Total
                                                        </td>
                                                        <td className='border border-gray-300 px-4 py-2 text-right'>{calculateGrandTotal()}</td>
                                                        <td className='border border-gray-300 px-4 py-2 text-right' />
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </CollapsibleSection>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
