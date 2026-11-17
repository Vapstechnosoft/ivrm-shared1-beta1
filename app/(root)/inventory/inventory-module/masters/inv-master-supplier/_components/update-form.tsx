'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInvMasterSupplier } from '@/hooks/inventory/masters/use-inv-master-supplier';
import { invMasterSupplierSchema, type InvMasterSupplierSchema } from '@/schemas/inventory/masters/inv-master-supplier';
import { saveInvMasterSupplier } from '@/server/inventory/masters/inv-master-supplier';
import { toast } from 'sonner';
import type { IInvMasterSupplier } from '@/types/inventory/masters/inv-master-supplier';

interface UpdateInvMasterSupplierFormProps {
    onSuccess: () => void;
    selectedRow: IInvMasterSupplier;
}

export default function UpdateInvMasterSupplierForm({ onSuccess, selectedRow }: UpdateInvMasterSupplierFormProps) {
    const { refetchAll } = useInvMasterSupplier();
    const {
        control,
        handleSubmit,
        formState: { isSubmitting, errors }
    } = useForm<InvMasterSupplierSchema & { invmS_ActiveFlg?: boolean }>({
        resolver: zodResolver(invMasterSupplierSchema),
        defaultValues: {
            invmS_Id: selectedRow.invmS_Id,
            invmS_SupplierName: selectedRow.invmS_SupplierName,
            invmS_SupplierCode: selectedRow.invmS_SupplierCode || '',
            invmS_SupplierConatctPerson: selectedRow.invmS_SupplierConatctPerson || '',
            invmS_SupplierConatctNo: selectedRow.invmS_SupplierConatctNo,
            invmS_EmailId: selectedRow.invmS_EmailId,
            invmS_GSTNo: selectedRow.invmS_GSTNo || '',
            invmS_SupplierAddress: selectedRow.invmS_SupplierAddress || '',
            invmS_ActiveFlg: selectedRow.invmS_ActiveFlg,
        } as any
    });

    const onInvalid = (errors: any) => {
        console.error('UpdateInvMasterSupplierForm: Validation errors:', errors);
    };

    const onSubmit = async (data: InvMasterSupplierSchema) => {
        console.log('UpdateInvMasterSupplierForm: onSubmit triggered with data:', data);
        try {
            const result = await saveInvMasterSupplier(data);
            if (result.success || result.returnval) {
                toast.success(result.message || 'Record updated successfully');
                refetchAll();
                onSuccess();
            } else if (result.returnduplicatestatus === 'Duplicate') {
                toast.error('Record already exists');
            } else {
                toast.error(result.message || 'Failed to update record');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='space-y-4 p-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                    <Label htmlFor='invmS_SupplierName'>
                        Supplier Name <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='invmS_SupplierName'
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id='invmS_SupplierName'
                                placeholder='Enter Supplier Name'
                                className={errors.invmS_SupplierName ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.invmS_SupplierName && (
                        <p className='text-red-500 text-xs'>{errors.invmS_SupplierName.message}</p>
                    )}
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='invmS_SupplierCode'>Supplier Code</Label>
                    <Controller
                        name='invmS_SupplierCode'
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id='invmS_SupplierCode'
                                placeholder='Enter Supplier Code'
                            />
                        )}
                    />
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='invmS_SupplierConatctPerson'>Contact Person</Label>
                    <Controller
                        name='invmS_SupplierConatctPerson'
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id='invmS_SupplierConatctPerson'
                                placeholder='Enter Contact Person'
                            />
                        )}
                    />
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='invmS_SupplierConatctNo'>
                        Contact Number <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='invmS_SupplierConatctNo'
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id='invmS_SupplierConatctNo'
                                placeholder='Enter Contact Number'
                                maxLength={10}
                                className={errors.invmS_SupplierConatctNo ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.invmS_SupplierConatctNo && (
                        <p className='text-red-500 text-xs'>{errors.invmS_SupplierConatctNo.message}</p>
                    )}
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='invmS_EmailId'>
                        Email ID <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='invmS_EmailId'
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id='invmS_EmailId'
                                placeholder='Enter Email ID'
                                className={errors.invmS_EmailId ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.invmS_EmailId && (
                        <p className='text-red-500 text-xs'>{errors.invmS_EmailId.message}</p>
                    )}
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='invmS_GSTNo'>GST No.</Label>
                    <Controller
                        name='invmS_GSTNo'
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id='invmS_GSTNo'
                                placeholder='Enter GST No.'
                            />
                        )}
                    />
                </div>

                <div className='space-y-2 md:col-span-2'>
                    <Label htmlFor='invmS_SupplierAddress'>Supplier Address</Label>
                    <Controller
                        name='invmS_SupplierAddress'
                        control={control}
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                id='invmS_SupplierAddress'
                                placeholder='Enter Supplier Address'
                                rows={3}
                            />
                        )}
                    />
                </div>
            </div>

            <div className='flex justify-end gap-2'>
                <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update'}
                </Button>
            </div>
        </form>
    );
}
