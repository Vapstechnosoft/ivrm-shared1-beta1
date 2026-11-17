'use client';

import { Button } from '@/components/ui/button';
import { CustomMultiSelectBox } from '@/components/ui/custom-multiselect';
import { DateField } from '@/components/ui/dateField';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { useClassDropdownDropdown } from '@/hooks/fees/useReports';

import type { IUploadClassDropdownList } from '@/types/upload/reports/classwork-upload-report';

import { getNoticeBoardReport } from '@/server/upload/reports/noticeboard-report';
import type { INoticeBoardUploadReport } from '@/types/upload/reports/noticeboard-report';

/* ---------------- Schema ---------------- */
const formSchema = z.object({
    asmay_id: z.string().nonempty('Academic Year is required'),
    fromdate: z.string().nonempty('From date is required'),
    todate: z.string().nonempty('To date is required'),
    classarray: z.array(z.string()).min(1, 'Please select at least one class')
});

type FormFields = z.infer<typeof formSchema>;

export default function NoticeBoardUploadReportPage() {
    const [showReport, setShowReport] = useState(false);
    const [noticeBoardReport, setNoticeBoardReport] = useState<INoticeBoardUploadReport[]>([]);

    /* ---------------- Form ---------------- */
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            asmay_id: '',
            fromdate: '',
            todate: '',
            classarray: []
        }
    });

    /* ---------------- Academic Year ---------------- */
    const { data: academicResponse, isLoading: academicLoading } = useAcademicYearDropdown();

    const academicYears = Array.isArray(academicResponse) ? academicResponse : academicResponse?.data || [];

    /* ---------------- Class List ---------------- */
    const { data: classData, isLoading: loadingClasses, error: classError } = useClassDropdownDropdown();

    const [classList, setClassList] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        if (classError) {
            toast.error(classError?.message || 'Failed to load classes');
            setClassList([]);
            return;
        }

        if (Array.isArray(classData?.data)) {
            setClassList(
                classData.data.map((cls: IUploadClassDropdownList) => ({
                    label: cls.asmcL_ClassName,
                    value: String(cls.asmcL_Id)
                }))
            );
        }
    }, [classData, classError]);

    /* ---------------- Academic Year Change ---------------- */
    const handleYearChange = (value: string) => {
        const year = academicYears.find((y: any) => String(y.asmaY_Id) === value);
        if (year) {
            setValue('asmay_id', value);
            setValue('fromdate', year.asmaY_From_Date);
            setValue('todate', year.asmaY_To_Date);
        }
    };

    /* ---------------- Submit ---------------- */
    const onSubmit = async (values: FormFields) => {
        setShowReport(true);

        const payload = {
            ASMAY_Id: Number(values.asmay_id),
            fromdate: new Date(values.fromdate).toISOString().slice(0, 10),
            todate: new Date(values.todate).toISOString().slice(0, 10),
            classarray: values.classarray.map((id) => ({
                ASMCL_Id: Number(id)
            }))
        };

        const response = await getNoticeBoardReport(payload);
        setNoticeBoardReport(response.data ?? []);
    };

    /* ---------------- Cancel ---------------- */
    const handleCancel = () => {
        reset();
        window.location.reload();
    };

    return (
        <div className='container mx-auto space-y-6 p-4'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='mx-auto max-w-7xl'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                        {/* Academic Year */}
                        <Controller
                            control={control}
                            name='asmay_id'
                            render={({ fieldState }) => (
                                <div className='flex flex-col gap-2'>
                                    <Label>
                                        Academic Year <span className='text-red-500'>*</span>
                                    </Label>

                                    {academicLoading ? (
                                        <div className='rounded-md border px-3 py-2 text-gray-500 text-sm'>Loading Academic Years...</div>
                                    ) : (
                                        <Select onValueChange={handleYearChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Academic Year' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {academicYears.map((year: any) => (
                                                    <SelectItem key={year.asmaY_Id} value={String(year.asmaY_Id)}>
                                                        {year.asmaY_Year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}

                                    {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                </div>
                            )}
                        />

                        {/* From Date */}
                        <Controller
                            control={control}
                            name='fromdate'
                            render={({ field, fieldState }) => (
                                <DateField field={field} fieldState={fieldState} label='From Date' placeholder='Select From Date' />
                            )}
                        />

                        {/* To Date */}
                        <Controller
                            control={control}
                            name='todate'
                            render={({ field, fieldState }) => (
                                <DateField field={field} fieldState={fieldState} label='To Date' placeholder='Select To Date' />
                            )}
                        />

                        {/* Class */}
                        <Controller
                            control={control}
                            name='classarray'
                            render={({ field, fieldState }) => (
                                <div className='mt-5 flex flex-col gap-2'>
                                    <Label>
                                        Class Name <span className='text-red-500'>*</span>
                                    </Label>

                                    <CustomMultiSelectBox
                                        options={classList}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder={loadingClasses ? 'Loading Classes...' : 'Select Classes'}
                                        height='200px'
                                        isSearchRequired
                                    />

                                    {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                </div>
                            )}
                        />
                    </div>

                    {/* Buttons */}
                    <div className='flex justify-center space-x-2'>
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? 'Generating...' : 'Report'}
                        </Button>
                        <Button type='button' variant='destructive' onClick={handleCancel}>
                            Cancel
                        </Button>
                    </div>

                    {/* Report Table */}
                    {showReport && (
                        <CollapsibleSection defaultOpen>
                            <div className='mt-10 rounded-lg border bg-white shadow-xl'>
                                <div className='border-b bg-primary/5 px-8 py-6 text-center'>
                                    <h2 className='font-bold text-2xl text-primary'>NoticeBoard Upload Report</h2>
                                </div>

                                <div className='overflow-x-auto'>
                                    <table className='w-full border-collapse text-sm'>
                                        <thead className='bg-primary text-white'>
                                            <tr>
                                                <th className='border px-2 py-2'>Sl No</th>
                                                <th className='border px-2 py-2'>Topic</th>
                                                <th className='border px-2 py-2'>Class</th>
                                                <th className='border px-2 py-2'>File Name</th>
                                                <th className='border px-2 py-2'>Upload Date</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {noticeBoardReport.map((row, index) => (
                                                <tr key={index}>
                                                    <td className='border px-2 py-2 text-center'>{index + 1}</td>
                                                    <td className='border px-2 py-2 font-semibold'>{row.topic}</td>
                                                    <td className='border px-2 py-2 text-center'>{row.className}</td>

                                                    <td className='border px-2 py-2 text-center'>NA</td>
                                                    <td className='border px-2 py-2 text-center'>
                                                        {new Date(row.uploadDate).toISOString().slice(0, 10)}
                                                    </td>
                                                </tr>
                                            ))}

                                            {noticeBoardReport.length === 0 && (
                                                <tr>
                                                    <td colSpan={8} className='py-4 text-center font-bold text-red-600'>
                                                        No records found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CollapsibleSection>
                    )}
                </div>
            </form>
        </div>
    );
}
