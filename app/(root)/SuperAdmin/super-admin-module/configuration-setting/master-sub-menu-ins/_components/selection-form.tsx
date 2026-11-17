'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { InstitutionDTO, ModuleDTO, MainMenuDTO } from '@/types/super-admin/configuration-setting/master-sub-menu-ins';
import { getInstitutionDropdown, getModuleDropdown, getMainMenuDropdown } from '@/server/super-admin/configuration-setting/master-sub-menu-ins';
import { toast } from 'sonner';

export default function SelectionForm() {
    const { control, setValue, watch, formState: { errors } } = useFormContext();
    const [institutions, setInstitutions] = useState<InstitutionDTO[]>([]);
    const [modules, setModules] = useState<ModuleDTO[]>([]);
    const [mainMenus, setMainMenus] = useState<MainMenuDTO[]>([]);

    const selectedModule = watch('module');
    const selectedInstitution = watch('institution');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const instData = await getInstitutionDropdown();
                if (instData.success && instData.data?.institutionList) {
                    setInstitutions(instData.data.institutionList);
                }
            } catch (e) {
                console.error("Error fetching dropdowns", e);
                toast.error("Failed to load initial data");
            }
        };
        fetchInitialData();
    }, []);

    // Fetch Modules when Institution Changes
    useEffect(() => {
        const fetchModules = async () => {
            if (!selectedInstitution) {
                setModules([]);
                setMainMenus([]); // Also clear child dependent
                return;
            }

            try {
                const mi_id = parseInt(selectedInstitution);
                const modData = await getModuleDropdown(mi_id);
                if (modData.success && modData.data?.moduleList) {
                    setModules(modData.data.moduleList);
                } else {
                    setModules([]);
                }
            } catch (e) {
                console.error("Error fetching modules", e);
                toast.error("Failed to load modules");
            }
        };
        // Reset sub-selections when parent changes
        // managed by setValue in change handlers or user re-selection
        fetchModules();
    }, [selectedInstitution]);

    // Fetch Main Menus when Module changes
    useEffect(() => {
        const fetchMainMenus = async () => {
            if (!selectedModule || !selectedInstitution) {
                setMainMenus([]);
                return;
            }

            try {
                const mi_id = parseInt(selectedInstitution);
                const ivrmm_id = parseInt(selectedModule);
                const menuData = await getMainMenuDropdown(mi_id, ivrmm_id);
                if (menuData.success && menuData.data?.mainMenuList) {
                    setMainMenus(menuData.data.mainMenuList);
                } else {
                    setMainMenus([]);
                }
            } catch (e) {
                console.error("Error fetching main menus", e);
                toast.error("Failed to load main menus");
            }
        };

        fetchMainMenus();
    }, [selectedModule, selectedInstitution]);

    // Reset Main Menu if Module changes (optional, handled by user re-selection but good UX)
    // Using onValueChange in Controller to handle reset is better to avoid circle

    return (
        <Card className="mb-6 bg-white shadow-md rounded-lg p-0 border">
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Institution Dropdown */}
                    <div className="space-y-2">
                        <Label className="font-semibold">Institution Name: <span className="text-red-500">*</span></Label>
                        <Controller
                            control={control}
                            name="institution"
                            render={({ field }) => (
                                <Select
                                    onValueChange={(val) => {
                                        field.onChange(val);
                                        setValue('module', '');
                                        setValue('mainMenu', '');
                                    }}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Institution" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {institutions.map((item) => (
                                            <SelectItem key={item.mI_Id} value={item.mI_Id.toString()}>
                                                {item.mI_Name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.institution && (
                            <p className="text-sm font-medium text-destructive text-red-500">
                                {errors.institution.message as string}
                            </p>
                        )}
                    </div>

                    {/* Module Dropdown */}
                    <div className="space-y-2">
                        <Label className="font-semibold">Module Name: <span className="text-red-500">*</span></Label>
                        <Controller
                            control={control}
                            name="module"
                            render={({ field }) => (
                                <Select
                                    onValueChange={(val) => {
                                        field.onChange(val);
                                        setValue('mainMenu', ''); // Reset Main Menu on Module change
                                    }}
                                    value={field.value}
                                    disabled={!selectedInstitution}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Module" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {modules.map((item) => (
                                            <SelectItem key={item.ivrmM_Id} value={item.ivrmM_Id.toString()}>
                                                {item.ivrmM_ModuleName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.module && (
                            <p className="text-sm font-medium text-destructive text-red-500">
                                {errors.module.message as string}
                            </p>
                        )}
                    </div>

                    {/* Main Menu Dropdown */}
                    <div className="space-y-2">
                        <Label className="font-semibold">Main Menu Name: <span className="text-red-500">*</span></Label>
                        <Controller
                            control={control}
                            name="mainMenu"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedModule}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Main Menu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mainMenus.map((item) => (
                                            <SelectItem key={item.ivrmmM_Id} value={item.ivrmmM_Id.toString()}>
                                                {item.ivrmmmI_MenuName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.mainMenu && (
                            <p className="text-sm font-medium text-destructive text-red-500">
                                {errors.mainMenu.message as string}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
