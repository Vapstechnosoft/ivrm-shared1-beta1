'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useAcademicYearDropdown,
    useMasterFeeYearlyGroup,
    useMasterGetYearlyCategory,
    useMasterGroupListDropDown
} from '@/hooks/fees/useMasters';
import { cn } from '@/lib/utils';
import { YearlyGroupSchema } from '@/schemas/fees/masters';
import { addOrUpdateMasterGroupYearlyCategory } from '@/server/fees/masters/fees_yearly_group';
import { zodResolver } from '@hookform/resolvers/zod';

import { CheckSquare, ChevronsUpDown, Save, Search, Square } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

interface FeeGroup {
    fmgg_Id: number;
    fmgg_GroupName: string;
}

interface Payload {
    //mI_Id: number;
    fyG_Id: number;
    // user_id: number;
    asmaY_Id: number;
    grouplist: number[];
    fyG_RebateTypeFlg: string;
    fyG_RebateApplicableFlg: boolean;
    fyG_PartialRebateAmtOrPercentageValue: number;
}

type FormFields = z.infer<typeof YearlyGroupSchema.addOrUpdate>;
interface AddMasterYearlyGroupProps {
    onSuccess?: () => void;
}
export default function AddMasterYearlyGroup({ onSuccess }: AddMasterYearlyGroupProps) {
    const [search, setSearch] = useState('');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const { data: academicYearOptions } = useAcademicYearDropdown();
    const { data: groupData, refetch: refetchGroups } = useMasterGroupListDropDown();
    const { refetchAll } = useMasterFeeYearlyGroup();
    const { refetchAll: refetchCategory } = useMasterGetYearlyCategory();

    useEffect(() => {
        refetchGroups();
    }, [refetchGroups]);

    const feeGroups: FeeGroup[] =
        groupData?.success && Array.isArray(groupData.data)
            ? groupData.data.map((group) => ({
                  fmgg_Id: Number(group.fmG_Id),
                  fmgg_GroupName: String(group.fmG_GroupName ?? '')
              }))
            : [];

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        mode: 'onChange',
        resolver: zodResolver(YearlyGroupSchema.addOrUpdate),
        defaultValues: {
            academicYear: '',
            rebateApplicable: false,
            rebateType: undefined,
            rebateValue: 0,
            feeGroupIds: []
        }
    });

    const rebateApplicable = watch('rebateApplicable');
    const rebateType = watch('rebateType');

    const selectedGroupIds = watch('feeGroupIds') || [];

    // Get filtered groups based on search
    const filteredGroups = feeGroups.filter((fg) => fg.fmgg_GroupName.toLowerCase().includes(search.toLowerCase().trim()));

    // Check if all filtered groups are selected
    const allFilteredSelected = filteredGroups.length > 0 && filteredGroups.every((group) => selectedGroupIds.includes(group.fmgg_Id));

    const onSubmit = async (data: FormFields) => {
        const selectedAcademicYear = academicYearOptions?.data?.find((year) => year && year.asmaY_Id.toString() === data.academicYear);

        if (!selectedAcademicYear) {
            toast.error('Please select a valid Academic Year');
            return;
        }

        const asmaY_Id = Number(selectedAcademicYear.asmaY_Id);
        if (Number.isNaN(asmaY_Id)) {
            toast.error('Invalid Academic Year value');
            return;
        }

        const payload: Payload = {
            // mI_Id: 30,
            fyG_Id: 0,
            // user_id: 21602,
            asmaY_Id,
            grouplist: data.feeGroupIds || [],
            fyG_RebateTypeFlg: data.rebateApplicable && data.rebateType ? data.rebateType : '',
            fyG_RebateApplicableFlg: data.rebateApplicable,
            fyG_PartialRebateAmtOrPercentageValue: data.rebateApplicable && data.rebateValue ? Number(data.rebateValue) : 0
        };

        try {
            const response = await addOrUpdateMasterGroupYearlyCategory(payload);
            if (response.success) {
                toast.success(response.message || 'Form submitted successfully!');
                try {
                    onSuccess?.();
                } catch (_e) {}
                try {
                    if (typeof refetchCategory === 'function') {
                        await refetchCategory();
                    } else if (typeof refetchAll === 'function') {
                        // fallback to groups refetch if category hook isn't available
                        await refetchAll();
                    } else {
                        console.warn('Neither refetchCategory nor refetchAll are available');
                    }
                } catch (e) {
                    console.warn('Failed to refetch after create:', e);
                }
                reset();
            } else {
                toast.error(response.message || 'Failed to submit form');
            }
        } catch (error) {
            toast.error('An error occurred while submitting the form');
            console.error('Submission error:', error);
        }
    };

    const handleReset = () => reset();

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Academic Year + Fee Group Grid */}
                <div className='grid grid-cols-1 gap-6 border-b pb-4 sm:grid-cols-2'>
                    {/* Academic Year Dropdown */}
                    <Controller
                        name='academicYear'
                        control={control}
                        render={({ field }) => (
                            <div className='flex flex-col'>
                                <label htmlFor='academicYear' className='mb-1 font-medium text-gray-700 text-sm'>
                                    Academic Year <span className='text-red-500'>*</span>
                                </label>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger
                                        id='academicYear'
                                        className={cn('transition-colors', errors.academicYear ? 'border-red-500' : '')}>
                                        <SelectValue placeholder='Select Academic Year' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicYearOptions?.data && Array.isArray(academicYearOptions.data) ? (
                                            academicYearOptions.data.map((year) => (
                                                <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                                    {year.asmaY_Year}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className='px-2 py-1 text-gray-500 text-sm'>No academic years available</div>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.academicYear && <FormError>{errors.academicYear.message}</FormError>}
                            </div>
                        )}
                    />
                    {/* Fee Group Multi-select Dropdown */}
                    {/* <Controller
                        name='feeGroupIds'
                        control={control}
                        render={({ field }) => (
                            <div className='flex flex-col'>
                                <label htmlFor='feeGroupsTrigger' className='mb-1 font-medium text-gray-700 text-sm'>
                                    Fee Groups <span className='text-red-500'>*</span>
                                </label>

                                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id='feeGroupsTrigger'
                                            type='button'
                                            variant='outline'
                                            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                                            className={cn(
                                                'h-10 w-full select-none justify-between rounded-md border font-normal text-sm transition-none',
                                                'bg-white',
                                                errors.feeGroupIds ? 'border-red-500' : 'border-gray-300',
                                                '!focus:border-gray-300 !hover:border-gray-300 !hover:bg-white !focus:ring-0 active:scale-100'
                                            )}>
                                            <span className='truncate text-gray-700'>
                                                {field.value?.length ? `${field.value.length} selected` : 'Select Fee Groups'}
                                            </span>
                                            <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent
                                        className='w-[var(--radix-popover-trigger-width)] rounded-md border border-gray-200 bg-white p-2 shadow-lg sm:w-[300px]'
                                        align='start'
                                        sideOffset={6}>
                                        
                                        <div className='relative mb-2'>
                                            <Search className='absolute top-2.5 left-2 h-4 w-4 text-gray-400' />
                                            <Input
                                                placeholder='Search groups...'
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className='h-8 border-gray-300 pl-8 text-sm focus:border-gray-400 focus:ring-0'
                                            />
                                        </div>

                                        
                                        <div className='max-h-[260px] overflow-y-auto rounded-md border border-gray-200 p-1'>
                                          
                                            <div
                                                onClick={() => {
                                                    const allIds = feeGroups.map((f) => f.fmgg_Id);
                                                    const allSelected = field.value?.length === allIds.length;
                                                    field.onChange(allSelected ? [] : allIds);
                                                }}
                                                className={cn(
                                                    'mb-2 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 font-medium text-sm',
                                                    field.value?.length === feeGroups.length
                                                        ? 'bg-gray-100 text-gray-800'
                                                        : 'hover:bg-gray-50'
                                                )}>
                                                {field.value?.length === feeGroups.length ? (
                                                    <CheckSquare className='h-4 w-4 text-primary' />
                                                ) : (
                                                    <Square className='h-4 w-4 text-gray-400' />
                                                )}
                                                <span>Select All</span>
                                            </div>

                                            
                                            {feeGroups
                                                .filter((fg) => fg.fmgg_GroupName.toLowerCase().includes(search.toLowerCase().trim()))
                                                .map((fg) => {
                                                    const selected = field.value?.includes(fg.fmgg_Id);
                                                    return (
                                                        <div
                                                            key={fg.fmgg_Id}
                                                            onClick={() => {
                                                                field.onChange(
                                                                    selected
                                                                        ? field.value.filter((v) => v !== fg.fmgg_Id)
                                                                        : [...(field.value || []), fg.fmgg_Id]
                                                                );
                                                            }}
                                                            className={cn(
                                                                'mb-1 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm',
                                                                selected ? 'bg-gray-100 text-gray-800' : 'hover:bg-gray-50'
                                                            )}>
                                                            {selected ? (
                                                                <CheckSquare className='h-4 w-4 text-primary' />
                                                            ) : (
                                                                <Square className='h-4 w-4 text-gray-400' />
                                                            )}
                                                            <span>{fg.fmgg_GroupName}</span>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                {errors.feeGroupIds && <FormError>{errors.feeGroupIds.message}</FormError>}
                            </div>
                        )}
                    /> */}
                    {/* Fee Group Multi-select Dropdown */}
                    <Controller
                        name='feeGroupIds'
                        control={control}
                        render={({ field }) => (
                            <div className='flex flex-col'>
                                <label htmlFor='feeGroupsTrigger' className='mb-1 font-medium text-gray-700 text-sm'>
                                    Fee Groups <span className='text-red-500'>*</span>
                                </label>

                                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id='feeGroupsTrigger'
                                            type='button'
                                            variant='outline'
                                            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                                            className={cn(
                                                'h-10 w-full select-none justify-between rounded-md border font-normal text-sm transition-none',
                                                'bg-white',
                                                errors.feeGroupIds ? 'border-red-500' : 'border-gray-300',
                                                '!focus:border-gray-300 !hover:border-gray-300 !hover:bg-white !focus:ring-0 active:scale-100'
                                            )}>
                                            <span className='truncate text-gray-700'>
                                                {/* {field.value?.length ? `${field.value.length} selected` : 'Select Fee Groups'} */}
                                                Select Fee Groups
                                            </span>
                                            <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent
                                        className='w-[var(--radix-popover-trigger-width)] rounded-md border border-gray-200 bg-white p-2 shadow-lg sm:w-[300px]'
                                        align='start'
                                        sideOffset={6}>
                                        {/* Search bar */}
                                        <div className='relative mb-2'>
                                            <Search className='absolute top-2.5 left-2 h-4 w-4 text-gray-400' />
                                            <Input
                                                placeholder='Search groups...'
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className='h-8 border-gray-300 pl-8 text-sm focus:border-gray-400 focus:ring-0'
                                            />
                                        </div>

                                        {/* Fee Group list */}
                                        <div className='max-h-[260px] overflow-y-auto rounded-md border border-gray-200 p-1'>
                                            {/* Select All - only selects filtered items */}
                                            <div
                                                onClick={() => {
                                                    const filteredIds = filteredGroups.map((fg) => fg.fmgg_Id);
                                                    if (allFilteredSelected) {
                                                        // Deselect only filtered items
                                                        const newSelected = selectedGroupIds.filter((id) => !filteredIds.includes(id));
                                                        field.onChange(newSelected);
                                                    } else {
                                                        // Select only filtered items (add to existing selection)
                                                        const newSelected = [...selectedGroupIds];
                                                        filteredIds.forEach((id) => {
                                                            if (!newSelected.includes(id)) {
                                                                newSelected.push(id);
                                                            }
                                                        });
                                                        field.onChange(newSelected);
                                                    }
                                                }}
                                                className={cn(
                                                    'mb-2 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 font-medium text-sm',
                                                    allFilteredSelected ? 'bg-gray-100 text-gray-800' : 'hover:bg-gray-50'
                                                )}>
                                                {allFilteredSelected ? (
                                                    <CheckSquare className='h-4 w-4 text-primary' />
                                                ) : (
                                                    <Square className='h-4 w-4 text-gray-400' />
                                                )}
                                                <span>
                                                    {/* {allFilteredSelected ? 'Deselect All' : 'Select All'} 
                                                    {search && ` (${filteredGroups.length} filtered)`} */}
                                                    Select All
                                                </span>
                                            </div>

                                            {/* Individual Fee Groups - only show filtered */}
                                            {filteredGroups.length > 0 ? (
                                                filteredGroups.map((fg) => {
                                                    const selected = selectedGroupIds.includes(fg.fmgg_Id);
                                                    return (
                                                        <div
                                                            key={fg.fmgg_Id}
                                                            onClick={() => {
                                                                const newValue = selected
                                                                    ? selectedGroupIds.filter((v) => v !== fg.fmgg_Id)
                                                                    : [...selectedGroupIds, fg.fmgg_Id];
                                                                field.onChange(newValue);
                                                            }}
                                                            className={cn(
                                                                'mb-1 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm',
                                                                selected ? 'bg-gray-100 text-gray-800' : 'hover:bg-gray-50'
                                                            )}>
                                                            {selected ? (
                                                                <CheckSquare className='h-4 w-4 text-primary' />
                                                            ) : (
                                                                <Square className='h-4 w-4 text-gray-400' />
                                                            )}
                                                            <span>{fg.fmgg_GroupName}</span>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className='px-2 py-4 text-center text-gray-500 text-sm'>
                                                    No groups found for "{search}"
                                                </div>
                                            )}
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                {errors.feeGroupIds && <FormError>{errors.feeGroupIds.message}</FormError>}
                            </div>
                        )}
                    />
                </div>

                {/* Rebate Applicable Checkbox */}
                <Controller
                    name='rebateApplicable'
                    control={control}
                    render={({ field }) => (
                        <div className='flex items-center gap-2 border-b pb-3'>
                            <input
                                id='rebateApplicable'
                                type='checkbox'
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                className='h-4 w-4 accent-primary'
                            />
                            <label htmlFor='rebateApplicable' className='cursor-pointer font-medium text-gray-700 text-sm'>
                                Rebate Applicable
                            </label>
                        </div>
                    )}
                />

                {/* Rebate Type + Value */}
                {rebateApplicable && (
                    <div className='grid grid-cols-1 gap-6 border-b pb-4 sm:grid-cols-2'>
                        {/* Rebate Type Dropdown */}
                        <Controller
                            name='rebateType'
                            control={control}
                            render={({ field }) => (
                                <div className='flex flex-col'>
                                    <label htmlFor='rebateType' className='mb-1 font-medium text-gray-700 text-sm'>
                                        Rebate Type <span className='text-red-500'>*</span>
                                    </label>
                                    <Select onValueChange={(val) => field.onChange(val)} value={field.value ?? undefined}>
                                        <SelectTrigger
                                            id='rebateType'
                                            className={cn('transition-colors', errors.rebateType ? 'border-red-500' : '')}>
                                            <SelectValue placeholder='Select Type' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='Percentage'>Percentage</SelectItem>
                                            <SelectItem value='Amount'>Amount</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.rebateType && <FormError>{errors.rebateType.message}</FormError>}
                                </div>
                            )}
                        />

                        {/* Rebate Value */}
                        <Controller
                            name='rebateValue'
                            control={control}
                            render={({ field }) => (
                                <div className='flex flex-col'>
                                    <label htmlFor='rebateValue' className='mb-1 font-medium text-gray-700 text-sm'>
                                        {rebateType === 'Percentage' ? 'Percentage (%)' : 'Amount'} <span className='text-red-500'>*</span>
                                    </label>
                                    <Input
                                        id='rebateValue'
                                        type='text'
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                field.onChange(value);
                                            }
                                        }}
                                        placeholder={rebateType === 'Percentage' ? 'Enter percentage' : 'Enter amount'}
                                        className={cn('transition-colors', errors.rebateValue ? 'border-red-500' : '')}
                                    />
                                    {errors.rebateValue && <FormError>{errors.rebateValue.message}</FormError>}
                                </div>
                            )}
                        />
                    </div>
                )}

                {/* Buttons */}
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting || !academicYearOptions?.data}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'>
                        <Save className='mr-2 h-4 w-4' />
                        Save Yearly Groups
                    </Button>
                </div>
            </form>
        </div>
    );
}
