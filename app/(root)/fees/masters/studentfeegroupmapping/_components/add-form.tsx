'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { SecondaryFormProvider, useSecondaryFormContext } from '@/components/ui/form/secondary-form-provider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import {
    useMasterStudentFeeGrouMappingAcademic,
    useStudentClassDropDown,
    useStudentFeeBusAreaDropDown,
    useStudentFeeBusRoutingDropDown,
    useStudentFeeCasteRoutingDropDown,
    useStudentFeeGroupAdmiClassCategoryDropDown,
    useStudentFeeGroupFeeClassCategoryDropDown,
    useStudentFeeGroupMapping,
    useStudentSectionDropDown
} from '@/hooks/fees/useMasters';
import { masterStudentFeeGroupMappingSchema } from '@/schemas/fees/masters';
import {
    getStudentClassMapping,
    getStudentFeeGroupList,
    getStudentFeeHeadList,
    getStudentFeeInstallmentList,
    getStudentFeeSave
} from '@/server/fees/masters/student_fee_group_mapping';
import type { ApiSearchparams } from '@/types';
import type {
    IMasterFeeGroupList,
    IMasterFeeHeadList,
    IMasterFeeInstallmentList,
    IMasterStudentClassMappingList
} from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCcw, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { MasterViewDetail } from './masterViewDetails';
import { masterFeeStudentClassMapping } from './student-list-columns';

type FormFields = z.infer<typeof masterStudentFeeGroupMappingSchema.addOrUpdate>;
interface DropdownOption {
    value: string;
    label: string;
}
interface AddStudentFeeGroupMappingFilter {
    onSuccess?: () => void;
}

export default function AddMasterStudentFeeGroupMapping({ onSuccess }: AddStudentFeeGroupMappingFilter) {
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    const formState = {
        isEditFormOpen,
        selectedRow,

        openEditForm: (row: any) => {
            setSelectedRow(row);
            setIsEditFormOpen(true);
        },
        closeEditForm: () => {
            setSelectedRow(null);
            setIsEditFormOpen(false);
        },

        addFormRef: React.createRef<HTMLDivElement>(),
        editFormRef: React.createRef<HTMLDivElement>()
    };

    return (
        <SecondaryFormProvider<IMasterStudentClassMappingList> {...formState}>
            <StudentFeeGroupMappingFilter onSuccess={onSuccess} />
        </SecondaryFormProvider>
    );
}
function StudentFeeGroupMappingFilter({ onSuccess }: AddStudentFeeGroupMappingFilter) {
    const { refetchAll } = useStudentFeeGroupMapping();
    const [filterType, setFilterType] = useState<string>('alldata');
    const [classWise, setClassWise] = useState(false);
    const [areaWise, setAreaWise] = useState(false);
    const [academicYear, setAcademicYear] = useState(0);
    const [feeClassCategory, setFeeClassCategory] = useState<string>('');
    const [admClassCategory, setAdmClassCategory] = useState<string>('');
    const [feeBusRouting, setFeeBusRouting] = useState<string>('');
    const [feeCasteCategory, setFeeCasteCategory] = useState<string>('');
    const [studentClass, setStudentClass] = useState<string>('');
    const [section, setSection] = useState<string>('');
    const [area, setArea] = useState<string>('');
    const [collapsedGroups, setCollapsedGroups] = useState<Record<number, boolean>>({});
    const [collapsedHeads, setCollapsedHeads] = useState<Record<string, boolean>>({});
    const [apisearchParams_, setApisearchParams_] = useState<ApiSearchparams>({});
    const [masterStudentClassMapping, setMasterStudentClassMapping] = useState<any[]>([]);
    const [masterStudentClassMappingLoading, setMasterStudentClassMappingLoading] = useState(false);
    const [masterStudentClassMappingError, setMasterStudentClassMappingError] = useState<any>(null);
    const [masterFeeStudentGroupList, setMasterFeeStudentGroupList] = useState<any[]>([]);
    const [masterFeeStudentGroupListLoading, setMasterFeeStudentGroupListLoading] = useState(false);
    const [masterFeeStudentGroupListError, setMasterFeeStudentGroupListError] = useState<any>(null);

    // tableProps stored in state
    const [tableProps, setTableProps] = useState<any>(null);

    const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
    const [selectedHeads, setSelectedHeads] = useState<string[]>([]); // "groupId-headId"
    const [selectedInstallments, setSelectedInstallments] = useState<string[]>([]);
    const [heads, setHeads] = useState<Record<number, IMasterFeeHeadList[]>>({});
    const [installment, setInstallment] = useState<Record<number, Record<number, IMasterFeeInstallmentList[]>>>({});
    const [selectedStudents, setSelectedStudents] = useState<IMasterStudentClassMappingList[]>([]);
    const { data: academicYearData, isLoading: academicYearLoading, error: academicYearError } = useMasterStudentFeeGrouMappingAcademic();
    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        getValues,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterStudentFeeGroupMappingSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            // asmaY_Id: academicYear,
            asmaY_Id: academicYearData?.data?.[0]?.asmaY_Id || 0,
            mI_Id: '',
            institutionName: ''
        }
    });

    //-------------Academic Year---------------

    const [academicYearOptions, setAcademicYearOptions] = useState<DropdownOption[]>([]);
    // useEffect(() => {
    //     if (academicYearError) {
    //         toast.error(academicYearError.message || 'Error fetching academic years');
    //         setAcademicYearOptions([]);
    //         return;
    //     }
    //     if (academicYearData?.data && Array.isArray(academicYearData.data)) {
    //         const options = academicYearData.data.map((item: any) => ({
    //             value: item.asmaY_Id.toString(),
    //             label: item.asmaY_Year
    //         }));
    //         setAcademicYearOptions(options);
    //     } else {
    //         setAcademicYearOptions([]);
    //     }
    // }, [academicYearData, academicYearError]);

    useEffect(() => {
        if (academicYearData?.data && Array.isArray(academicYearData.data)) {
            const firstId = academicYearData.data[0]?.asmaY_Id.toString();

            reset((prev) => ({
                ...prev,
                asmaY_Id: Number(firstId)
            }));
        }
    }, [academicYearData, setValue]);

    const asmaY_Id = watch('asmaY_Id');
    const classId = watch('class');
    const sectionId = watch('section');
    const areaId = watch('area');
    const admCategoryId =
        filterType === 'FCC'
            ? watch('feeClassCategory')
            : filterType === 'AC'
              ? watch('classCategory')
              : filterType === 'BR'
                ? watch('busRouting')
                : filterType === 'CCAT'
                  ? watch('casteCategory')
                  : 0;

    const toSafeNumber = (val: string | number | null | undefined) => {
        const num = Number(val);
        return Number.isNaN(num) ? 0 : num;
    };

    //------------Student Group Details----------------
    const fetchStudentClassMapping = async () => {
        if (!asmaY_Id) return;

        try {
            setMasterStudentClassMappingLoading(true);
            setMasterStudentClassMappingError(null);

            const res = await getStudentClassMapping(
                asmaY_Id,
                toSafeNumber(classId),
                toSafeNumber(sectionId),
                toSafeNumber(admCategoryId),
                filterType,
                apisearchParams_
            );

            const saferes = Array.isArray(res) ? res : [];
            setMasterStudentClassMapping(saferes);
            setTableProps(useDataTableProps(res ?? []));
        } catch (error) {
            console.error('Error fetching student class mapping', error);
            setMasterStudentClassMappingError(error);
        } finally {
            setMasterStudentClassMappingLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentClassMapping();
    }, [asmaY_Id, classId, sectionId, admCategoryId, areaId, filterType, apisearchParams_]);

    // useEffect(() => {
    //     fetchStudentClassMapping();
    // }, [academicYear, classId, sectionId, admCategoryId, areaId, filterType, apisearchParams_]);

    //--------------------Student Group List----------------------
    const loadStudentFeeGroupList = async () => {
        if (!asmaY_Id) return;
        try {
            setMasterFeeStudentGroupListLoading(true);
            setMasterFeeStudentGroupListError(null);

            const res = await getStudentFeeGroupList(asmaY_Id);
            setMasterFeeStudentGroupList(res.data ?? []);
        } catch (error) {
            console.error('Error fetching student class mapping', error);
            setMasterFeeStudentGroupListError(error);
        } finally {
            setMasterFeeStudentGroupListLoading(false);
        }
    };

    useEffect(() => {
        loadStudentFeeGroupList();
    }, [academicYear, asmaY_Id]);

    const {
        data: masterfeeClassCategory,
        isLoading: masterfeeClassCategoryLoading,
        error: masterfeeClassCategoryError
    } = useStudentFeeGroupFeeClassCategoryDropDown(filterType === 'FCC');

    const {
        data: masterAdmissionClassCategory,
        isLoading: masterAdmissionClassLoading,
        error: masterAdmissionClassError
    } = useStudentFeeGroupAdmiClassCategoryDropDown(filterType === 'AC');

    const {
        data: masterFeeBusRouting,
        isLoading: masterFeeBusRoutingLoading,
        error: masterFeeBusRoutingError
    } = useStudentFeeBusRoutingDropDown(filterType === 'BR');

    const {
        data: masterFeeCasteCategory,
        isLoading: masterFeeCasteCategoryLoading,
        error: masterFeeCasteCategoryError
    } = useStudentFeeCasteRoutingDropDown(filterType === 'CCAT');

    const {
        data: masterFeeBusAreaData,
        isLoading: masterFeeBusAreaDataLoading,
        error: masterFeeBusAreaDataError
    } = useStudentFeeBusAreaDropDown(areaWise);

    const {
        data: masterStudentFeeclassData,
        isLoading: masterStudentFeeclassDataLoading,
        error: masterStudentFeeclassDataError
    } = useStudentClassDropDown(classWise);

    const {
        data: masterStudentFeeSectionData,
        isLoading: masterStudentFeeSectionDataLoading,
        error: masterStudentFeeSectionDataError
    } = useStudentSectionDropDown(classWise);

    const handleApiParmasChange = (apiparmas: ApiSearchparams) => {
        setApisearchParams_((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(apiparmas)) return prev;
            return apiparmas;
        });
    };

    useEffect(() => {
        setClassWise(false);
        setAreaWise(false);
        reset();
    }, [filterType]);

    const handleFilterChange = (value: string) => {
        setFilterType(value);
    };

    const handleCheckboxChange = (checked: boolean, type: 'class' | 'area') => {
        if (type === 'class') setClassWise(checked);
        else setAreaWise(checked);
    };

    const toggleGroup = async (id: number) => {
        if (!heads[id]) {
            const { data: response } = await getStudentFeeHeadList(
                {
                    groupIds: [id]
                },
                asmaY_Id
            );
            setHeads((prev) => ({ ...prev, [id]: response ?? [] }));
        }
        setCollapsedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleHead = async (groupId: number, headId: number) => {
        if (!installment[groupId]) {
            setInstallment((prev) => ({ ...prev, [groupId]: {} }));
        }
        if (!installment[groupId]?.[headId]) {
            const { data: response } = await getStudentFeeInstallmentList(
                {
                    groupIds: [groupId],
                    headIds: [headId]
                },
                asmaY_Id
            );
            setInstallment((prev) => ({
                ...prev,
                [groupId]: {
                    ...(prev[groupId] || {}),
                    [headId]: response ?? []
                }
            }));
        }
        const key = `${groupId}-${headId}`;
        setCollapsedHeads((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const makeHeadKey = (groupId: number, headId: number) => `${groupId}-${headId}`;
    const makeInstKey = (groupId: number, headId: number, instId: number) => `${groupId}-${headId}-${instId}`;

    const handleGroupCheck = async (grp: IMasterFeeGroupList, checked: boolean) => {
        const groupId = grp.fmG_Id;
        if (!groupId) return;

        let groupHeads = heads[groupId];
        if (!groupHeads) {
            const { data } = await getStudentFeeHeadList({ groupIds: [groupId] }, asmaY_Id);
            groupHeads = data || [];
            setHeads((prev) => ({ ...prev, [groupId]: groupHeads }));
        }

        const updatedInstallments: Record<number, any[]> = {};
        const allInstKeys: string[] = [];
        const allHeadKeys: string[] = [];

        for (const head of groupHeads) {
            const headId = head.fmH_Id;
            allHeadKeys.push(makeHeadKey(groupId, headId));

            let instList = installment[groupId]?.[headId];
            if (!instList) {
                const { data } = await getStudentFeeInstallmentList(
                    {
                        groupIds: [groupId],
                        headIds: [headId]
                    },
                    asmaY_Id
                );
                instList = data || [];
            }
            updatedInstallments[headId] = instList;

            instList.forEach((inst) => {
                allInstKeys.push(makeInstKey(groupId, headId, inst.ftI_Id));
            });
        }

        setInstallment((prev) => ({
            ...prev,
            [groupId]: { ...(prev[groupId] || {}), ...updatedInstallments }
        }));

        if (checked) {
            setSelectedGroups((p) => [...new Set([...p, groupId])]);
            setSelectedHeads((p) => [...new Set([...p, ...allHeadKeys])]);
            setSelectedInstallments((p) => [...new Set([...p, ...allInstKeys])]);
        } else {
            setSelectedGroups((p) => p.filter((id) => id !== groupId));
            setSelectedHeads((p) => p.filter((k) => !allHeadKeys.includes(k)));
            setSelectedInstallments((p) => p.filter((k) => !allInstKeys.includes(k)));
        }
    };

    const handleHeadCheck = async (groupId: number, headId: number, checked: boolean) => {
        const headKey = makeHeadKey(groupId, headId);

        let instList = installment[groupId]?.[headId];
        if (!instList) {
            const { data } = await getStudentFeeInstallmentList(
                {
                    groupIds: [groupId],
                    headIds: [headId]
                },
                asmaY_Id
            );
            instList = data || [];
            setInstallment((prev) => ({
                ...prev,
                [groupId]: { ...(prev[groupId] || {}), [headId]: instList }
            }));
        }

        const instKeys = instList.map((i) => makeInstKey(groupId, headId, i.ftI_Id));

        setSelectedInstallments((prev) => {
            const newSelected = checked ? [...new Set([...prev, ...instKeys])] : prev.filter((k) => !instKeys.includes(k));

            // Update selected heads
            setSelectedHeads((p) => (checked ? [...new Set([...p, headKey])] : p.filter((k) => k !== headKey)));

            // Check if group should be selected
            const otherHeadsInGroup = Object.keys(installment[groupId] || {})
                .filter((hid) => Number(hid) !== headId) // Other heads in this group
                .flatMap((hid: any) => installment[groupId][hid] || []);

            // Check if any installment from other heads in this group is selected
            const otherInstallmentsSelected = otherHeadsInGroup.some((inst) =>
                prev.includes(makeInstKey(groupId, inst.fmH_Id, inst.ftI_Id))
            );

            // If checking the head, always select the group
            // If unchecking, only keep group selected if other heads/installments are selected
            const shouldGroupBeSelected = checked || otherInstallmentsSelected;

            setSelectedGroups((p) => {
                if (shouldGroupBeSelected && !p.includes(groupId)) {
                    return [...p, groupId];
                } else if (!shouldGroupBeSelected && p.includes(groupId)) {
                    return p.filter((g) => g !== groupId);
                }
                return p;
            });

            return newSelected;
        });
    };

    const handleInstallmentCheck = (inst: IMasterFeeInstallmentList, checked: boolean) => {
        const groupId = inst.fmG_Id;
        const headId = inst.fmH_Id;
        const instId = inst.ftI_Id;
        const instKey = makeInstKey(groupId, headId, instId);
        const headKey = makeHeadKey(groupId, headId);

        setSelectedInstallments((prev) => {
            const updated = checked ? [...new Set([...prev, instKey])] : prev.filter((k) => k !== instKey);

            // Update Head
            const headInsts = installment[groupId]?.[headId] || [];
            const hasAnyHeadSelected = headInsts.some((i) => updated.includes(makeInstKey(groupId, headId, i.ftI_Id)));

            setSelectedHeads((p) => (hasAnyHeadSelected ? [...new Set([...p, headKey])] : p.filter((k) => k !== headKey)));

            // Update Group
            const hasAnyGroupSelected = Object.values(installment[groupId] || {})
                .flat()
                .some((i) => updated.some((k) => k.startsWith(`${groupId}-${i.fmH_Id}-`)));

            setSelectedGroups((p) => (hasAnyGroupSelected ? [...new Set([...p, groupId])] : p.filter((g) => g !== groupId)));

            return updated;
        });
    };

    const handleSelectStudent = (selectedRows: IMasterStudentClassMappingList[]) => {
        setSelectedStudents(selectedRows);
    };
    //-------------Submit-------------------------------
    const onSubmit = async () => {
        if (selectedStudents.length < 1) {
            toast.error('Please select at least one student!!');
            return;
        }

        if (selectedInstallments.length === 0) {
            toast.error('Please select at least one installment!!');
            return;
        }

        const buildPayload = () => {
            const feeGroupsMap = new Map<number, Map<number, number[]>>();

            selectedInstallments.forEach((instKey) => {
                const [groupIdStr, headIdStr, instIdStr] = instKey.split('-');
                const groupId = Number(groupIdStr);
                const headId = Number(headIdStr);
                const instId = Number(instIdStr);

                if (!feeGroupsMap.has(groupId)) {
                    feeGroupsMap.set(groupId, new Map());
                }
                const headsMap = feeGroupsMap.get(groupId)!;
                if (!headsMap.has(headId)) {
                    headsMap.set(headId, []);
                }
                headsMap.get(headId)!.push(instId);
            });

            const commonFeeGroups = Array.from(feeGroupsMap.entries()).map(([fmG_Id, headsMap]) => ({
                fmG_Id,
                feeHeads: Array.from(headsMap.entries()).map(([fmH_Id, ftI_Ids]) => ({
                    fmH_Id,
                    ftI_Ids: [...new Set(ftI_Ids)]
                }))
            }));

            const studentMappings = selectedStudents.map((student: any) => ({
                amsT_Id: student.studentId || student.amsT_Id,
                feeGroups: commonFeeGroups
            }));

            return {
                // mI_Id: Number(getValues('mI_Id')),
                asmaY_Id: asmaY_Id,
                // userId: 1001,
                studentMappings
            };
        };

        console.log('Payload to save:', JSON.stringify(buildPayload()));
        const payload = buildPayload();
        try {
            const res = await getStudentFeeSave(payload);

            if (res?.success) {
                toast.success(res.message || 'Saved successfully');
                await refetchAll();
                handleReset();
                onSuccess?.();
            } else {
                toast.error(res?.message || 'Save failed');
            }
        } catch (err: any) {
            console.error('API Error:', err);
            toast.error(err?.message || 'Something went wrong');
        }
    };

    const handleReset = () => {
        reset();
        setFilterType('alldata');
        setClassWise(false);
        setAreaWise(false);
        setFeeClassCategory('');
        setAdmClassCategory('');
        setFeeBusRouting('');
        setFeeCasteCategory('');
        setStudentClass('');
        setSection('');
        setArea('');
        handleSelectStudent([]);
        setSelectedGroups([]);
        setSelectedHeads([]);
        setSelectedInstallments([]);
    };
    const { isEditFormOpen, closeEditForm } = useSecondaryFormContext<IMasterStudentClassMappingList>();

    return (
        <div className='mx-auto max-w-5xl space-y-6 p-4'>
            <Card className='p-4'>
                <RadioGroup value={filterType} onValueChange={handleFilterChange}>
                    <div className='grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5'>
                        {[
                            { value: 'alldata', label: 'All' },
                            { value: 'FCC', label: 'Fee Class Category' },
                            { value: 'AC', label: 'Admission Category' },
                            { value: 'BR', label: 'Bus Route' },
                            { value: 'Regular', label: 'Regular Student' },
                            { value: 'NewStude', label: 'New Student' },
                            { value: 'LeftStudent', label: 'Left Student' },
                            { value: 'CCAT', label: 'Caste Category' }
                        ].map((item) => {
                            return (
                                <div key={item.value} className='flex items-center space-x-2'>
                                    <RadioGroupItem value={item.value} id={item.value} />
                                    <Label htmlFor={item.value} className='cursor-pointer text-sm'>
                                        {item.label}
                                    </Label>
                                </div>
                            );
                        })}
                    </div>
                </RadioGroup>
            </Card>

            <Card className='p-4'>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center space-x-2'>
                        <Checkbox
                            id='classwise'
                            checked={classWise}
                            onCheckedChange={(c) => handleCheckboxChange(c as boolean, 'class')}
                            disabled={['FCC', 'AC', 'Staff', 'Others', 'BR'].includes(filterType)}
                        />
                        <Label htmlFor='classwise' className='cursor-pointer text-sm'>
                            Class Wise
                        </Label>
                    </div>

                    <div className='flex items-center space-x-2'>
                        <Checkbox
                            id='areawise'
                            checked={areaWise}
                            onCheckedChange={(c) => handleCheckboxChange(c as boolean, 'area')}
                            disabled={filterType !== 'BR'}
                        />
                        <Label htmlFor='areawise' className='cursor-pointer text-sm'>
                            Area Wise
                        </Label>
                    </div>
                </div>
            </Card>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {/* <div className='group flex flex-col gap-1.5'>
                        <Label htmlFor='asmaY_Id'>
                            Academic Year <span className='ml-1 text-red-500'>*</span>
                        </Label>

                        <Controller
                            name='asmaY_Id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    disabled={academicYearLoading}
                                    onValueChange={(v) => {
                                        const selectedYear = Number(v);
                                        field.onChange(selectedYear);
                                        setAcademicYear(selectedYear);
                                    }}
                                    value={field.value?.toString() || ''}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select Academic Year' />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {academicYearLoading ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : academicYearError ? (
                                            <SelectItem value='error' disabled>
                                                Error
                                            </SelectItem>
                                        ) : (
                                            academicYearOptions.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        {errors.asmaY_Id && <FormError>{errors.asmaY_Id.message}</FormError>}
                    </div> */}
                    <div>
                        <Label htmlFor='asmaY_Id'>
                            Academic Year <span className='ml-1 text-red-500'>*</span>
                        </Label>
                        <Select
                            onValueChange={(value) => setValue('asmaY_Id', Number(value), { shouldValidate: true })}
                            value={asmaY_Id?.toString() || ''}
                            disabled={academicYearLoading}>
                            <SelectTrigger id='asmaY_Id' className={`transition-colors ${errors.asmaY_Id ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder='Select Academic Year' />
                            </SelectTrigger>
                            {/* <SelectContent>
                                    {academicYearOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent> */}
                            <SelectContent>
                                {academicYearLoading ? (
                                    <SelectItem value='loading' disabled>
                                        Loading...
                                    </SelectItem>
                                ) : academicYearError ? (
                                    <SelectItem value='error' disabled>
                                        Error loading
                                    </SelectItem>
                                ) : (
                                    academicYearData?.data?.map((item: any, index: number) => (
                                        <SelectItem key={`${item.asmaY_Id}-${index}`} value={item.asmaY_Id.toString()}>
                                            {item.asmaY_Year}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        {errors.asmaY_Id && <FormError>{errors.asmaY_Id.message}</FormError>}
                    </div>
                    {filterType === 'FCC' && (
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='feeClassCategory'>Fee Class Category</Label>

                            <Controller
                                name='feeClassCategory'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(v) => {
                                            field.onChange(v);
                                            setFeeClassCategory(v);
                                        }}
                                        value={field.value}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select fee class Category' />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {masterfeeClassCategoryLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading...
                                                </SelectItem>
                                            ) : masterfeeClassCategoryError ? (
                                                <SelectItem value='error' disabled>
                                                    Error
                                                </SelectItem>
                                            ) : (
                                                masterfeeClassCategory?.data?.map((item: any) => (
                                                    <SelectItem key={item.fmcC_Id} value={item.fmcC_Id.toString()}>
                                                        {item.fmcC_ClassCategoryName}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.feeClassCategory && <FormError>{errors.feeClassCategory.message}</FormError>}
                        </div>
                    )}
                    {filterType === 'AC' && (
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='classCategory'>Adm. Class Category</Label>

                            <Controller
                                name='classCategory'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(v) => {
                                            field.onChange(v);
                                            setAdmClassCategory(v);
                                        }}
                                        value={field.value}
                                        // disabled={!academicYear}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select classCategory' />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {masterAdmissionClassLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading...
                                                </SelectItem>
                                            ) : masterAdmissionClassError ? (
                                                <SelectItem value='error' disabled>
                                                    Error
                                                </SelectItem>
                                            ) : (
                                                masterAdmissionClassCategory?.data?.map((item: any) => (
                                                    <SelectItem key={item.amC_Id} value={item.amC_Id.toString()}>
                                                        {item.categoryName}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.classCategory && <FormError>{errors.classCategory.message}</FormError>}
                        </div>
                    )}
                    {filterType === 'BR' && (
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='busrouting'>Bus Route</Label>
                            <Controller
                                name='busRouting'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(v) => {
                                            field.onChange(v);
                                            setFeeBusRouting(v);
                                        }}
                                        value={field.value}
                                        // disabled={!academicYear}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Route' />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {masterFeeBusRoutingLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading...
                                                </SelectItem>
                                            ) : masterFeeBusRoutingError ? (
                                                <SelectItem value='error' disabled>
                                                    Error
                                                </SelectItem>
                                            ) : (
                                                masterFeeBusRouting?.data?.map((item: any) => (
                                                    <SelectItem key={item.trmR_Id} value={item.trmR_Id.toString()}>
                                                        {item.trmR_RouteName}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.busRouting && <FormError>{errors.busRouting.message}</FormError>}
                        </div>
                    )}
                    {filterType === 'CCAT' && (
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='casteCategory'>Caste Category</Label>
                            <Controller
                                name='casteCategory'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(v) => {
                                            field.onChange(v);
                                            setFeeCasteCategory(v);
                                        }}
                                        value={field.value}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Caste Category' />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {masterFeeCasteCategoryLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading...
                                                </SelectItem>
                                            ) : masterFeeCasteCategoryError ? (
                                                <SelectItem value='error' disabled>
                                                    Error
                                                </SelectItem>
                                            ) : (
                                                masterFeeCasteCategory?.data?.map((item: any) => (
                                                    <SelectItem key={item.imC_Id} value={item.imC_Id.toString()}>
                                                        {item.imC_CasteName}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.casteCategory && <FormError>{errors.casteCategory.message}</FormError>}
                        </div>
                    )}
                    {classWise === true && (
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='class'>Class</Label>

                            <Controller
                                name='class'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(v) => {
                                            const selectedClass = Number(v);
                                            field.onChange(selectedClass);
                                            setStudentClass(v);
                                        }}
                                        value={field.value?.toString() ?? ''}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Class' />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {masterStudentFeeclassDataLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading...
                                                </SelectItem>
                                            ) : masterStudentFeeclassDataError ? (
                                                <SelectItem value='error' disabled>
                                                    Error
                                                </SelectItem>
                                            ) : (
                                                masterStudentFeeclassData?.data?.map((item: any) => (
                                                    <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                                        {item.asmcL_ClassName}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.class && <FormError>{errors.class.message}</FormError>}
                        </div>
                    )}
                    {classWise === true && (
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='section'>Section</Label>

                            <Controller
                                name='section'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(v) => {
                                            const selectedsection = Number(v);
                                            field.onChange(selectedsection);
                                            setSection(v);
                                        }}
                                        value={field.value?.toString() ?? ''}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Section' />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {masterStudentFeeSectionDataLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading...
                                                </SelectItem>
                                            ) : masterStudentFeeSectionDataError ? (
                                                <SelectItem value='error' disabled>
                                                    Error
                                                </SelectItem>
                                            ) : (
                                                masterStudentFeeSectionData?.data?.map((item: any) => (
                                                    <SelectItem key={item.asmS_Id} value={item.asmS_Id.toString()}>
                                                        {item.asmC_SectionName}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.section && <FormError>{errors.section.message}</FormError>}
                        </div>
                    )}
                    {areaWise === true && (
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='area'>Area</Label>

                            <Controller
                                name='area'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(v) => {
                                            field.onChange(v);
                                            setArea(v);
                                        }}
                                        value={field.value}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Area' />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {masterFeeBusAreaDataError ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading...
                                                </SelectItem>
                                            ) : masterFeeBusAreaDataLoading ? (
                                                <SelectItem value='error' disabled>
                                                    Error
                                                </SelectItem>
                                            ) : (
                                                masterFeeBusAreaData?.data?.map((item: any) => (
                                                    <SelectItem key={item.trmA_Id} value={item.trmA_Id.toString()}>
                                                        {item.trmA_AreaName}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.classCategory && <FormError>{errors.classCategory.message}</FormError>}
                        </div>
                    )}
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-1'>
                    {/* <CollapsibleSection
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>                       
                    </CollapsibleSection> */}
                    <Card className='p-4'>
                        <GenericDataTable<IMasterStudentClassMappingList>
                            {...tableProps}
                            columns={masterFeeStudentClassMapping}
                            isLoading={masterStudentClassMappingLoading}
                            error={masterStudentClassMappingError}
                            onRowSelectionChange={handleSelectStudent}
                            columnPinning={{ right: ['actions'] }}
                            loadingMessage='Loading Student Class Mapping...'
                            noDataTitle='No Student Student Class Mapping Found'
                            noDataDescription='Get started by creating your first Student Class Mapping'
                            errorTitle='Error Student Class Mapping'
                            onSearchQueryChange={handleApiParmasChange}
                            showSearch={true}
                            searchQuery=''
                            showPagination={true}
                            currentApiParams={apisearchParams_}
                        />
                    </Card>
                    {isEditFormOpen && <MasterViewDetail onSuccess={closeEditForm} />}

                    <div className='p-4'>
                        <h3 className='mb-2 font-semibold text-lg'>Group List</h3>
                        <div
                            className='rounded-lg border p-3'
                            style={{
                                height: '300px',
                                overflowY: 'auto'
                            }}>
                            <ul className='pl-0'>
                                {masterFeeStudentGroupListLoading ? (
                                    <>
                                        {[...Array(6)].map((_, i) => (
                                            <li key={`skeleton-${i}`} className='mb-3'>
                                                <div className='flex items-center'>
                                                    <div className='mr-2 flex h-6 w-6 animate-pulse items-center justify-center rounded bg-gray-200 text-lg'>
                                                        +
                                                    </div>
                                                    <div className='mr-3 h-5 w-5 animate-pulse rounded border-2 border-gray-300 bg-gray-200' />
                                                    <div className='h-5 w-56 animate-pulse rounded bg-gray-200' />
                                                </div>
                                            </li>
                                        ))}
                                    </>
                                ) : masterFeeStudentGroupListError ? (
                                    <li className='py-8 text-center'>
                                        <p className='font-medium text-red-600'>Failed to load Student Groups</p>
                                    </li>
                                ) : masterFeeStudentGroupList.length === 0 ? (
                                    <li className='py-6 text-center text-sm'>
                                        <p className='font-medium text-red-600'>No results found.</p>
                                    </li>
                                ) : (
                                    masterFeeStudentGroupList?.map((grp) => {
                                        const groupId = grp.fmG_Id;

                                        return (
                                            <li key={groupId} className='mb-2'>
                                                <div className='mb-1 flex items-center'>
                                                    <div
                                                        className='mr-2 cursor-pointer select-none text-xl'
                                                        onClick={() => toggleGroup(groupId)}>
                                                        {collapsedGroups[groupId] ? '-' : '+'}
                                                    </div>
                                                    <Checkbox
                                                        checked={selectedGroups?.includes(groupId) || false}
                                                        onCheckedChange={(checked) => handleGroupCheck(grp, checked as boolean)}
                                                        className='mr-2'
                                                    />
                                                    <span>{grp.fmG_GroupName}</span>
                                                </div>

                                                {/* Fee Heads under this Group */}
                                                {collapsedGroups[groupId] && heads[groupId] && (
                                                    <ul className='pl-6'>
                                                        {heads[groupId].map((head) => {
                                                            const headId = head.fmH_Id;
                                                            const headKey = `${groupId}-${headId}`; // Unique across entire tree

                                                            return (
                                                                <li key={headKey} className='mb-1'>
                                                                    <div className='mb-1 flex items-center'>
                                                                        <div
                                                                            className='mr-2 cursor-pointer select-none text-xl'
                                                                            onClick={() => toggleHead(groupId, headId)}>
                                                                            {collapsedHeads[headKey] ? '-' : '+'}
                                                                        </div>
                                                                        <Checkbox
                                                                            checked={selectedHeads.includes(makeHeadKey(groupId, headId))}
                                                                            onCheckedChange={(c) =>
                                                                                handleHeadCheck(groupId, headId, c as boolean)
                                                                            }
                                                                            className='mr-2'
                                                                        />
                                                                        <span>{head.fmH_FeeName}</span>
                                                                    </div>

                                                                    {/* Installments under this Head */}
                                                                    {collapsedHeads[headKey] && installment[groupId]?.[headId] && (
                                                                        <ul className='pl-6'>
                                                                            {installment[groupId][headId].map((inst) => {
                                                                                const installmentId = inst.ftI_Id;
                                                                                const installmentKey = `${groupId}-${headId}-${installmentId}`;

                                                                                return (
                                                                                    <li key={installmentKey} className='mb-1'>
                                                                                        <div className='flex items-center'>
                                                                                            <Checkbox
                                                                                                checked={selectedInstallments.includes(
                                                                                                    makeInstKey(
                                                                                                        groupId,
                                                                                                        headId,
                                                                                                        inst.ftI_Id
                                                                                                    )
                                                                                                )}
                                                                                                onCheckedChange={(c) =>
                                                                                                    handleInstallmentCheck(
                                                                                                        inst,
                                                                                                        c as boolean
                                                                                                    )
                                                                                                }
                                                                                                className='mr-2'
                                                                                            />
                                                                                            <span>{inst.ftI_Name}</span>
                                                                                        </div>
                                                                                    </li>
                                                                                );
                                                                            })}
                                                                        </ul>
                                                                    )}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                )}
                                            </li>
                                        );
                                    })
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='flex justify-end gap-3 border-t pt-4'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='flex items-center gap-2'>
                        <RotateCcw className='h-4 w-4' />
                        Reset
                    </Button>

                    <Button type='submit' disabled={isSubmitting} className='flex items-center gap-2'>
                        <Save className='h-4 w-4' />
                        Save Student Fee Group Mapping
                    </Button>
                </div>
            </form>
        </div>
    );
}
