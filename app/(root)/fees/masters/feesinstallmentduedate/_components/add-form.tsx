'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { useAcademicYearDropdown, useMasterFeeInstallmentDropDown, useMasterFeeInstallmentDueDateList } from '@/hooks/fees/useMasters';
import { cn } from '@/lib/utils';
import { masterInstallmentDueDateSchema } from '@/schemas/fees/masters';
import { getAcademicYearDetailsData, getInstallmentDueDateList, saveInstallmentDueDate } from '@/server/fees/masters/feeinstallmentduedate';
import type { IMasterFeesInstallmentDueDateList } from '@/types/fees/masters';
import type { IMasterFeeInstallmentDropDown } from '@/types/fees/masters/masters';
import { masterFeeInstallmentDueDateColumn } from './fee_due_date_column';

// type MasterInstallmentFormSchema = z.infer<typeof masterInstallmentDueDateSchema>;
type FormFields = z.infer<typeof masterInstallmentDueDateSchema>;
interface AcademicYearOption {
    asmaY_Id: number;
    asmaY_Year: string;
}

interface AddMasterInstallmentDueDateFormProps {
    onSuccess?: () => void;
}

export default function AddMasterInstallmentDueDateForm({ onSuccess }: AddMasterInstallmentDueDateFormProps) {
    const { refetchAll } = useMasterFeeInstallmentDueDateList();
    const [masterInstallmentDueData, setMasterInstallmentDueData] = useState<IMasterFeesInstallmentDueDateList[]>([]);
    const [masterInstallmentDueDataLoading, setMasterInstallmentDueDataLoading] = useState(false);
    const [masterInstallmentDueDataError, setMasterInstallmentDueDataError] = useState<any>(null);
    const [tableProps, setTableProps] = useState<any>(null);
    const { data: academicYearData, isLoading: loadingAcademic, error: academicError } = useAcademicYearDropdown();
    const { data: installmentData, isLoading: loadingInstallment, error: installmentError } = useMasterFeeInstallmentDropDown();

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterInstallmentDueDateSchema),
        mode: 'onChange',
        defaultValues: {
            asmay_Id: '',
            fmi_Id: ''
        }
    });

    useEffect(() => {
        if (academicError) {
            toast.error(academicError.message || 'Error fetching academic years');
        }
    }, [academicError]);

    const asmayId = watch('asmay_Id');
    const fmI_Installment_Type = watch('fmi_Id');
    useEffect(() => {
        fetchStudentClassMapping();
    }, [asmayId, fmI_Installment_Type]);
    const fetchStudentClassMapping = async () => {
        try {
            setMasterInstallmentDueDataLoading(true);
            setMasterInstallmentDueDataError(null);
            const res = await getInstallmentDueDateList(Number(asmayId || 0), Number(fmI_Installment_Type || 0));
            setMasterInstallmentDueData(res.data);
            setTableProps(useDataTableProps(res || []));
        } catch (error) {
            console.error('Error fetching student class mapping', error);
            setMasterInstallmentDueDataError(error);
        } finally {
            setMasterInstallmentDueDataLoading(false);
        }
    };

    const asmay_Id = watch('asmay_Id');

    const [academicYearRange, setAcademicYearRange] = useState<{
        minDate: Date | null;
        maxDate: Date | null;
    }>({ minDate: null, maxDate: null });
    useEffect(() => {
        const fetchAcademicYearDetails = async () => {
            console.log('setting min and max dates', asmay_Id);
            if (!asmay_Id) {
                setAcademicYearRange({ minDate: null, maxDate: null });
                return;
            }
            try {
                const response = await getAcademicYearDetailsData(Number(asmay_Id));
                console.log('Response:', response);

                // Assuming response has startDate and endDate
                // Adjust based on your actual API response structure
                if (response.data) {
                    const academicYear = response.data[0]; // Or use response.data.find(...) if selecting by criteria

                    const minDateStr = academicYear.asmaY_From_Date ? new Date(academicYear.asmaY_From_Date) : '';
                    const maxDateStr = academicYear.asmaY_To_Date ? new Date(academicYear.asmaY_To_Date) : '';
                    // const minDateStr = '2025-01-01';
                    // const maxDateStr = '2025-12-31';

                    // Convert strings to Date objects
                    const minDate = new Date(minDateStr);
                    const maxDate = new Date(maxDateStr);

                    console.log('mindate', minDate);
                    console.log('mindate', minDate);
                    setAcademicYearRange({ minDate, maxDate });
                }
            } catch (error) {
                console.error('Error fetching academic year details:', error);
                setAcademicYearRange({ minDate: null, maxDate: null });
            }
        };

        fetchAcademicYearDetails();
    }, [asmay_Id]);

    function formatDateToYMD(date: any) {
        if (!date) return null;
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            // --- Manual validation for all date fields ---
            const missing = masterInstallmentDueData.some((item) => {
                return !item.fdate || !item.tdate || !item.aplc || !item.ddate;
            });

            if (missing) {
                toast.error('Please fill all date fields before saving.');
                return;
            }
            const buildPayload = () => {
                return {
                    // fmI_Id: fmI_Installment_Type,

                    asmay_id: asmayId,
                    fidddto: masterInstallmentDueData.map((item: IMasterFeesInstallmentDueDateList) => ({
                        ftidD_Id: item.ftidD_Id ?? 0,
                        ftI_Id: item.ftI_Id,
                        ftidD_FromDate: formatDateToYMD(item.fdate) ?? '',
                        ftidD_ToDate: formatDateToYMD(item.tdate) ?? '',
                        ftidD_ApplicableDate: formatDateToYMD(item.aplc) ?? '',
                        ftidD_DueDate: formatDateToYMD(item.ddate) ?? ''
                    }))
                };
            };

            const _payload = buildPayload();
            const updatedpayload = JSON.stringify(_payload);
            console.log('Add Payload:', updatedpayload);
            const response = await saveInstallmentDueDate(_payload);

            if (response?.success) {
                toast.success(response.message);
                handleReset();
                onSuccess?.();
                refetchAll();
            } else {
                toast.error(response?.message || 'Save failed');
            }
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong');
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className='p-4'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Academic Year + Type */}
                <div className='grid grid-cols-1 gap-6 border-b pb-4 sm:grid-cols-2'>
                    <div className='flex flex-col gap-1.5'>
                        <Label htmlFor='asmay_Id'>
                            Academic Year <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            name='asmay_Id'
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange} disabled={loadingAcademic}>
                                    <SelectTrigger
                                        id='asmay_Id'
                                        className={cn('w-full transition-colors', errors.asmay_Id ? 'border-red-500' : '')}>
                                        <SelectValue placeholder='Select Academic Year' />
                                    </SelectTrigger>
                                    <SelectContent className='max-h-56 overflow-y-auto'>
                                        {Array.isArray(academicYearData?.data) &&
                                            academicYearData.data.map((year: AcademicYearOption) => (
                                                <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                                    {year.asmaY_Year}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.asmay_Id && <FormError>{errors.asmay_Id.message}</FormError>}
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <Label htmlFor='fmi_Id'>
                            Master Installment <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            name='fmi_Id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={(val) => {
                                        field.onChange(val);
                                    }}>
                                    <SelectTrigger
                                        id='fmI_Installment_Type'
                                        className={cn('w-full transition-colors', errors.fmi_Id ? 'border-red-500' : '')}>
                                        <SelectValue placeholder='Select Installment Type' />
                                    </SelectTrigger>
                                    <SelectContent className='max-h-56 overflow-y-auto'>
                                        {loadingInstallment ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : installmentError ? (
                                            <SelectItem value='error' disabled>
                                                Error
                                            </SelectItem>
                                        ) : (
                                            Array.isArray(installmentData?.data) &&
                                            installmentData?.data?.map((type: IMasterFeeInstallmentDropDown) => (
                                                <SelectItem key={type.fmI_Id} value={type.fmI_Id.toString()}>
                                                    {type.fmI_Name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.fmi_Id && <FormError>{errors.fmi_Id.message}</FormError>}
                    </div>
                </div>

                {asmayId && fmI_Installment_Type ? (
                    <CollapsibleSection
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                        <GenericDataTable<IMasterFeesInstallmentDueDateList>
                            {...tableProps}
                            columns={masterFeeInstallmentDueDateColumn(academicYearRange.minDate, academicYearRange.maxDate)}
                            isLoading={masterInstallmentDueDataLoading}
                            error={masterInstallmentDueDataError}
                            // onRowSelectionChange={handleSelectStudent}
                            columnPinning={{ right: ['actions'] }}
                            loadingMessage='Loading Fee Installment Due Date...'
                            noDataTitle='No Fee Installment Due Date Found'
                            noDataDescription='Get started by creating your first Fee Installment Due Date'
                            errorTitle='Error Fee Installment Due Date'
                        />
                    </CollapsibleSection>
                ) : null}
                {/* Action Buttons */}
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'
                        disabled={isSubmitting}>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        disabled={isSubmitting}>
                        <Save className='mr-2 h-4 w-4' />
                        Save Installment Due Date
                    </Button>
                </div>
            </form>
        </div>
    );
}
