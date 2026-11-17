'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { masterGroupsGroupingSchema } from '@/schemas/fees/masters';
import { addOrUpdateGroupGrouping } from '@/server/fees/masters/groupsgrouping';
import type { IMasterGroupsGrouping } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, ChevronsUpDown, Save, Search, Square } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

interface FeeGroup {
    fmG_Id: number;
    feeGroups: string;
}

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

interface UpdateMasterFeeGroupGroupingFormProps {
    onSuccess?: () => void;
    selectedRow: IMasterGroupsGrouping;
    feeGroups: FeeGroup[];
    className?: string;
}

export default function UpdateMasterFeeGroupGroupingForm({
    onSuccess,
    selectedRow,
    feeGroups = [],
    className = ''
}: UpdateMasterFeeGroupGroupingFormProps) {
    const [search, setSearch] = useState('');

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
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

    const selectedIds = watch('selectedFeeGroupIds') || [];

    useEffect(() => {
        if (selectedRow) {
            const selectedIds = selectedRow.selectedFeeGroups?.map((group: { fmG_Id: any }) => group.fmG_Id) || [];

            const initialData = {
                fmgG_GroupName: selectedRow.fmgG_GroupName || '',
                fmgG_GroupCode: selectedRow.fmgG_GroupCode || '',
                selectedFeeGroupIds: selectedIds
            };
            reset(initialData);
            setValue('selectedFeeGroupIds', selectedIds);
        }
    }, [selectedRow, reset, setValue]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload: SaveGroupGroupingPayload = {
                // mI_Id: 30,
                fmgG_Id: selectedRow.fmgG_Id,
                fmgG_GroupName: data.fmgG_GroupName?.trim() || '',
                fmgG_GroupCode: data.fmgG_GroupCode?.trim() || '',
                selectedFeeGroupIds: data.selectedFeeGroupIds || []
            };

            const response = await addOrUpdateGroupGrouping(payload);

            if (response?.success) {
                toast.success(response.message || 'Group Grouping updated successfully');
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to update Group Grouping');
            }
        } catch (error: any) {
            console.error('Update error:', error);
            toast.error(error?.message || 'An error occurred while updating');
        }
    };

    const handleReset = () => {
        const selectedIds = selectedRow.selectedFeeGroups?.map((group: { fmG_Id: any }) => group.fmG_Id) || [];
        reset({
            fmgG_GroupName: selectedRow.fmgG_GroupName || '',
            fmgG_GroupCode: selectedRow.fmgG_GroupCode || '',
            selectedFeeGroupIds: selectedIds
        });
    };

    const filteredFeeGroups = feeGroups.filter((fg) => fg.feeGroups.toLowerCase().includes(search.toLowerCase().trim()));

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
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    error={errors.fmgG_GroupName?.message}
                                    className='transition-colors focus:ring-2 focus:ring-primary/20'
                                />
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
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    error={errors.fmgG_GroupCode?.message}
                                    className='transition-colors focus:ring-2 focus:ring-primary/20'
                                />
                            )}
                        />
                    </div>

                    {/* Multi-select Dropdown */}
                    <Controller
                        name='selectedFeeGroupIds'
                        control={control}
                        render={() => (
                            <div className='flex w-full flex-col sm:w-1/2'>
                                <label htmlFor='fee-groups' className='mb-1 font-medium text-sm'>
                                    Fees Groups <span className='text-red-500'>*</span>
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button type='button' variant='outline' className='w-full justify-between border-primary/30'>
                                            {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Select Fees Groups'}
                                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className='w-[260px] p-2 sm:w-[300px]'>
                                        {/* Search */}
                                        <div className='relative mb-2'>
                                            <Search className='absolute top-2.5 left-2 h-4 w-4 text-gray-400' />
                                            <input
                                                placeholder='Search...'
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className='h-8 w-full rounded-md border border-input bg-background pr-3 pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                                            />
                                        </div>

                                        {/* Scrollable List */}
                                        <div className='max-h-[260px] overflow-y-auto rounded-md border p-1'>
                                            {filteredFeeGroups.map((fg) => {
                                                const isSelected = selectedIds.includes(fg.fmG_Id);

                                                return (
                                                    <div
                                                        key={fg.fmG_Id}
                                                        onClick={() => {
                                                            // FREE TOGGLE: add or remove the ID
                                                            const newSelected = isSelected
                                                                ? selectedIds.filter((id) => id !== fg.fmG_Id)
                                                                : [...selectedIds, fg.fmG_Id];

                                                            setValue('selectedFeeGroupIds', newSelected);
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
                                                        <span>{fg.feeGroups}</span>
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

                    {/* Action Buttons */}
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
                            loadingText='Updating...'>
                            <Save className='mr-2 h-4 w-4' />
                            Update Group Grouping
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
