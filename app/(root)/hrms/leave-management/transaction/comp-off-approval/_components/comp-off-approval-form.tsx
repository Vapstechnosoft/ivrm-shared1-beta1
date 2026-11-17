'use client';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { CompOffApproval } from './columns';
export type CompOffApprovalFormData = Record<string, unknown>;
interface CompOffApprovalFormProps {
    editingCompOffApproval: CompOffApproval | null;
    onSubmit: (data: CompOffApprovalFormData) => void;
    onCancel: () => void;
}
export function CompOffApprovalForm({ editingCompOffApproval, onSubmit, onCancel }: CompOffApprovalFormProps) {
    const { handleSubmit } = useForm<CompOffApprovalFormData>({
        mode: 'onChange',
        defaultValues: (editingCompOffApproval as any) || {}
    });
    const handleFormSubmit: SubmitHandler<CompOffApprovalFormData> = async (data) => {
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
                <Button type='submit' variant='default' disabled={false}>
                    <Save className='mr-2 h-4 w-4' />
                    Save
                </Button>
            </div>
        </form>
    );
}
