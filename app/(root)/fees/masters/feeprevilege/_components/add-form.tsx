'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useAcademicYearDropdown,
    useFeeMasterGroupwiseAutoReceiptDropDown,
    useFeePrevilegeList,
    useHeadsByGroupAndAcademicYear,
    useRolesDropdown,
    useUserNameDropdown
} from '@/hooks/fees/useMasters';
import { cn } from '@/lib/utils';
import { feePrivilegeSchema } from '@/schemas/fees/masters';
import { addOrUpdateFeePrivilege } from '@/server/fees/masters/fee_previlege';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, RotateCcw, Save, Square } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

interface DropdownOption {
    value: string;
    label: string;
}

interface UserOption {
    userId: number;
    normalizedUserName: string;
}

interface AddMasterClassFormProps {
    onSuccess?: () => void;
    className?: string;
}

type FormFields = z.infer<typeof feePrivilegeSchema.addOrUpdate>;

export default function AddFeePrivilegeForm({ onSuccess, className = '' }: AddMasterClassFormProps) {
    const { refetchAll } = useFeePrevilegeList();

    const {
        handleSubmit,
        setValue,
        watch,

        formState: { errors, isSubmitting },
        reset
    } = useForm<FormFields>({
        resolver: zodResolver(feePrivilegeSchema.addOrUpdate),
        defaultValues: {
            academicYear: '',
            group: '',
            heads: [],
            roles: '',
            users: []
        }
    });

    const academicYear = watch('academicYear');
    const group = watch('group');
    const headsValue = watch('heads');
    const roles = watch('roles');
    const usersValue = watch('users');

    const { data: academicData, isLoading: loadingAcademic, error: academicError, refetch } = useAcademicYearDropdown();

    const { data: rolesData, isLoading: loadingRoles, error: rolesError } = useRolesDropdown();

    const {
        data: groupData,
        isLoading: loadingGroupData,
        error: groupDataError,
        refetch: refetchGroups
    } = useFeeMasterGroupwiseAutoReceiptDropDown(Number(academicYear));

    const { data: userNameData, isLoading: loadingUserNames, error: userNameError } = useUserNameDropdown(Number(roles || 0));

    const {
        data: masterHeadName,
        isLoading: masterHeadNameLoading,
        refetch: refetchHeadNames
    } = useHeadsByGroupAndAcademicYear(Number(academicYear), Number(group));
    console.log('masterHeadName', masterHeadName);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [academicYearOptions, setAcademicYearOptions] = useState<DropdownOption[]>([]);
    const [roleOptions, setRoleOptions] = useState<DropdownOption[]>([]);
    const [groupOptions, setGroupOptions] = useState<DropdownOption[]>([]);
    const [userOptions, setUserOptions] = useState<UserOption[]>([]);
    const [headOptions, setHeadOptions] = useState<DropdownOption[]>([]);
    const [userSearch, setUserSearch] = useState('');
    const [headSearchTerm, setHeadSearchTerm] = useState('');
    const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);

    const [resetKey, setResetKey] = useState(0);

    const [shouldFetchHeads, setShouldFetchHeads] = useState(false);

    // useEffect(() => {
    //     if (academicYear && group) {
    //         // Clear heads immediately when group changes
    //         setHeadOptions([]);
    //         setValue('heads', []);
    //         // Then refetch for new group
    //         refetchHeadNames();
    //         //refetchHeadNames();
    //     } else {
    //         setHeadOptions([]);
    //         setValue('heads', []);
    //     }
    // }, [academicYear, group, refetchHeadNames]);

    // Also, modify your useEffect that depends on academicYear and group:
    // Update the useEffect for heads
    useEffect(() => {
        // Only fetch heads if both academicYear AND group have valid values
        if (academicYear && group) {
            // Clear heads immediately when group changes
            setValue('heads', []);
            setHeadOptions([]);
            // Set flag to fetch heads
            setShouldFetchHeads(true);
        } else {
            // Clear heads when either academicYear or group is empty
            setHeadOptions([]);
            setValue('heads', []);
            setShouldFetchHeads(false);
        }
    }, [academicYear, group, resetKey]);

    useEffect(() => {
        setIsLoadingDropdowns(loadingAcademic || loadingRoles);
    }, [loadingAcademic, loadingRoles]);

    useEffect(() => {
        if (academicError) {
            toast.error(academicError.message || 'Error fetching academic years');
            setAcademicYearOptions([]);
            return;
        }
        if (academicData?.data && Array.isArray(academicData.data)) {
            const opts = academicData.data.map((i: any) => ({
                value: i.asmaY_Id.toString(),
                label: i.asmaY_Year
            }));
            setAcademicYearOptions(opts);
        } else {
            setAcademicYearOptions([]);
        }
    }, [academicData, academicError]);

    useEffect(() => {
        if (rolesError) {
            toast.error(rolesError.message || 'Error fetching roles');
            setRoleOptions([]);
            return;
        }
        if (rolesData?.data && Array.isArray(rolesData.data)) {
            const opts = rolesData.data
                .map((i: any) => ({
                    value: i.ivrmrT_Id?.toString() || '',
                    label: i.ivrmrT_Role || 'Unknown Role'
                }))
                .filter((o) => o.value);
            setRoleOptions(opts);
        } else {
            setRoleOptions([]);
        }
    }, [rolesData, rolesError]);

    useEffect(() => {
        if (groupDataError) {
            toast.error(groupDataError.message || 'Error fetching groups');
            setGroupOptions([]);
            return;
        }
        if (groupData?.data && Array.isArray(groupData.data)) {
            const opts = groupData.data.map((g: any) => ({
                value: g.fmG_Id.toString(),
                label: g.fmG_GroupName
            }));
            setGroupOptions(opts);
        } else {
            setGroupOptions([]);
        }
    }, [groupData, groupDataError, academicYear]);

    useEffect(() => {
        if (masterHeadName?.data && Array.isArray(masterHeadName.data)) {
            // const opts = masterHeadName.data.map((h: any) => ({
            //     value: h.fmH_Id.toString(),
            //     label: h.fmH_FeeName
            // }));
            // setHeadOptions(opts);
            const opts = Array.from(
                new Map(
                    masterHeadName.data.map((h: any) => [
                        h.fmH_Id, // unique key
                        {
                            value: h.fmH_Id.toString(),
                            label: h.fmH_FeeName
                        }
                    ])
                ).values()
            );

            setHeadOptions(opts);
        } else {
            setHeadOptions([]);
        }
    }, [masterHeadName]);

    useEffect(() => {
        if (userNameError) {
            toast.error(userNameError.message || 'Error fetching users');
            setUserOptions([]);
            return;
        }
        if (userNameData?.data && Array.isArray(userNameData.data)) {
            const opts = userNameData.data.map((i: any) => ({
                userId: i.userId,
                normalizedUserName: i.normalizedUserName
            }));
            setUserOptions(opts);
        } else {
            setUserOptions([]);
        }
    }, [userNameData, userNameError, roles]);

    //const filteredHeadOptions = headOptions.filter((h) => h.label.toLowerCase().includes(headSearchTerm.toLowerCase()));

    // const filteredHeadOptions = headOptions.filter((h) =>
    //     (h.label ?? '').toString().toLowerCase().includes(headSearchTerm.trim().toLowerCase())
    // );

    const filteredHeadOptions = headOptions.filter((h) => {
        const label = (h.label ?? '').toString().trim();
        const searchTerm = headSearchTerm.trim();

        return label.toLowerCase().includes(searchTerm.toLowerCase());
    });
    const filteredUsers = userOptions.filter((u) => u.normalizedUserName.toLowerCase().includes(userSearch.toLowerCase()));

    const toggleHead = (id: string) => {
        const cur = headsValue || [];
        const updated = cur.includes(id) ? cur.filter((v) => v !== id) : [...cur, id];
        //setValue('heads', updated, { shouldValidate: hasSubmitted });

        setValue('heads', updated, { shouldValidate: true });
    };

    const selectAllHeads = () => {
        if ((headsValue || []).length === headOptions.length && headOptions.length) {
            setValue('heads', [], { shouldValidate: hasSubmitted });
        } else {
            const all = headOptions.map((h) => h.value);
            // setValue('heads', all, { shouldValidate: hasSubmitted });

            setValue('heads', all, { shouldValidate: true });
        }
    };

    const toggleUser = (id: string) => {
        const cur = usersValue || [];
        const updated = cur.includes(id) ? cur.filter((v) => v !== id) : [...cur, id];
        // setValue('users', updated, { shouldValidate: hasSubmitted });

        setValue('users', updated, { shouldValidate: true });
    };

    const selectAllUsers = () => {
        if ((usersValue || []).length === userOptions.length && userOptions.length) {
            setValue('users', [], { shouldValidate: hasSubmitted });
        } else {
            const all = userOptions.map((u) => u.userId.toString());
            // setValue('users', all, { shouldValidate: hasSubmitted });
            setValue('users', all, { shouldValidate: true });
        }
    };

    // const handleReset = () => {
    //     // reset();
    //     // setUserSearch('');
    //     // setHeadSearchTerm('');
    //     // setHasSubmitted(false);
    //     window.location.reload();
    // };

    useEffect(() => {
        if (shouldFetchHeads && academicYear && group) {
            refetchHeadNames();
            setShouldFetchHeads(false);
        }
    }, [shouldFetchHeads, academicYear, group, refetchHeadNames]);

    const handleReset = () => {
        // Reset form values
        reset({
            academicYear: '',
            group: '',
            heads: [],
            roles: '',
            users: []
        });

        // Clear search terms
        setUserSearch('');
        setHeadSearchTerm('');

        // Reset validation state
        setHasSubmitted(false);

        // Clear dropdown options that depend on selections
        setGroupOptions([]);
        setUserOptions([]);
        setHeadOptions([]);
        //setRoleOptions([]);
        setShouldFetchHeads(false);
        // IMPORTANT: Force refetch groups with undefined academic year
        // This will clear the cached data for the previous academic year
        setTimeout(() => {
            setValue('academicYear', '', { shouldValidate: false });
            setValue('roles', '', { shouldValidate: false });
        }, 0);
        setTimeout(() => {
            // Force refetch academic years
            refetch();

            // Force refetch groups with undefined academic year
            refetchGroups();

            // Force refetch heads with undefined parameters
            refetchHeadNames();
        }, 0);

        setResetKey((prev) => prev + 1);
    };

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const selectedAcademicYear = academicYearOptions.find((year) => year.value === data.academicYear);

            if (!selectedAcademicYear) {
                toast.error('Please select a valid Academic Year');
                return;
            }

            const selectedGroup = groupOptions.find((grp) => grp.value === data.group);

            if (!selectedGroup) {
                toast.error('Please select a valid Group');
                return;
            }

            const selectedRole = roleOptions.find((role) => role.value === data.roles);

            if (!selectedRole) {
                toast.error('Please select a valid Role');
                return;
            }
            const payload = {
                asmaY_Id: Number(selectedAcademicYear.value),
                fmG_ID: Number(selectedGroup.value),
                // mI_Id: 30,
                UserId: Number(selectedRole.value),
                grouphead: data.heads.map((h) => ({ FMH_Id: Number(h) })),
                username: data.users.map((u) => ({ UserId: Number(u) }))
            };

            console.log('Submitting payload:', JSON.stringify(payload));

            const res = await addOrUpdateFeePrivilege(payload);
            if (res) {
                // toast.success('Privilege saved successfully');
                toast.success(res.message);
            }

            handleReset();
            onSuccess?.();
            refetchAll();
        } catch (_err: any) {
            toast.error('Something went wrong while saving.');
        }
    };

    return (
        <div className={`${className} w-full`}>
            <Card className='mx-auto w-full max-w-8xl border-gray-300 shadow-md'>
                <CardContent className='p-6'>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                        {/* Academic Year */}
                        <div key={`academic-${resetKey}`}>
                            <Label htmlFor='academicYear'>
                                Academic Year <span className='text-red-500'>*</span>
                            </Label>
                            <Select
                                onValueChange={(v) => {
                                    if (v === 'none') {
                                        setValue('academicYear', '', { shouldValidate: true });
                                    } else {
                                        setValue('academicYear', v, { shouldValidate: true });
                                    }
                                    //  setValue('academicYear', v, { shouldValidate: true });
                                    setValue('group', '');
                                    setValue('heads', []);
                                }}
                                value={academicYear || ''}
                                disabled={isLoadingDropdowns}>
                                <SelectTrigger
                                    id='academicYear'
                                    className={cn('mt-1 w-full', errors.academicYear ? 'border-red-500' : 'border-gray-300')}>
                                    <SelectValue placeholder='Select Academic Year' />
                                    {/* <SelectValue placeholder='Select Academic Year'>
            {academicYear ? academicYearOptions.find(opt => opt.value === academicYear)?.label : ''}
        </SelectValue> */}
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYearOptions.map((o) => (
                                        <SelectItem key={o.value} value={o.value}>
                                            {o.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.academicYear && <FormError>{errors.academicYear.message}</FormError>}
                        </div>

                        {academicYear && (
                            <div>
                                <Label htmlFor='group'>
                                    Group <span className='text-red-500'>*</span>
                                </Label>
                                <Select
                                    onValueChange={(v) => {
                                        setValue('group', v, { shouldValidate: true });
                                        setValue('heads', []);
                                    }}
                                    value={group}
                                    disabled={loadingGroupData}>
                                    <SelectTrigger
                                        id='group'
                                        className={cn('mt-1 w-full', errors.group ? 'border-red-500' : 'border-gray-300')}>
                                        <SelectValue placeholder='Select Group' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadingGroupData ? (
                                            <div className='px-3 py-2 text-gray-500 text-sm'>Loading groups...</div>
                                        ) : groupOptions.length === 0 ? (
                                            <div className='px-3 py-2 text-gray-500 text-sm'>No groups available</div>
                                        ) : (
                                            groupOptions.map((o) => (
                                                <SelectItem key={o.value} value={o.value}>
                                                    {o.label}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.group && <FormError>{errors.group.message}</FormError>}
                            </div>
                        )}

                        {academicYear && group && (
                            <div>
                                <Label>
                                    Head Name <span className='text-red-500'>*</span>
                                </Label>
                                <div className='mt-2 rounded-md border border-gray-300 bg-white p-3'>
                                    <InputText
                                        placeholder='Search Head Name...'
                                        value={headSearchTerm}
                                        onChange={(e) => setHeadSearchTerm(e.target.value)}
                                        className='mb-3'
                                        disabled={!academicYear || !group}
                                    />

                                    {headOptions.length > 0 && filteredHeadOptions.length > 0 && (
                                        <div
                                            onClick={selectAllHeads}
                                            className={cn(
                                                'mb-2 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 font-medium text-sm transition-all',
                                                (headsValue || []).length === headOptions.length && headOptions.length
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-gray-300 hover:border-primary/40'
                                            )}>
                                            {(headsValue || []).length === headOptions.length && headOptions.length ? (
                                                <CheckSquare className='h-4 w-4 text-primary' />
                                            ) : (
                                                <Square className='h-4 w-4 text-gray-400' />
                                            )}
                                            <span>Select All</span>
                                        </div>
                                    )}

                                    <div className='max-h-40 overflow-y-auto rounded-md border border-gray-300 p-1'>
                                        {masterHeadNameLoading ? (
                                            <div className='py-4 text-center text-gray-500 text-sm'>Loading heads...</div>
                                        ) : filteredHeadOptions.length === 0 ? (
                                            <div className='py-4 text-center text-gray-500 text-sm'>
                                                {!academicYear || !group ? 'Select Academic Year and Group first' : 'No heads found'}
                                            </div>
                                        ) : (
                                            filteredHeadOptions.map((h) => {
                                                const selected = (headsValue || []).includes(h.value);
                                                return (
                                                    <div
                                                        key={h.value}
                                                        onClick={() => toggleHead(h.value)}
                                                        className={cn(
                                                            'mb-1 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-sm transition-all',
                                                            selected
                                                                ? 'border-primary bg-primary/5 text-primary'
                                                                : 'border-gray-300 hover:border-primary/40'
                                                        )}>
                                                        {selected ? (
                                                            <CheckSquare className='h-4 w-4 text-primary' />
                                                        ) : (
                                                            <Square className='h-4 w-4 text-gray-400' />
                                                        )}
                                                        <span>{h.label}</span>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                                {errors.heads && <FormError>{errors.heads.message}</FormError>}
                            </div>
                        )}

                        {/* Role */}
                        <div key={`role-${resetKey}`}>
                            <Label htmlFor='roles'>
                                Role <span className='text-red-500'>*</span>
                            </Label>
                            <Select
                                onValueChange={(v) => {
                                    setValue('roles', v, { shouldValidate: true });
                                    setValue('users', []);
                                    setUserSearch('');
                                }}
                                value={roles || ''}
                                disabled={isLoadingDropdowns}>
                                <SelectTrigger
                                    id='roles'
                                    className={cn('mt-1 w-full', errors.roles ? 'border-red-500' : 'border-gray-300')}>
                                    <SelectValue placeholder='Select Role' />
                                </SelectTrigger>
                                <SelectContent>
                                    {loadingRoles ? (
                                        <div className='px-3 py-2 text-gray-500 text-sm'>Loading roles...</div>
                                    ) : roleOptions.length === 0 ? (
                                        <div className='px-3 py-2 text-gray-500 text-sm'>No roles</div>
                                    ) : (
                                        roleOptions.map((o) => (
                                            <SelectItem key={o.value} value={o.value}>
                                                {o.label}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.roles && <FormError>{errors.roles.message}</FormError>}
                        </div>

                        {/* Users */}
                        {roles && (
                            <div>
                                <Label>
                                    Select Users <span className='text-red-500'>*</span>
                                </Label>
                                <div className='mt-2 rounded-md border border-gray-300 bg-white p-3'>
                                    <InputText
                                        placeholder='Search Users...'
                                        value={userSearch}
                                        onChange={(e) => setUserSearch(e.target.value)}
                                        className='mb-3'
                                    />

                                    {/* Select All Users */}
                                    {userOptions.length > 0 && (
                                        <div
                                            onClick={selectAllUsers}
                                            className={cn(
                                                'mb-2 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 font-medium text-sm transition-all',
                                                (usersValue || []).length === userOptions.length && userOptions.length
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-gray-300 hover:border-primary/40'
                                            )}>
                                            {(usersValue || []).length === userOptions.length && userOptions.length ? (
                                                <CheckSquare className='h-4 w-4 text-primary' />
                                            ) : (
                                                <Square className='h-4 w-4 text-gray-400' />
                                            )}
                                            <span>Select All</span>
                                        </div>
                                    )}

                                    <div className='max-h-40 overflow-y-auto rounded-md border border-gray-300 p-1'>
                                        {loadingUserNames ? (
                                            <div className='py-4 text-center text-gray-500 text-sm'>Loading users...</div>
                                        ) : filteredUsers.length === 0 ? (
                                            <div className='py-4 text-center text-gray-500 text-sm'>No users found</div>
                                        ) : (
                                            filteredUsers.map((u) => {
                                                const id = u.userId.toString();
                                                const selected = (usersValue || []).includes(id);
                                                return (
                                                    <div
                                                        key={u.userId}
                                                        onClick={() => toggleUser(id)}
                                                        className={cn(
                                                            'mb-1 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-sm transition-all',
                                                            selected
                                                                ? 'border-primary bg-primary/5 text-primary'
                                                                : 'border-gray-300 hover:border-primary/40'
                                                        )}>
                                                        {selected ? (
                                                            <CheckSquare className='h-4 w-4 text-primary' />
                                                        ) : (
                                                            <Square className='h-4 w-4 text-gray-400' />
                                                        )}
                                                        <span>{u.normalizedUserName}</span>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                                {errors.users && <FormError>{errors.users.message}</FormError>}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className='mt-3 flex justify-start gap-3 border-t pt-5'>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={handleReset}
                                disabled={isSubmitting}
                                className='flex w-fit items-center gap-2'>
                                <RotateCcw className='h-4 w-4' />
                                Reset
                            </Button>
                            <Button type='submit' disabled={isSubmitting} className='flex w-fit items-center gap-2'>
                                <Save className='h-4 w-4' />
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
