'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { getInstitutionDropdown, getModuleDropdown, getRoleDropdown } from '@/server/super-admin/configuration-setting/institution-module-page';
import { InstitutionDTO, ModuleDTO, RoleDTO } from '@/types/super-admin/configuration-setting/institution-module-page';

export default function SelectionForm() {
    const { control, formState: { errors } } = useFormContext();
    const [institutions, setInstitutions] = useState<InstitutionDTO[]>([]);
    const [modules, setModules] = useState<ModuleDTO[]>([]);
    const [roles, setRoles] = useState<RoleDTO[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [instRes, modRes, roleRes] = await Promise.all([
                    getInstitutionDropdown(),
                    getModuleDropdown(),
                    getRoleDropdown()
                ]);

                console.log("Institution Dropdown Response:", instRes);
                console.log("Module Dropdown Response:", modRes);
                console.log("Role Dropdown Response:", roleRes);

                if (instRes.success && instRes.data?.institutionList) {
                    setInstitutions(instRes.data.institutionList);
                } else {
                    console.error("Failed to load institutions:", instRes);
                }

                if (modRes.success && modRes.data?.moduleList) {
                    setModules(modRes.data.moduleList);
                }
                if (roleRes.success && roleRes.data?.roleList) {
                    setRoles(roleRes.data.roleList);
                }
            } catch (error) {
                console.error("Failed to load dropdown data", error);
            }
        };

        loadData();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-sm-6 col-sm-offset-3">
            {/* Institution Name */}
            <div className="space-y-2">
                <Label>Institution Name: <span className="text-red-500">*</span></Label>
                <Controller
                    control={control}
                    name="institution"
                    render={({ field }) => (
                        <Select onValueChange={(value) => {
                            field.onChange(value);
                            console.log("Institution changed", value);
                        }} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Institute" />
                            </SelectTrigger>
                            <SelectContent>
                                {institutions.filter(i => i && i.mI_Id != null).map((inst, index) => (
                                    <SelectItem key={`${inst.mI_Id}_${index}`} value={String(inst.mI_Id)}>
                                        {inst.mI_Name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.institution && (
                    <p className="text-sm font-medium text-destructive">
                        {errors.institution.message as string}
                    </p>
                )}
            </div>

            {/* Module */}
            <div className="space-y-2">
                <Label>Module: <span className="text-red-500">*</span></Label>
                <Controller
                    control={control}
                    name="module"
                    render={({ field }) => (
                        <Select onValueChange={(value) => {
                            field.onChange(value);
                            console.log("Module changed", value);
                        }} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Module" />
                            </SelectTrigger>
                            <SelectContent>
                                {modules.filter(m => m && m.ivrmM_Id != null).map((mod, index) => (
                                    <SelectItem key={`${mod.ivrmM_Id}_${index}`} value={String(mod.ivrmM_Id)}>
                                        {mod.ivrmM_ModuleName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.module && (
                    <p className="text-sm font-medium text-destructive">
                        {errors.module.message as string}
                    </p>
                )}
            </div>

            {/* Role Name */}
            <div className="space-y-2">
                <Label>Role name: <span className="text-red-500">*</span></Label>
                <Controller
                    control={control}
                    name="roleid"
                    render={({ field }) => (
                        <Select onValueChange={(value) => {
                            field.onChange(value);
                            console.log("Role changed", value);
                        }} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Role name" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.filter(r => r && r.ivrmrT_Id != null).map((role, index) => (
                                    <SelectItem key={`${role.ivrmrT_Id}_${index}`} value={String(role.ivrmrT_Id)}>
                                        {role.ivrmrT_Role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.roleid && (
                    <p className="text-sm font-medium text-destructive">
                        {errors.roleid.message as string}
                    </p>
                )}
            </div>
        </div>
    );
}
