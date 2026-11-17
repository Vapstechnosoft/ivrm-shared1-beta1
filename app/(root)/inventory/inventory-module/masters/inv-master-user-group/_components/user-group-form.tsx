'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { INVENTORY_QUERY_KEYS } from '@/constants/query-keys';

import { invMasterUserGroupSchema, type InvMasterUserGroupType } from '@/schemas/inventory/masters/inv-master-group';
import { deactivateInvMasterGroup, saveInvMasterUserGroup } from '@/server/inventory/masters/inv-master-group';
import type { IInvMasterUserGroup } from '@/types/inventory/masters/inv-master-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface UserGroupFormProps {
    onSuccess: () => void;
    initialData?: IInvMasterUserGroup;
    mode: 'add' | 'edit';
    mainGroupOptions: { label: string; value: string }[];
}

function UserGroupForm({ onSuccess, initialData, mode, mainGroupOptions }: UserGroupFormProps) {
    const queryClient = useQueryClient();

    const {
        control,
        handleSubmit,
        reset,
        register,
        setValue,
        formState: { isSubmitting, errors }
    } = useForm<InvMasterUserGroupType>({
        resolver: zodResolver(invMasterUserGroupSchema),
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
            setValue('invmG_Id', initialData.invmG_Id);
            setValue('invmG_GroupName', initialData.invmG_GroupName);
            setValue('invmG_AliasName', initialData.invmG_AliasName);
            setValue('invmG_ParentId', initialData.invmG_ParentId);
            setValue('invmG_ActiveFlg', initialData.invmG_ActiveFlg);
        } else {
            reset({
                invmG_Id: 0,
                invmG_GroupName: '',
                invmG_AliasName: '',
                invmG_ParentId: 0,
                invmG_ActiveFlg: true
            });
        }
    }, [initialData, setValue, reset]);

    const onSubmit: SubmitHandler<InvMasterUserGroupType> = async (data) => {
        try {
            const result = await saveInvMasterUserGroup(data);
            if (result.success || result.returnval) {
                toast.success(mode === 'add' ? 'User Group Saved Successfully' : 'User Group Updated Successfully');
                queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEYS.INV_MASTER_GROUP] });
                onSuccess();
                if (mode === 'add') reset();
            } else {
                toast.error(result.message || (result.returnduplicatestatus as string) || 'Failed to save User Group');
            }
        } catch (error: any) {
            toast.error(error.message || 'An unexpected error occurred');
        }
    };

    const handleReset = () => {
        if (initialData) {
            setValue('invmG_Id', initialData.invmG_Id);
            setValue('invmG_GroupName', initialData.invmG_GroupName);
            setValue('invmG_AliasName', initialData.invmG_AliasName);
            setValue('invmG_ParentId', initialData.invmG_ParentId);
            setValue('invmG_ActiveFlg', initialData.invmG_ActiveFlg);
        } else {
            reset();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='invmG_ParentId'>
                        Main Group <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='invmG_ParentId'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                <SelectTrigger className={errors.invmG_ParentId ? 'border-destructive' : ''}>
                                    <SelectValue placeholder='Select Main Group' />
                                </SelectTrigger>
                                <SelectContent>
                                    {mainGroupOptions.map((option) => (
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

                <div className='flex flex-col gap-2'>
                    <Label htmlFor='invmG_GroupName'>
                        User Group Name <span className='text-red-500'>*</span>
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
                        {mode === 'add' ? 'Save' : 'Update'}
                    </div>
                </Button>
            </div>
        </form>
    );
}

export function AddUserGroupForm({ onSuccess, mainGroupOptions }: { onSuccess: () => void; mainGroupOptions: { label: string; value: string }[] }) {
    return <UserGroupForm onSuccess={onSuccess} mode='add' mainGroupOptions={mainGroupOptions} />;
}

export function UpdateUserGroupForm({
    selectedRow,
    onSuccess,
    mainGroupOptions
}: {
    selectedRow: IInvMasterUserGroup;
    onSuccess: () => void;
    mainGroupOptions: { label: string; value: string }[];
}) {
    return <UserGroupForm onSuccess={onSuccess} initialData={selectedRow} mode='edit' mainGroupOptions={mainGroupOptions} />;
}

interface ToggleUserGroupFormProps {
    rowData: IInvMasterUserGroup;
    onClose: () => void;
}

export function ToggleUserGroupForm({ rowData, onClose }: ToggleUserGroupFormProps) {
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
                toast.success(isActive ? 'User Group Deactivated' : 'User Group Activated');
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
        <AdaptiveDialog title='Toggle User Group Status' isOpen={true} onClose={onClose}>
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
