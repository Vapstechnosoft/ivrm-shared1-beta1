'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner as LoadingSpinner } from '@/components/ui/spinner';
import { masterPageSchema, type MasterPageSchema } from '@/schemas/super-admin/super-admin-module/general-setting/master-page';
import { getMasterPageById, saveMasterPage } from '@/server/super-admin/super-admin-module/general-setting/master-page';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterPage } from '@/types/super-admin/super-admin-module/general-setting/master-page';

interface AddMasterPageFormProps {
    onSuccess?: () => void;
}

export default function AddMasterPageForm({ onSuccess }: AddMasterPageFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { selectedRow } = useFormContext<IMasterPage>();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<MasterPageSchema>({
        resolver: zodResolver(masterPageSchema),
        defaultValues: {
            ivrmmP_PageName: '',
            ivrmP_PageDisplayName: '',
            ivrmP_PageDesc: '',
            ivrmP_MandatoryFlag: 1,
        },
    });

    useEffect(() => {
        const fetchDetails = async () => {
            if (selectedRow?.ivrmP_Id) {
                setIsLoading(true);
                try {
                    const response = await getMasterPageById(selectedRow.ivrmP_Id);
                    if (response.success && response.data) {
                        reset({
                            ...response.data,
                            ivrmP_MandatoryFlag: response.data.ivrmP_MandatoryFlag === null ? 0 : (typeof response.data.ivrmP_MandatoryFlag === 'boolean' ? (response.data.ivrmP_MandatoryFlag ? 1 : 0) : response.data.ivrmP_MandatoryFlag),
                        });
                    } else {
                        toast.error('Failed to load page details');
                        reset({
                            ...selectedRow,
                            ivrmP_MandatoryFlag: selectedRow.ivrmP_MandatoryFlag ? 1 : 0
                        });
                    }
                } catch (error) {
                    console.error('Error fetching page details', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                reset({
                    ivrmmP_PageName: '',
                    ivrmP_PageDisplayName: '',
                    ivrmP_PageDesc: '',
                    ivrmP_MandatoryFlag: 1,
                });
            }
        };

        fetchDetails();
    }, [selectedRow, reset]);

    const onSubmit = async (data: MasterPageSchema) => {
        setIsLoading(true);
        try {
            const payload = {
                ...selectedRow,
                ...data,
                ivrmP_Id: selectedRow?.ivrmP_Id || 0,
            };

            const result = await saveMasterPage(payload);
            if (result.success) {
                toast.success(result.message);
                reset();
                onSuccess?.();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='p-4'>
                <div className='mx-auto max-w-2xl space-y-4'>
                    <div className='grid grid-cols-12 items-center gap-4'>
                        <Label className='col-span-12 md:col-span-4 text-left md:text-right'>
                            Page Name: <span className='text-red-500'>*</span>
                        </Label>
                        <div className='col-span-12 md:col-span-8'>
                            <Controller
                                control={control}
                                name='ivrmmP_PageName'
                                render={({ field }) => (
                                    <InputText
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder='Enter Page Name'
                                        maxLength={100}
                                    />
                                )}
                            />
                            <FormError>{errors.ivrmmP_PageName?.message}</FormError>
                        </div>
                    </div>

                    <div className='grid grid-cols-12 items-center gap-4'>
                        <Label className='col-span-12 md:col-span-4 text-left md:text-right'>
                            Display Name: <span className='text-red-500'>*</span>
                        </Label>
                        <div className='col-span-12 md:col-span-8'>
                            <Controller
                                control={control}
                                name='ivrmP_PageDisplayName'
                                render={({ field }) => (
                                    <InputText
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder='Enter Display Name'
                                        maxLength={100}
                                    />
                                )}
                            />
                            <FormError>{errors.ivrmP_PageDisplayName?.message}</FormError>
                        </div>
                    </div>

                    <div className='grid grid-cols-12 items-center gap-4'>
                        <Label className='col-span-12 md:col-span-4 text-left md:text-right'>
                            Page URL: <span className='text-red-500'>*</span>
                        </Label>
                        <div className='col-span-12 md:col-span-8'>
                            <Controller
                                control={control}
                                name='ivrmP_PageDesc'
                                render={({ field }) => (
                                    <InputText
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder='Enter Page URL'
                                        maxLength={100}
                                    />
                                )}
                            />
                            <FormError>{errors.ivrmP_PageDesc?.message}</FormError>
                        </div>
                    </div>

                    <div className='grid grid-cols-12 items-center gap-4'>
                        <Label className='col-span-12 md:col-span-4 text-left md:text-right'>
                            Page Mandatory?: <span className='text-red-500'>*</span>
                        </Label>
                        <div className='col-span-12 md:col-span-8 flex items-center gap-4'>
                            <Controller
                                control={control}
                                name="ivrmP_MandatoryFlag"
                                render={({ field }) => (
                                    <RadioGroup
                                        className="flex gap-4"
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={String(field.value)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="1" id="r1" />
                                            <Label htmlFor="r1">Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="0" id="r2" />
                                            <Label htmlFor="r2">No</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                            <FormError>{errors.ivrmP_MandatoryFlag?.message}</FormError>
                        </div>
                    </div>
                </div>

                <div className='mt-8 flex justify-center gap-4 border-t pt-4'>
                    <Button
                        type='button'
                        variant='destructive'
                        onClick={() => { reset(); onSuccess?.(); }}
                        className='bg-red-500 hover:bg-red-600 w-32'
                    >
                        <X className='mr-2 h-4 w-4' />
                        Cancel
                    </Button>

                    <Button
                        type='submit'
                        disabled={isLoading}
                        className='bg-blue-600 hover:bg-blue-700 w-32'
                    >
                        {isLoading ? <LoadingSpinner /> : <Save className='mr-2 h-4 w-4' />}
                        Save
                    </Button>
                </div>
            </div>
        </form>
    );
}
