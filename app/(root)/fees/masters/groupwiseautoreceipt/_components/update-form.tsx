'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown, useFeeMasterGroupwiseAutoReceiptDropDown } from '@/hooks/fees/useMasters';
import { cn } from '@/lib/utils';
import { masterClassFeeMasterGroupwiseAutoReceipt } from '@/schemas/fees/masters';
import { addOrUpdateMasterFeeMasterGroupwiseAutoReceipt } from '@/server/fees/masters/fee_master_groupwise_auto_receipt';
import type { IMasterGroupWiseAutoReciptList } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, RotateCcw, Save, Square } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FormFields = {
    academicYear: string;
    usePrefix: boolean;
    useSuffix: boolean;
    prefixValue: string;
    suffixValue: string;
    startingNumber: string;
    groups: string[];
    autoGroupName: string;
    address: string;
    receiptTemplateFormat: string;
};

interface DropdownOption {
    value: string;
    label: string;
}

interface GroupOption {
    fmG_Id: number;
    fmG_GroupName: string;
}

interface UpdateMasterClassFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow?: IMasterGroupWiseAutoReciptList | null;
}

export default function UpdateMasterClassForm({ onSuccess, className = '', selectedRow }: UpdateMasterClassFormProps) {
    const { data: academicData, isLoading: loadingAcademic, error: academicError } = useAcademicYearDropdown();

    const {
        handleSubmit,
        reset,
        setValue,
        watch,
        register,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterClassFeeMasterGroupwiseAutoReceipt.addOrUpdate),
        mode: 'onSubmit',
        defaultValues: {
            academicYear: selectedRow?.asmaY_Id?.toString() || '',
            usePrefix: false,
            useSuffix: false,
            prefixValue: '',
            suffixValue: '',
            startingNumber: '',
            groups: [],
            autoGroupName: '',
            address: '',
            receiptTemplateFormat: ''
        }
    });

    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [academicYearOptions, setAcademicYearOptions] = useState<DropdownOption[]>([]);
    const [groupOptions, setGroupOptions] = useState<GroupOption[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);
    // const [usePrefix, setUsePrefix] = useState(false);
    // const [useSuffix, setUseSuffix] = useState(false);

    const usePrefix = watch('usePrefix');
    const useSuffix = watch('useSuffix');

    const academicYear = watch('academicYear');
    const groupsValue = watch('groups');

    // Sync selectedGroups with form state
    useEffect(() => {
        setSelectedGroups(groupsValue || []);
    }, [groupsValue]);

    // Load Academic Years
    useEffect(() => {
        setIsLoadingDropdowns(loadingAcademic);
    }, [loadingAcademic]);

    useEffect(() => {
        if (academicError) {
            toast.error(academicError.message || 'Error fetching academic years');
            setAcademicYearOptions([]);
            return;
        }
        if (academicData?.data && Array.isArray(academicData.data)) {
            const options = academicData.data.map((item: any) => ({
                value: item.asmaY_Id.toString(),
                label: item.asmaY_Year
            }));
            setAcademicYearOptions(options);
        } else {
            setAcademicYearOptions([]);
        }
    }, [academicData, academicError]);

    // Load Groups based on Academic Year
    const {
        data: groupData,
        isLoading: loadingGroupData,
        error: groupDataError
    } = useFeeMasterGroupwiseAutoReceiptDropDown(Number(academicYear));

    useEffect(() => {
        if (groupDataError) {
            toast.error(groupDataError.message || 'Error fetching groups');
            setGroupOptions([]);
            return;
        }
        if (groupData?.data && Array.isArray(groupData.data)) {
            setGroupOptions(groupData.data);
        } else {
            setGroupOptions([]);
        }
    }, [groupData, groupDataError, academicYear]);

    // Pre-fill form when selectedRow changes and dropdowns are ready
    useEffect(() => {
        if (!selectedRow) return;

        // Academic Year
        if (academicYearOptions.length > 0) {
            const academicYearOption = academicYearOptions.find((opt) => opt.label === selectedRow.academicyear);
            if (academicYearOption) {
                setValue('academicYear', academicYearOption.value);
            }
        }

        // Starting Number
        setValue('startingNumber', selectedRow.fgaR_Starting_No?.toString() || '');

        // Prefix / Suffix
        const hasPrefix = selectedRow.fgaR_PrefixFlag === '1' && !!selectedRow.fgaR_PrefixName;
        const hasSuffix = selectedRow.fgaR_SuffixFlag === '1' && !!selectedRow.fgaR_SuffixName;

        // setUsePrefix(hasPrefix);
        // setUseSuffix(hasSuffix);
        setValue('usePrefix', hasPrefix);
        setValue('useSuffix', hasSuffix);
        setValue('prefixValue', selectedRow.fgaR_PrefixName || '');
        setValue('suffixValue', selectedRow.fgaR_SuffixName || '');

        // Other fields
        setValue('autoGroupName', selectedRow.fgaR_Name || '');
        setValue('address', selectedRow.fgaR_Address || '');
        setValue('receiptTemplateFormat', selectedRow.fgaR_Template_Name || '');
    }, [selectedRow, academicYearOptions, setValue]);

    // useEffect(() => {
    //     if (!selectedRow?.feeGroupslist || groupOptions.length === 0) return;

    //     const preSelectedGroupIds = selectedRow.feeGroupslist
    //         .map((group: any) => {
    //             const matched = groupOptions.find((opt) => opt.fmG_GroupName === group.fmG_GroupName);
    //             return matched ? matched.fmG_Id.toString() : null;
    //         })
    //         .filter((id: string | null): id is string => id !== null);

    //     if (preSelectedGroupIds.length > 0) {
    //         setSelectedGroups(preSelectedGroupIds);
    //         setValue('groups', preSelectedGroupIds, { shouldValidate: hasSubmitted });
    //     }
    // }, [selectedRow, groupOptions, setValue, hasSubmitted]);

    const filteredGroupOptions = groupOptions.filter((option) => option.fmG_GroupName.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        if (!selectedRow?.feeGroupslist || groupOptions.length === 0) return;

        const preSelectedGroupIds = selectedRow.feeGroupslist
            .map((group: any) => {
                const matched = groupOptions.find((opt) => opt.fmG_GroupName === group.fmG_GroupName);
                return matched ? matched.fmG_Id.toString() : null;
            })
            .filter((id: string | null): id is string => id !== null);

        if (preSelectedGroupIds.length > 0) {
            setSelectedGroups(preSelectedGroupIds);
            setValue('groups', preSelectedGroupIds, {
                shouldValidate: true,
                shouldDirty: true
            });
        }
    }, [selectedRow, groupOptions, setValue]);

    // const handleGroupChange = (value: string) => {
    //     const currentGroups = groupsValue || [];
    //     let updatedGroups: string[];
    //     if (currentGroups.includes(value)) {
    //         updatedGroups = currentGroups.filter((c) => c !== value);
    //     } else {
    //         updatedGroups = [...currentGroups, value];
    //     }
    //     setSelectedGroups(updatedGroups);
    //     setValue('groups', updatedGroups, { shouldValidate: hasSubmitted });
    // };

    const handleGroupChange = (value: string) => {
        // Create a new array based on current selectedGroups state
        const newSelectedGroups = selectedGroups.includes(value)
            ? selectedGroups.filter((id) => id !== value) // Remove if already selected
            : [...selectedGroups, value]; // Add if not selected

        // Update both state and form value
        setSelectedGroups(newSelectedGroups);
        setValue('groups', newSelectedGroups, {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    // const handleSelectAll = () => {
    //     const currentGroups = groupsValue || [];
    //     if (currentGroups.length === groupOptions.length) {
    //         setSelectedGroups([]);
    //         setValue('groups', [], { shouldValidate: hasSubmitted });
    //     } else {
    //         const allValues = groupOptions.map((opt) => opt.fmG_Id.toString());
    //         setSelectedGroups(allValues);
    //         setValue('groups', allValues, { shouldValidate: hasSubmitted });
    //     }
    // };

    const handleSelectAll = () => {
        if (groupOptions.length === 0) return;

        const newSelectedGroups =
            selectedGroups.length === groupOptions.length
                ? [] // Deselect all if all are selected
                : groupOptions.map((opt) => opt.fmG_Id.toString()); // Select all

        setSelectedGroups(newSelectedGroups);
        setValue('groups', newSelectedGroups, {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    // In your useEffect that pre-fills groups:
    useEffect(() => {
        if (!selectedRow?.feeGroupslist || groupOptions.length === 0) return;

        const preSelectedGroupIds = selectedRow.feeGroupslist
            .map((group: any) => {
                const matched = groupOptions.find((opt) => opt.fmG_GroupName === group.fmG_GroupName);
                return matched ? matched.fmG_Id.toString() : null;
            })
            .filter((id: string | null): id is string => id !== null);

        if (preSelectedGroupIds.length > 0) {
            setSelectedGroups(preSelectedGroupIds);
            setValue('groups', preSelectedGroupIds, {
                shouldValidate: true,
                shouldDirty: true
            });
        }
    }, [selectedRow, groupOptions, setValue]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const { academicYear, prefixValue, suffixValue, startingNumber, groups, autoGroupName, address, receiptTemplateFormat } = data;

            const payload = {
                asmaY_Id: Number.parseInt(academicYear),
                fgaR_Id: selectedRow?.fgaR_Id || 0,
                fgaR_PrefixFlag: prefixValue ? '1' : '',
                fgaR_SuffixFlag: suffixValue ? '1' : '',
                fgaR_PrefixName: prefixValue || '',
                fgaR_SuffixName: suffixValue || '',
                fgaR_Name: autoGroupName,
                fgaR_Address: address || '',
                savegroup: groups.map((groupId) => ({
                    fmG_Id: Number.parseInt(groupId)
                })),
                fgaR_Starting_No: startingNumber,
                fgaR_Template_Name: receiptTemplateFormat || ''
            };

            console.log('auto receipt payload', JSON.stringify(payload));
            const response = await addOrUpdateMasterFeeMasterGroupwiseAutoReceipt(payload);

            if (response.success) {
                toast.success(response.message || 'Master class updated successfully');
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to update Groupwise Auto Receipt');
            }
        } catch (error: any) {
            console.error('Submission error:', error);
            toast.error(error.message || 'Error updating master class');
        }
    };

    const handleReset = () => {
        reset();
        setSelectedGroups([]);
        setSearchTerm('');
        // setUsePrefix(false);
        // setUseSuffix(false);
        setHasSubmitted(false);
    };

    const handleFormSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        setHasSubmitted(true);
        handleSubmit(onSubmit)();
    };

    return (
        <div className={`${className} w-full`}>
            <Card className='mx-auto w-full max-w-8xl border-gray-200 shadow-md'>
                <CardHeader className='border-b bg-white p-5'>
                    <CardTitle className='font-medium text-gray-700 text-sm'>Update Master Class</CardTitle>
                </CardHeader>
                <CardContent className='p-6'>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleFormSubmit(e as any);
                        }}>
                        <div className='space-y-6'>
                            {/* Academic Year */}
                            <div>
                                <Label htmlFor='academicYear'>
                                    Academic Year <span className='text-red-500'>*</span>
                                </Label>
                                <Select
                                    onValueChange={(value) => setValue('academicYear', value, { shouldValidate: hasSubmitted })}
                                    value={academicYear}
                                    disabled={isLoadingDropdowns}>
                                    <SelectTrigger
                                        id='academicYear'
                                        className={`mt-1 w-full transition-colors focus:ring-2 focus:ring-primary/20 ${
                                            errors.academicYear ? 'border-red-500' : 'border-gray-300'
                                        }`}>
                                        <SelectValue placeholder='Select Academic Year' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicYearOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {hasSubmitted && errors.academicYear && <FormError>{errors.academicYear.message}</FormError>}
                            </div>

                            {/* Starting Number */}
                            <div>
                                <Label htmlFor='startingNumber'>
                                    Starting Number <span className='text-red-500'>*</span>
                                </Label>
                                <InputText
                                    id='startingNumber'
                                    placeholder='Enter starting number'
                                    {...register('startingNumber')}
                                    error={hasSubmitted ? errors.startingNumber?.message : undefined}
                                    className='transition-colors focus:ring-2 focus:ring-primary/20'
                                />
                                {hasSubmitted && errors.startingNumber && <FormError>{errors.startingNumber.message}</FormError>}
                            </div>

                            {/* Prefix / Suffix Toggle */}
                            <div className='lg:col-span-2'>
                                <Label>Prefix / Suffix</Label>
                                <div className='mt-2 flex flex-wrap gap-6'>
                                    <Label className='flex items-center space-x-2'>
                                        {/* <input
                                            type='checkbox'
                                            checked={usePrefix}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setUsePrefix(checked);
                                                setValue('usePrefix', checked, { shouldValidate: hasSubmitted });
                                                if (checked) {
                                                    setUseSuffix(false);
                                                    setValue('useSuffix', false, { shouldValidate: hasSubmitted });
                                                    setValue('suffixValue', '', { shouldValidate: hasSubmitted });
                                                }
                                                if (!checked) {
                                                    setValue('prefixValue', '', { shouldValidate: hasSubmitted });
                                                }
                                            }}
                                            className='h-4 w-4 rounded border-gray-300 accent-primary'
                                        /> */}
                                        <Input
                                            type='checkbox'
                                            checked={usePrefix}
                                            onChange={(e) => {
                                                const checked = e.target.checked;

                                                setValue('usePrefix', checked, { shouldValidate: hasSubmitted });

                                                if (!checked) {
                                                    setValue('prefixValue', '', { shouldValidate: hasSubmitted });
                                                }
                                            }}
                                            className='h-4 w-4 rounded border-gray-300 accent-primary'
                                        />

                                        <span>Prefix</span>
                                    </Label>
                                    <Label className='flex items-center space-x-2'>
                                        {/* <input
                                            type='checkbox'
                                            checked={useSuffix}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setUseSuffix(checked);
                                                setValue('useSuffix', checked, { shouldValidate: hasSubmitted });
                                                if (checked) {
                                                    setUsePrefix(false);
                                                    setValue('usePrefix', false, { shouldValidate: hasSubmitted });
                                                    setValue('prefixValue', '', { shouldValidate: hasSubmitted });
                                                }
                                                if (!checked) {
                                                    setValue('suffixValue', '', { shouldValidate: hasSubmitted });
                                                }
                                            }}
                                            className='h-4 w-4 rounded border-gray-300 accent-primary'
                                        /> */}

                                        <Input
                                            type='checkbox'
                                            checked={useSuffix}
                                            onChange={(e) => {
                                                const checked = e.target.checked;

                                                setValue('useSuffix', checked, { shouldValidate: hasSubmitted });

                                                if (!checked) {
                                                    setValue('suffixValue', '', { shouldValidate: hasSubmitted });
                                                }
                                            }}
                                            className='h-4 w-4 rounded border-gray-300 accent-primary'
                                        />
                                        <span>Suffix</span>
                                    </Label>
                                </div>
                            </div>

                            {usePrefix && (
                                <div>
                                    <Label htmlFor='prefixValue'>
                                        Prefix <span className='text-red-500'>*</span>
                                    </Label>
                                    <InputText
                                        id='prefixValue'
                                        placeholder='Enter prefix value'
                                        {...register('prefixValue')}
                                        error={hasSubmitted ? errors.prefixValue?.message : undefined}
                                        className='transition-colors focus:ring-2 focus:ring-primary/20'
                                    />
                                    {hasSubmitted && errors.prefixValue && <FormError>{errors.prefixValue.message}</FormError>}
                                </div>
                            )}

                            {useSuffix && (
                                <div>
                                    <Label htmlFor='suffixValue'>
                                        Suffix <span className='text-red-500'>*</span>
                                    </Label>
                                    <InputText
                                        id='suffixValue'
                                        placeholder='Enter suffix value'
                                        {...register('suffixValue')}
                                        error={hasSubmitted ? errors.suffixValue?.message : undefined}
                                        className='transition-colors focus:ring-2 focus:ring-primary/20'
                                    />
                                    {hasSubmitted && errors.suffixValue && <FormError>{errors.suffixValue.message}</FormError>}
                                </div>
                            )}

                            {/* <div className='lg:col-span-2'>
                                <Label>
                                    Select Groups <span className='text-red-500'>*</span>
                                </Label>
                                <div className='mt-2 rounded-md border border-gray-300 bg-white p-3'>
                                    <InputText
                                        placeholder='Search Groups...'
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className='mb-3 transition-colors focus:ring-2 focus:ring-primary/20'
                                    />
                                    <div
                                        onClick={handleSelectAll}
                                        className={cn(
                                            'mb-2 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 font-medium text-sm transition-all',
                                            groupsValue?.length === groupOptions.length && groupOptions.length > 0
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-300 hover:border-primary/40'
                                        )}>
                                        {groupsValue?.length === groupOptions.length && groupOptions.length > 0 ? (
                                            <CheckSquare className='h-4 w-4 text-primary' />
                                        ) : (
                                            <Square className='h-4 w-4 text-gray-400' />
                                        )}
                                        <span>Select All</span>
                                    </div>

                                    <div className='mt-2 max-h-40 overflow-y-auto rounded-md border border-gray-300 p-1'>
                                        {loadingGroupData && (
                                            <div className='py-4 text-center text-gray-500 text-sm'>Loading groups...</div>
                                        )}
                                        {!loadingGroupData && filteredGroupOptions.length === 0 && (
                                            <div className='py-4 text-center text-gray-500 text-sm'>
                                                {academicYear ? 'No groups found' : 'Please select an academic year first'}
                                            </div>
                                        )}
                                        {filteredGroupOptions.map((option) => {
                                            const value = option.fmG_Id.toString();
                                            const selected = groupsValue?.includes(value) || false;
                                            return (
                                                <div
                                                    key={option.fmG_Id}
                                                    onClick={() => handleGroupChange(value)}
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
                                                    <span>{option.fmG_GroupName}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className='mt-1 text-gray-500 text-xs'>
                                        {groupsValue?.length || 0} of {groupOptions.length} groups selected
                                    </div>
                                </div>
                                {hasSubmitted && errors.groups && <FormError>{errors.groups.message}</FormError>}
                            </div> */}

                            {/* Group Selection */}
                            <div className='lg:col-span-2'>
                                <Label>
                                    Select Groups <span className='text-red-500'>*</span>
                                </Label>
                                <div className='mt-2 rounded-md border border-gray-300 bg-white p-3'>
                                    <InputText
                                        placeholder='Search Groups...'
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className='mb-3 transition-colors focus:ring-2 focus:ring-primary/20'
                                    />

                                    {/* Select All Checkbox */}
                                    <div
                                        onClick={handleSelectAll}
                                        className={cn(
                                            'mb-2 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 font-medium text-sm transition-all',
                                            selectedGroups.length === groupOptions.length && groupOptions.length > 0
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-300 hover:border-primary/40'
                                        )}>
                                        {selectedGroups.length === groupOptions.length && groupOptions.length > 0 ? (
                                            <CheckSquare className='h-4 w-4 text-primary' />
                                        ) : (
                                            <Square className='h-4 w-4 text-gray-400' />
                                        )}
                                        <span>Select All</span>
                                    </div>

                                    {/* Groups List */}
                                    <div className='mt-2 max-h-40 overflow-y-auto rounded-md border border-gray-300 p-1'>
                                        {loadingGroupData && (
                                            <div className='py-4 text-center text-gray-500 text-sm'>Loading groups...</div>
                                        )}
                                        {!loadingGroupData && filteredGroupOptions.length === 0 && (
                                            <div className='py-4 text-center text-gray-500 text-sm'>
                                                {academicYear ? 'No groups found' : 'Please select an academic year first'}
                                            </div>
                                        )}
                                        {filteredGroupOptions.map((option) => {
                                            const value = option.fmG_Id.toString();
                                            const selected = selectedGroups.includes(value); // Use selectedGroups state
                                            return (
                                                <div
                                                    key={option.fmG_Id}
                                                    onClick={() => handleGroupChange(value)}
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
                                                    <span>{option.fmG_GroupName}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Selection Count */}
                                    <div className='mt-1 text-gray-500 text-xs'>
                                        {selectedGroups.length || 0} of {groupOptions.length} groups selected
                                    </div>
                                </div>
                                {hasSubmitted && errors.groups && <FormError>{errors.groups.message}</FormError>}
                            </div>

                            {/* Auto Group Name */}
                            <div>
                                <Label htmlFor='autoGroupName'>
                                    Auto Group Name <span className='text-red-500'>*</span>
                                </Label>
                                <InputText
                                    id='autoGroupName'
                                    placeholder='Enter auto group name'
                                    {...register('autoGroupName')}
                                    error={hasSubmitted ? errors.autoGroupName?.message : undefined}
                                    className='transition-colors focus:ring-2 focus:ring-primary/20'
                                />
                                {hasSubmitted && errors.autoGroupName && <FormError>{errors.autoGroupName.message}</FormError>}
                            </div>

                            {/* Address */}
                            <div className='lg:col-span-2'>
                                <Label htmlFor='address'>
                                    Address<span className='text-red-500'>*</span>
                                </Label>
                                <InputTextarea
                                    id='address'
                                    placeholder='Enter address '
                                    {...register('address')}
                                    rows={4}
                                    className='h-24 transition-colors focus:ring-2 focus:ring-primary/20'
                                    error={hasSubmitted ? errors.address?.message : undefined}
                                />
                            </div>

                            {/* Receipt Template */}
                            <div className='pt-10 lg:col-span-2'>
                                <Label htmlFor='receiptTemplateFormat'>
                                    Receipt Template Format<span className='text-red-500'>*</span>
                                </Label>
                                <InputTextarea
                                    id='receiptTemplateFormat'
                                    placeholder='Kindly add the HTML format only...'
                                    {...register('receiptTemplateFormat')}
                                    rows={6}
                                    className='h-32 transition-colors focus:ring-2 focus:ring-primary/20'
                                    error={hasSubmitted ? errors.receiptTemplateFormat?.message : undefined}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className='mt-3 flex justify-start gap-3 pt-5 lg:col-span-2'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={handleReset}
                                    disabled={isSubmitting}
                                    className='order-2 flex w-fit items-center gap-2 transition-all duration-200 hover:scale-105 sm:order-1'>
                                    <RotateCcw className='h-4 w-4' />
                                    Reset
                                </Button>
                                <Button
                                    type='submit'
                                    disabled={isSubmitting}
                                    className='order-1 flex w-fit items-center gap-2 transition-all duration-200 hover:scale-105 sm:order-2'>
                                    <Save className='h-4 w-4' />
                                    {isSubmitting ? 'Updating...' : ' update Groupwise Auto Receipt'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
