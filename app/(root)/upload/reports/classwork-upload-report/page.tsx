'use client';

import { useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { getReportData } from '@/server/upload/reports/classwork-upload-report';
import type { ApiSearchparams } from '@/types';
import type { IClassWorkReport, IClassWorkUploadReport, IUploadClassDropdownList } from '@/types/upload/reports/classwork-upload-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
// import ClassWorkReportForm from './_components/add-form';
// import { getColumns } from './_components/columns';
// import { ViewAttachmentModal } from './_components/view-attachment-modal';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { CustomMultiSelectBox } from '@/components/ui/custom-multiselect';
import { DateField } from '@/components/ui/dateField';
import { FormError } from '@/components/ui/extension/field';
import { useClassDropdownDropdown } from '@/hooks/fees/useReports';
const formSchema = z.object({
    fromdate: z.string().nonempty('From date is required'),
    todate: z.string().nonempty('To date is required'),
    classarray: z.array(z.string()).min(1, 'Please select at least one class')
});

type FormFields = z.infer<typeof formSchema>;
export default function ClassWorkUploadReportPage() {
    const [reportData, setReportData] = useState<IClassWorkReport[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAttachments, setModalAttachments] = useState<any[]>([]);
    const [searchParams, setSearchParams] = useState<ApiSearchparams>({ page: 1, page_size: 10 });
    const [currentPayload, setCurrentPayload] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const tableProps = useDataTableProps(reportData);
    const {
        control,
        reset,
        setValue,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fromdate: '',
            todate: '',
            classarray: []
        }
    });
    // const handleReportSuccess = async (payload: any, sParams: ApiSearchparams) => {
    //     if (!payload) {
    //         setReportData([]);
    //         setCurrentPayload(null);
    //         return;
    //     }

    //     setCurrentPayload(payload);
    //     setIsLoading(true);
    //     try {
    //         const res = await getReportData({ ...payload, ...sParams });
    //         // if (res.data && res.data.classreportlist) {
    //         //     setReportData(res.data.classreportlist);
    //         // } else {
    //         //     setReportData([]);
    //         //     toast.info('No records found');
    //         // }
    //     } catch (error) {
    //         console.error('Error fetching report:', error);
    //         toast.error('Failed to fetch report');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     if (currentPayload) {
    //         handleReportSuccess(currentPayload, searchParams);
    //     }
    // }, [searchParams]);

    const { data: classData, isLoading: loadingClasses, error } = useClassDropdownDropdown();
    // const handleViewAttachment = async (item: IClassWorkReport) => {
    //     try {
    //         const payload = {
    //             ICW_Id: item.icW_Id,
    //             ASMAY_Id: 0,
    //             Temp: 0
    //         };

    //         const res = await viewAttachmentData(payload);
    //         // if (res.data && res.data.attachementlist && res.data.attachementlist.length > 0) {
    //         //     setModalAttachments(res.data.attachementlist);
    //         //     setIsModalOpen(true);
    //         // } else {
    //         //     toast.info('No attachments details found.');
    //         // }
    //     } catch (error) {
    //         console.error('Error fetching attachments:', error);
    //         toast.error('Failed to fetch attachments');
    //     }
    // };
    const [classList, setClassList] = useState<{ label: string; value: string }[]>([]);

    /* -------------------- Map API → Dropdown -------------------- */
    useEffect(() => {
        if (error) {
            toast.error(error?.message || 'Failed to load classes');
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
    }, [classData, error]);

    // const columns = getColumns({ onViewAttachment: handleViewAttachment });

    const handleApiSearchParms = (sParams: ApiSearchparams) => {
        setSearchParams(sParams);
    };
    const [showReport, setShowReport] = useState(false);
    const [classWorkReport, setClassWorkReport] = useState<IClassWorkUploadReport[]>([]);

    const onSubmit = async (values: FormFields) => {
        setShowReport(true);
        const payload = {
            fromdate: new Date(values.fromdate).toISOString().slice(0, 10), // "YYYY-MM-DD"
            todate: new Date(values.todate).toISOString().slice(0, 10), // "YYYY-MM-DD"
            classarray: values.classarray.map((id) => ({
                ASMCL_Id: Number(id)
            }))
        };

        const response = await getReportData(payload);
        setClassWorkReport(response.data ?? []);
    };

    const handleCancel = () => {
        reset();
        window.location.reload();
        // onSuccess(null, apiSearchParams || { page: 1, page_size: 10 });
    };
    // const handlePrint = () => {

    // };
    //     const handleExport = () => {

    //     };

    return (
        <div className='container mx-auto space-y-6 p-4'>
            {/* <CollapsibleSection title='ClassWork Upload Report' defaultOpen>
                <ClassWorkReportForm onSuccess={handleReportSuccess} apiSearchParams={searchParams} />
            </CollapsibleSection> */}
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='mx-auto max-w-7xl'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
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

                        {/* Class Dropdown */}
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
                                        placeholder={loadingClasses ? 'Loading classes...' : 'Select Classes'}
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

                    {showReport && (
                        <CollapsibleSection defaultOpen={true}>
                            <div className='mt-10 rounded-lg border bg-white shadow-xl'>
                                {/* Header */}
                                <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-6'>
                                    <div className='mb-6 text-center'>
                                        <h2 className='font-bold text-2xl text-primary'>ClassWork Upload Report</h2>
                                    </div>
                                    {/* <div className='flex gap-3'>
                                                        <div className='mb-4 flex justify-end gap-2'>
                                                            <Button size='sm' className='h-8 w-auto px-3 text-xs' onClick={handleExport}
                                                            >
                                                                Export Excel
                                                            </Button>

                                                            <Button
                                                                size='sm'
                                                                variant='outline'
                                                                className='h-8 w-auto px-3 text-xs'
                                                                onClick={handlePrint}>
                                                                Print
                                                            </Button>
                                                        </div>
                                                    </div> */}
                                </div>

                                {/* TABLE */}
                                <div className='overflow-x-auto'>
                                    <table className='w-full border-collapse text-sm'>
                                        <thead className='bg-primary text-white'>
                                            <tr>
                                                <th className='border px-2 py-2'>Sl No</th>
                                                <th className='border px-2 py-2'>Topic</th>
                                                <th className='border px-2 py-2'>Class</th>
                                                <th className='border px-2 py-2'>Section</th>
                                                <th className='border px-2 py-2'>Subject</th>
                                                <th className='border px-2 py-2'>File Name</th>
                                                <th className='border px-2 py-2'>Upload Date</th>
                                                <th className='border px-2 py-2'>Upload By</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {classWorkReport.map((row, index) => (
                                                <tr key={index + 1}>
                                                    <td className='border px-2 py-2 text-center'>{index + 1}</td>
                                                    <td className='border px-2 py-2 font-semibold'>{row.topic}</td>
                                                    <td className='border px-2 py-2 text-center'>{row.className}</td>
                                                    <td className='border px-2 py-2 text-center'>{row.sectionName}</td>
                                                    <td className='border px-2 py-2 text-center'>{row.subjectName}</td>
                                                    <td className='border px-2 py-2 text-center'>{'NA'}</td>
                                                    <td className='border px-2 py-2 text-center'>
                                                        {new Date(row.uploadDate).toISOString().slice(0, 10)}
                                                    </td>
                                                    <td className='border px-2 py-2 text-center'>{row.employeeName}</td>
                                                </tr>
                                            ))}

                                            {classWorkReport.length === 0 && (
                                                <tr>
                                                    <td colSpan={7} className='py-4 text-center font-bold text-red-600'>
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
