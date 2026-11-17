'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInvMasterGroup } from '@/hooks/inventory/masters/use-inv-master-group';
import { invMasterMainGroupSchema } from '@/schemas/inventory/masters/inv-master-group';
import { deactivateInvMasterGroup, saveInvMasterMainGroup } from '@/server/inventory/masters/inv-master-group';
import type { IInvMasterMainGroup } from '@/types/inventory/masters/inv-master-group';
import { INVENTORY_QUERY_KEYS } from '@/constants/query-keys';
import { useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof invMasterMainGroupSchema>;

interface MainGroupFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow?: IInvMasterMainGroup;
}

export default function MainGroupForm({ onSuccess, className = '', selectedRow }: MainGroupFormProps) {
    const queryClient = useQueryClient();
    const { refetchAll } = useInvMasterGroup();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(invMasterMainGroupSchema),
        mode: 'onChange',
        defaultValues: {
            invmG_Id: 0,
            invmG_GroupName: '',
            invmG_AliasName: '',
            invmG_GroupPrefix: '',
            invmG_GroupSuffix: '',
            invmG_GroupStartingNo: '',
            invmG_ActiveFlg: true
        }
    });

    useEffect(() => {
        if (selectedRow) {
            setValue('invmG_Id', selectedRow.invmG_Id);
            setValue('invmG_GroupName', selectedRow.invmG_GroupName);
            setValue('invmG_AliasName', selectedRow.invmG_AliasName);
            setValue('invmG_GroupPrefix', selectedRow.invmG_GroupPrefix);
            setValue('invmG_GroupSuffix', selectedRow.invmG_GroupSuffix);
            setValue('invmG_GroupStartingNo', selectedRow.invmG_GroupStartingNo);
            setValue('invmG_ActiveFlg', selectedRow.invmG_ActiveFlg);
        } else {
            reset({
                invmG_Id: 0,
                invmG_GroupName: '',
                invmG_AliasName: '',
                invmG_GroupPrefix: '',
                invmG_GroupSuffix: '',
                invmG_GroupStartingNo: '',
                invmG_ActiveFlg: true
            });
        }
    }, [selectedRow, setValue, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response = await saveInvMasterMainGroup(data);
            if (response.success || response.returnval) {
                toast.success(selectedRow ? 'Main Group Updated Successfully' : 'Main Group Saved Successfully');
                reset();
                queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEYS.INV_MASTER_GROUP] });
                onSuccess?.();
            } else {
                toast.error(response.message || (response.returnduplicatestatus as string) || 'Failed to save Main Group');
            }
        } catch (error: any) {
            toast.error(error.message || 'An unexpected error occurred');
        }
    };

    const handleReset = () => {
        if (selectedRow) {
            setValue('invmG_Id', selectedRow.invmG_Id);
            setValue('invmG_GroupName', selectedRow.invmG_GroupName);
            setValue('invmG_AliasName', selectedRow.invmG_AliasName);
            setValue('invmG_GroupPrefix', selectedRow.invmG_GroupPrefix);
            setValue('invmG_GroupSuffix', selectedRow.invmG_GroupSuffix);
            setValue('invmG_GroupStartingNo', selectedRow.invmG_GroupStartingNo);
            setValue('invmG_ActiveFlg', selectedRow.invmG_ActiveFlg);
        } else {
            reset();
        }
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>


                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor='invmG_GroupName'>
                                Group Name <span className='text-red-500'>*</span>
                            </Label>
                            <Input
                                id='invmG_GroupName'
                                {...register('invmG_GroupName')}
                                className={errors.invmG_GroupName ? 'border-destructive' : ''}
                            />
                            {errors.invmG_GroupName && <FormError>{errors.invmG_GroupName.message}</FormError>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <Label htmlFor='invmG_AliasName'>Alias Name</Label>
                            <Input
                                id='invmG_AliasName'
                                {...register('invmG_AliasName')}
                                className={errors.invmG_AliasName ? 'border-destructive' : ''}
                            />
                            {errors.invmG_AliasName && <FormError>{errors.invmG_AliasName.message}</FormError>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <Label htmlFor='invmG_GroupPrefix'>Group Prefix</Label>
                            <Input
                                id='invmG_GroupPrefix'
                                {...register('invmG_GroupPrefix')}
                                className={errors.invmG_GroupPrefix ? 'border-destructive' : ''}
                            />
                            {errors.invmG_GroupPrefix && <FormError>{errors.invmG_GroupPrefix.message}</FormError>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <Label htmlFor='invmG_GroupSuffix'>Group Suffix</Label>
                            <Input
                                id='invmG_GroupSuffix'
                                {...register('invmG_GroupSuffix')}
                                className={errors.invmG_GroupSuffix ? 'border-destructive' : ''}
                            />
                            {errors.invmG_GroupSuffix && <FormError>{errors.invmG_GroupSuffix.message}</FormError>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <Label htmlFor='invmG_GroupStartingNo'>Group Starting No</Label>
                            <Input
                                id='invmG_GroupStartingNo'
                                {...register('invmG_GroupStartingNo')}
                                className={errors.invmG_GroupStartingNo ? 'border-destructive' : ''}
                            />
                            {errors.invmG_GroupStartingNo && <FormError>{errors.invmG_GroupStartingNo.message}</FormError>}
                        </div>
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

interface ToggleMainGroupFormProps {
    rowData: IInvMasterMainGroup;
    onClose: () => void;
}

export function ToggleMainGroupForm({ rowData, onClose }: ToggleMainGroupFormProps) {
    const queryClient = useQueryClient();
    const isActive = rowData.invmG_ActiveFlg;

    const {
        handleSubmit,
        formState: { isSubmitting }
    } = useForm({
        defaultValues: {
            invmG_Id: rowData.invmG_Id,
            invmG_ActiveFlg: rowData.invmG_ActiveFlg
        }
    });

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            const response = await deactivateInvMasterGroup(data);
            if (response.success || response.returnval) {
                toast.success(isActive ? 'Main Group Deactivated' : 'Main Group Activated');
                queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEYS.INV_MASTER_GROUP] });
                onClose();
            } else {
                toast.error(response.message || 'Failed to toggle status');
            }
        } catch (error: any) {
            toast.error(error.message || 'An unexpected error occurred');
        }
    };

    return (
        <AdaptiveDialog title='Toggle Main Group Status' isOpen={true} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <div className='space-y-3'>
                        <p className='text-sm text-warning-foreground'>
                            Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.invmG_GroupName}</strong>?
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
