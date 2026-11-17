'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputText } from '@/components/ui/extension/input-text';
import { Button } from '@/components/ui/button';
import { useInvMasterTax } from '@/hooks/inventory/masters/use-inv-master-tax';

import { saveInvMasterTax } from '@/server/inventory/masters/inv-master-tax';
import { toast } from 'sonner';
import type { IInvMasterTax } from '@/types/inventory/masters/inv-master-tax';
import { useEffect } from 'react';

import { invMasterTaxSchema } from '@/schemas/inventory/masters/inv-master-tax';
import { z } from 'zod';

interface UpdateInvMasterTaxFormProps {
    selectedRow: IInvMasterTax;
    onSuccess: () => void;
}

type InvMasterTaxSchema = z.infer<typeof invMasterTaxSchema.addOrUpdate>;

export default function UpdateInvMasterTaxForm({ selectedRow, onSuccess }: UpdateInvMasterTaxFormProps) {
    const { refetchAll } = useInvMasterTax();

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors }
    } = useForm<InvMasterTaxSchema>({
        resolver: zodResolver(invMasterTaxSchema.addOrUpdate),
        defaultValues: {
            INVMT_TaxName: selectedRow.invmT_TaxName,
            INVMT_TaxAliasName: selectedRow.invmT_TaxAliasName,
            INVMT_ActiveFlg: selectedRow.invmT_ActiveFlg
        }
    });

    useEffect(() => {
        if (selectedRow) {
            reset({
                INVMT_TaxName: selectedRow.invmT_TaxName,
                INVMT_TaxAliasName: selectedRow.invmT_TaxAliasName,
                INVMT_ActiveFlg: selectedRow.invmT_ActiveFlg
            });
        }
    }, [selectedRow, reset]);

    const onSubmit = async (data: InvMasterTaxSchema) => {
        try {
            // Using PascalCase for payload as requested
            const payload = {
                INVMT_Id: selectedRow.invmT_Id,
                INVMT_TaxName: data.INVMT_TaxName,
                INVMT_TaxAliasName: data.INVMT_TaxAliasName,
                INVMT_ActiveFlg: data.INVMT_ActiveFlg
            };

            const result = await saveInvMasterTax(payload);

            if (result.success || result.returnval) {
                toast.success(result.message || 'Record updated successfully');
                refetchAll();
                onSuccess();
            } else if (result.returnduplicatestatus === 'Duplicate' || result.message === 'Duplicate') {
                toast.error('Record already exists');
            } else {
                toast.error(result.message || 'Failed to update record');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 p-4'>
            <div className='flex flex-col gap-4'>
                <InputText
                    label='Tax Name'
                    required
                    id='INVMT_TaxName'
                    {...register('INVMT_TaxName')}
                    error={errors.INVMT_TaxName?.message}
                />

                <InputText
                    label='Alias Name'
                    id='INVMT_TaxAliasName'
                    {...register('INVMT_TaxAliasName')}
                    error={errors.INVMT_TaxAliasName?.message}
                />
            </div>

            <div className='flex justify-end gap-2 pt-4'>
                <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update'}
                </Button>
            </div>
        </form>
    );
}
