'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { MultiSelect } from '@/components/ui/multi-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import {
    useFilterSalaryUpdationEmployees,
    useSalaryUpdationList,
    useUpdateEmployeesEarningsAndDeductions
} from '@/hooks/hrms/useTransactions';
import {
    getDepartmentDropdownByGroupType,
    getDesignationDropdownByGroupTypeAndDesignation,
    getGroupTypeDropdown,
    getHeadDropdown
} from '@/server/hrms/hrmsConfig/transaction/salary-updation';
import type {
    DepartmentDropdown,
    DesignationDropdown,
    EmployeeDropdown,
    HeadDropdown,
    SalaryUpdationItem
} from '@/types/hrms/salary-updation';
import { RefreshCw, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { buildSalaryEntryColumns } from './_components/employee-entry-columns';
import FormSections from './_components/form-sections';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function SalaryUpdationPage(_props: { searchParams: SearchParams }) {
    const { listQuery } = useSalaryUpdationList({
        page: 0,
        page_size: 0,
        search_query: '',
        search_column: '',
        sort_column: '',
        sort_direction: '',
        is_export: true,
        MIID: HRMS_MI_ID,
        LoginUserId: 0, // TODO: Get from auth context
        UserRole: '' // TODO: Get from auth context
    });
    return (
        <FormProvider<SalaryUpdationItem>>
            <SalaryUpdationPageContent
                response={listQuery.data}
                isLoading={listQuery.isLoading}
                error={listQuery.error}
                refetch={listQuery.refetch}
            />
        </FormProvider>
    );
}

function SalaryUpdationPageContent({
    response,
    isLoading,
    error,
    refetch
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetch: () => void;
}) {
    const { openAddForm } = useFormContext<SalaryUpdationItem>();
    const [hasSearched, setHasSearched] = useState(false);
    const [filteredEmployees, setFilteredEmployees] = useState<EmployeeDropdown[]>([]);
    const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

    // Mutations
    const { mutate: filterEmployees, isPending: isFiltering } = useFilterSalaryUpdationEmployees();
    const { mutate: updateEarningsDeductions, isPending: isSaving } = useUpdateEmployeesEarningsAndDeductions();

    // Dropdown Data States
    const [groupTypes, setGroupTypes] = useState<any[]>([]);
    const [departments, setDepartments] = useState<DepartmentDropdown[]>([]);
    const [designations, setDesignations] = useState<DesignationDropdown[]>([]);
    const [headsData, setHeadsData] = useState<HeadDropdown[]>([]);

    // Grid Display Data (Employees with updated values)
    const [gridData, setGridData] = useState<EmployeeDropdown[]>([]);
    const [localSearch, setLocalSearch] = useState('');

    const processedGridData = useMemo(() => {
        if (!localSearch) return gridData;
        const lowerSearch = localSearch.toLowerCase();
        return gridData.filter(
            (emp) =>
                (emp.HRME_EmployeeFirstName + ' ' + (emp.HRME_EmployeeMiddleName || '') + ' ' + (emp.HRME_EmployeeLastName || ''))
                    .toLowerCase()
                    .includes(lowerSearch) || (emp.HRME_EmployeeCode || '').toLowerCase().includes(lowerSearch)
        );
    }, [gridData, localSearch]);

    // Initial Data Loading
    useEffect(() => {
        async function fetchGroupTypes() {
            try {
                const { groupTypedropdown } = await getGroupTypeDropdown();
                setGroupTypes(groupTypedropdown || []);
            } catch (err) {
                console.error('Failed to load group types', err);
                setGroupTypes([]);
            }
        }
        fetchGroupTypes();

        async function fetchHeads() {
            try {
                const { headdropdown } = await getHeadDropdown();
                setHeadsData(headdropdown || []);
            } catch (err) {
                console.error('Failed to load heads', err);
                setHeadsData([]);
            }
        }
        fetchHeads();

        if (response?.departmentdropdown || response?.departmentdropdownlist) {
            setDepartments(response?.departmentdropdown || response?.departmentdropdownlist || []);
        }
        if (response?.designationdropdown || response?.designationdropdownlist) {
            setDesignations(response?.designationdropdown || response?.designationdropdownlist || []);
        }
    }, [response]);

    // Head Lists
    const allHeads = useMemo(() => {
        if (headsData.length > 0) return headsData;
        return response?.headdropdown || [];
    }, [response?.headdropdown, headsData]);

    const earningHeadsList = useMemo(() => allHeads.filter((h: HeadDropdown) => h.HRMED_EarnDedFlag === 'Earning'), [allHeads]);
    const deductionHeadsList = useMemo(() => allHeads.filter((h: HeadDropdown) => h.HRMED_EarnDedFlag === 'Deduction'), [allHeads]);

    const [isClient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);

    // Form Setup
    const { control, handleSubmit, reset, watch, setValue, getValues } = useForm({
        defaultValues: {
            groupType: [] as string[],
            department: [] as string[],
            designation: [] as string[],
            earningDeduction: 'All Earning & Deduction',
            amountType: 'All',
            heads: [] as string[]
        }
    });

    const watchedGroupType = watch('groupType');
    const watchedDepartment = watch('department');
    watch('earningDeduction');
    watch('amountType');

    // Cascading Departments
    useEffect(() => {
        if (!isClient) return;
        async function fetchDepartments() {
            let activeGroupIds: string[] = [];

            if (watchedGroupType && Array.isArray(watchedGroupType) && watchedGroupType.length > 0) {
                if (watchedGroupType.includes('All')) {
                    // If All is selected, take all available group types
                    activeGroupIds = groupTypes.map((gt: any) => gt.HRMGT_Id?.toString() || '');
                } else {
                    activeGroupIds = watchedGroupType;
                }
            }

            if (activeGroupIds.length > 0) {
                const ids = activeGroupIds.join(',');
                try {
                    const { departmentdropdown } = await getDepartmentDropdownByGroupType(ids);
                    setDepartments(departmentdropdown || []);
                } catch (error) {
                    console.error('Error fetching departments', error);
                    setDepartments([]);
                }
            } else {
                setDepartments([]);
            }
        }
        fetchDepartments();
    }, [watchedGroupType, groupTypes, isClient]);

    // Cascading Designations
    useEffect(() => {
        if (!isClient) return;
        async function fetchDesignations() {
            let activeGroupIds: string[] = [];
            // Resolve Group Types
            if (watchedGroupType && Array.isArray(watchedGroupType) && watchedGroupType.length > 0) {
                if (watchedGroupType.includes('All')) {
                    activeGroupIds = groupTypes.map((gt: any) => gt.HRMGT_Id?.toString() || '');
                } else {
                    activeGroupIds = watchedGroupType;
                }
            }

            let activeDeptIds: string[] = [];
            // Resolve Departments
            if (watchedDepartment && Array.isArray(watchedDepartment) && watchedDepartment.length > 0) {
                if (watchedDepartment.includes('All')) {
                    activeDeptIds = departments.map((d: any) => d.HRMD_Id?.toString() || '');
                } else {
                    activeDeptIds = watchedDepartment;
                }
            }

            if (activeGroupIds.length > 0 && activeDeptIds.length > 0) {
                const gIds = activeGroupIds.join(',');
                const dIds = activeDeptIds.join(',');
                try {
                    const { designationdropdown } = await getDesignationDropdownByGroupTypeAndDesignation(gIds, dIds);
                    setDesignations(designationdropdown || []);
                } catch (error) {
                    console.error('Error fetching designations', error);
                    setDesignations([]);
                }
            } else {
                setDesignations([]);
            }
        }
        fetchDesignations();
    }, [watchedDepartment, watchedGroupType, groupTypes, departments, isClient]);

    // Search Handler
    const onSubmit = (formData: any) => {
        const groupTypeIds: number[] = formData.groupType.filter((x: string) => x !== 'All').map(Number);
        const departmentIds: number[] = formData.department.filter((x: string) => x !== 'All').map(Number);
        const designationIds: number[] = formData.designation.filter((x: string) => x !== 'All').map(Number);
        const headIds: number[] = formData.heads.filter((x: string) => x !== 'All').map(Number);

        filterEmployees(
            {
                MI_Id: HRMS_MI_ID,
                LogInUserId: 0,
                designationselected: designationIds,
                departmentselected: departmentIds,
                groupTypeselected: groupTypeIds,
                headselected: headIds.length > 0 ? headIds : undefined
            },
            {
                onSuccess: (data) => {
                    const emps = data.employeedropdown || [];
                    const initializedEmps = emps.map((e: any) => ({
                        ...e,
                        earningResult: e.earningResult || [],
                        deductionResult: e.deductionResult || []
                    }));

                    setGridData(initializedEmps);
                    setFilteredEmployees(initializedEmps);
                    setHasSearched(true);
                    setSelectedEmployees([]); // Reset selection on new search
                    toast.success('Search completed successfully');
                },
                onError: (err: any) => toast.error(err.message || 'Search failed')
            }
        );
    };

    // Grid Update Handler
    const handleUpdateAmount = (empId: number, headId: number, isEarning: boolean, newAmount: number | '') => {
        setGridData((prev) =>
            prev.map((emp) => {
                if (emp.HRME_Id !== empId) return emp;

                const amount = newAmount === '' ? 0 : newAmount;

                if (isEarning) {
                    const existing = emp.earningResult?.find((x) => x.HRMED_Id === headId);
                    let newEarnings = emp.earningResult || [];
                    if (existing) {
                        newEarnings = newEarnings.map((x) => (x.HRMED_Id === headId ? { ...x, HREED_Amount: amount } : x));
                    } else {
                        // Add new entry
                        newEarnings = [
                            ...newEarnings,
                            {
                                HREED_Id: 0,
                                MI_Id: HRMS_MI_ID,
                                HRME_Id: empId,
                                HRMED_Id: headId,
                                HREED_Amount: amount,
                                HREED_Percentage: '0',
                                HREED_ActiveFlag: true,
                                HREED_MaxApplicableFlg: false,
                                HREED_ApplicableMaxValue: 0
                            }
                        ];
                    }
                    return { ...emp, earningResult: newEarnings };
                } else {
                    const existing = emp.deductionResult?.find((x) => x.HRMED_Id === headId);
                    let newDeductions = emp.deductionResult || [];
                    if (existing) {
                        newDeductions = newDeductions.map((x) => (x.HRMED_Id === headId ? { ...x, HREED_Amount: amount } : x));
                    } else {
                        newDeductions = [
                            ...newDeductions,
                            {
                                HREED_Id: 0,
                                MI_Id: HRMS_MI_ID,
                                HRME_Id: empId,
                                HRMED_Id: headId,
                                HREED_Amount: amount,
                                HREED_Percentage: '0',
                                HREED_ActiveFlag: true,
                                HREED_MaxApplicableFlg: false,
                                HREED_ApplicableMaxValue: 0
                            }
                        ];
                    }
                    return { ...emp, deductionResult: newDeductions };
                }
            })
        );
    };

    // Save Handler
    const handleSave = () => {
        const rowsToSave = gridData.filter((emp) => selectedEmployees.includes(emp.HRME_Id));

        if (rowsToSave.length === 0) {
            toast.error('Please select employees to save');
            return;
        }

        const allEarnings: any[] = [];
        const allDeductions: any[] = [];

        rowsToSave.forEach((emp) => {
            if (emp.earningResult) allEarnings.push(...emp.earningResult);
            if (emp.deductionResult) allDeductions.push(...emp.deductionResult);
        });

        updateEarningsDeductions(
            {
                earningResult: allEarnings.length > 0 ? allEarnings : undefined,
                deductionResult: allDeductions.length > 0 ? allDeductions : undefined,
                LoginUserId: 0
            },
            {
                onSuccess: () => {
                    // Refresh data or just clear selection?
                    // Typically we might want to refresh, but for now let's just clear selection
                    setSelectedEmployees([]);
                },
                onError: (err: any) => toast.error(err.message || 'Save failed')
            }
        );
    };

    const handleCancel = () => {
        setHasSearched(false);
        reset({
            groupType: [],
            department: [],
            designation: [],
            heads: []
        });
        setGridData([]);
        setSelectedEmployees([]);
    };

    // Column Construction
    const selectedHeadIds = watch('heads')
        .filter((x) => x !== 'All')
        .map(Number);
    const visibleEarningHeads = earningHeadsList
        .filter((h: HeadDropdown) => selectedHeadIds.length === 0 || selectedHeadIds.includes(h.HRMED_Id))
        .map((h: HeadDropdown) => ({ headId: h.HRMED_Id, headName: h.HRMED_Name, isEarning: true }));

    const visibleDeductionHeads = deductionHeadsList
        .filter((h: HeadDropdown) => selectedHeadIds.length === 0 || selectedHeadIds.includes(h.HRMED_Id))
        .map((h: HeadDropdown) => ({ headId: h.HRMED_Id, headName: h.HRMED_Name, isEarning: false }));

    // Stabilize allGridIds: Only change reference if the actual IDs change (e.g. search/filter), not on data edit.
    // This prevents 'columns' from regenerating, which prevents the Table from unmounting inputs and losing focus.
    const allGridIdsString = processedGridData.map((e) => e.HRME_Id).join(',');
    const allGridIds = useMemo(() => processedGridData.map((e) => e.HRME_Id), [allGridIdsString]);

    const columns = useMemo(
        () =>
            buildSalaryEntryColumns(
                visibleEarningHeads,
                visibleDeductionHeads,
                handleUpdateAmount,
                selectedEmployees,
                setSelectedEmployees,
                allGridIds
            ),
        [visibleEarningHeads, visibleDeductionHeads, selectedEmployees, allGridIds]
    );

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <FormSections onloadData={response} onSuccess={refetch} />

                <CollapsibleSection defaultOpen={true} variant='outline' size='lg' className='shadow-lg'>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                            {/* Row 1: Primary Selection */}
                            <div className='space-y-3'>
                                <Label className='font-semibold'>
                                    Group Type <span className='text-destructive'>*</span>
                                </Label>
                                <Controller
                                    name='groupType'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            options={[
                                                { label: 'All', value: 'All' },
                                                ...groupTypes.map((gt: any) => ({
                                                    label: gt.HRMGT_EmployeeGroupType,
                                                    value: gt.HRMGT_Id?.toString() || ''
                                                }))
                                            ]}
                                            defaultValue={Array.isArray(field.value) ? field.value : []}
                                            onValueChange={field.onChange}
                                            placeholder='Select Group Types'
                                            maxHeight={240}
                                            className='w-full'
                                        />
                                    )}
                                />
                            </div>

                            <div className='space-y-3'>
                                <Label className='font-semibold'>
                                    Department <span className='text-destructive'>*</span>
                                </Label>
                                <Controller
                                    name='department'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            options={[
                                                { label: 'All', value: 'All' },
                                                ...departments.map((d: any) => ({
                                                    label: d.HRMD_DepartmentName,
                                                    value: d.HRMD_Id?.toString() || ''
                                                }))
                                            ]}
                                            defaultValue={Array.isArray(field.value) ? field.value : []}
                                            onValueChange={field.onChange}
                                            placeholder='Select Departments'
                                            maxHeight={240}
                                            className='w-full'
                                        />
                                    )}
                                />
                            </div>

                            <div className='space-y-3'>
                                <Label className='font-semibold'>
                                    Designation <span className='text-destructive'>*</span>
                                </Label>
                                <Controller
                                    name='designation'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            options={[
                                                { label: 'All', value: 'All' },
                                                ...designations.map((d: any) => ({
                                                    label: d.HRMDES_DesignationName,
                                                    value: d.HRMDES_Id?.toString() || ''
                                                }))
                                            ]}
                                            defaultValue={Array.isArray(field.value) ? field.value : []}
                                            onValueChange={field.onChange}
                                            placeholder='Select Designations'
                                            maxHeight={240}
                                            className='w-full'
                                        />
                                    )}
                                />
                            </div>

                            {/* Row 2: Secondary Filters & Heads */}
                            <div className='space-y-3'>
                                <Label className='font-semibold'>
                                    Earning & Deduction <span className='text-destructive'>*</span>
                                </Label>
                                <Controller
                                    name='earningDeduction'
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup
                                            value={field.value || 'All Earning & Deduction'}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                setValue('heads', []); // Reset heads when filter changes
                                            }}
                                            className='flex flex-row flex-wrap gap-4'>
                                            <div className='flex items-center gap-2'>
                                                <RadioGroupItem value='All Earning & Deduction' id='s-ed-all' />
                                                <Label htmlFor='s-ed-all' className='cursor-pointer font-normal'>
                                                    All Earning & Deduction
                                                </Label>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <RadioGroupItem value='Earning' id='s-ed-earning' />
                                                <Label htmlFor='s-ed-earning' className='cursor-pointer font-normal'>
                                                    Earning
                                                </Label>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <RadioGroupItem value='Deduction' id='s-ed-deduction' />
                                                <Label htmlFor='s-ed-deduction' className='cursor-pointer font-normal'>
                                                    Deduction
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>

                            <div className='space-y-3'>
                                <Label className='font-semibold'>
                                    Amount / Percentage <span className='text-destructive'>*</span>
                                </Label>
                                <Controller
                                    name='amountType'
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup
                                            value={field.value || 'All'}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                setValue('heads', []); // Reset heads when filter changes
                                            }}
                                            className='flex flex-row flex-wrap gap-4'>
                                            <div className='flex items-center gap-2'>
                                                <RadioGroupItem value='All' id='s-amt-all' />
                                                <Label htmlFor='s-amt-all' className='cursor-pointer font-normal'>
                                                    All
                                                </Label>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <RadioGroupItem value='Amount' id='s-amt-amount' />
                                                <Label htmlFor='s-amt-amount' className='cursor-pointer font-normal'>
                                                    Amount
                                                </Label>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <RadioGroupItem value='Percentage' id='s-amt-percentage' />
                                                <Label htmlFor='s-amt-percentage' className='cursor-pointer font-normal'>
                                                    Percentage
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>

                            <div className='space-y-3'>
                                <Label className='font-semibold'>Heads</Label>
                                <Controller
                                    name='heads'
                                    control={control}
                                    render={({ field }) => {
                                        const currentValue = Array.isArray(field.value) ? field.value : [];

                                        // Filter heads based on selections
                                        const filteredHeads = allHeads.filter((h: HeadDropdown) => {
                                            const ed = getValues('earningDeduction');
                                            const amt = getValues('amountType');

                                            let passEd = true;
                                            if (ed === 'Earning') passEd = h.HRMED_EarnDedFlag === 'Earning';
                                            if (ed === 'Deduction') passEd = h.HRMED_EarnDedFlag === 'Deduction';

                                            let passAmt = true;
                                            if (amt === 'Amount') passAmt = h.HRMED_AmountPercentFlag === 'Amount';
                                            if (amt === 'Percentage') passAmt = h.HRMED_AmountPercentFlag === 'Percentage';

                                            return passEd && passAmt;
                                        });

                                        return (
                                            <MultiSelect
                                                options={[
                                                    { label: 'All', value: 'All' },
                                                    ...filteredHeads.map((h: any) => ({
                                                        label: h.HRMED_Name || '',
                                                        value: h.HRMED_Id?.toString() || ''
                                                    }))
                                                ]}
                                                defaultValue={currentValue}
                                                onValueChange={field.onChange}
                                                placeholder='Select Heads to View'
                                                maxHeight={240}
                                                className='w-full'
                                            />
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        <div className='flex justify-end lg:col-span-4'>
                            <Button type='submit' className='w-32'>
                                Search
                            </Button>
                        </div>

                        {hasSearched && (
                            <CollapsibleSection defaultOpen={true} variant='default' size='lg' className='shadow-lg'>
                                <div className='space-y-4 rounded-lg border p-1'>
                                    {/* Client-side Search Input */}
                                    <div className='flex justify-end p-2'>
                                        <InputText
                                            name='localSearch'
                                            value={localSearch}
                                            onChange={(e) => setLocalSearch(e.target.value)}
                                            placeholder='Search by Employee Name or Code...'
                                            className='w-64'
                                        />
                                    </div>
                                    <GenericDataTable
                                        data={processedGridData}
                                        columns={columns}
                                        totalItems={processedGridData.length}
                                        isLoading={isFiltering}
                                        noDataTitle='No Employees Found'
                                        isPaginationRequired={false}
                                        isSearchRequired={false}
                                        scrollable={true}
                                        maxHeight='400px'
                                    />
                                </div>

                                <div className='flex justify-end gap-2 border-t pt-4'>
                                    <Button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className='bg-blue-600 transition-all duration-200 hover:scale-105 hover:bg-blue-700'>
                                        <RefreshCw className={`mr-2 h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} />
                                        {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
                                    </Button>
                                    <Button
                                        variant='outline'
                                        onClick={handleCancel}
                                        className='border-orange-500 text-orange-600 transition-all duration-200 hover:scale-105 hover:bg-orange-50'>
                                        <X className='mr-2 h-4 w-4' />
                                        CANCEL
                                    </Button>
                                </div>
                            </CollapsibleSection>
                        )}
                        {!hasSearched && (
                            <div className='flex items-center justify-center rounded-lg bg-muted/50 py-12'>
                                <div className='space-y-2 text-center'>
                                    <div className='text-lg text-muted-foreground'>
                                        Please use the search form above to find employee salary records
                                    </div>
                                    <div className='text-muted-foreground text-sm'>
                                        Select your criteria and click "SEARCH" to view results
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </CollapsibleSection>
            </div>
        </div>
    );
}
