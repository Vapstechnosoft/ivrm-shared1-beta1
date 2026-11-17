'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputNumber } from '@/components/ui/extension/input-number';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CONCESSION_CATEGORYDROPDOWN_DATA, useMasterConcessionDetails } from '@/hooks/fees/useMasters';
import { masterConcessionDetailsSchema } from '@/schemas/fees/masters';
import { addOrUpdateMasterConcessionDetails } from '@/server/fees/masters/masterconcessiondetails';
import type { IMasterConcessionDetailsList } from '@/types/fees/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';

import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterConcessionDetailsSchema.addOrUpdate>;

interface FeemasterConcessionDetailsFormProps {
    onSuccess?: () => void;
    termname?: string;
    selectedRow: IMasterConcessionDetailsList;
}

export default function UpdateMasterConcessionDetailsForm({
    onSuccess,
    termname = '',
    selectedRow: row
}: FeemasterConcessionDetailsFormProps) {
    const { refetchAll } = useMasterConcessionDetails();

    const {
        data: category,
        isLoading: categoryLoading,
        error: categoryError,
        refetchAll: refetchcategory
    } = CONCESSION_CATEGORYDROPDOWN_DATA();

    const {
        control,
        setValue,
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterConcessionDetailsSchema.addOrUpdate),
        //mode: 'onChange'
        mode: 'onBlur', // Use onBlur for better performance
        defaultValues: {
            // fmcC_Id: row?.fmcC_Id ?? undefined,
            // fmccD_PerOrAmtFlag: row?.fmccD_PerOrAmtFlag ?? undefined,
            // fmccD_FromNoSibblings: row?.fmccD_FromNoSibblings ? Number(row.fmccD_FromNoSibblings) : undefined,
            // fmccD_ToNoSibblings: row?.fmccD_ToNoSibblings ? Number(row.fmccD_ToNoSibblings) : undefined,
            //fmccD_PerOrAmt: row?.fmccD_PerOrAmt ? Number(row.fmccD_PerOrAmt) : undefined
        }
    });

    function OnReset() {
        reset();
        refetchAll();
        refetchcategory();
    }

    console.log('masterConcessionDetailsselected row', row);

    useEffect(() => {
        if (row) {
            console.log('row', row);
            reset({
                fmcC_Id: row.fmcC_Id,
                fmccD_PerOrAmtFlag: row.fmccD_PerOrAmtFlag,
                fmccD_FromNoSibblings: Number(row.fmccD_FromNoSibblings),
                fmccD_ToNoSibblings: Number(row.fmccD_ToNoSibblings),
                fmccD_PerOrAmt: Number(row.fmccD_PerOrAmt)
                //fmcC_ActiveFlag: row.fmcC_ActiveFlag
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { fmcC_Id, fmccD_PerOrAmtFlag, fmccD_FromNoSibblings, fmccD_ToNoSibblings, fmccD_PerOrAmt } = data;
            const payload = {
                // mI_Id: 30,
                fmcC_Id: fmcC_Id,
                fmccD_Id: row.fmccD_Id,
                fmccD_PerOrAmtFlag: fmccD_PerOrAmtFlag,
                fmccD_FromNoSibblings: fmccD_FromNoSibblings,
                fmccD_ToNoSibblings: fmccD_ToNoSibblings,
                fmccD_PerOrAmt: fmccD_PerOrAmt
                // fmccD_CreatedBy: 21602
            };

            console.log('payload', payload);
            const response = await addOrUpdateMasterConcessionDetails(payload);

            if (response.success) {
                toast.success(response.message);
                //OnReset();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className={`${termname}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    {/* <div className='flex flex-col items-center space-y-4'>

                        <div className='group flex items-center justify-center space-x-3'>
                            <Label aria-label='Category' htmlFor='fmcC_Id' className='whitespace-nowrap'>
                                Category <span className='ml-1 text-red-500'>*</span>:
                            </Label>

                            <div className='w-64'>
                                <Controller
                                    name='fmcC_Id'
                                    control={control}
                                    defaultValue={row?.fmcC_Id ?? ''}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))} // convert string → number
                                            value={field.value ? String(field.value) : ''} // convert number → string
                                        >
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Select Category' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categoryLoading ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading...
                                                    </SelectItem>
                                                ) : categoryError ? (
                                                    <SelectItem value='error' disabled>
                                                        Error loading
                                                    </SelectItem>
                                                ) : (
                                                    category?.data?.map((item) => (
                                                        <SelectItem key={item.fmcC_Id} value={String(item.fmcC_Id)}>
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
                        <div className='group flex items-center justify-center space-x-3'>
                            <Label aria-label='type' htmlFor='fmccD_PerOrAmtFlag' className='whitespace-nowrap'>
                                Type <span className='ml-1 text-red-500'>*</span>:
                            </Label>

                            <div className='w-64'>
                                <Controller
                                    name='fmccD_PerOrAmtFlag'
                                    control={control}
                                    defaultValue={row?.fmccD_PerOrAmtFlag ?? ''}
                                    rules={{ required: 'Please select a type' }}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(value) => field.onChange(value)} // convert string → number
                                            value={field.value ? String(field.value) : ''} // convert number → string
                                        >
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Select Type' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='P'>Percent</SelectItem>
                                                <SelectItem value='A'>Amount</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />


                                {errors.fmccD_PerOrAmtFlag && (
                                    <FormError className='mt-1 text-red-500 text-sm'>{errors.fmccD_PerOrAmtFlag.message}</FormError>
                                )}
                            </div>
                        </div>
                        <div className='group flex items-center justify-center space-x-3'>
                            <label htmlFor='fmccD_FromNoSibblings'>
                                From No of Sibling<span className='text-red-500'>*</span>:
                            </label>
                            <Controller
                                name='fmccD_FromNoSibblings'
                                control={control}
                                rules={{ required: 'From No of Sibling is required' }}
                                render={({ field }) => (
                                    <div className='flex flex-col'>
                                        <InputNumber
                                            //   label='Concession Limit'

                                            id='fmccD_FromNoSibblings'
                                            value={field.value ?? 0}
                                            onChange={(value: number) => {
                                                field.onChange(value);
                                            }}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                        {errors.fmccD_FromNoSibblings && <FormError>{errors.fmccD_FromNoSibblings.message}</FormError>}
                                    </div>
                                )}
                            />
                        </div>
                        <div className='group flex items-center justify-center space-x-3'>
                            <label htmlFor='fmccD_ToNoSibblings' className='whitespace-nowrap'>
                                To No of Siblings <span className='text-red-500'>*</span>:
                            </label>

                            <div className='flex-1'>
                                <Controller
                                    name='fmccD_ToNoSibblings'
                                    control={control}
                                    rules={{ required: 'To No of Siblings is required' }}
                                    render={({ field }) => (
                                        <div className='flex flex-col'>
                                            <InputNumber
                                                //   label='Concession Limit'

                                                id='fmccD_ToNoSibblings'
                                                value={field.value ?? 0}
                                                onChange={(value: number) => {
                                                    field.onChange(value);
                                                }}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                            {errors.fmccD_ToNoSibblings && <FormError>{errors.fmccD_ToNoSibblings.message}</FormError>}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group flex items-center justify-center space-x-3'>
                            <label htmlFor='fmccD_PerOrAmt'>
                                Percent/Amount<span className='text-red-500'>*</span>:
                            </label>

                            <div className='flex-1'>
                                <Controller
                                    name='fmccD_PerOrAmt'
                                    control={control}
                                    rules={{ required: 'Percent/Amount is required' }}
                                    render={({ field }) => (
                                        <div className='flex flex-col'>
                                            <InputNumber
                                                //   label='Concession Limit'

                                                id='fmccD_PerOrAmt'
                                                value={field.value ?? 0}
                                                onChange={(value: number) => {
                                                    field.onChange(value);
                                                }}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                            {errors.fmccD_PerOrAmt && <FormError>{errors.fmccD_PerOrAmt.message}</FormError>}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </div> */}

                    <div className='flex flex-col items-center space-y-4'>
                        {/* Category */}
                        <div className='flex items-center justify-center gap-4'>
                            <Label aria-label='Category' htmlFor='fmcC_Id' className='w-40 whitespace-nowrap text-right'>
                                Category <span className='ml-1 text-red-500'>*</span>:
                            </Label>

                            <div className='w-64'>
                                <Controller
                                    name='fmcC_Id'
                                    control={control}
                                    defaultValue={row?.fmcC_Id ?? ''}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            value={field.value ? String(field.value) : ''}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Select Category' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categoryLoading ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading...
                                                    </SelectItem>
                                                ) : categoryError ? (
                                                    <SelectItem value='error' disabled>
                                                        Error loading
                                                    </SelectItem>
                                                ) : (
                                                    category?.data?.map((item) => (
                                                        <SelectItem key={item.fmcC_Id} value={String(item.fmcC_Id)}>
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

                        {/* Type */}
                        <div className='flex items-center justify-center gap-4'>
                            <Label aria-label='type' htmlFor='fmccD_PerOrAmtFlag' className='w-40 whitespace-nowrap text-right'>
                                Type <span className='ml-1 text-red-500'>*</span>:
                            </Label>

                            <div className='w-64'>
                                <Controller
                                    name='fmccD_PerOrAmtFlag'
                                    control={control}
                                    defaultValue={row?.fmccD_PerOrAmtFlag ?? ''}
                                    rules={{ required: 'Please select a type' }}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(value) => field.onChange(value)}
                                            value={field.value ? String(field.value) : ''}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Select Type' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='P'>Percent</SelectItem>
                                                <SelectItem value='A'>Amount</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.fmccD_PerOrAmtFlag && (
                                    <FormError className='mt-1 text-red-500 text-sm'>{errors.fmccD_PerOrAmtFlag.message}</FormError>
                                )}
                            </div>
                        </div>

                        {/* <div className='flex items-center justify-center gap-4'>
                            <label htmlFor='fmccD_FromNoSibblings' className='w-40 whitespace-nowrap text-right'>
                                From No of Sibling <span className='text-red-500'>*</span>:
                            </label>

                            <div className='w-64'>
                                <Controller
                                    name='fmccD_FromNoSibblings'
                                    control={control}
                                    rules={{ required: 'From No of Sibling is required' }}
                                    render={({ field }) => (
                                        <div className='flex flex-col'>
                                            <InputNumber
                                                id='fmccD_FromNoSibblings'
                                               
                                                onChange={(value: number | string) => {
                                                   
                                                    if (value === '' || value === null || value === undefined) {
                                                        field.onChange(undefined);
                                                        return;
                                                    }

                                                    const num = Number(value);

                                                  
                                                    if (Number.isNaN(num)) return;

                                                    field.onChange(num);
                                                }}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                            {errors.fmccD_FromNoSibblings && <FormError>{errors.fmccD_FromNoSibblings.message}</FormError>}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

              
                        <div className='flex items-center justify-center gap-4'>
                            <label htmlFor='fmccD_ToNoSibblings' className='w-40 whitespace-nowrap text-right'>
                                To No of Siblings <span className='text-red-500'>*</span>:
                            </label>

                            <div className='w-64'>
                                <Controller
                                    name='fmccD_ToNoSibblings'
                                    control={control}
                                    rules={{ required: 'To No of Siblings is required' }}
                                    render={({ field }) => (
                                        <div className='flex flex-col'>
                                            <InputNumber
                                                id='fmccD_ToNoSibblings'
                                               
                                                onChange={(value: number | string) => {
                                                   
                                                    if (value === '' || value === null || value === undefined) {
                                                        field.onChange(undefined);
                                                        return;
                                                    }

                                                    const num = Number(value);

                                                    
                                                    if (Number.isNaN(num)) return;

                                                    field.onChange(num);
                                                }}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                            {errors.fmccD_ToNoSibblings && <FormError>{errors.fmccD_ToNoSibblings.message}</FormError>}
                                        </div>
                                    )}
                                />
                            </div>
                        </div> */}

                        <div className='flex items-center justify-center gap-4'>
                            <label htmlFor='fmccD_FromNoSibblings' className='w-40 whitespace-nowrap text-right'>
                                From No of Sibling <span className='text-red-500'>*</span>:
                            </label>

                            <div className='w-64'>
                                <Controller
                                    name='fmccD_FromNoSibblings'
                                    control={control}
                                    rules={{ required: 'From No of Sibling is required' }}
                                    render={({ field }) => (
                                        <div className='flex flex-col'>
                                            <InputNumber
                                                id='fmccD_FromNoSibblings'
                                                value={field.value !== undefined && field.value !== null ? field.value : undefined}
                                                onChange={(value: number | undefined) => {
                                                    field.onChange(value);
                                                }}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                            {errors.fmccD_FromNoSibblings && <FormError>{errors.fmccD_FromNoSibblings.message}</FormError>}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        {/* To No of Siblings */}
                        <div className='flex items-center justify-center gap-4'>
                            <label htmlFor='fmccD_ToNoSibblings' className='w-40 whitespace-nowrap text-right'>
                                To No of Siblings <span className='text-red-500'>*</span>:
                            </label>

                            <div className='w-64'>
                                <Controller
                                    name='fmccD_ToNoSibblings'
                                    control={control}
                                    rules={{ required: 'To No of Siblings is required' }}
                                    render={({ field }) => (
                                        <div className='flex flex-col'>
                                            <InputNumber
                                                id='fmccD_ToNoSibblings'
                                                value={field.value !== undefined && field.value !== null ? field.value : undefined}
                                                onChange={(value: number | undefined) => {
                                                    field.onChange(value);
                                                }}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                            {errors.fmccD_ToNoSibblings && <FormError>{errors.fmccD_ToNoSibblings.message}</FormError>}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Percent / Amount */}
                        <div className='flex items-center justify-center gap-4'>
                            <label htmlFor='fmccD_PerOrAmt' className='w-40 whitespace-nowrap text-right'>
                                Percent/Amount <span className='text-red-500'>*</span>:
                            </label>

                            <div className='w-64'>
                                {/* <Controller
                                    name='fmccD_PerOrAmt'
                                    control={control}
                                    rules={{ required: 'Percent/Amount is required' }}
                                    render={({ field }) => (
                                        <div className='flex flex-col'>
                                            <InputNumber
                                                id='fmccD_PerOrAmt'
                                                value={field.value ?? 0}
                                                onChange={(value: number) => field.onChange(value)}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                            {errors.fmccD_PerOrAmt && <FormError>{errors.fmccD_PerOrAmt.message}</FormError>}
                                        </div>
                                    )}
                                /> */}

                                {/* <Controller
                                    name='fmccD_PerOrAmt'
                                    control={control}
                                    //rules={{ required: 'Percent/Amount is required' }}
                                    render={({ field }) => (
                                        <div className='flex flex-col'>
                                            <InputNumber
                                                id='fmccD_PerOrAmt'
                                               value={field.value ?? null}
                                                // onChange={(value: number | string) => {
                                                //     // Allow empty value without producing NaN
                                                //     if (value === '' || value === null || value === undefined) {
                                                //         field.onChange(undefined);
                                                //         return;
                                                //     }

                                                //     const num = Number(value);

                                                //     // Prevent NaN from entering form state
                                                //     if (Number.isNaN(num)) return;

                                                //     field.onChange(num);
                                                // }}
                                                onChange={(value: number | string) => {
                                                    if (value === '' || value === null) {
                                                        field.onChange(null); // keep controlled
                                                        return;
                                                    }

                                                    const num = Number(value);
                                                    if (!Number.isNaN(num)) {
                                                        field.onChange(num);
                                                    }
                                                }}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />
                                            {errors.fmccD_PerOrAmt && <FormError>{errors.fmccD_PerOrAmt.message}</FormError>}
                                        </div>
                                    )}
                                /> */}
                                <Controller
                                    name='fmccD_PerOrAmt'
                                    control={control}
                                    render={({ field }) => (
                                        <div className='flex flex-col'>
                                            <InputNumber
                                                id='fmccD_PerOrAmt'
                                                value={field.value ?? null}
                                                onChange={(value: number | null) => {
                                                    field.onChange(value);
                                                }}
                                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                                            />

                                            {errors.fmccD_PerOrAmt && <FormError>{errors.fmccD_PerOrAmt.message}</FormError>}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Root Error */}
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-center'>
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
                            Update
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
