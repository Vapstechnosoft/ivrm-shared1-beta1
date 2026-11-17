'use client';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { LeavingReason } from './columns';
export type LeavingReasonFormData = Record<string, unknown>;
interface LeavingReasonFormProps {
    editingLeavingReason: LeavingReason | null;
    onSubmit: (data: LeavingReasonFormData) => void;
    onCancel: () => void;
}
export function LeavingReasonForm({ editingLeavingReason, onSubmit, onCancel }: LeavingReasonFormProps) {
    const { handleSubmit } = useForm<LeavingReasonFormData>({
        mode: 'onChange',
        defaultValues: (editingLeavingReason as any) || {}
    });
    const handleFormSubmit: SubmitHandler<LeavingReasonFormData> = async (data) => {
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
                <Button type='submit' disabled={false}>
                    <div className='flex items-center'>
                        <Save className='mr-2 h-4 w-4' />
                        Save
                    </div>
                </Button>
            </div>
        </form>
    );
}
