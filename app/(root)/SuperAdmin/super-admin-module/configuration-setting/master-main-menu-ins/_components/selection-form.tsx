'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getInstitutionDropdown, getModuleDropdown } from '@/server/super-admin/configuration-setting/master-main-menu-ins';
import type { InstitutionDTO, ModuleDTO } from '@/types/super-admin/configuration-setting/master-main-menu-ins';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export default function SelectionForm() {
    const {
        control,
        formState: { errors }
    } = useFormContext();
    const [institutions, setInstitutions] = useState<InstitutionDTO[]>([]);
    const [modules, setModules] = useState<ModuleDTO[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const instData = await getInstitutionDropdown();
                if (instData.success && instData.data?.institutionList) {
                    const uniqueDeep = Array.from(
                        new Map(
                            instData.data.institutionList
                                .filter((item) => item && item.mI_Id != null)
                                .map((item) => [String(item.mI_Id), item])
                        ).values()
                    );

                    if (uniqueDeep.length !== instData.data.institutionList.length) {
                        console.warn(`Removed ${instData.data.institutionList.length - uniqueDeep.length} duplicate institutions`);
                    }
                    setInstitutions(uniqueDeep);
                }

                const modData = await getModuleDropdown();
                if (modData.success && modData.data?.moduleList) {
                    const uniqueDeep = Array.from(
                        new Map(
                            modData.data.moduleList
                                .filter((item) => item && item.ivrmM_Id != null)
                                .map((item) => [String(item.ivrmM_Id), item])
                        ).values()
                    );

                    if (uniqueDeep.length !== modData.data.moduleList.length) {
                        console.warn(`Removed ${modData.data.moduleList.length - uniqueDeep.length} duplicate modules`);
                    }
                    setModules(uniqueDeep);
                }
            } catch (e) {
                console.error('Error fetching dropdowns', e);
            }
        };
        fetchData();
    }, []);

    return (
        <Card className='mb-6 rounded-lg border bg-white p-0 shadow-md'>
            <CardContent className='p-6'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    {/* Institution Dropdown */}
                    <div className='space-y-2'>
                        <Label className='font-semibold'>
                            Institution Name: <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            control={control}
                            name='institution'
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Institution' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {institutions.map((item) => (
                                            <SelectItem key={`inst-${item.mI_Id}`} value={item.mI_Id.toString()}>
                                                {item.mI_Name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.institution && (
                            <p className='font-medium text-destructive text-red-500 text-sm'>{errors.institution.message as string}</p>
                        )}
                    </div>

                    {/* Module Dropdown */}
                    <div className='space-y-2'>
                        <Label className='font-semibold'>
                            Module Name: <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            control={control}
                            name='module'
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Module' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {modules.map((item) => (
                                            <SelectItem key={`mod-${item.ivrmM_Id}`} value={item.ivrmM_Id.toString()}>
                                                {item.ivrmM_ModuleName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.module && (
                            <p className='font-medium text-destructive text-red-500 text-sm'>{errors.module.message as string}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
