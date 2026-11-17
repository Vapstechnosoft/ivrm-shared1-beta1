'use client';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLeaveTransferBasicData } from '@/hooks/hrms/leave-management/useTransactions';
import { Save, X } from 'lucide-react';
import { useMemo } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
export interface LeaveTransferFormData {
    type: string[];
    department: string[];
    designation: string[];
    leaveYear: string;
    leaveName: string;
}
interface LeaveTransferFormProps {
    activeTab: string;
    onSubmit: (data: LeaveTransferFormData) => void;
    onCancel: () => void;
    defaultValues?: Partial<LeaveTransferFormData>;
}
export function LeaveTransferForm({ activeTab: _activeTab, onSubmit, onCancel, defaultValues }: LeaveTransferFormProps) {
    // Fetch basic data from API
    const { data: basicDataResponse, isLoading: isLoadingBasicData } = useLeaveTransferBasicData();
    // Extract dropdown options from API response
    const typeOptions = useMemo(() => {
        if (!basicDataResponse?.data?.typeOptions || !Array.isArray(basicDataResponse.data.typeOptions)) {
            return [];
        }
        return basicDataResponse.data.typeOptions;
    }, [basicDataResponse]);
    const departmentOptions = useMemo(() => {
        if (!basicDataResponse?.data?.departmentOptions || !Array.isArray(basicDataResponse.data.departmentOptions)) {
            return [];
        }
        return basicDataResponse.data.departmentOptions;
    }, [basicDataResponse]);
    const designationOptions = useMemo(() => {
        if (!basicDataResponse?.data?.designationOptions || !Array.isArray(basicDataResponse.data.designationOptions)) {
            return [];
        }
        return basicDataResponse.data.designationOptions;
    }, [basicDataResponse]);
    const leaveYearOptions = useMemo(() => {
        if (!basicDataResponse?.data?.leaveYearOptions || !Array.isArray(basicDataResponse.data.leaveYearOptions)) {
            return [];
        }
        return basicDataResponse.data.leaveYearOptions;
    }, [basicDataResponse]);
    const leaveNameOptions = useMemo(() => {
        if (!basicDataResponse?.data?.leaveNameOptions || !Array.isArray(basicDataResponse.data.leaveNameOptions)) {
            return [];
        }
        return basicDataResponse.data.leaveNameOptions;
    }, [basicDataResponse]);
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<LeaveTransferFormData>({
        defaultValues: defaultValues || {
            type: [],
            department: [],
            designation: [],
            leaveYear: '',
            leaveName: ''
        }
    });
    const onSubmitForm: SubmitHandler<LeaveTransferFormData> = (data) => {
        onSubmit(data);
    };
    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                {/* Type Filter */}
                <div className='space-y-2'>
                    <Label className='font-medium text-sm'>Type:</Label>
                    <Controller
                        name='type'
                        control={control}
                        render={({ field }) => (
                            <MultiSelect
                                options={typeOptions}
                                onValueChange={field.onChange}
                                defaultValue={field.value || []}
                                placeholder={isLoadingBasicData ? 'Loading...' : 'Select Types'}
                                className='w-full'
                                maxHeight={240}
                                disabled={isLoadingBasicData}
                            />
                        )}
                    />
                </div>
                {/* Department Filter */}
                <div className='space-y-2'>
                    <Label className='font-medium text-sm'>Department:</Label>
                    <Controller
                        name='department'
                        control={control}
                        render={({ field }) => (
                            <MultiSelect
                                options={departmentOptions}
                                onValueChange={field.onChange}
                                defaultValue={field.value || []}
                                placeholder={isLoadingBasicData ? 'Loading...' : 'Select Departments'}
                                className='w-full'
                                maxHeight={240}
                                disabled={isLoadingBasicData}
                            />
                        )}
                    />
                </div>
                {/* Designation Filter */}
                <div className='space-y-2'>
                    <Label className='font-medium text-sm'>Designation:</Label>
                    <Controller
                        name='designation'
                        control={control}
                        render={({ field }) => (
                            <MultiSelect
                                options={designationOptions}
                                onValueChange={field.onChange}
                                defaultValue={field.value || []}
                                placeholder={isLoadingBasicData ? 'Loading...' : 'Select Designations'}
                                className='w-full'
                                maxHeight={240}
                                disabled={isLoadingBasicData}
                            />
                        )}
                    />
                </div>
            </div>
            {/* Leave Year and Leave Name */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                    <Label htmlFor='leave-year-select' className='font-medium text-sm'>
                        Leave Year <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='leaveYear'
                        control={control}
                        rules={{ required: 'Leave Year is required' }}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange} disabled={isLoadingBasicData}>
                                <SelectTrigger id='leave-year-select' className={errors.leaveYear ? 'border-red-500' : ''}>
                                    <SelectValue placeholder={isLoadingBasicData ? 'Loading...' : 'Select'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {leaveYearOptions.length > 0 ? (
                                        leaveYearOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className='px-2 py-1.5 text-muted-foreground text-sm'>
                                            {isLoadingBasicData ? 'Loading options...' : 'No options available'}
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.leaveYear && <FormError>{errors.leaveYear.message}</FormError>}
                </div>
                <div>
                    <Label htmlFor='leave-name-select' className='font-medium text-sm'>
                        Leave Name <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='leaveName'
                        control={control}
                        rules={{ required: 'Leave Name is required' }}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange} disabled={isLoadingBasicData}>
                                <SelectTrigger id='leave-name-select' className={errors.leaveName ? 'border-red-500' : ''}>
                                    <SelectValue placeholder={isLoadingBasicData ? 'Loading...' : 'Select'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {leaveNameOptions.length > 0 ? (
                                        leaveNameOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className='px-2 py-1.5 text-muted-foreground text-sm'>
                                            {isLoadingBasicData ? 'Loading options...' : 'No options available'}
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.leaveName && <FormError>{errors.leaveName.message}</FormError>}
                </div>
            </div>
            {/* Action Buttons */}
            <div className='flex justify-center gap-2 pt-4'>
                <Button type='submit' variant='default' className='min-w-[120px]'>
                    <Save className='mr-2 h-4 w-4' />
                    SAVE
                </Button>
                <Button type='button' variant='outline' onClick={onCancel} className='min-w-[120px]'>
                    <X className='mr-2 h-4 w-4' />
                    CANCEL
                </Button>
            </div>
        </form>
    );
}
