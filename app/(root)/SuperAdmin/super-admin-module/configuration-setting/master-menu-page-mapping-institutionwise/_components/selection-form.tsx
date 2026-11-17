'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    getInstitutionDropdown,
    getMainMenuDropdown,
    getModuleDropdown,
    getSubMenuDropdown
} from '@/server/super-admin/configuration-setting/master-menu-page-mapping-institutionwise';
import type {
    InstitutionDTO,
    MainMenuDTO,
    ModuleDTO,
    SubMenuDTO
} from '@/types/super-admin/configuration-setting/master-menu-page-mapping-institutionwise';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export default function SelectionForm() {
    const {
        control,
        watch,
        setValue,
        formState: { errors }
    } = useFormContext();

    const [institutions, setInstitutions] = useState<InstitutionDTO[]>([]);
    const [modules, setModules] = useState<ModuleDTO[]>([]);
    const [mainMenus, setMainMenus] = useState<MainMenuDTO[]>([]);
    const [subMenus, setSubMenus] = useState<SubMenuDTO[]>([]);

    const selectedMI_Id = watch('institution');
    const selectedIVRMM_Id = watch('module');
    const selectedIVRMMMI_Id = watch('mainMenu');

    // Load Institutions on Mount
    useEffect(() => {
        const loadInstitutions = async () => {
            const response = await getInstitutionDropdown();
            if (response.success && response.data?.institutionList) {
                setInstitutions(response.data.institutionList);
            }
        };
        loadInstitutions();
    }, []);

    // Load Modules when Institution changes
    useEffect(() => {
        const loadModules = async () => {
            if (selectedMI_Id) {
                const response = await getModuleDropdown(Number.parseInt(selectedMI_Id));
                if (response.success && response.data?.moduleList) {
                    setModules(response.data.moduleList);
                } else {
                    setModules([]);
                }
            } else {
                setModules([]);
            }
        };
        loadModules();
    }, [selectedMI_Id]);

    // Load Main Menus when Module changes
    useEffect(() => {
        const loadMainMenus = async () => {
            if (selectedMI_Id && selectedIVRMM_Id) {
                const response = await getMainMenuDropdown(Number.parseInt(selectedMI_Id), Number.parseInt(selectedIVRMM_Id));
                if (response.success && response.data?.mainMenuList) {
                    setMainMenus(response.data.mainMenuList);
                } else {
                    setMainMenus([]);
                }
            } else {
                setMainMenus([]);
            }
        };
        loadMainMenus();
    }, [selectedIVRMM_Id, selectedMI_Id]);

    // Load Sub Menus when Main Menu changes
    useEffect(() => {
        const loadSubMenus = async () => {
            if (selectedMI_Id && selectedIVRMMMI_Id) {
                const response = await getSubMenuDropdown(Number.parseInt(selectedMI_Id), Number.parseInt(selectedIVRMMMI_Id));
                if (response.success && response.data?.subMenuList) {
                    setSubMenus(response.data.subMenuList);
                } else {
                    setSubMenus([]);
                }
            } else {
                setSubMenus([]);
            }
        };
        loadSubMenus();
    }, [selectedIVRMMMI_Id, selectedMI_Id]);

    return (
        <div className='mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Institution Dropdown */}
            <div className='space-y-2'>
                <Label className='font-semibold'>
                    Institution Name <span className='text-red-500'>*</span>
                </Label>
                <Controller
                    control={control}
                    name='institution'
                    render={({ field }) => (
                        <Select
                            onValueChange={(val) => {
                                field.onChange(val);
                                setValue('module', '');
                                setValue('mainMenu', '');
                                setValue('subMenu', '');
                            }}
                            value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Institution' />
                            </SelectTrigger>
                            <SelectContent>
                                {institutions.map((inst) => (
                                    <SelectItem key={inst.mI_Id} value={inst.mI_Id?.toString() || ''}>
                                        {inst.mI_Name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.institution && <p className='font-medium text-red-500 text-sm'>{errors.institution.message as string}</p>}
            </div>

            {/* Module Dropdown */}
            <div className='space-y-2'>
                <Label className='font-semibold'>
                    Module Name <span className='text-red-500'>*</span>
                </Label>
                <Controller
                    control={control}
                    name='module'
                    render={({ field }) => (
                        <Select
                            onValueChange={(val) => {
                                field.onChange(val);
                                setValue('mainMenu', '');
                                setValue('subMenu', '');
                            }}
                            value={field.value}
                            disabled={!selectedMI_Id}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Module' />
                            </SelectTrigger>
                            <SelectContent>
                                {modules.map((mod) => (
                                    <SelectItem key={mod.ivrmM_Id} value={mod.ivrmM_Id?.toString() || ''}>
                                        {mod.ivrmM_ModuleName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.module && <p className='font-medium text-red-500 text-sm'>{errors.module.message as string}</p>}
            </div>

            {/* Main Menu Dropdown */}
            <div className='space-y-2'>
                <Label className='font-semibold'>
                    Main Menu Name <span className='text-red-500'>*</span>
                </Label>
                <Controller
                    control={control}
                    name='mainMenu'
                    render={({ field }) => (
                        <Select
                            onValueChange={(val) => {
                                field.onChange(val);
                                setValue('subMenu', '');
                            }}
                            value={field.value}
                            disabled={!selectedIVRMM_Id}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Main Menu' />
                            </SelectTrigger>
                            <SelectContent>
                                {mainMenus.map((menu) => (
                                    <SelectItem key={menu.ivrmmM_Id} value={menu.ivrmmM_Id?.toString() || ''}>
                                        {menu.ivrmmmI_MenuName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.mainMenu && <p className='font-medium text-red-500 text-sm'>{errors.mainMenu.message as string}</p>}
            </div>

            {/* Sub Menu Dropdown */}
            <div className='space-y-2'>
                <Label className='font-semibold'>
                    Sub Menu Name <span className='text-red-500'>*</span>
                </Label>
                <Controller
                    control={control}
                    name='subMenu'
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedIVRMMMI_Id}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Sub Menu' />
                            </SelectTrigger>
                            <SelectContent>
                                {subMenus.map((smenu) => (
                                    <SelectItem key={smenu.ivrmmmI_Id} value={smenu.ivrmmmI_Id?.toString() || ''}>
                                        {smenu.submenuname}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.subMenu && <p className='font-medium text-red-500 text-sm'>{errors.subMenu.message as string}</p>}
            </div>
        </div>
    );
}
