'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Spinner as LoadingSpinner } from '@/components/ui/spinner';
import { masterSchoolTypeSchema, type MasterSchoolTypeSchema } from '@/schemas/super-admin/super-admin-module/general-setting/master-school-type';
import { saveMasterSchoolType, getMasterSchoolTypeDetails } from '@/server/super-admin/super-admin-module/general-setting/master-school-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useFormContext } from '@/components/ui/form/form-provider';
import { IMasterSchoolType } from '@/types/super-admin/super-admin-module/general-setting/master-school-type';

interface AddMasterSchoolTypeFormProps {
    onSuccess?: () => void;
}

export default function AddMasterSchoolTypeForm({ onSuccess }: AddMasterSchoolTypeFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { closeAddForm, selectedRow } = useFormContext<IMasterSchoolType>();

    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<MasterSchoolTypeSchema>({
        resolver: zodResolver(masterSchoolTypeSchema),
        defaultValues: {
            ivrmmtyP_Id: 0,
            ivrmmtyP_Type: '',
            ivrmmtyP_Description: '',
        },
    });

    useEffect(() => {
        if (selectedRow) {
            // Set initial values from selectedRow immediately using reset (better for form re-initialization)
            reset({
                ivrmmtyP_Id: selectedRow.ivrmmtyP_Id,
                ivrmmtyP_Type: selectedRow.ivrmmtyP_Type,
                ivrmmtyP_Description: selectedRow.ivrmmtyP_Description,
            });

            setIsLoading(true);
            getMasterSchoolTypeDetails(selectedRow.ivrmmtyP_Id).then(res => {
                if (res.success && res.data) {
                    // Update with fresh data
                    reset({
                        ivrmmtyP_Id: res.data.ivrmmtyP_Id,
                        ivrmmtyP_Type: res.data.ivrmmtyP_Type,
                        ivrmmtyP_Description: res.data.ivrmmtyP_Description,
                    });
                }
                setIsLoading(false);
            });
        }
    }, [selectedRow, reset]);

    const onSubmit = async (data: MasterSchoolTypeSchema) => {
        setIsLoading(true);
        try {
            const result = await saveMasterSchoolType(data);
            if (result.success) {
                toast.success('Saved Successfully');
                reset();
                onSuccess?.();
            } else {
                toast.error(result.message || 'Failed to save data');
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
                    <div className="space-y-2">
                        <Label>School Type <span className='text-red-500'>*</span></Label>
                        <Input
                            {...register('ivrmmtyP_Type')}
                            placeholder="Enter School Type"
                        />
                        <FormError>{errors.ivrmmtyP_Type?.message}</FormError>
                    </div>

                    <div className="space-y-2">
                        <Label>School Description <span className='text-red-500'>*</span></Label>
                        <Textarea
                            {...register('ivrmmtyP_Description')}
                            placeholder="Enter School Description"
                            rows={3}
                        />
                        <FormError>{errors.ivrmmtyP_Description?.message}</FormError>
                    </div>
                </div>

                <div className='mt-8 flex justify-center gap-4 border-t pt-4'>
                    <Button
                        type='button'
                        variant='destructive'
                        onClick={closeAddForm}
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
