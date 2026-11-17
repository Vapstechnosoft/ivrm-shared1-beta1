'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInvMasterStore } from '@/hooks/inventory/masters/use-inv-master-store';
import { invMasterStoreSchema, type TInvMasterStore } from '@/schemas/inventory/masters/inv-master-store';
import { saveInvMasterStore } from '@/server/inventory/masters/inv-master-store';
import { toast } from 'sonner';
import type { IInvMasterStore, IEmployeeDropdown } from '@/types/inventory/masters/inv-master-store';
import { useEffect } from 'react';

interface UpdateInvMasterStoreFormProps {
    onSuccess: () => void;
    empname_list: IEmployeeDropdown[];
    selectedRow: IInvMasterStore;
}

export default function UpdateInvMasterStoreForm({ onSuccess, empname_list, selectedRow }: UpdateInvMasterStoreFormProps) {
    const { refetchAll } = useInvMasterStore();
    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { isSubmitting, errors }
    } = useForm<TInvMasterStore>({
        resolver: zodResolver(invMasterStoreSchema),
        defaultValues: {
            invmsT_Id: selectedRow.invmsT_Id,
            invmS_StoreName: selectedRow.invmS_StoreName,
            invmS_StoreLocation: selectedRow.invmS_StoreLocation,
            invmS_ContactPerson: selectedRow.invmS_ContactPerson || '',
            invmS_ContactNo: selectedRow.invmS_ContactNo,
            hrmE_Id: selectedRow.hrmE_Id,
            invmS_ActiveFlg: selectedRow.invmS_ActiveFlg,
        }
    });

    const selectedEmpId = watch('hrmE_Id');

    useEffect(() => {
        if (selectedEmpId) {
            const emp = empname_list.find(e => e.hrmE_Id === Number(selectedEmpId));
            if (emp) {
                setValue('invmS_ContactNo', emp.hrmE_MobileNo);
            }
        }
    }, [selectedEmpId, empname_list, setValue]);

    const onInvalid = (errors: any) => {
        console.error('UpdateInvMasterStoreForm: Validation errors:', errors);
    };

    const onSubmit = async (data: TInvMasterStore) => {
        console.log('UpdateInvMasterStoreForm: onSubmit triggered with data:', data);
        try {
            const result = await saveInvMasterStore(data);
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
                    <Label htmlFor='invmS_StoreName'>
                        Store Name <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='invmS_StoreName'
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id='invmS_StoreName'
                                placeholder='Enter Store Name'
                                className={errors.invmS_StoreName ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.invmS_StoreName && (
                        <p className='text-red-500 text-xs'>{errors.invmS_StoreName.message}</p>
                    )}
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='invmS_StoreLocation'>
                        Store Location <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='invmS_StoreLocation'
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id='invmS_StoreLocation'
                                placeholder='Enter Store Location'
                                className={errors.invmS_StoreLocation ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.invmS_StoreLocation && (
                        <p className='text-red-500 text-xs'>{errors.invmS_StoreLocation.message}</p>
                    )}
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='hrmE_Id'>
                        Store Incharge <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='hrmE_Id'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                <SelectTrigger className={errors.hrmE_Id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder='Select Incharge' />
                                </SelectTrigger>
                                <SelectContent>
                                    {empname_list.map((emp) => (
                                        <SelectItem key={emp.hrmE_Id} value={emp.hrmE_Id.toString()}>
                                            {emp.employeename}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.hrmE_Id && (
                        <p className='text-red-500 text-xs'>{errors.hrmE_Id.message}</p>
                    )}
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='invmS_ContactPerson'>Contact Person</Label>
                    <Controller
                        name='invmS_ContactPerson'
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id='invmS_ContactPerson'
                                placeholder='Enter Contact Person'
                            />
                        )}
                    />
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='invmS_ContactNo'>
                        Contact Number <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='invmS_ContactNo'
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id='invmS_ContactNo'
                                placeholder='Enter Contact Number'
                                disabled
                                className={errors.invmS_ContactNo ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.invmS_ContactNo && (
                        <p className='text-red-500 text-xs'>{errors.invmS_ContactNo.message}</p>
                    )}
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
