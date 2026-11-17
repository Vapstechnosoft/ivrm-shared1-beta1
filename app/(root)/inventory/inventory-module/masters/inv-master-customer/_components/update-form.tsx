'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import {
    invMasterCustomerSchema,
    type InvMasterCustomerSchema
} from '@/schemas/inventory/masters/inv-master-customer';
import { useInvMasterCustomer } from '@/hooks/inventory/masters/use-inv-master-customer';
import { Save } from 'lucide-react';
import type { IInvMasterCustomer } from '@/types/inventory/masters/inv-master-customer';
import { useEffect } from 'react';

interface UpdateCustomerFormProps {
    selectedRow: IInvMasterCustomer;
    onSuccess: () => void;
}

export default function UpdateCustomerForm({ selectedRow, onSuccess }: UpdateCustomerFormProps) {
    const { saveMutation } = useInvMasterCustomer();

    const form = useForm<InvMasterCustomerSchema>({
        resolver: zodResolver(invMasterCustomerSchema),
        defaultValues: {
            invmC_Id: selectedRow.invmC_Id,
            invmC_CustomerName: selectedRow.invmC_CustomerName,
            invmC_CustomerContactPerson: selectedRow.invmC_CustomerContactPerson,
            invmC_CustomerContactNo: selectedRow.invmC_CustomerContactNo,
            invmC_CustomerAddress: selectedRow.invmC_CustomerAddress,
            invmC_ActiveFlg: selectedRow.invmC_ActiveFlg
        }
    });

    const { register, handleSubmit, reset, formState: { errors } } = form;

    // Reset form when selectedRow changes (just in case, though modal usually unmounts)
    useEffect(() => {
        if (selectedRow) {
            reset({
                invmC_Id: selectedRow.invmC_Id,
                invmC_CustomerName: selectedRow.invmC_CustomerName,
                invmC_CustomerContactPerson: selectedRow.invmC_CustomerContactPerson,
                invmC_CustomerContactNo: selectedRow.invmC_CustomerContactNo,
                invmC_CustomerAddress: selectedRow.invmC_CustomerAddress,
                invmC_ActiveFlg: selectedRow.invmC_ActiveFlg
            });
        }
    }, [selectedRow, reset]);

    const onSubmit = (data: InvMasterCustomerSchema) => {
        saveMutation.mutate(data, {
            onSuccess: () => {
                onSuccess();
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 p-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <InputText
                    label='Customer Name'
                    placeholder='Enter Customer Name'
                    {...register('invmC_CustomerName')}
                    error={errors.invmC_CustomerName?.message}
                    required
                />

                <InputText
                    label='Contact Person'
                    placeholder='Enter Contact Person'
                    {...register('invmC_CustomerContactPerson')}
                    error={errors.invmC_CustomerContactPerson?.message}
                    required
                />

                <InputText
                    label='Contact Number'
                    placeholder='Enter Contact Number'
                    {...register('invmC_CustomerContactNo')}
                    error={errors.invmC_CustomerContactNo?.message}
                    required
                    maxLength={15}
                />
            </div>

            <div className='grid grid-cols-1 gap-4'>
                <InputTextarea
                    label='Address'
                    placeholder='Enter Customer Address'
                    {...register('invmC_CustomerAddress')}
                    error={errors.invmC_CustomerAddress?.message}
                    required
                    rows={3}
                />
            </div>

            <div className='flex justify-end gap-2 mt-4'>
                <Button type='submit' isLoading={saveMutation.isPending}>
                    <Save className='h-4 w-4 mr-2' />
                    Update
                </Button>
            </div>
        </form>
    );
}
