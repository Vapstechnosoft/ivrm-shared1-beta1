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
import { GenericDataTable } from '@/components/ui/view-data-table/view-generic-data-table';
import { useAcademicYearDropdown, useMasterFeeInstallmentDropDown, useMasterFeeInstallmentDueDateList } from '@/hooks/fees/useMasters';
import { cn } from '@/lib/utils';
import { masterInstallmentDueDateSchema } from '@/schemas/fees/masters';
import { getAcademicYearDetailsData, saveInstallmentDueDate } from '@/server/fees/masters/feeinstallmentduedate';
import type { IMasterFeesInstallmentDueDateList, IMasterFeesInstallmentDuedateList } from '@/types/fees/masters';
import type { IMasterFeeInstallmentDropDown } from '@/types/fees/masters/masters';
import { masterFeeInstallmentDueDateUpdateColumn } from './fee_due_date_columnupdate';

type FormFields = z.infer<typeof masterInstallmentDueDateSchema>;

interface AcademicYearOption {
    asmaY_Id: number;
    asmaY_Year: string;
}

interface UpdtaeMasterInstallmentDueDateFormProps {
    onSuccess?: () => void;
    selectedRow: IMasterFeesInstallmentDuedateList;
}

export default function UpdtaeMasterInstallmentDueDateForm({ onSuccess, selectedRow }: UpdtaeMasterInstallmentDueDateFormProps) {
    const { refetchAll } = useMasterFeeInstallmentDueDateList();

    // Debug the selected row
    useEffect(() => {
        console.log('=== SELECTED ROW FOR EDITING ===');
        console.log('Full selectedRow:', JSON.stringify(selectedRow, null, 2));
        console.log('Selected row properties:', {
            ftidD_Id: selectedRow?.ftidD_Id,
            ftI_Id: selectedRow?.ftI_Id,
            fmI_Id: selectedRow?.fmI_Id,
            asmaY_Id: selectedRow?.asmaY_Id,
            ftI_Name: selectedRow?.ftI_Name,
            dates: {
                from: selectedRow?.ftidD_FromDate,
                to: selectedRow?.ftidD_ToDate,
                applicable: selectedRow?.ftidD_ApplicableDate,
                due: selectedRow?.ftidD_DueDate
            }
        });
    }, [selectedRow]);

    const [filteredMasterInstallmentDueData, setFilteredMasterInstallmentDueData] = useState<IMasterFeesInstallmentDueDateList[]>([]);
    const [masterInstallmentDueDataLoading, setMasterInstallmentDueDataLoading] = useState(false);
    const { data: academicYearData, isLoading: loadingAcademic } = useAcademicYearDropdown();
    const { data: installmentData, isLoading: loadingInstallment } = useMasterFeeInstallmentDropDown();

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
            asmay_Id: selectedRow?.asmaY_Id?.toString() || '',
            fmi_Id: selectedRow?.fmI_Id?.toString() || '' // Note: using fmI_Id from selectedRow
        }
    });
    const asmayId = watch('asmay_Id');
    const fmiId = watch('fmi_Id');

    useEffect(() => {
        if (!selectedRow) return;

        // Reset form with selected row values
        reset({
            asmay_Id: selectedRow.asmaY_Id.toString(),
            fmi_Id: selectedRow.fmI_Id.toString() // Using fmI_Id
        });

        // Create editing row from selectedRow
        createEditingRowFromSelected();
    }, [selectedRow, reset]);

    const createEditingRowFromSelected = () => {
        if (!selectedRow) {
            setFilteredMasterInstallmentDueData([]);
            return;
        }

        console.log('Creating editing row from selectedRow...');

        // Create the row for editing with ALL required properties
        const editingRow: IMasterFeesInstallmentDueDateList = {
            // Main properties from selectedRow
            ftidD_Id: selectedRow.ftidD_Id,
            ftI_Id: selectedRow.ftI_Id,
            ftI_Name: selectedRow.ftI_Name || `Installment ${selectedRow.ftI_Id}`,
            asmaY_Id: selectedRow.asmaY_Id,
            fmI_Id: selectedRow.fmI_Id || 0,
            fmI_Name: '',

            // Date properties that match the interface
            ftidD_FromDate: selectedRow.ftidD_FromDate || '',
            ftidD_ToDate: selectedRow.ftidD_ToDate || '',
            ftidD_ApplicableDate: selectedRow.ftidD_ApplicableDate || '',
            ftidD_DueDate: selectedRow.ftidD_DueDate || '',

            // Table column date properties (fdate, tdate, etc.)
            fdate: selectedRow.ftidD_FromDate || '',
            tdate: selectedRow.ftidD_ToDate || '',
            aplc: selectedRow.ftidD_ApplicableDate || '',
            ddate: selectedRow.ftidD_DueDate || '',

            // Other properties from the interface with default values
            mI_Id: 0,
            returnval: false,

            // These seem to be duplicate date properties with "1" suffix
            fdate1: selectedRow.ftidD_FromDate || '',
            tdate1: selectedRow.ftidD_ToDate || '',
            aplc1: selectedRow.ftidD_ApplicableDate || '',
            ddate1: selectedRow.ftidD_DueDate || '',

            // Other properties
            fname: selectedRow.ftI_Name || `Installment ${selectedRow.ftI_Id}`,
            fmiid: selectedRow.fmI_Id || 0,

            // These seem to be duplicate date properties with "2" suffix
            fromdate2: selectedRow.ftidD_FromDate || '',
            todate2: selectedRow.ftidD_ToDate || '',
            apldate2: selectedRow.ftidD_ApplicableDate || '',
            ddudate2: selectedRow.ftidD_DueDate || '',

            yrid: selectedRow.asmaY_Id || 0
        };

        console.log('Created editing row:', editingRow);
        setFilteredMasterInstallmentDueData([editingRow]);
    };
    useEffect(() => {
        // If form values change, update the editing row
        if (filteredMasterInstallmentDueData.length > 0 && selectedRow) {
            const updatedRow = { ...filteredMasterInstallmentDueData[0] };

            // Update installment ID if fmiId changed (this is fmI_Id from master_installment table)
            // Note: ftI_Id in the due date table might be different from fmI_Id
            // You need to check your data model

            setFilteredMasterInstallmentDueData([updatedRow]);
        }
    }, [asmayId, fmiId]);

    const [academicYearRange, setAcademicYearRange] = useState<{
        minDate: Date | null;
        maxDate: Date | null;
    }>({ minDate: null, maxDate: null });

    useEffect(() => {
        const fetchAcademicYearDetails = async () => {
            if (!asmayId) {
                setAcademicYearRange({ minDate: null, maxDate: null });
                return;
            }
            try {
                const response = await getAcademicYearDetailsData(Number(asmayId));

                if (response.data && response.data.length > 0) {
                    const academicYear = response.data[0];
                    const minDate = academicYear.asmaY_From_Date ? new Date(academicYear.asmaY_From_Date) : null;
                    const maxDate = academicYear.asmaY_To_Date ? new Date(academicYear.asmaY_To_Date) : null;

                    setAcademicYearRange({ minDate, maxDate });
                }
            } catch (error) {
                console.error('Error fetching academic year details:', error);
                setAcademicYearRange({ minDate: null, maxDate: null });
            }
        };

        fetchAcademicYearDetails();
    }, [asmayId]);

    function formatDateToYMD(date: any) {
        if (!date) return null;
        try {
            const d = new Date(date);
            if (Number.isNaN(d.getTime())) return null;
            return d.toISOString().split('T')[0];
        } catch (error) {
            console.error('Error formatting date:', error);
            return null;
        }
    }

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            if (filteredMasterInstallmentDueData.length === 0) {
                toast.error('No data to save');
                return;
            }

            const editingRow = filteredMasterInstallmentDueData[0];

            const payload = {
                asmay_id: asmayId,
                fidddto: [
                    {
                        ftidD_Id: selectedRow.ftidD_Id || editingRow.ftidD_Id || 0,
                        ftI_Id: editingRow.ftI_Id, // This should match the installment in due date table
                        ftidD_FromDate: formatDateToYMD(editingRow.fdate) || '',
                        ftidD_ToDate: formatDateToYMD(editingRow.tdate) || '',
                        ftidD_ApplicableDate: formatDateToYMD(editingRow.aplc) || '',
                        ftidD_DueDate: formatDateToYMD(editingRow.ddate) || ''
                    }
                ]
            };

            console.log('Update Payload:', JSON.stringify(payload, null, 2));

            const response = await saveInstallmentDueDate(payload);

            if (response?.success) {
                toast.success(response.message || 'Saved successfully');
                onSuccess?.();
                handleReset();
                refetchAll();
            } else {
                toast.error(response?.message || 'Save failed');
            }
        } catch (err: any) {
            console.error('Error submitting form:', err);
            toast.error(err.message || 'Something went wrong');
        }
    };

    const handleReset = () => {
        // Reset to original selected values
        reset({
            asmay_Id: selectedRow.asmaY_Id.toString(),
            fmi_Id: selectedRow.fmI_Id.toString()
        });

        // Recreate the editing row
        createEditingRowFromSelected();
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
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger
                                        id='fmi_Id'
                                        className={cn('w-full transition-colors', errors.fmi_Id ? 'border-red-500' : '')}>
                                        <SelectValue placeholder='Select Installment Type' />
                                    </SelectTrigger>
                                    <SelectContent className='max-h-56 overflow-y-auto'>
                                        {loadingInstallment ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
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

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    {/* <div className="mb-2 text-sm text-gray-700">
                        <div className="font-medium">Editing Installment Due Date</div>
                        <div className="text-xs text-gray-500 mt-1">
                            Row ID: {selectedRow?.ftidD_Id} |
                            Showing {filteredMasterInstallmentDueData.length} row(s)
                        </div>
                    </div> */}

                    {filteredMasterInstallmentDueData.length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-8 text-center'>
                            <div className='mb-2 text-gray-400'>No data available for editing</div>
                        </div>
                    ) : (
                        <GenericDataTable<IMasterFeesInstallmentDueDateList>
                            data={filteredMasterInstallmentDueData}
                            columns={masterFeeInstallmentDueDateUpdateColumn(academicYearRange.minDate, academicYearRange.maxDate)}
                            isLoading={masterInstallmentDueDataLoading}
                            loadingMessage='Loading...'
                            noDataTitle='No data found'
                            noDataDescription=''
                            // enablePagination={false}
                            // enableRowSelection={false}
                            // enableSorting={false}
                        />
                    )}
                </CollapsibleSection>

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
                        disabled={isSubmitting || filteredMasterInstallmentDueData.length === 0}>
                        <Save className='mr-2 h-4 w-4' />
                        Update Installment Due Date
                    </Button>
                </div>
            </form>
        </div>
    );
}
