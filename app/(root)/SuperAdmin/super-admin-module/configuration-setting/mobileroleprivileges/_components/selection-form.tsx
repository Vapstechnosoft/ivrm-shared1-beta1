'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { InstitutionDropdown, RoleDropdown } from '@/types/super-admin/configuration-setting/mobileroleprivileges';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const selectionSchema = z.object({
    mI_Id: z.string().min(1, 'Institution is required'),
    ivrmrT_Id: z.string().min(1, 'Role is required')
});

type SelectionFormData = z.infer<typeof selectionSchema>;

interface MobileRolePrivilegesSelectionFormProps {
    institutions: InstitutionDropdown[];
    roles: RoleDropdown[];
    onSubmit: (data: { mI_Id: number; ivrmrT_Id: number }) => void;
    isLoading?: boolean;
}

export function MobileRolePrivilegesSelectionForm({ institutions, roles, onSubmit, isLoading }: MobileRolePrivilegesSelectionFormProps) {
    const {
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<SelectionFormData>({
        resolver: zodResolver(selectionSchema),
        defaultValues: {
            mI_Id: '',
            ivrmrT_Id: ''
        }
    });

    const selectedMI = watch('mI_Id');
    const selectedRole = watch('ivrmrT_Id');

    useEffect(() => {
        if (selectedMI && selectedRole) {
            handleFormSubmit({ mI_Id: selectedMI, ivrmrT_Id: selectedRole });
        }
    }, [selectedMI, selectedRole]);

    const handleFormSubmit = (data: { mI_Id: string; ivrmrT_Id: string }) => {
        onSubmit({
            mI_Id: Number(data.mI_Id),
            ivrmrT_Id: Number(data.ivrmrT_Id)
        });
    };

    return (
        <Card className='w-full'>
            <CardHeader className='bg-slate-50/50 pb-4'>
                <CardTitle className='flex items-center font-bold text-slate-800 text-xl'>
                    <div className='mr-3 h-8 w-2 rounded-full bg-[#7C3AED]' />
                    Mobile Role Privileges Selection
                </CardTitle>
            </CardHeader>
            <CardContent className='pt-6'>
                <form className='space-y-6'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        <div className='space-y-2'>
                            <Label className='font-semibold text-sm'>
                                Institution Name <span className='text-red-500'>*</span>
                            </Label>
                            <Select onValueChange={(value) => setValue('mI_Id', value)} value={selectedMI}>
                                <SelectTrigger className='w-full border-slate-200 bg-white transition-all hover:border-[#7C3AED]/30 focus:ring-[#7C3AED]/20'>
                                    <SelectValue
                                        placeholder={
                                            institutions.length > 0 ? `Select Institute (${institutions.length})` : 'Select Institute'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {institutions.map((inst) => (
                                        <SelectItem key={inst.mI_Id} value={inst.mI_Id.toString()}>
                                            {inst.mI_Name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.mI_Id?.message && <FormError>{errors.mI_Id.message}</FormError>}
                        </div>

                        <div className='space-y-2'>
                            <Label className='font-semibold text-sm'>
                                Role Name <span className='text-red-500'>*</span>
                            </Label>
                            <Select onValueChange={(value) => setValue('ivrmrT_Id', value)} value={selectedRole}>
                                <SelectTrigger className='w-full border-slate-200 bg-white transition-all hover:border-[#7C3AED]/30 focus:ring-[#7C3AED]/20'>
                                    <SelectValue placeholder={roles.length > 0 ? `Select Role (${roles.length})` : 'Select Role'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.ivrmrT_Id} value={role.ivrmrT_Id.toString()}>
                                            {role.ivrmrT_Role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.ivrmrT_Id?.message && <FormError>{errors.ivrmrT_Id.message}</FormError>}
                        </div>
                    </div>

                    {isLoading && (
                        <div className='flex animate-pulse items-center justify-center gap-2 py-2 font-medium text-slate-500'>
                            <Loader2 className='h-4 w-4 animate-spin text-[#7C3AED]' />
                            Fetching records...
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
