'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MASTER_HEADS_DROPDOWN, TERM_DROPDOWN_DATA, useMasterTermsHeadDueDate } from '@/hooks/fees/useMasters';
import { useacademicyerdropdowndatafee } from '@/hooks/fees/useTrasactions';
import { masterTermFeeHeadDuedateSchema } from '@/schemas/fees/masters';
import { addOrUpdateFeeTermHeadDueDate, getFeeTermHeadDueDateGridList } from '@/server/fees/masters/fee-term-head-duedate';
import type { IFeeTermFeeHeadDueDateGridList } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterTermFeeHeadDuedateSchema.addOrUpdate>;

interface FeeTermsHeadFormProps {
    onSuccess?: () => void;
    termname?: string;
}

export default function AddFeeTermsHeadDueDateFormForm({ onSuccess, termname = '' }: FeeTermsHeadFormProps) {
    const { refetchAll } = useMasterTermsHeadDueDate();

    // Fetch hooks
    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useacademicyerdropdowndatafee();

    const { data: terms, isLoading: termsLoading, error: termsError, refetchAll: refetchterms } = TERM_DROPDOWN_DATA();

    const { data: masterHeads, isLoading: masterHeadsLoading, error: headerror, refetchAll: refetchMasterHeads } = MASTER_HEADS_DROPDOWN();

    const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(null);
    const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
    const [selectedHead, setSelectedHead] = useState<number | null>(null);

    const [gridData, setGridData] = useState<IFeeTermFeeHeadDueDateGridList[]>([]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterTermFeeHeadDuedateSchema.addOrUpdate),
        mode: 'onChange'
    });

    // ✅ useEffect to auto-fetch dropdown data
    useEffect(() => {
        refetchterms();
        refetchMasterHeads();
    }, [refetchterms, refetchMasterHeads]);

    function OnReset() {
        reset();
        refetchAll();
        refetchterms();
        refetchMasterHeads();
        setGridData([]);
    }
    useEffect(() => {
        async function fetchFeeTermHeadDueDateList() {
            if (selectedAcademicYear && selectedTerm && selectedHead) {
                const loadingToast = toast.loading('Fetching Due Date details...');
                try {
                    const response = await getFeeTermHeadDueDateGridList(selectedAcademicYear, selectedTerm, selectedHead);

                    if (response?.success && Array.isArray(response.data)) {
                        console.log('Response data:', response.data);

                        if (response.data.length > 0) {
                            setGridData(response.data);
                            toast.success(response.message, {
                                id: loadingToast
                            });
                        } else {
                            setGridData([]);
                            toast.error('No Due Date details found for the selected criteria', {
                                id: loadingToast
                            });
                        }
                    } else {
                        setGridData([]);
                        toast.error(response?.message || 'Failed to fetch data', {
                            id: loadingToast
                        });
                    }
                } catch (err: any) {
                    setGridData([]);
                    toast.error(err?.message || 'Error while fetching data', {
                        id: loadingToast
                    });
                }
            }
        }

        fetchFeeTermHeadDueDateList();
    }, [selectedAcademicYear, selectedTerm, selectedHead]);
    //getFeeTermHeadDueDateGridList
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const hasMissingDates = gridData.some(
                (item) => !item.fmtfhdD_FromDate || !item.fmtfhdD_ToDate || !item.fmtfhdD_ApplicableDate || !item.fmtfhdD_DueDate
            );

            if (hasMissingDates) {
                toast.error('Please select all the required date details');
                return;
            }
            const { asmay_Id, fmt_id, fmh_id } = data;

            const payload = {
                // MI_Id: 30,
                term_year_id: selectedAcademicYear ?? 0,
                // fmT_Id: selectedTerm ?? 0,
                // fmH_Id: selectedHead ?? 0,

                feetfhddd: gridData.map((item) => ({
                    FMTFH_Id: item.fmtfH_Id ?? 0,
                    FMTP_Id: item.fmtP_Id ?? 0,
                    FMTFHDD_FromDate: item.fmtfhdD_FromDate || null,
                    FMTFHDD_ToDate: item.fmtfhdD_ToDate || null,
                    FMTFHDD_ApplicableDate: item.fmtfhdD_ApplicableDate || null,
                    FMTFHDD_DueDate: item.fmtfhdD_DueDate || null
                }))
            };

            console.log('Payload JSON:', JSON.stringify(payload));

            const response = await addOrUpdateFeeTermHeadDueDate(payload);

            if (response.success) {
                toast.success(response.message);
                OnReset();
                onSuccess?.();
                refetchAll();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className={`${termname}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col items-center justify-center space-y-6'>
                {/* Academic Year */}
                <div className='flex items-center gap-6'>
                    <Label className='min-w-[150px] text-right'>
                        Academic Year:<span className='ml-1 text-red-500'>*</span>
                    </Label>
                    <div className='flex w-full max-w-[400px] flex-col'>
                        <Controller
                            name='asmay_Id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    key={field.value || 'empty'}
                                    onValueChange={(val) => {
                                        const id = Number(val);
                                        field.onChange(id);
                                        setSelectedAcademicYear(id);
                                    }}
                                    value={typeof field.value === 'number' || typeof field.value === 'string' ? String(field.value) : ''}
                                    disabled={academicYearLoading}>
                                    <SelectTrigger className='min-w-[400px] text-center'>
                                        <SelectValue placeholder='--Select Academic Year--' />
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
                                            academicYear?.data?.map((item: any, index: number) => (
                                                <SelectItem key={`${item.asmaY_Id}-${index}`} value={item.asmaY_Id.toString()}>
                                                    {item.asmaY_Year}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.asmay_Id && <FormError>{errors.asmay_Id.message}</FormError>}
                    </div>
                </div>

                {/* Term Name */}
                <div className='flex items-center gap-6'>
                    <Label className='min-w-[150px] text-right'>
                        Term Name :<span className='ml-1 text-red-500'>*</span>
                    </Label>
                    <div className='flex w-full max-w-[400px] flex-col'>
                        <Controller
                            name='fmt_id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    key={field.value || 'empty'}
                                    onValueChange={(val) => {
                                        const id = Number(val);
                                        field.onChange(id);
                                        setSelectedTerm(id);
                                    }}
                                    value={typeof field.value === 'number' || typeof field.value === 'string' ? String(field.value) : ''}
                                    disabled={termsLoading}>
                                    <SelectTrigger className='min-w-[400px] text-center'>
                                        <SelectValue placeholder='--Select Term--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {termsLoading ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : termsError ? (
                                            <SelectItem value='error' disabled>
                                                Error loading
                                            </SelectItem>
                                        ) : (
                                            terms?.data?.map((item: any, index: number) => (
                                                <SelectItem key={`${item.fmT_Id}-${index}`} value={item.fmT_Id.toString()}>
                                                    {item.fmT_Name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.fmt_id && <FormError>{errors.fmt_id.message}</FormError>}
                    </div>
                </div>

                {/* Fees Head */}
                <div className='flex items-center gap-6'>
                    <Label className='min-w-[150px] text-right'>
                        Fees Head :<span className='ml-1 text-red-500'>*</span>
                    </Label>
                    <div className='flex w-full max-w-[400px] flex-col'>
                        <Controller
                            name='fmh_id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    key={field.value || 'empty'}
                                    onValueChange={(val) => {
                                        const id = Number(val);
                                        field.onChange(id);
                                        setSelectedHead(id);
                                    }}
                                    value={typeof field.value === 'number' || typeof field.value === 'string' ? String(field.value) : ''}
                                    disabled={masterHeadsLoading}>
                                    <SelectTrigger className='min-w-[400px] text-center'>
                                        <SelectValue placeholder='--Select Fees Head--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {masterHeadsLoading ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : headerror ? (
                                            <SelectItem value='error' disabled>
                                                Error loading
                                            </SelectItem>
                                        ) : (
                                            masterHeads?.data?.map((item: any, index: number) => (
                                                <SelectItem key={`${item.fmH_Id}-${index}`} value={item.fmH_Id.toString()}>
                                                    {item.fmH_FeeName}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.fmh_id && <FormError>{errors.fmh_id.message}</FormError>}
                    </div>
                </div>

                <div className='mt-6 w-full'>
                    {gridData.length > 0 && (
                        <div className='overflow-x-auto rounded-lg border border-gray-300 shadow-sm'>
                            <table className='w-full border-collapse text-sm'>
                                <thead>
                                    <tr>
                                        <th className='border border-gray-300 px-4 py-2'>SL No</th>
                                        <th className='border border-gray-300 px-4 py-2'>Installment Name</th>
                                        <th className='border border-gray-300 px-4 py-2'>From Date</th>
                                        <th className='border border-gray-300 px-4 py-2'>To Date</th>
                                        <th className='border border-gray-300 px-4 py-2'>Applicable Date</th>
                                        <th className='border border-gray-300 px-4 py-2'>Due Date</th>
                                    </tr>
                                </thead>

                                <tbody className='bg-white text-center'>
                                    {gridData.map((item, index) => (
                                        <tr key={index} className='border border-gray-300 transition-colors hover:bg-gray-50'>
                                            <td className='border border-gray-300 px-4 py-2 font-medium'>{index + 1}</td>
                                            <td className='border border-gray-300 px-4 py-2 font-semibold text-gray-700'>{item.insname}</td>

                                            <td className='border border-gray-300 px-2 py-1'>
                                                <input
                                                    type='date'
                                                    onKeyDown={(e) => e.preventDefault()} // BLOCK ALL TYPING
                                                    min='1900-01-01'
                                                    max='2100-12-31'
                                                    className='w-full rounded-md border border-gray-300 px-2 py-1 text-gray-700 outline-none focus:border-blue-400 focus:ring focus:ring-blue-100'
                                                    //value={item.fmtfhdD_FromDate?.split('T')[0] || ''}
                                                    value={item.fmtfhdD_FromDate ? item.fmtfhdD_FromDate.split('T')[0] : ''}
                                                    onChange={(e) => {
                                                        const updated = [...gridData];
                                                        updated[index].fmtfhdD_FromDate = e.target.value;
                                                        setGridData(updated);
                                                    }}
                                                />
                                            </td>

                                            <td className='border border-gray-300 px-2 py-1'>
                                                <input
                                                    type='date'
                                                    onKeyDown={(e) => e.preventDefault()}
                                                    className='w-full rounded-md border border-gray-300 px-2 py-1 text-gray-700 outline-none focus:border-blue-400 focus:ring focus:ring-blue-100'
                                                    // value={item.fmtfhdD_ToDate?.split('T')[0] || ''}
                                                    value={item.fmtfhdD_ToDate ? item.fmtfhdD_ToDate.split('T')[0] : ''}
                                                    onChange={(e) => {
                                                        const updated = [...gridData];
                                                        updated[index].fmtfhdD_ToDate = e.target.value;
                                                        setGridData(updated);
                                                    }}
                                                />
                                            </td>

                                            <td className='border border-gray-300 px-2 py-1'>
                                                <input
                                                    type='date'
                                                    onKeyDown={(e) => e.preventDefault()}
                                                    className='w-full rounded-md border border-gray-300 px-2 py-1 text-gray-700 outline-none focus:border-blue-400 focus:ring focus:ring-blue-100'
                                                    //  value={item.fmtfhdD_ApplicableDate?.split('T')[0] || ''}
                                                    value={item.fmtfhdD_ApplicableDate ? item.fmtfhdD_ApplicableDate.split('T')[0] : ''}
                                                    onChange={(e) => {
                                                        const updated = [...gridData];
                                                        updated[index].fmtfhdD_ApplicableDate = e.target.value;
                                                        setGridData(updated);
                                                    }}
                                                />
                                            </td>

                                            <td className='border border-gray-300 px-2 py-1'>
                                                <input
                                                    type='date'
                                                    onKeyDown={(e) => e.preventDefault()}
                                                    className='w-full rounded-md border border-gray-300 px-2 py-1 text-gray-700 outline-none focus:border-blue-400 focus:ring focus:ring-blue-100'
                                                    // value={item.fmtfhdD_DueDate?.split('T')[0] || ''}
                                                    value={item.fmtfhdD_DueDate ? item.fmtfhdD_DueDate.split('T')[0] : ''}
                                                    onChange={(e) => {
                                                        const updated = [...gridData];
                                                        updated[index].fmtfhdD_DueDate = e.target.value;
                                                        setGridData(updated);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className='flex flex-col gap-3 pt-4 sm:flex-row sm:justify-start'>
                    {gridData.length > 0 && (
                        <>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={OnReset}
                                disabled={isSubmitting}
                                className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                                Reset
                            </Button>

                            <Button
                                type='submit'
                                disabled={isSubmitting}
                                className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                                isLoading={isSubmitting}
                                loadingText='Saving...'>
                                <div className='flex items-center'>
                                    <Save className='mr-2 h-4 w-4' />
                                    Save
                                </div>
                            </Button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}
