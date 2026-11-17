'use client';
import { Button } from '@/components/ui/button';
import { RefreshCw, Save, X } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { AppointmentLetter } from './columns';
export type AppointmentLetterFormData = Record<string, unknown>;
interface AppointmentLetterFormProps {
    editingAppointmentLetter: AppointmentLetter | null;
    onSubmit: (data: AppointmentLetterFormData) => void;
    onCancel: () => void;
}
export function AppointmentLetterForm({ editingAppointmentLetter, onSubmit, onCancel }: AppointmentLetterFormProps) {
    const {
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<AppointmentLetterFormData>({
        mode: 'onChange',
        defaultValues: ((editingAppointmentLetter as any) || {}) as AppointmentLetterFormData
    });
    const handleFormSubmit: SubmitHandler<AppointmentLetterFormData> = async (data) => {
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
