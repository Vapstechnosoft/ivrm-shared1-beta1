'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMasterDocument } from '@/hooks/admission/preadmission/useMasters';
import { masterDocumentSchema } from '@/schemas/admission/preadmission/masters';
import { addOrUpdateMasterDocument } from '@/server/admission/preadmission/masters/document';
import type { IMasterDocumentList } from '@/types/admission/preadmission/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterDocumentSchema.addOrUpdate>;

interface UpdateMasterDocumentFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterDocumentList;
}

export default function UpdateMasterDocumentForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterDocumentFormProps) {
    const { refetchAll } = useMasterDocument();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterDocumentSchema.addOrUpdate),
        mode: 'onChange'
    });

    // Pre-fill form with selected row data (if available)
    useEffect(() => {
        if (row) {
            reset({
                amsmD_DocumentName: row.amsmD_DocumentName || '',
                amsmD_Description: row.amsmD_Description || '',
                amsmD_FLAG: row.amsmD_FLAG ? 1 : 0
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                amsmD_Id: row.amsmD_Id,
                amsmD_DocumentName: data?.amsmD_DocumentName,
                amsmD_Description: data?.amsmD_Description,
                amsmD_FLAG: data?.amsmD_FLAG === 1
            };
            const response = await addOrUpdateMasterDocument(payload);

            if (response?.success) {
                toast.success('Document updated successfully!');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        {/* Document Name */}
                        <InputText
                            label='Document Name'
                            required
                            id='amsmD_DocumentName'
                            {...register('amsmD_DocumentName')}
                            error={errors.amsmD_DocumentName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        {/* Description */}
                        <InputTextarea
                            label='Description'
                            id='amsmD_Description'
                            placeholder='Enter description'
                            {...register('amsmD_Description')}
                            error={errors.amsmD_Description?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                            minHeight={20}
                        />

                        {/* Is Mandatory */}
                        <div className='group flex flex-col gap-1.5 space-y-2'>
                            <Label aria-label='Document Is Mandatory' htmlFor='amsmD_FLAG'>
                                Document Is Mandatory <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='amsmD_FLAG'
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        value={String(field.value)}
                                        onValueChange={(value) => setValue('amsmD_FLAG', Number(value))}
                                        className='flex gap-4'>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='1' id='yes' />
                                            <Label htmlFor='yes'>Yes</Label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='0' id='no' />
                                            <Label htmlFor='no'>No</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                            {errors.amsmD_FLAG && <FormError>{errors.amsmD_FLAG.message}</FormError>}
                        </div>
                    </div>

                    <div className='text-grey-600 text-sm'>
                        Note: Only files with formats <span className='font-medium'>pdf, jpg, jpeg, png</span> are accepted.
                    </div>
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
                            Save Document
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
