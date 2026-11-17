'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MASTER_HEADS_DROPDOWN, MASTER_INSTALLMENT_DROPDOWN, TERM_DROPDOWN_DATA, useMasterTermsHead } from '@/hooks/fees/useMasters';
import { masterTermFeeHeadSchema } from '@/schemas/fees/masters';
import { addOrUpdateFeeTermHead } from '@/server/fees/masters/fee-term-heads';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterTermFeeHeadSchema.addOrUpdate>;

interface FeeTermsHeadFormProps {
    onSuccess?: () => void;
    termname?: string;
}

export default function AddFeeTermsHeadFormForm({ onSuccess, termname = '' }: FeeTermsHeadFormProps) {
    const { refetchAll } = useMasterTermsHead();
    const [selectedHeadsItems, setSelectedHeadsItems] = useState<{ fmH_Id: string }[]>([]);
    const [SelectedInstallmentsItems, setSelectedInstallmentsItems] = useState<{ ftI_ID: string }[]>([]);

    const { data: terms, isLoading: termsLoading, error: termsError, refetchAll: refetchterms } = TERM_DROPDOWN_DATA();

    const {
        data: masterInstallment,
        isLoading: masterInstallmentLoading,
        error: masterInstallmentError,
        refetchAll: refetchmasterInstallment
    } = MASTER_INSTALLMENT_DROPDOWN();

    const { data: masterHeads, isLoading: masterHeadsLoading, refetchAll: refetchMasterHeads } = MASTER_HEADS_DROPDOWN();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterTermFeeHeadSchema.addOrUpdate),
        mode: 'onChange'
    });

    function OnReset() {
        reset();
        setSelectedHeadsItems([]);
        setSelectedInstallmentsItems([]);
        refetchAll();
        refetchterms();
        refetchmasterInstallment();
        refetchMasterHeads();
        setSelectedHeadsItems([]); // Reset the selectedHeadsItems state to an empty array of { fmH_Id: string }[]
    }

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { fmT_Id } = data;

            const payload = {
                FMT_Id: fmT_Id,
                // mI_Id: 30,
                feeHeadList: selectedHeadsItems.map((item) => ({
                    fmH_Id: Number(item.fmH_Id)
                })),
                feeInsatallmentList: SelectedInstallmentsItems.map((item) => ({
                    fmI_Id: Number(item.ftI_ID)
                }))
            };

            const js = JSON.stringify(payload);
            console.log('Payload JSON:', js);

            const response = await addOrUpdateFeeTermHead(payload);

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

    const handleInstallmentSelection = (selectedValues: string[]) => {
        setSelectedInstallmentsItems(
            selectedValues.map((value) => ({
                ftI_ID: value.toString() // Store only the ftI_ID as a string
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
                                Term Name <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='fmT_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(Number(value) || '');
                                        }}
                                        value={field.value?.toString() || undefined}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Term' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {termsLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading Terms...
                                                </SelectItem>
                                            ) : termsError ? (
                                                <SelectItem value='error' disabled>
                                                    Error loading Terms
                                                </SelectItem>
                                            ) : (
                                                terms?.data?.map((item) => (
                                                    <SelectItem key={item.fmT_Id} value={item.fmT_Id.toString()}>
                                                        {item.fmT_Name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.fmT_Id && <FormError>{errors.fmT_Id.message}</FormError>}
                        </div>

                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Heads' htmlFor='fmH_Id'>
                                Fees Head <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
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
                            />

                            {errors.heads && <FormError>{errors.heads.message}</FormError>}
                        </div>

                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Installments' htmlFor='ftI_Id'>
                                Installment Name <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='installments'
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        options={
                                            masterInstallment?.data?.map((data) => ({
                                                label: data.ftI_NAME || '',
                                                value: data.ftI_ID.toString()
                                            })) ?? []
                                        }
                                        onValueChange={(selectedValues) => {
                                            field.onChange(selectedValues);
                                            handleInstallmentSelection(selectedValues);
                                        }}
                                        defaultValue={SelectedInstallmentsItems.map((data) =>
                                            data.ftI_ID !== undefined ? data.ftI_ID.toString() : ''
                                        )}
                                        value={SelectedInstallmentsItems.map((data) =>
                                            data.ftI_ID !== undefined ? data.ftI_ID.toString() : ''
                                        )}
                                        placeholder='Select Installments'
                                        variant='inverted'
                                        disabled={masterInstallmentLoading}
                                    />
                                )}
                            />
                            {errors.installments && <FormError>{errors.installments.message}</FormError>}
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
