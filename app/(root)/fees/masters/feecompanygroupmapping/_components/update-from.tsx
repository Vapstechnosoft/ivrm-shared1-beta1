'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, ChevronsUpDown, Save, Search, Square } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import {
    feeCompanyFeeGroupMappingCompanyDropdown,
    feeCompanyFeeGroupMappingGroupDropdown,
    useFeeCompanyGroupMapping
} from '@/hooks/fees/useMasters';

import { feeCompanyGroupMappingSchema } from '@/schemas/fees/masters';

import { InputText } from '@/components/ui/extension/input-text';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addOrUpdateCompanyFeeGroupMapping } from '@/server/fees/masters/fee_companygroupmapping';
import type { IfeeCompanyGroupMappingList } from '@/types/fees/masters';

type FormFields = z.infer<typeof feeCompanyGroupMappingSchema.addOrUpdate>;

interface UpdateFeeCompanyGroupMappingFormProps {
    onSuccess?: () => void;
    termname?: string;
    selectedRow: IfeeCompanyGroupMappingList;
}

export default function UpdateFeeCompanyGroupMappingForm({
    onSuccess,
    termname = '',
    selectedRow: row
}: UpdateFeeCompanyGroupMappingFormProps) {
    const { refetchAll } = useFeeCompanyGroupMapping();

    console.log('Selected Row Data in Update Form:', row);

    // For selected groupss in multiselect
    const [selectedGroupsItems, setselectedGroupsItems] = useState<{ fmG_Id: string }[]>([]);

    // Dropdown data

    const { data: groupss, isLoading: groupssLoading, refetch: refetchgroupss } = feeCompanyFeeGroupMappingGroupDropdown();

    const {
        data: mastercompanys,
        isLoading: mastercompanysLoading,
        error: mastercompanysError,
        refetchAll: refetchMasterCompanys
    } = feeCompanyFeeGroupMappingCompanyDropdown();

    const [isgroupsPopoverOpen, setIsgroupsPopoverOpen] = useState(false);
    const [search, setSearch] = useState('');

    console.log('Selected Row Data in Update Form:', row);

    // Form setup
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        register,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feeCompanyGroupMappingSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            ftmcoM_Id: row.ftmcoM_Id ? Number(row.ftmcoM_Id) : undefined,
            groupids: selectedGroupsItems.map((h) => h.fmG_Id) as [string, ...string[]]
        }
    });

    // Pre-fill form for edit mode
    useEffect(() => {
        if (!row || !groupss?.data) return;

        const preselectedgroupss = Array.isArray(row.fmgG_Id)
            ? row.fmgG_Id.map((id) => ({ fmG_Id: id.toString() }))
            : row.fmgG_Id
              ? [{ fmG_Id: row.fmgG_Id.toString() }]
              : [];

        setselectedGroupsItems(preselectedgroupss);

        reset({
            //ftmcoM_Id: row.ftmcoM_Id,
            ftmcoM_Id: row.ftmcoM_Id ? Number(row.ftmcoM_Id) : undefined,
            groupids: preselectedgroupss.map((h) => h.fmG_Id) as [string, ...string[]]
        });
    }, [row, groupss?.data, reset]);

    // When groupss list updates, ensure the selected values persist
    useEffect(() => {
        if (groupss?.data?.length && selectedGroupsItems.length > 0) {
            setValue('groupids', selectedGroupsItems.map((h) => h.fmG_Id) as [string, ...string[]]);
        }
    }, [groupss?.data, selectedGroupsItems, setValue]);

    function OnReset() {
        reset();
        refetchAll();
        refetchgroupss();
        setselectedGroupsItems([]);
    }

    const initialDataRef = useRef<{
        ftmcoM_Id: string;
        groupss: string[];
    } | null>(null);

    useEffect(() => {
        if (!row || !groupss?.data) return;

        const preselectedgroupss = Array.isArray(row.fmgG_Id)
            ? row.fmgG_Id.map((id) => id.toString())
            : row.fmgG_Id
              ? [row.fmgG_Id.toString()]
              : [];

        setselectedGroupsItems(preselectedgroupss.map((id) => ({ fmG_Id: id })));

        reset({
            ftmcoM_Id: row.ftmcoM_Id ? Number(row.ftmcoM_Id) : undefined,
            groupids: preselectedgroupss as [string, ...string[]]
        });

        // ✅ Store initial values only once
        initialDataRef.current = {
            ftmcoM_Id: String(row.ftmcoM_Id),
            groupss: preselectedgroupss
        };
    }, [row, groupss?.data, reset]);

    // Handle submit
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const initial = initialDataRef.current;

            // if (initial) {
            //     const currentName = data.fmsfH_Name.trim();
            //     const currentgroupss = selectedGroupsItems.map((h) => h.fmG_Id);

            //     const isNameChanged = currentName !== initial.fmsfH_Name.trim();
            //     const isgroupssChanged = JSON.stringify(currentgroupss.sort()) !== JSON.stringify(initial.groupss.sort());

            //     if (!isNameChanged && !isgroupssChanged) {
            //         toast.info('No changes were made to update');
            //         return;
            //     }
            // }

            //   const { fmsfH_Name } = data;
            const payload = {
                ffgcmA_Id: row.ffgcmA_Id,
                ftmcoM_Id: Number(data.ftmcoM_Id),

                tempararyArrayList: selectedGroupsItems.map((item) => ({
                    fmG_Id: Number(item.fmG_Id)
                }))
            };
            const js = JSON.stringify(payload);

            console.log('Payload for Special Fee groups Submission:', js);
            const response = await addOrUpdateCompanyFeeGroupMapping(payload);

            if (response.success) {
                toast.success(response.message);
                onSuccess?.();
                refetchAll();
            } else {
                toast.error(response.message);
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    // Handle multi-select changes
    const handlegroupsSelection = (selectedValues: string[]) => {
        setselectedGroupsItems(
            selectedValues.map((value) => ({
                fmG_Id: value.toString()
            }))
        );
    };

    return (
        <div className={`${termname}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='flex flex-col items-center space-y-4'>
                        <div className='group flex items-center justify-center gap-1.5 space-x-3'>
                            <Label htmlFor='fmcC_Id'>
                                Company Name:<span className='text-red-500'>*</span>
                            </Label>
                            <div className='w-96'>
                                <Controller
                                    name='ftmcoM_Id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            disabled={true}
                                            value={field.value != null ? String(field.value) : undefined}
                                            onValueChange={(v) => field.onChange(Number(v))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Company' />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {mastercompanysLoading ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading Company...
                                                    </SelectItem>
                                                ) : (
                                                    mastercompanys?.data?.map((item) =>
                                                        item?.ftmcoM_Id != null ? (
                                                            <SelectItem key={item.ftmcoM_Id} value={String(item.ftmcoM_Id)}>
                                                                {item.ftmcoM_CompanyName ?? 'Unnamed Company'}
                                                            </SelectItem>
                                                        ) : null
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                {errors.ftmcoM_Id && <FormError>{errors.ftmcoM_Id.message}</FormError>}
                            </div>
                        </div>

                        <div className='group flex items-center gap-3'>
                            <Label htmlFor='groupids' className='whitespace-nowrap'>
                                Group:<span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <div className='ml-16 w-96'>
                                <Controller
                                    name='groupids'
                                    control={control}
                                    render={({ field }) => {
                                        const selectedValue = field.value?.[0] || ''; // Only 1 selected (single-select)
                                        const filteredgroupss =
                                            groupss?.data?.filter((h) => h.fmG_GroupName?.toLowerCase().includes(search.toLowerCase())) ||
                                            [];
                                        return (
                                            <Popover open={isgroupsPopoverOpen} onOpenChange={setIsgroupsPopoverOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        type='button'
                                                        variant='outline'
                                                        onClick={() => setIsgroupsPopoverOpen(!isgroupsPopoverOpen)}
                                                        className={cn(
                                                            'w-full justify-between',
                                                            errors.groupids ? 'border-red-500' : 'border-primary/30'
                                                        )}>
                                                        <span className='truncate'>
                                                            {groupss?.data?.find((h) => h.fmG_Id.toString() === selectedValue)
                                                                ?.fmG_GroupName || 'Select Fee groups'}
                                                        </span>
                                                        <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent className='w-[260px] p-2 sm:w-[300px]'>
                                                    {/* Search */}
                                                    <div className='relative mb-2'>
                                                        <Search className='absolute top-2.5 left-2 h-4 w-4 text-gray-400' />
                                                        <InputText
                                                            placeholder='Search groupss...'
                                                            value={search}
                                                            onChange={(e) => setSearch(e.target.value)}
                                                            className='h-8 pl-8 text-sm'
                                                        />
                                                    </div>

                                                    {/* List */}
                                                    <div className='max-h-[260px] overflow-y-auto rounded-md border p-1'>
                                                        {groupss?.data?.length === 0 ? (
                                                            <div className='py-4 text-center text-gray-500 text-sm'>No groupss found</div>
                                                        ) : filteredgroupss.length === 0 ? (
                                                            <div className='py-4 text-center text-gray-500 text-sm'>
                                                                No groupss match your search
                                                            </div>
                                                        ) : (
                                                            filteredgroupss.map((h) => {
                                                                const isSelected = selectedValue === h.fmG_Id.toString();

                                                                return (
                                                                    <div
                                                                        key={h.fmG_Id}
                                                                        onClick={() => {
                                                                            field.onChange([h.fmG_Id.toString()]);
                                                                            setselectedGroupsItems([{ fmG_Id: h.fmG_Id.toString() }]);
                                                                        }}
                                                                        className={cn(
                                                                            'mb-1 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-sm',
                                                                            isSelected
                                                                                ? 'border-primary bg-primary/5'
                                                                                : 'border-gray-200 hover:border-primary/40'
                                                                        )}>
                                                                        {isSelected ? (
                                                                            <CheckSquare className='h-4 w-4 text-primary' />
                                                                        ) : (
                                                                            <Square className='h-4 w-4 text-gray-400' />
                                                                        )}
                                                                        <span>{h.fmG_GroupName}</span>
                                                                    </div>
                                                                );
                                                            })
                                                        )}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        );
                                    }}
                                />

                                {errors.groupids && <FormError>{errors.groupids.message}</FormError>}
                            </div>
                        </div>
                    </div>

                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                {/* ACTION BUTTONS */}
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-center'>
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
            </form>
        </div>
    );
}
