'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMasterGroup } from '@/hooks/fees/useMasters';
import { masterGroupSchema } from '@/schemas/fees/masters';
import { addOrUpdateMasterGroup } from '@/server/fees/masters/master_group';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterGroupSchema.addOrUpdate>;

interface MasterGroupsProps {
    onSuccess?: () => void;
    className?: string;
}

export default function MasterGroups({ onSuccess, className = '' }: MasterGroupsProps) {
    const { refetchAll } = useMasterGroup();

    const {
        control,

        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterGroupSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            fmG_CompulsoryFlag: false,
            studentType: 'regular'
        }
    });

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { fmG_GroupName, fmG_Remarks, transportHostelType, studentType, fmG_CompulsoryFlag } = data;

            const payload = {
                fmG_Id: 0,
                // mI_Id: 30,
                fmG_GroupName: fmG_GroupName,
                fmG_Remarks: fmG_Remarks,
                fmG_CompulsoryFlag: fmG_CompulsoryFlag ? '1' : '0',
                fmG_ActiceFlag: true,
                // user_id: 21602,
                returnval: false,
                ivrmR_Id: 0,
                is_Active: true,
                retvalue: false,
                asmaY_Id: 0,
                fmG_PRE_FLAG: '',
                fmG_RegNewFlg: studentType === 'regular' ? 'R' : 'N',
                fmG_HostelFlg: transportHostelType === 'hostel',
                fmG_TransportFlg: transportHostelType === 'transport',
                fmG_BatchwiseFeeApplFlg: false
            };

            const response = await addOrUpdateMasterGroup(payload);
            if (response.success) {
                toast.success(response.message);
                reset({
                    transportHostelType: '' as any,
                    studentType: '' as any,
                    fmG_CompulsoryFlag: false
                });
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
        reset({
            fmG_GroupName: '',
            fmG_Remarks: '',
            transportHostelType: undefined,
            fmG_CompulsoryFlag: false
        });
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Fee Group'
                            required
                            id='fmG_GroupName'
                            {...register('fmG_GroupName')}
                            error={errors.fmG_GroupName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        {/* <InputText
                            label='Fee Group'
                            required
                            id='fmG_GroupName'
                            {...register('fmG_GroupName', {
                                required: 'Fee Group is required'
                            })}
                            onKeyDown={(e) => {
                                const allowed = /^[A-Za-z\s]$/;

                                // Allow navigation keys
                                if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                                    return;
                                }

                                // Block characters that are not letters/spaces
                                if (!allowed.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            error={errors.fmG_GroupName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        /> */}

                        <div className='group flex flex-col gap-1.5'>
                            <InputTextarea
                                label='Remarks'
                                required
                                id='fmG_Remarks'
                                {...register('fmG_Remarks')}
                                error={errors.fmG_Remarks?.message}
                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                            />
                            {/* {errors.fmG_Remarks && <FormError>{errors.fmG_Remarks.message}</FormError>} */}
                        </div>
                    </div>

                    <div className='flex flex-row items-center justify-center space-x-4'>
                        <Controller
                            name='transportHostelType'
                            control={control}
                            render={({ field }) => (
                                <RadioGroup value={field.value ?? ''} onValueChange={field.onChange} className='flex items-center gap-4'>
                                    <div className='flex items-center justify-center gap-1'>
                                        <RadioGroupItem value='transport' id='transport' />
                                        <Label htmlFor='transport' className='cursor-pointer text-gray-600 text-sm'>
                                            Transport
                                        </Label>
                                    </div>

                                    <div className='flex items-center justify-center gap-1'>
                                        <RadioGroupItem value='hostel' id='hostel' />
                                        <Label htmlFor='hostel' className='cursor-pointer text-gray-600 text-sm'>
                                            Hostel
                                        </Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />

                        <div className='flex items-center gap-1'>
                            <Controller
                                name='fmG_CompulsoryFlag'
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Checkbox id='compulsory' checked={field.value} onCheckedChange={field.onChange} />
                                        <Label htmlFor='compulsory' className='cursor-pointer text-gray-600 text-sm'>
                                            Compulsory
                                        </Label>
                                    </>
                                )}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <div className='flex flex-row items-center justify-center space-x-4'>
                            <Controller
                                name='studentType'
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        value={field.value ?? ''}
                                        onValueChange={field.onChange}
                                        className='flex items-center gap-4'>
                                        <div className='flex items-center justify-center gap-1'>
                                            <RadioGroupItem value='regular' id='regular' />
                                            <Label htmlFor='regular' className='cursor-pointer text-gray-600 text-sm'>
                                                Regular
                                            </Label>
                                        </div>

                                        <div className='flex items-center justify-center gap-1'>
                                            <RadioGroupItem value='newstudent' id='newstudent' />
                                            <Label htmlFor='newstudent' className='cursor-pointer text-gray-600 text-sm'>
                                                New Student
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                        </div>
                        {errors.studentType && <FormError>{errors.studentType.message}</FormError>}
                    </div>

                    {/* Root Error */}
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                {/* Action Buttons */}
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
                            Save Master Group
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
