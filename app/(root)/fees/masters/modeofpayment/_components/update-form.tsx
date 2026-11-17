'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterModeOfPayment } from '@/hooks/fees/useMasters';
import { masterModeOfPaymentSchema } from '@/schemas/fees/masters';
import { addOrUpdateModeOfPayment } from '@/server/fees/masters/modeOfPayment';
import type { IModeOfPaymentList } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterModeOfPaymentSchema.addOrUpdate>;

interface UpdateMasterModeOfPaymentFormProps {
    onSuccess?: () => void;
    ivrmmoD_ModeOfPayment?: string;
    selectedRow: IModeOfPaymentList;
}

export default function UpdateMasterModeOfPaymentForm({
    onSuccess,
    ivrmmoD_ModeOfPayment = '',
    selectedRow: row
}: UpdateMasterModeOfPaymentFormProps) {
    const { refetchAll } = useMasterModeOfPayment();

    const {
        setValue,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterModeOfPaymentSchema.addOrUpdate),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                ivrmmoD_Id: row.ivrmmoD_Id,
                ivrmmoD_ModeOfPayment: row.ivrmmoD_ModeOfPayment,
                ivrmmoD_ModeOfPayment_Code: row.ivrmmoD_ModeOfPayment_Code
            });
        }
    }, [row, reset, setValue]);

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { ivrmmoD_ModeOfPayment, ivrmmoD_ModeOfPayment_Code, ivrmmoD_Id } = data;
            const payload = {
                // mi_id: 30,
                IVRMMOD_ModeOfPayment: ivrmmoD_ModeOfPayment,
                IVRMMOD_ModeOfPayment_Code: ivrmmoD_ModeOfPayment_Code,
                IVRMMOD_Id: ivrmmoD_Id
            };
            const response = await addOrUpdateModeOfPayment(payload);

            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
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
        <div className={`${ivrmmoD_ModeOfPayment}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                    {/* <InputText
            label="Mode Of Payment"
            required
            id="ivrmmoD_ModeOfPayment"
            {...register("ivrmmoD_ModeOfPayment")}
            error={errors.ivrmmoD_ModeOfPayment?.message}
            className="transition-colors focus:ring-2 focus:ring-primary/20"
          /> */}

                    <InputText
                        label='Mode Of Payment'
                        required
                        id='ivrmmoD_ModeOfPayment'
                        {...register('ivrmmoD_ModeOfPayment', {
                            validate: (value) => /^[A-Za-z0-9 ]*$/.test(value) || 'Only letters, numbers and spaces allowed'
                        })}
                        onKeyDown={(e) => {
                            const allowed = /^[A-Za-z0-9 ]$/;

                            // Block if key is a single character and not allowed
                            if (e.key.length === 1 && !allowed.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        onPaste={(e) => {
                            const pasteText = e.clipboardData.getData('text');
                            if (!/^[A-Za-z0-9 ]*$/.test(pasteText)) {
                                e.preventDefault();
                            }
                        }}
                        error={errors.ivrmmoD_ModeOfPayment?.message}
                        className='transition-colors focus:ring-2 focus:ring-primary/20'
                    />

                    <div className='group flex flex-col gap-1.5'>
                        {/* <InputText
              label="Mode Of Payment Code"
              required
              id="ivrmmoD_ModeOfPayment_Code"
              {...register("ivrmmoD_ModeOfPayment_Code")}
              error={errors.ivrmmoD_ModeOfPayment_Code?.message}
              className="transition-colors focus:ring-2 focus:ring-primary/20"
            />
            {errors.ivrmmoD_ModeOfPayment_Code && (
              <FormError>{errors.ivrmmoD_ModeOfPayment_Code.message}</FormError>
            )} */}

                        <InputText
                            label='Mode Of Payment Code'
                            required
                            id='ivrmmoD_ModeOfPayment_Code'
                            maxLength={1}
                            {...register('ivrmmoD_ModeOfPayment_Code', {
                                validate: (value) => /^[A-Za-z]$/.test(value) || 'Only one alphabet allowed'
                            })}
                            onKeyDown={(e) => {
                                const allowed = /^[A-Za-z]$/;

                                // block numbers & special chars
                                if (e.key.length === 1 && !allowed.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            onPaste={(e) => {
                                const pasteText = e.clipboardData.getData('text');

                                // block paste if not a single alphabet
                                if (!/^[A-Za-z]$/.test(pasteText)) {
                                    e.preventDefault();
                                }
                            }}
                            error={errors.ivrmmoD_ModeOfPayment_Code?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <div>
                            <p>Please choose Code as mentioned below:</p>

                            <p>
                                For Cash, code should be <strong>C</strong>
                            </p>
                            <p>
                                For Bank, code should be <strong>B</strong>
                            </p>
                            <p>
                                For RTGS/NEFT, code should be <strong>R</strong>
                            </p>
                            <p>
                                For Swipe/Card, code should be <strong>S</strong>
                            </p>
                            <p>
                                For UPI, code should be <strong>U</strong>
                            </p>
                        </div>
                    </div>
                </div>

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
                            Update
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
