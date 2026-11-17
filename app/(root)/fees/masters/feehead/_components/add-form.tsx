'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';

import { InputText } from '@/components/ui/extension/input-text';

import { useMasterFeehead } from '@/hooks/fees/useMasters';
import { masterFeeheadSchema } from '@/schemas/fees/masters';

import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addOrUpdateMasterfeehead } from '@/server/fees/masters/feehead';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterFeeheadSchema.addOrUpdate>;

interface AddMasterFeeHeadProps {
    onSuccess?: () => void;
    headname?: string;
}

export default function AddMasterFeeHeadForm({ onSuccess, headname = '' }: AddMasterFeeHeadProps) {
    const { refetchAll } = useMasterFeehead();

    const {
        control,
        watch,
        setValue,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterFeeheadSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            fmH_Order: 0,
            fmH_Flag: ''
        }
    });

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { fmH_FeeName, fmH_Flag, fmH_RefundFlag, fmH_PDAFlag, fmH_SpecialFeeFlag } = data;
            const payload = {
                // mi_id: 30,
                fmH_FeeName: fmH_FeeName,
                fmH_Flag: fmH_Flag,
                fmH_RefundFlag: fmH_RefundFlag,
                fmH_PDAFlag: fmH_PDAFlag,
                fmH_SpecialFeeFlag: fmH_SpecialFeeFlag
            };
            console.log('PALOAD', JSON.stringify(payload));
            const response = await addOrUpdateMasterfeehead(payload);
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
        <div className={`${headname}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                        {/* <InputText
                            label='Fee Head'
                            required
                            id='fmH_FeeName'
                            {...register('fmH_FeeName')}
                            error={errors.fmH_FeeName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        /> */}
                        <InputText
                            label='Fee Head'
                            required
                            id='fmH_FeeName'
                            {...register('fmH_FeeName', {
                                validate: (value) => /^[A-Za-z0-9 ]+$/.test(value) || 'Only letters, numbers and spaces allowed'
                            })}
                            onKeyDown={(e) => {
                                const allowed = /^[A-Za-z0-9 ]$/;
                                if (!allowed.test(e.key) && e.key.length === 1) {
                                    e.preventDefault(); // block typing of special chars
                                }
                            }}
                            onPaste={(e) => {
                                const pasteData = e.clipboardData.getData('text');
                                if (!/^[A-Za-z0-9 ]+$/.test(pasteData)) {
                                    e.preventDefault(); // block pasting special chars
                                }
                            }}
                            error={errors.fmH_FeeName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label=' Fee Head Type' htmlFor='fmH_Flag'>
                                Fee Head Type<span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='fmH_Flag'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value || ''}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Fee Head Type' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem key='General' value='G'>
                                                General
                                            </SelectItem>
                                            <SelectItem key='Transport' value='T'>
                                                Transport
                                            </SelectItem>
                                            <SelectItem key='ExcessAmount' value='E'>
                                                ExcessAmount
                                            </SelectItem>
                                            <SelectItem key='Registration' value='R'>
                                                Registration
                                            </SelectItem>
                                            <SelectItem key='Application' value='A'>
                                                Application
                                            </SelectItem>
                                            <SelectItem key='Hostel' value='H'>
                                                Hostel
                                            </SelectItem>
                                            <SelectItem key='New Admission' value='N'>
                                                New Admission
                                            </SelectItem>
                                            <SelectItem key='Swiping' value='S'>
                                                Swiping
                                            </SelectItem>
                                            <SelectItem key='Fine' value='F'>
                                                Fine
                                            </SelectItem>
                                            <SelectItem key='Transport Registration' value='TR'>
                                                Transport Registration
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.fmH_Flag && <FormError>{errors.fmH_Flag.message}</FormError>}
                        </div>

                        <div className='group flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='fmH_SpecialFeeFlag'
                                    control={control}
                                    defaultValue={false}
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} id='specialFeeHead' />
                                            <Label htmlFor='specialFeeHead'>Special Fee Head</Label>
                                        </div>
                                    )}
                                />
                                <Controller
                                    name='fmH_PDAFlag'
                                    control={control}
                                    defaultValue={false}
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} id='pdaExpense' />
                                            <Label htmlFor='pdaExpense'>PDA Expense</Label>
                                        </div>
                                    )}
                                />
                                <Controller
                                    name='fmH_RefundFlag'
                                    control={control}
                                    defaultValue={false}
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} id='refundable' />
                                            <Label htmlFor='refundable'>Refundable</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {errors.root && <FormError>{errors.root.message}</FormError>}
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
                            Save Master Fees Head
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
