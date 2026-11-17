'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { Spinner as LoadingSpinner } from '@/components/ui/spinner';
import { masterModuleSchema, type MasterModuleSchema } from '@/schemas/super-admin/super-admin-module/general-setting/module';
import { saveMasterModule } from '@/server/super-admin/super-admin-module/general-setting/module';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useFormContext } from '@/components/ui/form/form-provider';
import { getMasterModuleById } from '@/server/super-admin/super-admin-module/general-setting/module';
import type { IMasterModule } from '@/types/super-admin/super-admin-module/general-setting/module';
import { useEffect } from 'react';

interface AddMasterModuleFormProps {
    onSuccess?: () => void;
}

export default function AddMasterModuleForm({ onSuccess }: AddMasterModuleFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<MasterModuleSchema>({
        resolver: zodResolver(masterModuleSchema),
        defaultValues: {
            ivrmM_ModuleName: '',
            ivrmM_ModuleDesc: '',
            module_ActiveFlag: 1,
        },
    });

    const { selectedRow } = useFormContext<IMasterModule>();

    useEffect(() => {
        const fetchDetails = async () => {
            if (selectedRow?.ivrmM_Id) {
                setIsLoading(true);
                try {
                    const response = await getMasterModuleById(selectedRow.ivrmM_Id);
                    if (response.success && response.data) {
                        reset(response.data);
                    } else {
                        toast.error('Failed to load module details');
                    }
                } catch (error) {
                    console.error('Error fetching module details', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                reset({
                    ivrmM_ModuleName: '',
                    ivrmM_ModuleDesc: '',
                    module_ActiveFlag: 1,
                });
            }
        };

        fetchDetails();
    }, [selectedRow, reset]);

    const onSubmit = async (data: MasterModuleSchema) => {
        setIsLoading(true);
        try {
            const payload = {
                ...data,
                ivrmM_Id: selectedRow?.ivrmM_Id || 0,
                userid: selectedRow?.userid || 0,
                createdDate: selectedRow?.createdDate || new Date().toISOString(),
                updatedDate: new Date().toISOString(),
                module_ActiveFlag: selectedRow?.module_ActiveFlag ?? data.module_ActiveFlag ?? 1, // Prefer existing, then form default (if added), then 1
            };

            const result = await saveMasterModule(payload);
            if (result.success) {
                toast.success('Master Module Saved Successfully');
                reset();
                onSuccess?.();
            } else {
                toast.error(result.message || 'Failed to save module');
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
                            Module Name: <span className='text-red-500'>*</span>
                        </Label>
                        <div className='col-span-12 md:col-span-8'>
                            <Controller
                                control={control}
                                name='ivrmM_ModuleName'
                                render={({ field }) => (
                                    <InputText
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder='Enter Module Name'
                                        maxLength={20}
                                    />
                                )}
                            />
                            <FormError>{errors.ivrmM_ModuleName?.message}</FormError>
                        </div>
                    </div>

                    <div className='grid grid-cols-12 items-center gap-4'>
                        <Label className='col-span-12 md:col-span-4 text-left md:text-right'>
                            Module Description: <span className='text-red-500'>*</span>
                        </Label>
                        <div className='col-span-12 md:col-span-8'>
                            <Controller
                                control={control}
                                name='ivrmM_ModuleDesc'
                                render={({ field }) => (
                                    <InputTextarea
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder='Enter Module Description'
                                        maxLength={200}
                                    />
                                )}
                            />
                            <FormError>{errors.ivrmM_ModuleDesc?.message}</FormError>
                        </div>
                    </div>
                </div>

                <div className='mt-8 flex justify-center gap-4 border-t pt-4'>
                    {/* Cancel Left */}
                    <Button
                        type='button'
                        variant='destructive'
                        onClick={() => { reset(); onSuccess?.(); }}
                        className='bg-red-500 hover:bg-red-600 w-32'
                    >
                        <X className='mr-2 h-4 w-4' />
                        Cancel
                    </Button>

                    {/* Save Right */}
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
