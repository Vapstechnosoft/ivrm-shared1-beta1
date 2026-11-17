'use client';
import { Button } from '@/components/ui/button';
import { RefreshCw, Save, X } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { MRF } from './columns';
export type MRFFormData = Record<string, unknown>;
interface MRFFormProps {
    editingMRF: MRF | null;
    onSubmit: (data: MRFFormData) => void;
    onCancel: () => void;
}
export function MRFForm({ editingMRF, onSubmit, onCancel }: MRFFormProps) {
    const {
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<MRFFormData>({
        mode: 'onChange',
        defaultValues: ((editingMRF as any) || {}) as MRFFormData
    });
    const handleFormSubmit: SubmitHandler<MRFFormData> = async (data) => {
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
