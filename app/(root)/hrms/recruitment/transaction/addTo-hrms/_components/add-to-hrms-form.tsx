'use client';
import { Button } from '@/components/ui/button';
import { RefreshCw, Save, X } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { HRMSEmployee } from './columns';
export type AddToHRMSFormData = Record<string, unknown>;
interface AddToHRMSFormProps {
    editingAddToHRMS: HRMSEmployee | null;
    onSubmit: (data: AddToHRMSFormData) => void;
    onCancel: () => void;
}
export function AddToHRMSForm({ editingAddToHRMS, onSubmit, onCancel }: AddToHRMSFormProps) {
    const {
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<AddToHRMSFormData>({
        mode: 'onChange',
        defaultValues: ((editingAddToHRMS as any) || {}) as AddToHRMSFormData
    });
    const handleFormSubmit: SubmitHandler<AddToHRMSFormData> = async (data) => {
        onSubmit(data);
    };
    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* TODO: Add form fields */}
            <div className='flex justify-center gap-4 border-t pt-6 md:col-span-2'>
                <Button type='button' variant='outline' onClick={onCancel}>
                    <X className='mr-2 h-4 w-4' />
                    Cancel
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? (
                        <div className='flex items-center'>
                            <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                            Saving...
                        </div>
                    ) : (
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save
                        </div>
                    )}
                </Button>
            </div>
        </form>
    );
}
