'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useInvMasterUom } from '@/hooks/inventory/masters/use-inv-master-uom';
import { invMasterUOMSchema, type InvMasterUOMType } from '@/schemas/inventory/masters/inv-master-uom';
import { deactivateInvMasterUOM, saveInvMasterUOM } from '@/server/inventory/masters/inv-master-uom';
import type { IInvMasterUOM } from '@/types/inventory/masters/inv-master-uom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface UOMFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow?: IInvMasterUOM;
}

export default function UOMForm({ onSuccess, className = '', selectedRow }: UOMFormProps) {
    const { refetchAll } = useInvMasterUom();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<InvMasterUOMType>({
        resolver: zodResolver(invMasterUOMSchema),
        mode: 'onChange',
        defaultValues: {
            invmuoM_Id: 0,
            invmuoM_UOMName: '',
            invmuoM_UOMAliasName: '',
            invmuoM_Qty: '',
            invmuoM_ActiveFlg: true
        }
    });

    useEffect(() => {
        if (selectedRow) {
            setValue('invmuoM_Id', selectedRow.invmuoM_Id);
            setValue('invmuoM_UOMName', selectedRow.invmuoM_UOMName);
            setValue('invmuoM_UOMAliasName', selectedRow.invmuoM_UOMAliasName || '');
            setValue('invmuoM_Qty', selectedRow.invmuoM_Qty);
            setValue('invmuoM_ActiveFlg', selectedRow.invmuoM_ActiveFlg);
        } else {
            reset({
                invmuoM_Id: 0,
                invmuoM_UOMName: '',
                invmuoM_UOMAliasName: '',
                invmuoM_Qty: '',
                invmuoM_ActiveFlg: true
            });
        }
    }, [selectedRow, setValue, reset]);

    const onInvalid = (err: any) => {
        console.error('UOMForm: Validation Errors:', err);
    };

    const onSubmit: SubmitHandler<InvMasterUOMType> = async (data) => {
        console.log('UOMForm: Submitting data:', data);
        try {
            const response = await saveInvMasterUOM(data);
            if (response.success || response.returnval) {
                toast.success(selectedRow ? 'UOM Updated Successfully' : 'UOM Saved Successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || (response.returnduplicatestatus as string) || 'Failed to save UOM');
            }
        } catch (error: any) {
            toast.error(error.message || 'An unexpected error occurred');
        }
    };

    const handleReset = () => {
        if (selectedRow) {
            setValue('invmuoM_Id', selectedRow.invmuoM_Id);
            setValue('invmuoM_UOMName', selectedRow.invmuoM_UOMName);
            setValue('invmuoM_UOMAliasName', selectedRow.invmuoM_UOMAliasName || '');
            setValue('invmuoM_Qty', selectedRow.invmuoM_Qty);
            setValue('invmuoM_ActiveFlg', selectedRow.invmuoM_ActiveFlg);
        } else {
            reset();
        }
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='UOM Name'
                            required
                            id='invmuoM_UOMName'
                            {...register('invmuoM_UOMName')}
                            error={errors.invmuoM_UOMName?.message}
                        />
                        <InputText
                            label='Alias Name'
                            id='invmuoM_UOMAliasName'
                            {...register('invmuoM_UOMAliasName')}
                            error={errors.invmuoM_UOMAliasName?.message}
                        />
                        <InputText
                            label='UOM Quantity'
                            required
                            id='invmuoM_Qty'
                            maxLength={10}
                            {...register('invmuoM_Qty')}
                            error={errors.invmuoM_Qty?.message}
                        />
                    </div>

                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            {selectedRow ? 'Update' : 'Save'}
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}

interface ToggleUOMFormProps {
    rowData: IInvMasterUOM;
    onClose: () => void;
}

export function ToggleUOMForm({ rowData, onClose }: ToggleUOMFormProps) {
    const { refetchAll } = useInvMasterUom();
    const isActive = rowData.invmuoM_ActiveFlg;

    const {
        handleSubmit,
        formState: { isSubmitting }
    } = useForm({
        defaultValues: {
            invmuoM_Id: rowData.invmuoM_Id,
            invmuoM_ActiveFlg: rowData.invmuoM_ActiveFlg
        }
    });

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            const response = await deactivateInvMasterUOM(rowData);
            if (response.success || response.returnval) {
                toast.success(isActive ? 'UOM Deactivated' : 'UOM Activated');
                refetchAll();
                onClose();
            } else {
                toast.error(response.message || 'Failed to toggle status');
            }
        } catch (error: any) {
            toast.error(error.message || 'An unexpected error occurred');
        }
    };

    return (
        <AdaptiveDialog title='Toggle UOM Status' isOpen={true} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <div className='space-y-3'>
                        <p className='text-sm text-warning-foreground'>
                            Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.invmuoM_UOMName}</strong>?
                        </p>
                    </div>
                </AdaptiveBody>

                <AdaptiveFooter>
                    <Button variant='secondary' onClick={onClose} type='button' disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        isLoading={isSubmitting}
                        variant={isActive ? 'destructive' : 'default'}
                        loadingText={isActive ? 'Deactivating...' : 'Activating...'}>
                        {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
