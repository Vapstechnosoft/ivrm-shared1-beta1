'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { INVENTORY_QUERY_KEYS } from '@/constants/query-keys';

import { invMasterItemGroupSchema, type InvMasterItemGroupType } from '@/schemas/inventory/masters/inv-master-group';
import { deactivateInvMasterGroup, saveInvMasterItemGroup } from '@/server/inventory/masters/inv-master-group';
import type { IInvMasterItemGroup } from '@/types/inventory/masters/inv-master-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ItemGroupFormProps {
    onSuccess: () => void;
    initialData?: IInvMasterItemGroup;
    mode: 'add' | 'edit';
    userGroupOptions: { label: string; value: string }[];
}

function ItemGroupForm({ onSuccess, initialData, mode, userGroupOptions }: ItemGroupFormProps) {
    const queryClient = useQueryClient();

    const {
        control,
        handleSubmit,
        reset,
        register,
        formState: { isSubmitting, errors }
    } = useForm<InvMasterItemGroupType>({
        resolver: zodResolver(invMasterItemGroupSchema),
        defaultValues: {
            invmG_Id: initialData?.invmG_Id || 0,
            invmG_GroupName: initialData?.invmG_GroupName || '',
            invmG_AliasName: initialData?.invmG_AliasName || '',
            invmG_ParentId: initialData?.invmG_ParentId || 0,
            invmG_ActiveFlg: initialData?.invmG_ActiveFlg ?? true
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                invmG_Id: initialData.invmG_Id,
                invmG_GroupName: initialData.invmG_GroupName,
                invmG_AliasName: initialData.invmG_AliasName,
                invmG_ParentId: initialData.invmG_ParentId,
                invmG_ActiveFlg: initialData.invmG_ActiveFlg
            });
        }
    }, [initialData, reset]);

    const onSubmit: SubmitHandler<InvMasterItemGroupType> = async (data) => {
        try {
            const result = await saveInvMasterItemGroup(data);
            if (result.returnval || result.success) {
                toast.success(result.message || (mode === 'add' ? 'Record saved successfully' : 'Record updated successfully'));
                await queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEYS.INV_MASTER_GROUP] });
                onSuccess();
                if (mode === 'add') reset();

                // If the user specifically meant a page reload:
                // window.location.reload(); 
                // But generally data refresh (invalidation) is preferred. I will assume invalidation is sufficient unless explicitly told otherwise for a SPA.
            } else if (result.returnduplicatestatus === 'Duplicate') {
                toast.error('Record already exists');
            } else {
                toast.error(result.message || 'Failed to save record');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='invmG_ParentId'>
                        User Group <span className='ml-1 text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='invmG_ParentId'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                <SelectTrigger className={errors.invmG_ParentId ? 'border-destructive' : ''}>
                                    <SelectValue placeholder='Select User Group' />
                                </SelectTrigger>
                                <SelectContent>
                                    {userGroupOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.invmG_ParentId && <FormError>{errors.invmG_ParentId.message}</FormError>}
                </div>

                <InputText
                    label='Item Group Name'
                    required
                    id='invmG_GroupName'
                    {...register('invmG_GroupName')}
                    error={errors.invmG_GroupName?.message}
                />

                <InputText
                    label='Alias Name'
                    id='invmG_AliasName'
                    {...register('invmG_AliasName')}
                    error={errors.invmG_AliasName?.message}
                />
            </div>

            <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                    isLoading={isSubmitting}
                    loadingText='Saving...'>
                    <div className='flex items-center'>
                        <Save className='mr-2 h-4 w-4' />
                        {mode === 'add' ? 'Save Item Group' : 'Update Item Group'}
                    </div>
                </Button>
            </div>
        </form>
    );
}

export function AddItemGroupForm({ onSuccess, userGroupOptions }: { onSuccess: () => void; userGroupOptions: { label: string; value: string }[] }) {
    return <ItemGroupForm onSuccess={onSuccess} mode='add' userGroupOptions={userGroupOptions} />;
}

export function UpdateItemGroupForm({
    selectedRow,
    onSuccess,
    userGroupOptions
}: {
    selectedRow: IInvMasterItemGroup;
    onSuccess: () => void;
    userGroupOptions: { label: string; value: string }[];
}) {
    return <ItemGroupForm onSuccess={onSuccess} initialData={selectedRow} mode='edit' userGroupOptions={userGroupOptions} />;
}

interface ToggleItemGroupFormProps {
    rowData: IInvMasterItemGroup;
    onClose: () => void;
}

export function ToggleItemGroupForm({ rowData, onClose }: ToggleItemGroupFormProps) {
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
            if (response.returnval || response.success) {
                toast.success(isActive ? 'Item Group Deactivated' : 'Item Group Activated');
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
        <AdaptiveDialog title='Toggle Item Group Status' isOpen={true} onClose={onClose}>
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
