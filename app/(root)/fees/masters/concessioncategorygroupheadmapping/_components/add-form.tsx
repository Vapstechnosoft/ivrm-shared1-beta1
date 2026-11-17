'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    CONCESSION_CATEGORYG_DROPDOWN_DATA,
    CONCESSION_CATEGORYG_GROUP_DROPDOWN_DATA,
    CONCESSION_CATEGORYG_HEADS_DROPDOWN_DATA,
    useConcessionCategoryGroupHeadmappingdata
} from '@/hooks/fees/useMasters';
import { cn } from '@/lib/utils';
import { masterConcessionCategorygroupHeadMappingSchema } from '@/schemas/fees/masters';
import { addOrUpdateConcessionCategoryGroupHeadMapping } from '@/server/fees/masters/concession_category_head_group_mapping';
import { zodResolver } from '@hookform/resolvers/zod';

import { CheckSquare, Save, Square } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterConcessionCategorygroupHeadMappingSchema.addOrUpdate>;

interface ConcessionCatgoryGroupHeadMappingFormProps {
    onSuccess?: () => void;
    termname?: string;
}

export default function AddConcessionCatgoryGroupHeadMappingForm({ onSuccess, termname = '' }: ConcessionCatgoryGroupHeadMappingFormProps) {
    const { refetchAll } = useConcessionCategoryGroupHeadmappingdata();

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterConcessionCategorygroupHeadMappingSchema.addOrUpdate),
        mode: 'onChange'
    });

    const [headSearch, setheadSearch] = useState('');

    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedHeadsItems, setSelectedHeadsItems] = useState<{ fmH_Id: string }[]>([]);
    const [shouldFetchHeads, setShouldFetchHeads] = useState(false);

    // Group API
    const {
        data: group,
        isLoading: groupLoading,
        error: groupError,
        refetchAll: refetchGroup
    } = CONCESSION_CATEGORYG_GROUP_DROPDOWN_DATA();

    const {
        data: category,
        isLoading: categoryLoading,
        error: categoryError,
        refetchAll: refetchcategory
    } = CONCESSION_CATEGORYG_DROPDOWN_DATA();

    const {
        data: heads,
        isLoading: headsLoading,
        error: headsError,
        refetchAll: refetchHeads
    } = CONCESSION_CATEGORYG_HEADS_DROPDOWN_DATA(selectedGroupId ?? 0);

    //const headsValue = watch('fmH_Ids') || [];

    // Trigger Heads API only after Group is selected
    // useEffect(() => {
    //     if (selectedGroupId) {
    //         console.log('selectedGroupId', selectedGroupId);
    //         setShouldFetchHeads(true);
    //         refetchHeads();
    //     } else {
    //         setShouldFetchHeads(false);
    //         setSelectedHeadsItems([]);
    //     }
    // }, [selectedGroupId]);

    useEffect(() => {
        if (selectedGroupId) {
            setSelectedHeadsItems([]); // clear previous selections
            refetchHeads(); // fetch heads for selected group
        }
    }, [selectedGroupId]);

    // Convert Heads API to { label, id }
    const headOptions =
        heads?.data?.map((h) => ({
            id: h.fmH_Id.toString(),
            label: h.fmH_FeeName
        })) ?? [];

    // Define form value for fmH_Ids
    const fmH_Ids = watch('fmH_Ids') || [];

    const toggleHead = (id: string) => {
        let updated = [];

        if (fmH_Ids.includes(id)) {
            updated = fmH_Ids.filter((v: string) => v !== id);
        } else {
            updated = [...fmH_Ids, id];
        }

        // MUST be tuple: at least 1 element
        if (updated.length === 0) {
            setValue('fmH_Ids', undefined as any);
        } else {
            setValue('fmH_Ids', updated as [string, ...string[]], {
                shouldValidate: true
            });
        }

        setSelectedHeadsItems(updated.map((x) => ({ fmH_Id: x })));
    };

    const selectAllHeads = () => {
        const all = headOptions.map((h) => h.id);

        if (fmH_Ids.length === all.length) {
            // Option: clear selection → field becomes undefined
            setValue('fmH_Ids', undefined as any);
            setSelectedHeadsItems([]);
        } else {
            setValue('fmH_Ids', all as [string, ...string[]], {
                shouldValidate: true
            });
            setSelectedHeadsItems(all.map((x) => ({ fmH_Id: x })));
        }
    };

    const filteredHeads = heads?.data?.filter((h) => h.fmH_FeeName.toLowerCase().includes(headSearch.toLowerCase())) ?? [];

    function OnReset() {
        reset();
        refetchAll();
        refetchGroup();
        refetchcategory();
        setSelectedGroupId(null);
        setSelectedHeadsItems([]);
        setShouldFetchHeads(false);
    }
    const headIds: number[] = selectedHeadsItems.map((item) => Number(item.fmH_Id));
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const { fmcC_Id } = data;

            console.log('headIds', headIds);
            const payload = {
                // MI_Id: 30,
                // FMG_Id: selectedGroupId,
                // fmH_Ids: headIds,
                // FMCC_Id: selectedCategoryId,
                // FMACCG_CreatedBy: 21602
                FMCC_Id: fmcC_Id,
                FMG_Id: selectedGroupId,
                FMH_Ids: headIds
            };

            console.log('payload', payload);

            const response = await addOrUpdateConcessionCategoryGroupHeadMapping(payload);

            if (response.success) {
                toast.success(response.message);
                OnReset();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleHeadSelection = (selectedValues: string[]) => {
        setSelectedHeadsItems(selectedValues.map((value) => ({ fmH_Id: value.toString() })));
    };

    console.log('selectedHeadsItems', selectedHeadsItems);

    return (
        <div className={`${termname}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='flex flex-col items-center space-y-4'>
                        {/* Category DROPDOWN */}
                        <div className='group flex items-center justify-center gap-1.5 space-x-3'>
                            <Label htmlFor='fmcC_Id' className='whitespace-nowrap font-medium'>
                                Category <span className='ml-1 text-red-500'>*</span>:
                            </Label>
                            <div className='w-96'>
                                <Controller
                                    name='fmcC_Id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(value) => {
                                                const id = Number(value);
                                                field.onChange(id);
                                                setSelectedCategoryId(id);
                                            }}
                                            value={field.value?.toString() || ''}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Select Category' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categoryLoading ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading Category...
                                                    </SelectItem>
                                                ) : categoryError ? (
                                                    <SelectItem value='error' disabled>
                                                        Error loading Categorys
                                                    </SelectItem>
                                                ) : (
                                                    category?.data?.map((item) => (
                                                        <SelectItem key={item.fmcC_Id} value={item.fmcC_Id.toString()}>
                                                            {item.fmcC_ConcessionName}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.fmcC_Id && <FormError className='ml-2'>{errors.fmcC_Id.message}</FormError>}
                            </div>
                        </div>
                        {/* GROUP DROPDOWN */}
                        <div className='group flex items-center justify-center gap-1.5 space-x-3'>
                            <Label htmlFor='FMG_Id' className='whitespace-nowrap font-medium'>
                                Group <span className='ml-1 text-red-500'>*</span>:
                            </Label>
                            <div className='w-96'>
                                <Controller
                                    name='FMG_Id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(value) => {
                                                const id = Number(value);
                                                field.onChange(id);
                                                setSelectedGroupId(id);
                                                setSelectedHeadsItems([]); // clear previous heads
                                            }}
                                            value={field.value?.toString() || ''}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Select Group' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {groupLoading ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading Groups...
                                                    </SelectItem>
                                                ) : groupError ? (
                                                    <SelectItem value='error' disabled>
                                                        Error loading Groups
                                                    </SelectItem>
                                                ) : (
                                                    group?.data?.map((item) => (
                                                        <SelectItem key={item.fmG_Id} value={item.fmG_Id.toString()}>
                                                            {item.fmG_GroupName}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.FMG_Id && <FormError className='ml-2'>{errors.FMG_Id.message}</FormError>}
                            </div>
                        </div>

                        {/* HEADS MULTISELECT */}
                        <div className='group flex items-center justify-center gap-1.5 space-x-3'>
                            <Label htmlFor='fmH_Ids' className='whitespace-nowrap font-medium'>
                                Heads <span className='ml-1 text-red-500'>*</span>:
                            </Label>
                            <div className='w-96'>
                                {/* <Controller
                                    name='fmH_Ids'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            options={
                                                heads?.data?.map((data) => ({
                                                    label: data.fmH_FeeName || '',
                                                    value: data.fmH_Id.toString()
                                                })) ?? []
                                            }
                                            onValueChange={(selectedValues) => {
                                                field.onChange(selectedValues);
                                                handleHeadSelection(selectedValues);
                                            }}
                                            defaultValue={selectedHeadsItems.map((data) =>
                                                data.fmH_Id !== undefined ? data.fmH_Id.toString() : ''
                                            )}
                                            value={selectedHeadsItems.map((data) =>
                                                data.fmH_Id !== undefined ? data.fmH_Id.toString() : ''
                                            )}
                                            placeholder='Select Heads'
                                            variant='inverted'
                                            disabled={headsLoading}
                                        />
                                    )}
                                /> */}
                                <div className='mt-2 rounded-md border border-gray-300 bg-white p-3'>
                                    <InputText
                                        placeholder='Search Heads...'
                                        value={headSearch}
                                        onChange={(e) => setheadSearch(e.target.value)}
                                        className='mb-3'
                                    />

                                    {/* Select All Users */}
                                    {heads?.data && (
                                        <div
                                            onClick={selectAllHeads}
                                            className={cn(
                                                'mb-2 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 font-medium text-sm transition-all',
                                                fmH_Ids.length === headOptions.length && headOptions.length
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-gray-300 hover:border-primary/40'
                                            )}>
                                            {fmH_Ids.length === headOptions.length && headOptions.length ? (
                                                <CheckSquare className='h-4 w-4 text-primary' />
                                            ) : (
                                                <Square className='h-4 w-4 text-gray-400' />
                                            )}
                                            <span>Select All</span>
                                        </div>
                                    )}

                                    <div className='max-h-40 overflow-y-auto rounded-md border border-gray-300 p-1'>
                                        {headsLoading ? (
                                            <div className='py-4 text-center text-gray-500 text-sm'>Loading heads...</div>
                                        ) : heads?.data?.length === 0 ? (
                                            <div className='py-4 text-center text-gray-500 text-sm'>No heads found</div>
                                        ) : (
                                            filteredHeads.map((u) => {
                                                const id = u.fmH_Id.toString();
                                                const selected = fmH_Ids.includes(id);

                                                // return (
                                                //     <div
                                                //         key={u.fmH_Id}
                                                //         onClick={() => toggleHead(id)}
                                                //         className={cn(
                                                //             'mb-1 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-sm transition-all',
                                                //             selected
                                                //                 ? 'border-primary bg-primary/5 text-primary'
                                                //                 : 'border-gray-300 hover:border-primary/40'
                                                //         )}
                                                //     >
                                                //         {selected ? (
                                                //             <CheckSquare className='h-4 w-4 text-primary' />
                                                //         ) : (
                                                //             <Square className='h-4 w-4 text-gray-400' />
                                                //         )}
                                                //         <span>{u.fmH_FeeName}</span>
                                                //     </div>
                                                // );
                                                return (
                                                    <div
                                                        key={u.fmH_Id}
                                                        onClick={() => toggleHead(id)}
                                                        className={cn(
                                                            'mb-1 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-sm transition-all',
                                                            selected
                                                                ? 'border-primary bg-primary/5 text-primary'
                                                                : 'border-gray-300 hover:border-primary/40'
                                                        )}>
                                                        {selected ? (
                                                            <CheckSquare className='h-4 w-4 text-primary' />
                                                        ) : (
                                                            <Square className='h-4 w-4 text-gray-400' />
                                                        )}
                                                        <span>{u.fmH_FeeName}</span>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                                {errors.fmH_Ids && <FormError>{errors.fmH_Ids.message}</FormError>}
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
                            Save
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
