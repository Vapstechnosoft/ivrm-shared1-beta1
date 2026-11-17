'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGroupGroupingGroupDropdowndta } from '@/hooks/fees/useMasters';
import { cn } from '@/lib/utils';
import { masterGroupsGroupingSchema } from '@/schemas/fees/masters';
import { addOrUpdateGroupGrouping } from '@/server/fees/masters/groupsgrouping';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, ChevronsUpDown, Save, Search, Square } from 'lucide-react';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

// API Response Interface
interface FeeGroup {
    fmG_Id: number;
    feeGroups: string;
}

// Save Payload Interface
interface SaveGroupGroupingPayload {
    mI_Id?: number;
    fmgG_Id: number;
    fmgG_GroupName: string;
    fmgG_GroupCode: string;
    selectedFeeGroupIds: number[];
}

type FormFields = z.infer<typeof masterGroupsGroupingSchema.addOrUpdate> & {
    fmgG_GroupName?: string;
    fmgG_GroupCode?: string;
    selectedFeeGroupIds?: number[];
};

interface AddMasterGroupGroupingProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterGroupGrouping({ onSuccess, className = '' }: AddMasterGroupGroupingProps) {
    const [search, setSearch] = useState('');

    const { data: response, isLoading } = useGroupGroupingGroupDropdowndta() as {
        data: { success: boolean; message: string; data: FeeGroup[] } | undefined;
        isLoading: boolean;
    };

    console.log('response', response);

    // Extract feeGroups from nested response and ensure it's always an array
    const feeGroups = Array.isArray(response?.data) ? response.data : [];

    const {
        control,
        handleSubmit,
        reset,
        register,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterGroupsGroupingSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            fmgG_GroupName: '',
            fmgG_GroupCode: '',
            selectedFeeGroupIds: []
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload: SaveGroupGroupingPayload = {
                // mI_Id: 30, // Hardcoded
                fmgG_Id: 0, // Always 0 for new entries
                fmgG_GroupName: data.fmgG_GroupName || '',
                fmgG_GroupCode: data.fmgG_GroupCode || '',
                selectedFeeGroupIds: data.selectedFeeGroupIds || [] // Dropdown selected IDs
            };

            const response = await addOrUpdateGroupGrouping(payload);

            if (response?.success) {
                toast.success(response.message || 'Group Grouping saved successfully');
                reset();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to save Group Grouping');
            }
        } catch (error: any) {
            console.error('Save error:', error);
            toast.error(error?.message || 'An error occurred while saving');
        }
    };

    const handleReset = () => reset();

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                        {/* Fee Group Name */}
                        <Controller
                            name='fmgG_GroupName'
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    label='Fees Group Name'
                                    required
                                    id='fmgG_GroupName'
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.fmgG_GroupName?.message}
                                    className='transition-colors focus:ring-2 focus:ring-primary/20'
                                />

                                // <InputText
                                //     label='Fees Group Name'
                                //     required
                                //     id='fmgG_GroupName'
                                //     {...register('fmgG_GroupName', {
                                //         required: 'Fee Group is required'
                                //     })}
                                //     onKeyDown={(e) => {
                                //         const allowed = /^[A-Za-z\s]$/;

                                //         // Allow navigation keys
                                //         if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                                //             return;
                                //         }

                                //         // Block characters that are not letters/spaces
                                //         if (!allowed.test(e.key)) {
                                //             e.preventDefault();
                                //         }
                                //     }}
                                //     error={errors.fmgG_GroupName?.message}
                                //     className='transition-colors focus:ring-2 focus:ring-primary/20'
                                // />
                            )}
                        />

                        {/* Groups Code */}
                        <Controller
                            name='fmgG_GroupCode'
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    label='Groups Code'
                                    required
                                    id='fmgG_GroupCode'
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.fmgG_GroupCode?.message}
                                    className='transition-colors focus:ring-2 focus:ring-primary/20'
                                />
                                // <InputText
                                //     label='Groups Code'
                                //     required
                                //     id='fmgG_GroupCode'
                                //     {...register('fmgG_GroupCode', {
                                //         required: 'Fee Group is required'
                                //     })}
                                //     onKeyDown={(e) => {
                                //         const allowed = /^[A-Za-z\s]$/;

                                //         // Allow navigation keys
                                //         if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                                //             return;
                                //         }

                                //         // Block characters that are not letters/spaces
                                //         if (!allowed.test(e.key)) {
                                //             e.preventDefault();
                                //         }
                                //     }}
                                //     error={errors.fmgG_GroupCode?.message}
                                //     className='transition-colors focus:ring-2 focus:ring-primary/20'
                                // />
                            )}
                        />
                    </div>

                    {/* Fee Group Multi-select Dropdown */}
                    <Controller
                        name='selectedFeeGroupIds'
                        control={control}
                        render={({ field }) => (
                            <div className='flex w-full flex-col sm:w-1/2'>
                                <span className='mb-1 flex items-center font-medium text-sm'>
                                    Fees Groups <span className='ml-1 text-red-500'>*</span>
                                </span>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id='fee-groups'
                                            type='button'
                                            variant='outline'
                                            disabled={isLoading}
                                            className='w-full justify-between border-primary/30'>
                                            {field.value?.length
                                                ? `${field.value.length} selected`
                                                : isLoading
                                                  ? 'Loading...'
                                                  : 'Select Fees Groups'}
                                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className='w-[260px] p-2 sm:w-[300px]'>
                                        {/* Search Input */}
                                        <div className='relative mb-2'>
                                            <Search className='absolute top-2.5 left-2 h-4 w-4 text-gray-400' />
                                            <Input
                                                placeholder='search here...'
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className='h-8 pl-8 text-sm'
                                            />
                                        </div>

                                        {/* Scrollable list with "Select All" option */}
                                        <div className='max-h-[260px] overflow-y-auto rounded-md border p-1'>
                                            {/* Select All option */}
                                            <div
                                                onClick={() => {
                                                    const allIds = feeGroups.map((fg) => fg.fmG_Id);
                                                    const isAllSelected = field.value?.length === allIds.length;
                                                    field.onChange(isAllSelected ? [] : allIds);
                                                }}
                                                className={cn(
                                                    'mb-2 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 font-medium text-sm transition-all',
                                                    field.value?.length === feeGroups.length
                                                        ? 'border-primary bg-primary/5 text-primary'
                                                        : 'border-gray-200 hover:border-primary/40'
                                                )}>
                                                {field.value?.length === feeGroups.length ? (
                                                    <CheckSquare className='h-4 w-4 text-primary' />
                                                ) : (
                                                    <Square className='h-4 w-4 text-gray-400' />
                                                )}
                                                <span>Select All</span>
                                            </div>

                                            {/* Individual Fee Group checkboxes */}
                                            {feeGroups
                                                .filter((fg) => fg.feeGroups.toLowerCase().includes(search.toLowerCase().trim()))
                                                .map((fg) => {
                                                    const id = fg.fmG_Id;
                                                    const name = fg.feeGroups;
                                                    const isSelected = field.value?.includes(id);
                                                    return (
                                                        <div
                                                            key={id}
                                                            onClick={() => {
                                                                if (isSelected) {
                                                                    field.onChange(field.value?.filter((v) => v !== id));
                                                                } else {
                                                                    field.onChange([...(field.value || []), id]);
                                                                }
                                                            }}
                                                            className={cn(
                                                                'mb-1 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-sm transition-all',
                                                                isSelected
                                                                    ? 'border-primary bg-primary/5'
                                                                    : 'border-gray-200 hover:border-primary/40'
                                                            )}>
                                                            {isSelected ? (
                                                                <CheckSquare className='h-4 w-4 text-primary' />
                                                            ) : (
                                                                <Square className='h-4 w-4 text-gray-400' />
                                                            )}
                                                            <span>{name}</span>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                {errors.selectedFeeGroupIds && <FormError>{errors.selectedFeeGroupIds.message}</FormError>}
                            </div>
                        )}
                    />

                    {errors.root && <FormError>{errors.root.message}</FormError>}

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
                            disabled={isSubmitting}
                            className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                            isLoading={isSubmitting}
                            loadingText='Saving...'>
                            <div className='flex items-center'>
                                <Save className='mr-2 h-4 w-4' />
                                Save Group Grouping
                            </div>
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
