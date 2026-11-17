'use client';
import { Button } from '@/components/ui/button';
import { RefreshCw, Save, X } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { CallLetter } from './columns';
export type CallLetterFormData = Record<string, unknown>;
interface CallLetterFormProps {
    editingCallLetter: CallLetter | null;
    onSubmit: (data: CallLetterFormData) => void;
    onCancel: () => void;
}
export function CallLetterForm({ editingCallLetter, onSubmit, onCancel }: CallLetterFormProps) {
    const {
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<CallLetterFormData>({
        mode: 'onChange',
        defaultValues: ((editingCallLetter as any) || {}) as CallLetterFormData
    });
    const handleFormSubmit: SubmitHandler<CallLetterFormData> = async (data) => {
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
