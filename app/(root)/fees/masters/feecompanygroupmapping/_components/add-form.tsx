'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    feeCompanyFeeGroupMappingCompanyDropdown,
    feeCompanyFeeGroupMappingGroupDropdown,
    useFeeCompanyGroupMapping
} from '@/hooks/fees/useMasters';
import { cn } from '@/lib/utils';
import { feeCompanyGroupMappingSchema } from '@/schemas/fees/masters';
import { addOrUpdateCompanyFeeGroupMapping } from '@/server/fees/masters/fee_companygroupmapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, Save, Square } from 'lucide-react';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof feeCompanyGroupMappingSchema.addOrUpdate>;

interface CompanyFeeGroupMappingFormProps {
    onSuccess?: () => void;
    companyname?: string;
}

export default function AddFeeCompanyGroupMappingForm({ onSuccess, companyname = '' }: CompanyFeeGroupMappingFormProps) {
    const { refetchAll } = useFeeCompanyGroupMapping();
    const [headSearch, setheadSearch] = useState('');

    const [selectedGroupItems, setSelectedGroupItems] = useState<{ fmG_Id: string }[]>([]);

    const {
        data: mastergroups,
        isLoading: mastergroupsLoading,
        error: mastergroupsError,
        refetchAll: refetchMasterGroups
    } = feeCompanyFeeGroupMappingGroupDropdown();

    const {
        data: mastercompanys,
        isLoading: mastercompanysLoading,
        error: mastercompanysError,
        refetchAll: refetchMasterCompanys
    } = feeCompanyFeeGroupMappingCompanyDropdown();

    console.log('mastergroups', mastergroups);
    const {
        control,
        handleSubmit,
        reset,
        register,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feeCompanyGroupMappingSchema.addOrUpdate),
        mode: 'onChange'
    });

    function OnReset() {
        reset();
        setSelectedGroupItems([]);

        refetchAll();

        refetchMasterGroups();
        refetchMasterCompanys();
        setSelectedGroupItems([]);
    }
    //id: h.fmG_Id?.toString(),
    // Convert Heads API to { label, id }
    const headOptions =
        mastergroups?.data?.map((h) => ({
            id: String(h.fmG_Id),
            label: h.fmG_GroupName
        })) ?? [];

    const fmG_Ids = watch('groupids') || [];

    const toggleHead = (id: string) => {
        let updated = [];

        if (fmG_Ids.includes(id)) {
            updated = fmG_Ids.filter((v: string) => v !== id);
        } else {
            updated = [...fmG_Ids, id];
        }

        // MUST be tuple: at least 1 element
        if (updated.length === 0) {
            setValue('groupids', undefined as any);
        } else {
            setValue('groupids', updated as [string, ...string[]], {
                shouldValidate: true
            });
        }

        setSelectedGroupItems(updated.map((x) => ({ fmG_Id: x })));
    };

    const selectAllGroupss = () => {
        const all = headOptions.map((h) => h.id);

        if (fmG_Ids.length === all.length) {
            // Option: clear selection → field becomes undefined
            setValue('groupids', undefined as any);
            setSelectedGroupItems([]);
        } else {
            setValue('groupids', all as [string, ...string[]], {
                shouldValidate: true
            });
            setSelectedGroupItems(all.map((x) => ({ fmG_Id: x })));
        }
    };

    const filteredHeads = mastergroups?.data?.filter((h) => h.fmG_GroupName?.toLowerCase().includes(headSearch.toLowerCase())) ?? [];

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            // const { fmsfH_Name } = data;
            const payload = {
                ftmcoM_Id: Number(data.ftmcoM_Id),
                tempararyArrayList: selectedGroupItems.map((item) => ({
                    fmG_Id: Number(item.fmG_Id)
                }))
            };

            const js = JSON.stringify(payload);
            console.log('Payload JSON:', js);

            const response = await addOrUpdateCompanyFeeGroupMapping(payload);

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
        setSelectedGroupItems(
            selectedValues.map((value) => ({
                fmG_Id: value.toString() // Store only the fmG_Id as a string
            }))
        );
    };

    return (
        <div className={`${companyname}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='flex flex-col items-center space-y-4'>
                        <div className='group flex items-center justify-center gap-1.5 space-x-3'>
                            <Label htmlFor='ftmcoM_Id' className='whitespace-nowrap'>
                                Company Name:<span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <div className='w-96'>
                                <Controller
                                    name='ftmcoM_Id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            key={field.value || 'empty'}
                                            onValueChange={(value) => {
                                                field.onChange(Number(value) || '');
                                            }}
                                            value={field.value?.toString() || undefined}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Select Company' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mastercompanysLoading ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading Companys...
                                                    </SelectItem>
                                                ) : mastercompanysError ? (
                                                    <SelectItem value='error' disabled>
                                                        Error loading Companys
                                                    </SelectItem>
                                                ) : (
                                                    mastercompanys?.data?.map((item) => (
                                                        <SelectItem key={item.ftmcoM_Id} value={item.ftmcoM_Id.toString()}>
                                                            {item.ftmcoM_CompanyName}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.ftmcoM_Id && <FormError className='ml-2'>{errors.ftmcoM_Id.message}</FormError>}
                            </div>
                        </div>

                        <div className='group flex items-center justify-center gap-10 space-x-10'>
                            <Label htmlFor='groupids' className='whitespace-nowrap'>
                                Group:<span className='ml-1 text-red-500'>*</span>
                            </Label>

                            <div className='w-96'>
                                <div className='mt-2 rounded-md border border-gray-300 bg-white p-3'>
                                    <InputText
                                        placeholder='Search Group...'
                                        value={headSearch}
                                        onChange={(e) => setheadSearch(e.target.value)}
                                        className='mb-3'
                                    />

                                    {mastergroups?.data && (
                                        <div
                                            onClick={selectAllGroupss}
                                            className={cn(
                                                'mb-2 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 font-medium text-sm transition-all',
                                                fmG_Ids.length === headOptions.length && headOptions.length
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-gray-300 hover:border-primary/40'
                                            )}>
                                            {fmG_Ids.length === headOptions.length && headOptions.length ? (
                                                <CheckSquare className='h-4 w-4 text-primary' />
                                            ) : (
                                                <Square className='h-4 w-4 text-gray-400' />
                                            )}
                                            <span>Select All</span>
                                        </div>
                                    )}

                                    <div className='max-h-40 overflow-y-auto rounded-md border border-gray-300 p-1'>
                                        {mastergroups?.isLoading ? (
                                            <div className='py-4 text-center text-gray-500 text-sm'>Loading groups...</div>
                                        ) : mastergroups?.data?.length === 0 ? (
                                            <div className='py-4 text-center text-gray-500 text-sm'>No groups found</div>
                                        ) : filteredHeads.filter((u) => u.fmG_Id != null).length === 0 ? (
                                            <div className='py-4 text-center text-gray-500 text-sm'>No Seached Data</div>
                                        ) : (
                                            filteredHeads
                                                .filter((u) => u.fmG_Id != null) // 🔒 remove bad records
                                                .map((u) => {
                                                    const id = String(u.fmG_Id); // 🔒 safe conversion
                                                    const selected = fmG_Ids.includes(id);

                                                    return (
                                                        <div
                                                            key={u.fmG_Id}
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
                                                            <span>{u.fmG_GroupName}</span>
                                                        </div>
                                                    );
                                                })
                                        )}
                                    </div>
                                </div>
                                {errors.groupids && <FormError>{errors.groupids.message}</FormError>}
                            </div>
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
