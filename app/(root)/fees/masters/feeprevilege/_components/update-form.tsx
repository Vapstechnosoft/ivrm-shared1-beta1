'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FEES_QUERY_KEYS } from '@/constants/query-keys';
import {
    useAcademicYearDropdown,
    useFeeMasterGroupwiseAutoReceiptDropDown,
    useHeadsByGroupAndAcademicYear,
    useRolesDropdown,
    useUserNameDropdown
} from '@/hooks/fees/useMasters';
import { cn } from '@/lib/utils';
import { feePrivilegeSchema } from '@/schemas/fees/masters';
import { addOrUpdateFeePrivilege } from '@/server/fees/masters/fee_previlege';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { CheckSquare, RotateCcw, Save, Square } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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

interface UpdateFeePrivilegeFormProps {
    onSuccess?: () => void;
    selectedRow: any;
    className?: string;
}

type FormFields = z.infer<typeof feePrivilegeSchema.addOrUpdate>;

export default function UpdateFeePrivilegeForm({ onSuccess, selectedRow, className = '' }: UpdateFeePrivilegeFormProps) {
    console.log('selectedRow', selectedRow);

    const { data: academicData, isLoading: loadingAcademic, error: academicError } = useAcademicYearDropdown();

    const { data: rolesData, isLoading: loadingRoles, error: rolesError } = useRolesDropdown();

    const [isInitializing, setIsInitializing] = useState(false);
    const queryClient = useQueryClient();
    console.log('selectedRow', selectedRow);
    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
        reset
    } = useForm<FormFields>({
        mode: 'onChange',
        resolver: zodResolver(feePrivilegeSchema.addOrUpdate),
        defaultValues: {
            academicYear: selectedRow?.asmaY_Id?.toString() || '',
            group: selectedRow?.fmG_Id?.toString() || '',
            heads: selectedRow?.heads || [],
            roles: selectedRow?.ivrmR_Id?.toString() || '',
            users: selectedRow?.user_Id || []
        }
    });

    const academicYear = watch('academicYear');
    const group = watch('group');
    const headsValue = watch('heads');
    const roles = watch('roles');
    const usersValue = watch('users');

    const {
        data: groupData,
        isLoading: loadingGroupData,
        error: groupDataError
    } = useFeeMasterGroupwiseAutoReceiptDropDown(Number(academicYear));

    const { data: userNameData, isLoading: loadingUserNames, error: userNameError } = useUserNameDropdown(Number(roles || 0));

    const {
        data: masterHeadName,
        isLoading: masterHeadNameLoading,
        refetch: refetchHeadNames
    } = useHeadsByGroupAndAcademicYear(Number(academicYear), Number(group));

    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [academicYearOptions, setAcademicYearOptions] = useState<DropdownOption[]>([]);
    const [roleOptions, setRoleOptions] = useState<DropdownOption[]>([]);
    const [groupOptions, setGroupOptions] = useState<DropdownOption[]>([]);
    const [userOptions, setUserOptions] = useState<UserOption[]>([]);
    const [headOptions, setHeadOptions] = useState<DropdownOption[]>([]);
    const [userSearch, setUserSearch] = useState('');
    const [headSearchTerm, setHeadSearchTerm] = useState('');
    const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);

    // Initialize form with selected row data
    useEffect(() => {
        const initializeForm = async () => {
            setIsInitializing(true);

            // try {
            //     // Set basic values from selected row
            //     //const academicYearId = selectedRow.asmaY_Id?.toString() ?? '';
            //     const groupId = selectedRow.fmG_Id?.toString() ?? '';
            //     const roleId = selectedRow.ivrmrT_Id?.toString() ?? '';

            //     const academicYearId = '231';

            //     // Set form values
            //     setValue('academicYear', academicYearId);
            //     setValue('group', groupId);
            //     setValue('roles', roleId);

            //     // Wait for data to load and then set heads and users
            //     await Promise.resolve();

            //     // Set heads if available (you might need to adjust this based on your data structure)
            //     if (selectedRow.heads && Array.isArray(selectedRow.heads)) {
            //         setValue('heads', selectedRow.heads);
            //     }

            //     // Set users if available (you might need to adjust this based on your data structure)
            //     if (selectedRow.users && Array.isArray(selectedRow.users)) {
            //         setValue('users', selectedRow.users);
            //     }
            // } catch (_error) {
            //     //ignore
            // } finally {
            //     setTimeout(() => setIsInitializing(false), 100);
            // }

            try {
                // Set basic values from selected row
                const academicYearId = selectedRow.asmaY_Id?.toString() ?? '';
                const groupId = selectedRow.fmG_Id?.toString() ?? '';
                const roleId = selectedRow.ivrmR_Id?.toString() ?? '';

                //  const academicYearId = '231';

                // Set form values
                setValue('academicYear', academicYearId);
                setValue('group', groupId);
                setValue('roles', roleId);

                // Wait for data to load and then set heads and users
                await Promise.resolve();

                // Set heads if available (you might need to adjust this based on your data structure)
                // if (selectedRow.heads && Array.isArray(selectedRow.heads)) {
                //     setValue('heads', selectedRow.heads);
                // }
                setValue('heads', [selectedRow.fmH_Id.toString()]);

                // Set users if available (you might need to adjust this based on your data structure)
                // if (selectedRow.users && Array.isArray(selectedRow.users)) {
                //     setValue('users', selectedRow.users);
                // }

                setValue('users', [selectedRow.user_Id.toString()]);
            } catch (_error) {
                //ignore
            } finally {
                setTimeout(() => setIsInitializing(false), 100);
            }
        };

        initializeForm();
    }, [selectedRow, setValue]);

    //setValue('heads', [selectedRow.fmH_Id.toString()]);

    useEffect(() => {
        if (academicYear && group) {
            refetchHeadNames();
        } else {
            setHeadOptions([]);
            setValue('heads', []);
        }
    }, [academicYear, group, refetchHeadNames, setValue]);

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

    const filteredHeadOptions = headOptions.filter((h) => h.label.toLowerCase().includes(headSearchTerm.toLowerCase()));

    const filteredUsers = userOptions.filter((u) => u.normalizedUserName.toLowerCase().includes(userSearch.toLowerCase()));

    const toggleHead = (id: string) => {
        const cur = headsValue || [];
        const updated = cur.includes(id) ? cur.filter((v) => v !== id) : [...cur, id];
        setValue('heads', updated, { shouldValidate: hasSubmitted });
    };

    const selectAllHeads = () => {
        if ((headsValue || []).length === headOptions.length && headOptions.length) {
            setValue('heads', [], { shouldValidate: hasSubmitted });
        } else {
            const all = headOptions.map((h) => h.value);
            setValue('heads', all, { shouldValidate: hasSubmitted });
        }
    };

    const toggleUser = (id: string) => {
        const cur = usersValue || [];
        const updated = cur.includes(id) ? cur.filter((v) => v !== id) : [...cur, id];
        setValue('users', updated, { shouldValidate: hasSubmitted });
    };

    const selectAllUsers = () => {
        if ((usersValue || []).length === userOptions.length && userOptions.length) {
            setValue('users', [], { shouldValidate: hasSubmitted });
        } else {
            const all = userOptions.map((u) => u.userId.toString());
            setValue('users', all, { shouldValidate: hasSubmitted });
        }
    };

    // const handleReset = () => {
    //     if (selectedRow) {
    //         const academicYearId = selectedRow.asmaY_Id?.toString() ?? '';
    //         const groupId = selectedRow.fmG_Id?.toString() ?? '';
    //         const roleId = selectedRow.ivrmrT_Id?.toString() ?? '';

    //         reset({
    //             academicYear: academicYearId,
    //             group: groupId,
    //             roles: roleId,
    //             heads: selectedRow.heads || [],
    //             users: selectedRow.users || []
    //         });
    //     }
    //     setUserSearch('');
    //     setHeadSearchTerm('');
    //     setHasSubmitted(false);
    // };

    const handleReset = () => {
        if (selectedRow) {
            // Extract values from selectedRow - ensure they are arrays
            const academicYearId = selectedRow.asmaY_Id?.toString() ?? '';
            const groupId = selectedRow.fmG_Id?.toString() ?? '';
            const roleId = selectedRow.ivrmR_Id?.toString() ?? '';

            // Handle heads - check different possible locations
            let headsArray: string[] = [];
            if (selectedRow.heads && Array.isArray(selectedRow.heads)) {
                // If heads is already an array
                headsArray = selectedRow.heads.map((h: any) => h.toString());
            } else if (selectedRow.fmH_Id) {
                // If single head ID exists
                headsArray = [selectedRow.fmH_Id.toString()];
            } else if (selectedRow.fmH_Id?.toString()) {
                // Check as string
                headsArray = [selectedRow.fmH_Id.toString()];
            }

            // Handle users - check different possible locations
            let usersArray: string[] = [];
            if (selectedRow.users && Array.isArray(selectedRow.users)) {
                // If users is already an array
                usersArray = selectedRow.users.map((u: any) => u.toString());
            } else if (selectedRow.user_Id) {
                // If single user ID exists
                usersArray = [selectedRow.user_Id.toString()];
            } else if (selectedRow.user_Id?.toString()) {
                // Check as string
                usersArray = [selectedRow.user_Id.toString()];
            }

            // Reset form
            reset(
                {
                    academicYear: academicYearId,
                    group: groupId,
                    roles: roleId,
                    heads: headsArray,
                    users: usersArray
                },
                {
                    keepDirty: false,
                    keepErrors: false,
                    keepTouched: false,
                    keepIsSubmitted: false,
                    keepSubmitCount: false
                }
            );

            // Also force update the watched values immediately
            setValue('heads', headsArray, { shouldValidate: true });
            setValue('users', usersArray, { shouldValidate: true });
        } else {
            // Reset to empty if no selectedRow
            reset({
                academicYear: '',
                group: '',
                heads: [],
                roles: '',
                users: []
            });
        }

        // Clear search fields
        setUserSearch('');
        setHeadSearchTerm('');
        setHasSubmitted(false);
    };
    const onSubmit = async (data: FormFields) => {
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
                fgL_Id: Number(selectedRow?.fgL_Id),
                asmaY_Id: Number(selectedAcademicYear.value),
                fmG_ID: Number(selectedGroup.value),
                // mI_Id: 30,
                UserId: Number(selectedRole.value),
                grouphead: data.heads.map((h) => ({ FMH_Id: Number(h) })),
                username: data.users.map((u) => ({ UserId: Number(u) }))
            };

            const res = await addOrUpdateFeePrivilege(payload);
            if (res) {
                toast.success('Privilege updated successfully');

                queryClient.invalidateQueries({
                    predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === FEES_QUERY_KEYS.FEES_PRIVILEGE_LIST
                });
            }

            handleReset();
            onSuccess?.();
        } catch (_err: any) {
            toast.error('Something went wrong while updating.');
        }
    };

    return (
        <div className={`${className} w-full`}>
            <Card className='mx-auto w-full max-w-8xl border-gray-300 shadow-md'>
                <CardContent className='p-6'>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                        {/* Academic Year */}
                        <Controller
                            name='academicYear'
                            control={control}
                            render={({ field }) => (
                                <div>
                                    <Label htmlFor='academicYear'>
                                        Academic Year <span className='text-red-500'>*</span>
                                    </Label>
                                    <Select
                                        onValueChange={(v) => {
                                            field.onChange(v);
                                            setValue('group', '');
                                            setValue('heads', []);
                                        }}
                                        value={field.value}
                                        // disabled={isLoadingDropdowns}
                                        disabled
                                    >
                                        <SelectTrigger
                                            id='academicYear'
                                            className={cn('mt-1 w-full', errors.academicYear ? 'border-red-500' : 'border-gray-300')}>
                                            <SelectValue placeholder='Select Academic Year' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {academicYearOptions.map((o) => (
                                                <SelectItem key={o.value} value={o.value}>
                                                    {o.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {!isInitializing && errors.academicYear && <FormError>{errors.academicYear.message}</FormError>}
                                </div>
                            )}
                        />

                        {academicYear && (
                            <Controller
                                name='group'
                                control={control}
                                render={({ field }) => (
                                    <div>
                                        <Label htmlFor='group'>
                                            Group <span className='text-red-500'>*</span>
                                        </Label>
                                        <Select
                                            onValueChange={(v) => {
                                                field.onChange(v);
                                                setValue('heads', []);
                                            }}
                                            value={field.value}
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
                                        {!isInitializing && errors.group && <FormError>{errors.group.message}</FormError>}
                                    </div>
                                )}
                            />
                        )}

                        {academicYear && group && (
                            <div>
                                <Label>
                                    Head Name <span className='text-red-500'>*</span>
                                </Label>
                                <div className='mt-2 rounded-md border border-gray-300 bg-white p-3'>
                                    {/* <InputText
                                        placeholder='Search Head Name...'
                                        value={headSearchTerm}
                                        onChange={(e) => setHeadSearchTerm(e.target.value)}
                                        className='mb-3'
                                        disabled={!academicYear || !group}
                                    />

                                    {headOptions.length > 0 && (
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
                                    </div> */}
                                    <Controller
                                        name='heads'
                                        control={control}
                                        render={({ field }) => (
                                            <div>
                                                <Label htmlFor='heads'>
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

                                                    <div className='mt-2 rounded-md border border-gray-300 bg-white p-3'>
                                                        <InputText
                                                            placeholder='Search Head Name...'
                                                            value={headSearchTerm}
                                                            onChange={(e) => setHeadSearchTerm(e.target.value)}
                                                            className='mb-3'
                                                            disabled={!academicYear || !group}
                                                        />

                                                        <div className='max-h-40 overflow-y-auto rounded-md border border-gray-300 p-1'>
                                                            {masterHeadNameLoading ? (
                                                                <div className='py-4 text-center text-gray-500 text-sm'>
                                                                    Loading heads...
                                                                </div>
                                                            ) : filteredHeadOptions.length === 0 ? (
                                                                <div className='py-4 text-center text-gray-500 text-sm'>
                                                                    {!academicYear || !group
                                                                        ? 'Select Academic Year and Group first'
                                                                        : 'No heads found'}
                                                                </div>
                                                            ) : (
                                                                filteredHeadOptions.map((h) => {
                                                                    const selected = headsValue?.[0] === h.value; // Only first value matters
                                                                    return (
                                                                        <div
                                                                            key={h.value}
                                                                            onClick={() =>
                                                                                setValue('heads', [h.value], {
                                                                                    shouldValidate: hasSubmitted
                                                                                })
                                                                            }
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
                                                </div>

                                                {!isInitializing && errors.heads && <FormError>{errors.heads.message}</FormError>}
                                            </div>
                                        )}
                                    />
                                </div>
                                {!isInitializing && errors.heads && <FormError>{errors.heads.message}</FormError>}
                            </div>
                        )}

                        {/* Role */}
                        <Controller
                            name='roles'
                            control={control}
                            render={({ field }) => (
                                <div>
                                    <Label htmlFor='roles'>
                                        Role <span className='text-red-500'>*</span>
                                    </Label>
                                    <Select
                                        onValueChange={(v) => {
                                            field.onChange(v);
                                            setValue('users', []);
                                            setUserSearch('');
                                        }}
                                        value={field.value}
                                        // disabled={isLoadingDropdowns}
                                        disabled
                                    >
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
                                    {!isInitializing && errors.roles && <FormError>{errors.roles.message}</FormError>}
                                </div>
                            )}
                        />

                        {/* Users */}
                        {roles && (
                            <div>
                                <Label>
                                    Select Users <span className='text-red-500'>*</span>
                                </Label>
                                {/* <div className='mt-2 rounded-md border border-gray-300 bg-white p-3'>
                                    <InputText
                                        placeholder='Search Users...'
                                        value={userSearch}
                                        onChange={(e) => setUserSearch(e.target.value)}
                                        className='mb-3'
                                    />

                                   
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
                                </div> */}
                                <div className='mt-2 rounded-md border border-gray-300 bg-white p-3'>
                                    <InputText
                                        placeholder='Search Users...'
                                        value={userSearch}
                                        onChange={(e) => setUserSearch(e.target.value)}
                                        className='mb-3'
                                    />

                                    <div className='max-h-40 overflow-y-auto rounded-md border border-gray-300 p-1'>
                                        {loadingUserNames ? (
                                            <div className='py-4 text-center text-gray-500 text-sm'>Loading users...</div>
                                        ) : filteredUsers.length === 0 ? (
                                            <div className='py-4 text-center text-gray-500 text-sm'>No users found</div>
                                        ) : (
                                            filteredUsers.map((u) => {
                                                const id = u.userId.toString();
                                                const selected = usersValue?.[0] === id; // Single selection logic
                                                return (
                                                    <div
                                                        key={u.userId}
                                                        onClick={() => setValue('users', [id], { shouldValidate: hasSubmitted })} // Only one selected
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

                                {!isInitializing && errors.users && <FormError>{errors.users.message}</FormError>}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className='mt-3 flex justify-start gap-3 border-t pt-5'>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={handleReset}
                                disabled={isSubmitting}
                                className='flex w-fit items-center gap-2 transition-all duration-200 hover:scale-105'>
                                <RotateCcw className='h-4 w-4' />
                                Reset
                            </Button>
                            <Button
                                type='submit'
                                disabled={isSubmitting}
                                className='flex w-fit items-center gap-2 transition-all duration-200 hover:scale-105'>
                                <Save className='h-4 w-4' />
                                {isSubmitting ? 'Updating...' : 'Update Privilege'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
