'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MASTER_HEADS_DROPDOWN, TERM_DROPDOWN_DATA, useMasterTermsHeadDueDate } from '@/hooks/fees/useMasters';
import { useacademicyerdropdowndatafee } from '@/hooks/fees/useTrasactions';
import { masterTermFeeHeadDuedateSchema } from '@/schemas/fees/masters';
import { addOrUpdateFeeTermHeadDueDate, getFeeTermHeadDueDateGridList } from '@/server/fees/masters/fee-term-head-duedate';
import type { IFeeTermFeeHeadDueDateGridList, IMasterTermFeeHeadDueDateList } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterTermFeeHeadDuedateSchema.addOrUpdate>;

interface UpdateFeeTermsHeadDueDateFormProps {
    onSuccess?: () => void;
    termname?: string;
    selectedRow?: IMasterTermFeeHeadDueDateList;
}

export default function UpdateFeeTermsHeadDueDateForm({ onSuccess, termname = '', selectedRow }: UpdateFeeTermsHeadDueDateFormProps) {
    const { refetchAll } = useMasterTermsHeadDueDate();
    const rowData = selectedRow;

    // dropdown data
    const { data: academicYear, isLoading: academicYearLoading } = useacademicyerdropdowndatafee();
    const { data: terms, isLoading: termsLoading } = TERM_DROPDOWN_DATA();
    const { data: masterHeads, isLoading: headsLoading } = MASTER_HEADS_DROPDOWN();

    const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(null);
    const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
    const [selectedHead, setSelectedHead] = useState<number | null>(null);
    const [gridData, setGridData] = useState<IFeeTermFeeHeadDueDateGridList[]>([]);
    const [loadingGrid, setLoadingGrid] = useState(false);
    const isEditMode = !!rowData;

    const [originalGridData, setOriginalGridData] = useState<IFeeTermFeeHeadDueDateGridList[]>([]);
    // Check if dropdowns are still loading
    const dropdownsLoading = academicYearLoading || termsLoading || headsLoading;
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        setValue,
        getValues
    } = useForm<FormFields>({
        resolver: zodResolver(masterTermFeeHeadDuedateSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            asmay_Id: undefined,
            fmt_id: undefined,
            fmh_id: undefined
        }
    });

    function OnReset() {
        //if (!confirm('Discard changes?')) return;
        // reset({
        //     asmay_Id: undefined,
        //     fmt_id: undefined,
        //     fmh_id: undefined,
        // });
        // setGridData([]);
        // setSelectedAcademicYear(null);
        // setSelectedTerm(null);
        // setSelectedHead(null);
        //refetchAll();
        // setGridData(originalGridData);
        // if (!originalGridData.length) return;

        setGridData(structuredClone(originalGridData));
    }

    // ✅ DEBUG: Log the selectedRow when it changes
    useEffect(() => {
        console.log('selectedRow changed:', rowData);
        console.log('Dropdown status:', {
            academicYear: academicYear?.data?.length,
            terms: terms?.data?.length,
            masterHeads: masterHeads?.data?.length
        });
    }, [rowData, academicYear?.data?.length, terms?.data?.length, masterHeads?.data?.length]);

    // ✅ Initialize form when selectedRow changes
    useEffect(() => {
        // Only proceed if we have rowData and dropdowns are loaded
        if (rowData && academicYear?.data?.length && terms?.data?.length && masterHeads?.data?.length) {
            console.log('Setting form values from rowData:', {
                asmay_Id: rowData.asmay_Id,
                fmt_id: rowData.fmT_Id,
                fmh_id: rowData.fmH_Id
            });

            // Use setTimeout to ensure React Hook Form has time to initialize
            setTimeout(() => {
                reset(
                    {
                        asmay_Id: rowData.asmay_Id,
                        fmt_id: rowData.fmT_Id,
                        fmh_id: rowData.fmH_Id
                    },
                    {
                        keepDefaultValues: false
                    }
                );

                // Force update the state
                setSelectedAcademicYear(rowData.asmay_Id);
                setSelectedTerm(rowData.fmT_Id);
                setSelectedHead(rowData.fmH_Id);

                console.log('Form values after reset:', getValues());
            }, 0);
        } else if (!rowData) {
            // Clear form if no rowData (add mode)
            reset({
                asmay_Id: undefined,
                fmt_id: undefined,
                fmh_id: undefined
            });
            setSelectedAcademicYear(null);
            setSelectedTerm(null);
            setSelectedHead(null);
            setGridData([]);
        }
    }, [rowData, academicYear?.data?.length, terms?.data?.length, masterHeads?.data?.length, reset, getValues]);

    // ✅ fetch grid data dynamically
    useEffect(() => {
        async function fetchGrid() {
            if (selectedAcademicYear && selectedTerm && selectedHead) {
                console.log('Fetching grid for:', { selectedAcademicYear, selectedTerm, selectedHead });
                setLoadingGrid(true);
                const toastId = toast.loading('Fetching due date data...');
                try {
                    const res = await getFeeTermHeadDueDateGridList(selectedAcademicYear, selectedTerm, selectedHead);
                    console.log('Grid response:', res);

                    if (res?.success && Array.isArray(res.data)) {
                        // Format dates for input fields
                        const formattedData = res.data.map((item) => ({
                            ...item,
                            fmtfhdD_FromDate: item.fmtfhdD_FromDate?.split('T')[0] || '',
                            fmtfhdD_ToDate: item.fmtfhdD_ToDate?.split('T')[0] || '',
                            fmtfhdD_ApplicableDate: item.fmtfhdD_ApplicableDate?.split('T')[0] || '',
                            fmtfhdD_DueDate: item.fmtfhdD_DueDate?.split('T')[0] || ''
                        }));

                        //setGridData(formattedData);
                        //                         setGridData(formattedData);
                        // setOriginalGridData(formattedData);

                        const deepClonedData = structuredClone(formattedData);

                        setGridData(deepClonedData);
                        setOriginalGridData(structuredClone(deepClonedData));
                        toast.success('Data loaded successfully', { id: toastId });
                    } else {
                        setGridData([]);
                        toast.info('No records found', { id: toastId });
                    }
                } catch (err: any) {
                    console.error('Error fetching grid:', err);
                    toast.error(err?.message || 'Error fetching grid data', { id: toastId });
                } finally {
                    setLoadingGrid(false);
                }
            }
        }
        fetchGrid();
    }, [selectedAcademicYear, selectedTerm, selectedHead]);

    // ✅ Handle dropdown changes (for manual selection in add mode)
    const handleAcademicYearChange = (id: number) => {
        setValue('asmay_Id', id);
        setSelectedAcademicYear(id);
    };

    const handleTermChange = (id: number) => {
        setValue('fmt_id', id);
        setSelectedTerm(id);
    };

    const handleHeadChange = (id: number) => {
        setValue('fmh_id', id);
        setSelectedHead(id);
    };
    if (dropdownsLoading) {
        return (
            <div className='flex flex-col items-center justify-center py-8'>
                <Loader2 className='mb-4 h-8 w-8 animate-spin text-primary' />
                <p className='text-muted-foreground text-sm'>Loading form data...</p>
            </div>
        );
    }
    // ✅ Submit
    const onSubmit: SubmitHandler<FormFields> = async () => {
        if (!gridData.length) {
            toast.error('No grid data found to update');
            return;
        }

        const hasMissingDates = gridData.some(
            (item) => !item.fmtfhdD_FromDate || !item.fmtfhdD_ToDate || !item.fmtfhdD_ApplicableDate || !item.fmtfhdD_DueDate
        );

        if (hasMissingDates) {
            toast.error('Please select all the required date details');
            return;
        }

        const payload = {
            term_year_id: selectedAcademicYear ?? 0,
            FMTFHDD_Id: rowData?.fmtfhdD_Id,
            feetfhddd: gridData.map((item) => ({
                FMTFH_Id: item.fmtfH_Id ?? 0,
                FMTP_Id: item.fmtP_Id ?? 0,
                FMTFHDD_FromDate: item.fmtfhdD_FromDate || null,
                FMTFHDD_ToDate: item.fmtfhdD_ToDate || null,
                FMTFHDD_ApplicableDate: item.fmtfhdD_ApplicableDate || null,
                FMTFHDD_DueDate: item.fmtfhdD_DueDate || null
            }))
        };

        console.log('Submitting payload:', JSON.stringify(payload));

        const response = await addOrUpdateFeeTermHeadDueDate(payload);
        if (response.success) {
            toast.success('Updated successfully');
            onSuccess?.();
            refetchAll();
        } else {
            toast.error(response.message || 'Update failed');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col items-center justify-center space-y-6'>
            {/* Show loading only if dropdowns are loading AND we don't have selectedRow */}
            {dropdownsLoading && !rowData ? (
                <div className='flex flex-col items-center justify-center py-8'>
                    <Loader2 className='mb-4 h-8 w-8 animate-spin text-primary' />
                    <p className='text-muted-foreground text-sm'>Loading form data...</p>
                </div>
            ) : (
                <>
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
                                        onValueChange={(val) => {
                                            const id = Number(val);
                                            handleAcademicYearChange(id);
                                        }}
                                        value={field.value ? String(field.value) : ''}
                                        disabled={isEditMode || academicYearLoading}>
                                        <SelectTrigger className='min-w-[400px] text-center'>
                                            <SelectValue placeholder='Select Academic Year' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {academicYear?.data?.map((item: any) => (
                                                <SelectItem key={item.asmaY_Id} value={String(item.asmaY_Id)}>
                                                    {item.asmaY_Year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.asmay_Id && <FormError>{errors.asmay_Id.message}</FormError>}
                        </div>
                    </div>

                    {/* Term */}
                    <div className='flex items-center gap-6'>
                        <Label className='min-w-[150px] text-right'>
                            Term:<span className='ml-1 text-red-500'>*</span>
                        </Label>
                        <div className='flex w-full max-w-[400px] flex-col'>
                            <Controller
                                name='fmt_id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(val) => {
                                            const id = Number(val);
                                            handleTermChange(id);
                                        }}
                                        value={field.value ? String(field.value) : ''}
                                        disabled={isEditMode || termsLoading}>
                                        <SelectTrigger className='min-w-[400px] text-center'>
                                            <SelectValue placeholder='Select Term' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {terms?.data?.map((item: any) => (
                                                <SelectItem key={item.fmT_Id} value={String(item.fmT_Id)}>
                                                    {item.fmT_Name}
                                                </SelectItem>
                                            ))}
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
                            Fees Head:<span className='ml-1 text-red-500'>*</span>
                        </Label>
                        <div className='flex w-full max-w-[400px] flex-col'>
                            <Controller
                                name='fmh_id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(val) => {
                                            const id = Number(val);
                                            handleHeadChange(id);
                                        }}
                                        value={field.value ? String(field.value) : ''}
                                        disabled={isEditMode || headsLoading}>
                                        <SelectTrigger className='min-w-[400px] text-center'>
                                            <SelectValue placeholder='Select Fees Head' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masterHeads?.data?.map((item: any) => (
                                                <SelectItem key={item.fmH_Id} value={String(item.fmH_Id)}>
                                                    {item.fmH_FeeName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.fmh_id && <FormError>{errors.fmh_id.message}</FormError>}
                        </div>
                    </div>

                    {/* Grid Loading State */}
                    {/* {loadingGrid && (
                        <div className="flex flex-col items-center justify-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                            <p className="text-sm text-muted-foreground">Loading installment data...</p>
                        </div>
                    )} */}

                    {/* Grid Data - Show only when we have data */}
                    {gridData.length > 0 ? (
                        <div className='mt-6 w-full overflow-x-auto rounded border border-gray-300'>
                            <table className='min-w-full text-sm'>
                                <thead className='bg-gray-100'>
                                    <tr>
                                        <th className='border px-3 py-2'>SL No</th>
                                        <th className='border px-3 py-2'>Installment Name</th>
                                        <th className='border px-3 py-2'>From Date</th>
                                        <th className='border px-3 py-2'>To Date</th>
                                        <th className='border px-3 py-2'>Applicable Date</th>
                                        <th className='border px-3 py-2'>Due Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gridData.map((item, index) => (
                                        <tr key={index} className='hover:bg-gray-50'>
                                            <td className='border px-3 py-2 text-center'>{index + 1}</td>
                                            <td className='border px-3 py-2'>{item.insname}</td>
                                            {['fmtfhdD_FromDate', 'fmtfhdD_ToDate', 'fmtfhdD_ApplicableDate', 'fmtfhdD_DueDate'].map(
                                                (key) => (
                                                    <td key={key} className='border px-3 py-2'>
                                                        <input
                                                            type='date'
                                                            onKeyDown={(e) => e.preventDefault()}
                                                            min='1900-01-01'
                                                            max='2100-12-31'
                                                            value={(item as any)[key] || ''}
                                                            onChange={(e) => {
                                                                // const updated = [...gridData];
                                                                // (updated[index] as any)[key] = e.target.value;
                                                                // setGridData(updated);
                                                                setGridData((prev) =>
                                                                    prev.map((row, i) =>
                                                                        i === index ? { ...row, [key]: e.target.value } : row
                                                                    )
                                                                );
                                                            }}
                                                            className='w-full rounded border p-1'
                                                        />
                                                    </td>
                                                )
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        // Show empty state only when all three selections are made but no data
                        selectedAcademicYear &&
                        selectedTerm &&
                        selectedHead &&
                        !loadingGrid && (
                            <div className='flex flex-col items-center justify-center py-4'>
                                <p className='text-muted-foreground text-sm'>No installment data found for the selected combination.</p>
                            </div>
                        )
                    )}

                    {/* Buttons - Show only when we have grid data */}
                    {gridData.length > 0 && (
                        <div className='flex flex-col gap-3 pt-4 sm:flex-row sm:justify-start'>
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
                                    Update
                                </div>
                            </Button>
                        </div>
                    )}
                </>
            )}
        </form>
    );
}
