'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Spinner as LoadingSpinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { masterSubMenuSchema, type MasterSubMenuSchema } from '@/schemas/super-admin/super-admin-module/general-setting/master-sub-menu';
import { saveMasterSubMenu, getModuleDropdown, getMainMenuDropdown, getMasterSubMenuDetails } from '@/server/super-admin/super-admin-module/general-setting/master-sub-menu';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { IMasterSubMenu, IModuleDropdownItem, IMainMenuDropdownItem } from '@/types/super-admin/super-admin-module/general-setting/master-sub-menu';

interface AddMasterSubMenuFormProps {
    onSuccess?: () => void;
    initialData?: IMasterSubMenu;
}

export default function AddMasterSubMenuForm({ onSuccess, initialData }: AddMasterSubMenuFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [modules, setModules] = useState<IModuleDropdownItem[]>([]);
    const [mainMenus, setMainMenus] = useState<IMainMenuDropdownItem[]>([]);

    const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<MasterSubMenuSchema>({
        resolver: zodResolver(masterSubMenuSchema),
        defaultValues: {
            ivrmmS_Id: initialData?.ivrmmS_Id,
            ivrmM_Id: initialData?.ivrmM_Id || 0,
            ivrmmM_Id: initialData?.ivrmmM_Id || 0,
            ivrmmS_SubMenuName: initialData?.ivrmmS_SubMenuName || '',
            ivrmmS_Order: initialData?.ivrmmS_Order || 0,
        },
    });

    const selectedModuleId = watch('ivrmM_Id');

    // Fetch modules on mount
    useEffect(() => {
        getModuleDropdown().then(res => {
            if (res.success && res.data) {
                setModules(res.data);
            }
        });
    }, []);

    // Fetch main menus when module changes
    useEffect(() => {
        if (selectedModuleId) {
            // Avoid clearing if it's the initial load with data
            if (!initialData || (initialData.ivrmM_Id !== selectedModuleId)) {
                // If user changes module manually, we might want to clear main menu? 
                // But for now let's just fetch.
            }

            getMainMenuDropdown(selectedModuleId).then(res => {
                if (res.success && res.data) {
                    setMainMenus(res.data);
                } else {
                    setMainMenus([]);
                }
            });
        } else {
            setMainMenus([]);
        }
    }, [selectedModuleId, initialData]);

    // Fetch details on edit
    useEffect(() => {
        if (initialData && initialData.ivrmmS_Id) {
            setIsLoading(true);
            getMasterSubMenuDetails(initialData.ivrmmS_Id).then(async res => {
                setIsLoading(false);
                if (res.success) {
                    const response = res as any;
                    const data = response.edit_s_menu?.[0] || response.data?.[0] || response.data || response;

                    if (data) {
                        // Ensure module dropdown is loaded (it is by initial useEffect), 
                        // and trigger main menu load by setting module ID first?
                        // setValue triggers watch, which triggers generic useEffect.

                        // We might need to manually fetch main menus here if the dependency logic is race-condition prone,
                        // but useEffect [selectedModuleId] should handle it.

                        reset({
                            ivrmmS_Id: data.ivrmmS_Id,
                            ivrmM_Id: data.ivrmM_Id,
                            ivrmmM_Id: data.ivrmmM_Id,
                            ivrmmS_SubMenuName: data.ivrmmS_SubMenuName,
                            ivrmmS_Order: data.ivrmmS_Order,
                        });

                        // Explicitly fetch main menus for this module to ensure dropdown is populated
                        if (data.ivrmM_Id) {
                            const menuRes = await getMainMenuDropdown(data.ivrmM_Id);
                            if (menuRes.success && menuRes.data) {
                                setMainMenus(menuRes.data);
                            }
                        }
                    }
                } else {
                    toast.error('Failed to fetch details');
                }
            }).catch(() => {
                setIsLoading(false);
                toast.error('Error fetching details');
            });
        }
    }, [initialData, reset]);


    const onSubmit = async (data: MasterSubMenuSchema) => {
        setIsLoading(true);
        try {
            const result = await saveMasterSubMenu(data);
            if (result.success) {
                toast.success(initialData ? 'Master Sub Menu Updated Successfully' : 'Master Sub Menu Saved Successfully');
                if (!initialData) reset();
                onSuccess?.();
            } else {
                toast.error(result.message || 'Failed to save data');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='p-4'>
                <div className='mx-auto max-w-2xl space-y-4'>
                    <div className='grid grid-cols-12 items-center gap-4'>
                        <Label className='col-span-12 md:col-span-4 text-left md:text-right'>
                            Module Name: <span className='text-red-500'>*</span>
                        </Label>
                        <div className='col-span-12 md:col-span-8'>
                            <Controller
                                control={control}
                                name='ivrmM_Id'
                                render={({ field }) => (
                                    <Select
                                        value={field.value ? field.value.toString() : ''}
                                        onValueChange={(value) => {
                                            field.onChange(Number(value));
                                            setValue('ivrmmM_Id', 0); // Reset Main Menu on Module change
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Module" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {modules.map((module) => (
                                                <SelectItem key={module.ivrmM_Id} value={module.ivrmM_Id.toString()}>
                                                    {module.ivrmM_ModuleName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormError>{errors.ivrmM_Id?.message}</FormError>
                        </div>
                    </div>

                    <div className='grid grid-cols-12 items-center gap-4'>
                        <Label className='col-span-12 md:col-span-4 text-left md:text-right'>
                            Main Menu Name: <span className='text-red-500'>*</span>
                        </Label>
                        <div className='col-span-12 md:col-span-8'>
                            <Controller
                                control={control}
                                name='ivrmmM_Id'
                                render={({ field }) => (
                                    <Select
                                        value={field.value ? field.value.toString() : ''}
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        disabled={!selectedModuleId} // Disable if no module selected
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Main Menu" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mainMenus.map((menu) => (
                                                <SelectItem key={menu.ivrmmM_Id} value={menu.ivrmmM_Id.toString()}>
                                                    {menu.ivrmmM_MenuName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormError>{errors.ivrmmM_Id?.message}</FormError>
                        </div>
                    </div>

                    <div className='grid grid-cols-12 items-center gap-4'>
                        <Label className='col-span-12 md:col-span-4 text-left md:text-right'>
                            Sub Menu Name: <span className='text-red-500'>*</span>
                        </Label>
                        <div className='col-span-12 md:col-span-8'>
                            <Controller
                                control={control}
                                name='ivrmmS_SubMenuName'
                                render={({ field }) => (
                                    <InputText
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder='Enter Sub Menu Name'
                                        maxLength={20}
                                    />
                                )}
                            />
                            <FormError>{errors.ivrmmS_SubMenuName?.message}</FormError>
                        </div>
                    </div>

                    <div className='grid grid-cols-12 items-center gap-4'>
                        <Label className='col-span-12 md:col-span-4 text-left md:text-right'>
                            Sub Menu Order: <span className='text-red-500'>*</span>
                        </Label>
                        <div className='col-span-12 md:col-span-8'>
                            <Controller
                                control={control}
                                name='ivrmmS_Order'
                                render={({ field }) => (
                                    <InputText
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder='Enter Sub Menu Order'
                                        type="number"
                                        maxLength={3}
                                    />
                                )}
                            />
                            <FormError>{errors.ivrmmS_Order?.message}</FormError>
                        </div>
                    </div>
                </div>

                <div className='mt-8 flex justify-center gap-4 border-t pt-4'>
                    <Button
                        type='button'
                        variant='destructive'
                        onClick={() => { reset(); onSuccess?.(); }}
                        className='bg-red-500 hover:bg-red-600 w-32'
                    >
                        <X className='mr-2 h-4 w-4' />
                        Cancel
                    </Button>

                    <Button
                        type='submit'
                        disabled={isLoading}
                        className='bg-blue-600 hover:bg-blue-700 w-32'
                    >
                        {isLoading ? <LoadingSpinner /> : <Save className='mr-2 h-4 w-4' />}
                        {initialData ? 'Update' : 'Save'}
                    </Button>
                </div>
            </div>
        </form>
    );
}
