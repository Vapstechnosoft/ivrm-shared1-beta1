'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Spinner as LoadingSpinner } from '@/components/ui/spinner';
import { masterRoleTypeSchema, type MasterRoleTypeSchema } from '@/schemas/super-admin/super-admin-module/general-setting/master-role-type';
import { saveMasterRoleType, getMasterRoleTypeById, getRoleNameDropdown } from '@/server/super-admin/super-admin-module/general-setting/master-role-type';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterRoleType } from '@/types/super-admin/super-admin-module/general-setting/master-role-type';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AddMasterRoleTypeFormProps {
    onSuccess?: () => void;
}

export default function AddMasterRoleTypeForm({ onSuccess }: AddMasterRoleTypeFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { selectedRow } = useFormContext<IMasterRoleType>();
    const [masterRoles, setMasterRoles] = useState<any[]>([]);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<MasterRoleTypeSchema>({
        resolver: zodResolver(masterRoleTypeSchema),
        defaultValues: {
            roleType: selectedRow?.roleType || '',
            masterRoleIds: [], // array
            institutionType: selectedRow?.institutionType || 'S',
            id: selectedRow?.id || undefined
        },
    });

    useEffect(() => {
        const fetchMasterRoles = async () => {
            try {
                const response = await getRoleNameDropdown();
                if (response.success && response.data) {
                    setMasterRoles(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch master roles", error);
            }
        };

        fetchMasterRoles();
    }, []);

    useEffect(() => {
        const fetchDetails = async () => {
            if (selectedRow?.id) {
                setIsLoading(true);
                try {
                    const response = await getMasterRoleTypeById(selectedRow.id);
                    if (response.success && response.data) {
                        const data = response.data;
                        reset({
                            id: data.id,
                            roleType: data.roleType,
                            masterRoleIds: data.masterRoleId ? [data.masterRoleId] : [],
                            institutionType: data.institutionType || 'S'
                        });
                    } else {
                        toast.error('Failed to load role type details');
                        // Fallback using selectedRow data
                        reset({
                            id: selectedRow.id,
                            roleType: selectedRow.roleType,
                            masterRoleIds: selectedRow.masterRoleId ? [selectedRow.masterRoleId] : [],
                            institutionType: selectedRow.institutionType || 'S'
                        });
                    }
                } catch (error) {
                    console.error('Error fetching role type details', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                reset({
                    roleType: '',
                    masterRoleIds: [],
                    institutionType: 'S',
                    id: undefined
                });
            }
        };

        fetchDetails();
    }, [selectedRow, reset]);

    const onSubmit = async (data: MasterRoleTypeSchema) => {
        setIsLoading(true);
        try {
            const result = await saveMasterRoleType(data);
            if (result.success) {
                toast.success(result.message);
                reset();
                onSuccess?.();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='p-4 border rounded-md'>
                <h3 className="font-semibold text-lg text-primary mb-4 border-b pb-2">Master Role Type</h3>
                <div className='mx-auto max-w-2xl space-y-4'>
                    {/* Role Type (Text Input) */}
                    <div className='grid grid-cols-12 items-center gap-4'>
                        <Label className='col-span-12 md:col-span-4 text-left md:text-right'>
                            Role Type: <span className='text-red-500'>*</span>
                        </Label>
                        <div className='col-span-12 md:col-span-8'>
                            <Controller
                                control={control}
                                name='roleType'
                                render={({ field }) => (
                                    <InputText
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder='Enter Role Type' // Matches HTML placeholder? HTML placeholder not specified, but logical
                                        maxLength={50}
                                    />
                                )}
                            />
                            <FormError>{errors.roleType?.message}</FormError>
                        </div>
                    </div>

                    {/* Role Name (Selection) */}
                    <div className='grid grid-cols-12 items-center gap-4'>
                        <Label className='col-span-12 md:col-span-4 text-left md:text-right'>
                            Role Name: <span className='text-red-500'>*</span>
                        </Label>
                        <div className='col-span-12 md:col-span-8'>
                            <Controller
                                control={control}
                                name='masterRoleIds'
                                render={({ field }) => (
                                    <div className="border rounded-md p-2 h-40 overflow-y-auto bg-white">
                                        {masterRoles.map((role) => (
                                            <div key={role.id} className="flex items-center space-x-2 mb-2">
                                                <input
                                                    type="checkbox"
                                                    id={`role-${role.id}`}
                                                    value={role.id}
                                                    checked={field.value?.includes(role.id)}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        const value = role.id;
                                                        if (checked) {
                                                            field.onChange([...(field.value || []), value]);
                                                        } else {
                                                            field.onChange((field.value || []).filter((id: number) => id !== value));
                                                        }
                                                    }}
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <Label htmlFor={`role-${role.id}`} className="font-normal cursor-pointer select-none">
                                                    {role.name}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            />
                            <FormError>{errors.masterRoleIds?.message}</FormError>
                        </div>
                    </div>

                    {/* Institution / VAPS Radio */}
                    <div className='grid grid-cols-12 items-center gap-4'>
                        <Label className='col-span-12 md:col-span-4 text-left md:text-right'>
                            &nbsp;
                        </Label>
                        <div className='col-span-12 md:col-span-8'>
                            <Controller
                                control={control}
                                name="institutionType"
                                render={({ field }) => (
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex gap-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="S" id="r1" />
                                            <Label htmlFor="r1" className='font-normal'>Institution</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="U" id="r2" />
                                            <Label htmlFor="r2" className='font-normal'>VAPS</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className='mt-8 flex justify-center gap-4 border-t pt-4'>
                    <Button
                        type='submit'
                        disabled={isLoading}
                        className='bg-blue-600 hover:bg-blue-700 w-32'
                    >
                        {isLoading ? <LoadingSpinner /> : <Save className='mr-2 h-4 w-4' />}
                        Save
                    </Button>
                    <Button
                        type='button'
                        variant='destructive'
                        onClick={() => { reset(); onSuccess?.(); }}
                        className='bg-red-500 hover:bg-red-600 w-32'
                    >
                        <X className='mr-2 h-4 w-4' />
                        Cancel
                    </Button>
                </div>
            </div>
        </form>
    );
}
