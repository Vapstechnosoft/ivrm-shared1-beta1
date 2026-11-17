'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRegistrationNumbering } from '@/hooks/admission/preadmission/useConfigurations';
import { transactionnumberingSchema } from '@/schemas/admission/preadmission/academic-year';
import { addOrUpdateTransactionNumbering } from '@/server/admission/preadmission/configuration/transaction_numbering';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof transactionnumberingSchema>;

interface AddRegistrationNumberingFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddRegistrationNumberingForm({ onSuccess, className = '' }: AddRegistrationNumberingFormProps) {
    const { refetchAll } = useRegistrationNumbering();
    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(transactionnumberingSchema),
        defaultValues: {
            prefix_type: 'academic',
            suffix_type: 'academic',
            prefix_particulars: '',
            suffix_particulars: '',
            prefix_numeric_width: 2,
            suffix_starting_from: 1,
            prefix_with_zero: 'no',
            restart_frequency: 'never'
        }
    });

    const prefixType = watch('prefix_type');
    const suffixType = watch('suffix_type');

    // ==========================================
    // ON SUBMIT: Map UI → Exact Payload
    // ==========================================
    const onSubmit = async (data: FormFields) => {
        try {
            const payload = {
                imN_Id: 0,
                imN_AutoManualFlag: '',
                imN_DuplicatesFlag: '',
                imN_StartingNo: data.suffix_starting_from.toString(),
                imN_WidthNumeric: data.prefix_numeric_width.toString(),
                imN_ZeroPrefixFlag: data.prefix_with_zero === 'yes' ? 'Yes' : 'No',
                imN_PrefixAcadYearCode: data.prefix_type === 'academic',
                imN_PrefixParticular: data.prefix_type === 'particulars' ? data.prefix_particulars || '' : '',
                imN_SuffixAcadYearCode: data.suffix_type === 'academic',
                imN_SuffixParticular: data.suffix_type === 'particulars' ? data.suffix_particulars || '' : '',
                imN_RestartNumFlag: data.restart_frequency === 'yearly' ? 'Yearly' : 'Nevere',
                imN_Flag: 'Registration',
                imN_PrefixFinYearCode: data.prefix_type === 'academic',
                imN_PrefixCalYearCode: data.prefix_type === 'academic',
                imN_SuffixFinYearCode: data.suffix_type === 'academic',
                imN_SuffixCalYearCode: data.suffix_type === 'academic'
            };

            const response = await addOrUpdateTransactionNumbering(payload);
            if (response.success) {
                toast.success(response.message ?? 'Saved');
                reset();
                onSuccess?.();
                refetchAll();
            } else {
                toast.error(response.message ?? 'Failed');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to save configuration');
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    {/* === PREFIX SECTION === */}
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        <div className='rounded-md border bg-muted/20 p-4'>
                            <h3 className='mb-3 font-medium text-primary'>Prefix</h3>

                            <Controller
                                name='prefix_type'
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup onValueChange={field.onChange} value={field.value} className='flex items-center gap-6'>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='academic' id='prefix_academic' />
                                            <Label htmlFor='prefix_academic' className='cursor-pointer font-normal'>
                                                Academic Year Code
                                            </Label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='particulars' id='prefix_particulars' />
                                            <Label htmlFor='prefix_particulars' className='cursor-pointer font-normal'>
                                                Particulars
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />

                            <div className='mt-4 '>
                                <div className='space-y-1'>
                                    <Label htmlFor='prefix_particulars_input'>Particulars</Label>
                                    <Controller
                                        name='prefix_particulars'
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id='prefix_particulars_input'
                                                placeholder=''
                                                disabled={prefixType !== 'particulars'}
                                            />
                                        )}
                                    />
                                </div>

                                <div className='mt-3'>
                                    <Label htmlFor='prefix_numeric_width'>Width of numeric Part:</Label>
                                    <Controller
                                        name='prefix_numeric_width'
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id='prefix_numeric_width'
                                                type='number'
                                                placeholder='2'
                                                min='1'
                                                max='10'
                                                className='w-full'
                                            />
                                        )}
                                    />
                                    {errors.prefix_numeric_width && <FormError>{errors.prefix_numeric_width.message}</FormError>}
                                </div>
                            </div>
                        </div>

                        {/* === SUFFIX SECTION === */}
                        <div className='rounded-md border bg-muted/20 p-4'>
                            <h3 className='mb-3 font-medium text-primary'>Suffix</h3>

                            <Controller
                                name='suffix_type'
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup onValueChange={field.onChange} value={field.value} className='flex items-center gap-6'>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='academic' id='suffix_academic' />
                                            <Label htmlFor='suffix_academic' className='cursor-pointer font-normal'>
                                                Academic Year Code
                                            </Label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='particulars' id='suffix_particulars' />
                                            <Label htmlFor='suffix_particulars' className='cursor-pointer font-normal'>
                                                Particulars
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />

                            <div className='mt-4 '>
                                <div className='space-y-1'>
                                    <Label htmlFor='suffix_particulars_input'>Particulars</Label>
                                    <Controller
                                        name='suffix_particulars'
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id='suffix_particulars_input'
                                                placeholder=''
                                                disabled={suffixType !== 'particulars'}
                                            />
                                        )}
                                    />
                                </div>

                                <div className='mt-3'>
                                    <Label htmlFor='suffix_starting_from'>SLNO Starting From:</Label>
                                    <Controller
                                        name='suffix_starting_from'
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id='suffix_starting_from'
                                                type='number'
                                                placeholder='1'
                                                min='1'
                                                className='w-full'
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* === PREFIX WITH ZERO === */}
                    <div className='flex items-start gap-8 rounded-md border bg-muted/20 p-4'>
                        <Label className='font-medium text-primary'>Prefix with Zero:</Label>
                        <Controller
                            name='prefix_with_zero'
                            control={control}
                            render={({ field }) => (
                                <RadioGroup onValueChange={field.onChange} value={field.value} className='flex gap-6'>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value='yes' id='zero_yes' />
                                        <Label htmlFor='zero_yes' className='cursor-pointer'>
                                            Yes
                                        </Label>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value='no' id='zero_no' />
                                        <Label htmlFor='zero_no' className='cursor-pointer'>
                                            No
                                        </Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                    </div>

                    {/* === RESTART NUMBERING === */}
                    <div className='rounded-md border bg-muted/20 p-4'>
                        <h3 className='mb-3 font-medium text-primary'>Restart Numbering</h3>
                        <div className='flex items-center gap-8'>
                            <Label className='text-sm'>Frequency:</Label>
                            <Controller
                                name='restart_frequency'
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup onValueChange={field.onChange} value={field.value} className='flex gap-6'>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='never' id='freq_never' />
                                            <Label htmlFor='freq_never' className='cursor-pointer'>
                                                Never
                                            </Label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='yearly' id='freq_yearly' />
                                            <Label htmlFor='freq_yearly' className='cursor-pointer'>
                                                Yearly
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* === ACTION BUTTONS === */}
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
                        // @ts-ignore – assuming Button has isLoading
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
