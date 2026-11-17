'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, ChevronsUpDown, Save, Search, Square } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { feeSpecialHeadDROPDOWN, useSpecialFeeHead } from '@/hooks/fees/useMasters';

import { specialFeeHeadSchema } from '@/schemas/fees/masters';

import { InputText } from '@/components/ui/extension/input-text';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { addOrUpdateSpecialfeehead } from '@/server/fees/masters/specialfeehead';
import type { IspecialFeeHeadList } from '@/types/fees/masters';

type FormFields = z.infer<typeof specialFeeHeadSchema.addOrUpdate>;

interface UpdateSpecialFeeHeadFormProps {
    onSuccess?: () => void;
    termname?: string;
    selectedRow: IspecialFeeHeadList;
}

export default function UpdateSpecalFeeHeadForm({ onSuccess, termname = '', selectedRow: row }: UpdateSpecialFeeHeadFormProps) {
    const { refetchAll } = useSpecialFeeHead();

    // For selected heads in multiselect
    const [selectedHeadsItems, setSelectedHeadsItems] = useState<{ fmH_Id: string }[]>([]);

    // Dropdown data

    const { data: heads, isLoading: headsLoading, refetch: refetchHeads } = feeSpecialHeadDROPDOWN();

    const [isHeadPopoverOpen, setIsHeadPopoverOpen] = useState(false);
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
        resolver: zodResolver(specialFeeHeadSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            fmsfH_Name: row?.fmsfH_Name || ''
            // heads: selectedHeadsItems.map((h) => h.fmH_Id) as [string, ...string[]],
        }
    });

    // Pre-fill form for edit mode
    useEffect(() => {
        if (!row || !heads?.data) return;

        const preselectedHeads = Array.isArray(row.fmH_Id)
            ? row.fmH_Id.map((id) => ({ fmH_Id: id.toString() }))
            : row.fmH_Id
              ? [{ fmH_Id: row.fmH_Id.toString() }]
              : [];

        setSelectedHeadsItems(preselectedHeads);

        reset({
            fmsfH_Name: row.fmsfH_Name ?? '',
            heads: preselectedHeads.map((h) => h.fmH_Id) as [string, ...string[]]
        });
    }, [row, heads?.data, reset]);

    // When heads list updates, ensure the selected values persist
    useEffect(() => {
        if (heads?.data?.length && selectedHeadsItems.length > 0) {
            setValue('heads', selectedHeadsItems.map((h) => h.fmH_Id) as [string, ...string[]]);
        }
    }, [heads?.data, selectedHeadsItems, setValue]);

    function OnReset() {
        reset();
        refetchAll();
        refetchHeads();
        setSelectedHeadsItems([]);
    }

    const initialDataRef = useRef<{
        fmsfH_Name: string;
        heads: string[];
    } | null>(null);

    useEffect(() => {
        if (!row || !heads?.data) return;

        const preselectedHeads = Array.isArray(row.fmH_Id)
            ? row.fmH_Id.map((id) => id.toString())
            : row.fmH_Id
              ? [row.fmH_Id.toString()]
              : [];

        setSelectedHeadsItems(preselectedHeads.map((id) => ({ fmH_Id: id })));

        reset({
            fmsfH_Name: row.fmsfH_Name ?? '',
            heads: preselectedHeads as [string, ...string[]]
        });

        // ✅ Store initial values only once
        initialDataRef.current = {
            fmsfH_Name: row.fmsfH_Name ?? '',
            heads: preselectedHeads
        };
    }, [row, heads?.data, reset]);

    // Handle submit
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const initial = initialDataRef.current;

            if (initial) {
                const currentName = data.fmsfH_Name.trim();
                const currentHeads = selectedHeadsItems.map((h) => h.fmH_Id);

                const isNameChanged = currentName !== initial.fmsfH_Name.trim();
                const isHeadsChanged = JSON.stringify(currentHeads.sort()) !== JSON.stringify(initial.heads.sort());

                if (!isNameChanged && !isHeadsChanged) {
                    toast.info('No changes were made to update');
                    return;
                }
            }

            const { fmsfH_Name } = data;
            const payload = {
                fmsfhfH_Id: row.fmsfhfH_Id,
                fmsfH_Name: fmsfH_Name,
                fmsfH_Id: row.fmsfH_Id,
                tempararyArrayList: selectedHeadsItems.map((item) => ({
                    fmH_ID: Number(item.fmH_Id)
                }))
            };
            const js = JSON.stringify(payload);

            console.log('Payload for Special Fee Head Submission:', js);
            const response = await addOrUpdateSpecialfeehead(payload);

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
    const handleHeadSelection = (selectedValues: string[]) => {
        setSelectedHeadsItems(
            selectedValues.map((value) => ({
                fmH_Id: value.toString()
            }))
        );
    };

    return (
        <div className={`${termname}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Term' htmlFor='fmT_Id'>
                                Special Fee Head Name <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <div className='flex-1'>
                                <InputText
                                    id='fmsfH_Name'
                                    {...register('fmsfH_Name', {
                                        required: 'Term Name is required'
                                        // validate: (value) => {
                                        //     if (!/^[a-zA-Z0-9]+$/.test(value)) {
                                        //         return 'Only letters and numbers allowed (no spaces)';
                                        //     }
                                        //     return true;
                                        // },
                                        // onChange: (e) => {
                                        //     e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                                        // }
                                    })}
                                    error={errors.fmsfH_Name?.message}
                                    className='w-full rounded-none border-0 border-gray-300 px-0 py-1 focus:border-primary focus:ring-0'
                                />
                            </div>
                        </div>

                        {/* Heads MultiSelect */}
                        <div className='flex items-center justify-center gap-3'>
                            <Label htmlFor='fmH_Ids'>
                                Fee Head<span className='text-red-500'>*</span>:
                            </Label>
                            <div className='w-96'>
                                <Controller
                                    name='heads'
                                    control={control}
                                    render={({ field }) => {
                                        const selectedValue = field.value?.[0] || ''; // Only 1 selected (single-select)
                                        const filteredHeads =
                                            heads?.data?.filter((h) => h.fmH_FeeName.toLowerCase().includes(search.toLowerCase())) || [];

                                        return (
                                            <Popover open={isHeadPopoverOpen} onOpenChange={setIsHeadPopoverOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        type='button'
                                                        variant='outline'
                                                        onClick={() => setIsHeadPopoverOpen(!isHeadPopoverOpen)}
                                                        className={cn(
                                                            'w-full justify-between',
                                                            errors.heads ? 'border-red-500' : 'border-primary/30'
                                                        )}>
                                                        <span className='truncate'>
                                                            {heads?.data?.find((h) => h.fmH_Id.toString() === selectedValue)?.fmH_FeeName ||
                                                                'Select Fee Head'}
                                                        </span>
                                                        <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent className='w-[260px] p-2 sm:w-[300px]'>
                                                    {/* Search */}
                                                    <div className='relative mb-2'>
                                                        <Search className='absolute top-2.5 left-2 h-4 w-4 text-gray-400' />
                                                        <InputText
                                                            placeholder='Search heads...'
                                                            value={search}
                                                            onChange={(e) => setSearch(e.target.value)}
                                                            className='h-8 pl-8 text-sm'
                                                        />
                                                    </div>

                                                    {/* List */}
                                                    <div className='max-h-[260px] overflow-y-auto rounded-md border p-1'>
                                                        {heads?.data?.length === 0 ? (
                                                            <div className='py-4 text-center text-gray-500 text-sm'>No heads found</div>
                                                        ) : filteredHeads.length === 0 ? (
                                                            <div className='py-4 text-center text-gray-500 text-sm'>
                                                                No heads match your search
                                                            </div>
                                                        ) : (
                                                            filteredHeads.map((h) => {
                                                                const isSelected = selectedValue === h.fmH_Id.toString();

                                                                return (
                                                                    <div
                                                                        key={h.fmH_Id}
                                                                        onClick={() => {
                                                                            field.onChange([h.fmH_Id.toString()]);
                                                                            setSelectedHeadsItems([{ fmH_Id: h.fmH_Id.toString() }]);
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
                                                                        <span>{h.fmH_FeeName}</span>
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

                                {errors.heads && <FormError>{errors.heads.message}</FormError>}
                            </div>
                        </div>
                    </div>
                    {/* Root Error */}
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
