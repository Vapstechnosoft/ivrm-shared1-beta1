'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { feeSpecialHeadDROPDOWN, useSpecialFeeHead } from '@/hooks/fees/useMasters';
import { cn } from '@/lib/utils';
import { specialFeeHeadSchema } from '@/schemas/fees/masters';
import { addOrUpdateSpecialfeehead } from '@/server/fees/masters/specialfeehead';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, Save, Square } from 'lucide-react';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof specialFeeHeadSchema.addOrUpdate>;

interface SpecialFeeHeadFormProps {
    onSuccess?: () => void;
    termname?: string;
}

export default function AddSpecialFeeHeadFormForm({ onSuccess, termname = '' }: SpecialFeeHeadFormProps) {
    const { refetchAll } = useSpecialFeeHead();
    const [headSearch, setheadSearch] = useState('');

    const [selectedHeadsItems, setSelectedHeadsItems] = useState<{ fmH_Id: string }[]>([]);

    const { data: masterHeads, isLoading: masterHeadsLoading, refetchAll: refetchMasterHeads } = feeSpecialHeadDROPDOWN();

    const {
        control,
        handleSubmit,
        reset,
        register,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(specialFeeHeadSchema.addOrUpdate),
        mode: 'onChange'
    });

    function OnReset() {
        reset();
        setSelectedHeadsItems([]);

        refetchAll();

        refetchMasterHeads();
        setSelectedHeadsItems([]);
    }

    // Convert Heads API to { label, id }
    const headOptions =
        masterHeads?.data?.map((h) => ({
            id: h.fmH_Id.toString(),
            label: h.fmH_FeeName
        })) ?? [];

    // Define form value for fmH_Ids
    const fmH_Ids = watch('heads') || [];

    const toggleHead = (id: string) => {
        let updated = [];

        if (fmH_Ids.includes(id)) {
            updated = fmH_Ids.filter((v: string) => v !== id);
        } else {
            updated = [...fmH_Ids, id];
        }

        // MUST be tuple: at least 1 element
        if (updated.length === 0) {
            setValue('heads', undefined as any);
        } else {
            setValue('heads', updated as [string, ...string[]], {
                shouldValidate: true
            });
        }

        setSelectedHeadsItems(updated.map((x) => ({ fmH_Id: x })));
    };

    const selectAllHeads = () => {
        const all = headOptions.map((h) => h.id);

        if (fmH_Ids.length === all.length) {
            // Option: clear selection → field becomes undefined
            setValue('heads', undefined as any);
            setSelectedHeadsItems([]);
        } else {
            setValue('heads', all as [string, ...string[]], {
                shouldValidate: true
            });
            setSelectedHeadsItems(all.map((x) => ({ fmH_Id: x })));
        }
    };

    const filteredHeads = masterHeads?.data?.filter((h) => h.fmH_FeeName.toLowerCase().includes(headSearch.toLowerCase())) ?? [];

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { fmsfH_Name } = data;
            const payload = {
                fmsfH_Name: fmsfH_Name,
                // mI_Id: 30,
                tempararyArrayList: selectedHeadsItems.map((item) => ({
                    fmH_ID: Number(item.fmH_Id) // <-- Correct key format
                }))
            };

            const js = JSON.stringify(payload);
            console.log('Payload JSON:', js);

            const response = await addOrUpdateSpecialfeehead(payload);

            // Handle response as per your business logic
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
        setSelectedHeadsItems(
            selectedValues.map((value) => ({
                fmH_Id: value.toString() // Store only the fmH_Id as a string
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

                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Heads' htmlFor='fmH_Id'>
                                Fee Head <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            {/* <Controller
                                name='heads'
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        options={
                                            masterHeads?.data?.map((data) => ({
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
                                        value={selectedHeadsItems.map((data) => (data.fmH_Id !== undefined ? data.fmH_Id.toString() : ''))}
                                        placeholder='Select Heads'
                                        variant='inverted'
                                        disabled={masterHeadsLoading}
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
                                {masterHeads?.data && (
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
                                    {masterHeadsLoading ? (
                                        <div className='py-4 text-center text-gray-500 text-sm'>Loading heads...</div>
                                    ) : masterHeads?.data?.length === 0 ? (
                                        <div className='py-4 text-center text-gray-500 text-sm'>No heads found</div>
                                    ) : (
                                        filteredHeads.map((u) => {
                                            const id = u.fmH_Id.toString();
                                            const selected = fmH_Ids.includes(id);

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

                            {errors.heads && <FormError>{errors.heads.message}</FormError>}
                        </div>
                    </div>

                    {/* Root Error */}
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
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
