'use client';
import { Button } from '@/components/ui/button';
import { RefreshCw, Save, X } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { MasterLocation } from './columns';
export type LocationFormData = Record<string, unknown>;
interface LocationFormProps {
    editingLocation: MasterLocation | null;
    onSubmit: (data: LocationFormData) => void;
    onCancel: () => void;
}
export function LocationForm({ editingLocation, onSubmit, onCancel }: LocationFormProps) {
    const {
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<LocationFormData>({
        mode: 'onChange',
        defaultValues: (editingLocation as any) || {}
    });
    const handleFormSubmit: SubmitHandler<LocationFormData> = async (data) => {
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
