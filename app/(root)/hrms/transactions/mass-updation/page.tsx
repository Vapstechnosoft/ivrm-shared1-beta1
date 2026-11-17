'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { MultiSelect } from '@/components/ui/multi-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import {
    useMassUpdationOnload,
    useSaveMassUpdation,
    useSearchMassUpdationEmployees
} from '@/hooks/hrms/useTransactions';
import {
    getDepartmentDropdownByGroupType,
    getDesignationDropdownByGroupTypeAndDesignation,
    getGroupTypeDropdown,
    getHeadDropdown
} from '@/server/hrms/hrmsConfig/transaction/mass-updation';
import { RefreshCw, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function MassUpdationPage() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);

    // ------------------------------------------------------------------------
    // Hooks & State
    // ------------------------------------------------------------------------
    // Onload Data
    const { data: onloadData, isLoading: isLoadingOnload } = useMassUpdationOnload({
        MI_Id: HRMS_MI_ID,
        roleId: 0, // Should come from context
        LogInUserId: 0 // Should come from context
    });

    // Dropdown Data States
    const [groupTypes, setGroupTypes] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [designations, setDesignations] = useState<any[]>([]);
    const [heads, setHeads] = useState<any[]>([]);

    // Grid Data
    const [employees, setEmployees] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);

    // Mutations

    const { mutate: searchEmployees, isPending: isSearching } = useSearchMassUpdationEmployees();
    const { mutate: saveMassUpdate, isPending: isSaving } = useSaveMassUpdation();

    // Form Control
    const { control, handleSubmit, watch, setValue, reset, getValues } = useForm({
        defaultValues: {
            groupType: [] as string[],
            department: [] as string[],
            designation: [] as string[],

            // Action Section
            earningDeduction: '',
            amountType: '',
            selectedHead: '',
            amountValue: '',
            addRemove: ''
        }
    });

    const watchedGroupType = watch('groupType');
    const watchedDepartment = watch('department');
    const watchedEarningDeduction = watch('earningDeduction');
    const watchedAmountType = watch('amountType');

    // ------------------------------------------------------------------------
    // Effects
    // ------------------------------------------------------------------------
    // Initialize Master Data
    useEffect(() => {
        // Fetch Group Types
        async function fetchGroupTypes() {
            try {
                const { groupTypedropdown } = await getGroupTypeDropdown();
                setGroupTypes(groupTypedropdown || []);
            } catch (err) {
                console.error("Failed to load group types", err);
            }
        }
        fetchGroupTypes();

        // Fetch Heads
        async function fetchHeads() {
            try {
                const { headdropdown } = await getHeadDropdown();
                setHeads(headdropdown || []);
            } catch (err) {
                console.error("Failed to load heads", err);
            }
        }
        fetchHeads();
    }, []);

    // Cascading: Group Type -> Department
    useEffect(() => {
        if (!isClient) return;
        async function fetchDepartments() {
            let activeGroupIds: string[] = [];
            if (watchedGroupType && watchedGroupType.length > 0) {
                if (watchedGroupType.includes('All')) {
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
                    console.error("Error fetching departments", error);
                    setDepartments([]);
                }
            } else {
                setDepartments([]);
            }
        }
        fetchDepartments();
    }, [watchedGroupType, groupTypes, isClient]);

    // Cascading: Department -> Designation
    useEffect(() => {
        if (!isClient) return;
        async function fetchDesignations() {
            let activeGroupIds: string[] = [];
            if (watchedGroupType && watchedGroupType.length > 0) {
                if (watchedGroupType.includes('All')) {
                    activeGroupIds = groupTypes.map((gt: any) => gt.HRMGT_Id?.toString() || '');
                } else {
                    activeGroupIds = watchedGroupType;
                }
            }

            let activeDeptIds: string[] = [];
            if (watchedDepartment && watchedDepartment.length > 0) {
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
                    console.error("Error fetching designations", error);
                    setDesignations([]);
                }
            } else {
                setDesignations([]);
            }
        }
        fetchDesignations();
    }, [watchedDepartment, watchedGroupType, groupTypes, departments, isClient]);


    // ------------------------------------------------------------------------
    // Actions
    // ------------------------------------------------------------------------
    const onSearch = (formData: any) => {
        const groupTypeIds = formData.groupType.filter((x: string) => x !== 'All').map(Number);
        const departmentIds = formData.department.filter((x: string) => x !== 'All').map(Number);
        const designationIds = formData.designation.filter((x: string) => x !== 'All').map(Number);

        if (groupTypeIds.length === 0 && departmentIds.length === 0 && designationIds.length === 0) {
            toast.error('Please select at least one filter criterion');
            return;
        }

        searchEmployees(
            {
                MI_Id: HRMS_MI_ID,
                groupTypeIdList: groupTypeIds,
                hrmD_IdList: departmentIds,
                hrmdeS_IdList: designationIds,
                LogInUserId: 0,
                roleId: 0
            },
            {
                onSuccess: (data) => {
                    if (data.employeedropdown && data.employeedropdown.length > 0) {
                        setEmployees(data.employeedropdown);
                        setHasSearched(true);
                        toast.success(`Found ${data.employeedropdown.length} employees`);
                    } else {
                        setEmployees([]);
                        setHasSearched(true);
                        toast.info('No employees found matching criteria');
                    }
                },
                onError: (err) => toast.error(err.message || 'Search failed')
            }
        );
    };

    const onSave = () => {
        const formData = getValues();

        if (selectedEmployeeIds.length === 0) {
            toast.error('Please select at least one employee from the list');
            return;
        }

        if (!formData.earningDeduction) {
            toast.error('Please select Earning or Deduction');
            return;
        }
        if (!formData.amountType) {
            toast.error('Please select Amount or Percentage');
            return;
        }
        if (!formData.selectedHead) {
            toast.error('Please select a Head');
            return;
        }
        if (formData.addRemove !== 'Remove' && (!formData.amountValue || Number(formData.amountValue) <= 0)) {
            toast.error('Please enter a valid amount/percentage');
            return;
        }
        if (!formData.addRemove) {
            toast.error('Please select Add or Remove');
            return;
        }

        saveMassUpdate(
            {
                MI_Id: HRMS_MI_ID,
                roleId: 0,
                LogInUserId: 0,

                // selections
                employeeselected: selectedEmployeeIds,
                // Logic
                Type: formData.earningDeduction,
                EarningDeduction: formData.earningDeduction,
                AmountPercentage: formData.amountType,
                HRMED_Id: Number(formData.selectedHead),
                HREED_Amount: formData.amountType === 'Amount' ? Number(formData.amountValue) : 0,
                HREED_Percentage: formData.amountType === 'Percentage' ? formData.amountValue.toString() : '0',
                AddRemove: formData.addRemove,

                // Metadata to satisfy API (reuse search params)
                groupTypeIdList: formData.groupType.filter((x: string) => x !== 'All').map(Number),
                hrmD_IdList: formData.department.filter((x: string) => x !== 'All').map(Number),
                hrmdeS_IdList: formData.designation.filter((x: string) => x !== 'All').map(Number)
            },
            {
                onSuccess: () => {
                    // Reset action fields but keep grid? Or reset everything?
                    // Legacy clears data. Let's keep grid but clear action fields for better UX, or just clear selection.
                    setSelectedEmployeeIds([]);
                    setValue('amountValue', '');
                    setValue('selectedHead', '');
                    setValue('addRemove', '');
                    // We might need to refresh grid if "Add/Remove" changes data that is visible, 
                    // but here the grid just shows names. So no refresh needed.
                }
            }
        );
    };

    const handleCancel = () => {
        setHasSearched(false);
        setEmployees([]);
        setSelectedEmployeeIds([]);
        reset({
            groupType: [],
            department: [],
            designation: [],
            earningDeduction: '',
            amountType: '',
            selectedHead: '',
            amountValue: '',
            addRemove: ''
        });
    };

    // ------------------------------------------------------------------------
    // Derived Data
    // ------------------------------------------------------------------------
    const filteredHeads = useMemo(() => {
        if (!watchedEarningDeduction && !watchedAmountType) return heads;

        return heads.filter((h: any) => {
            let matchesType = true;
            if (watchedEarningDeduction) {
                matchesType = h.HRMED_EarnDedFlag === watchedEarningDeduction;
            }

            let matchesAmount = true;
            if (watchedAmountType) {
                matchesAmount = h.HRMED_AmountPercentFlag === watchedAmountType;
            }

            return matchesType && matchesAmount;
        });
    }, [heads, watchedEarningDeduction, watchedAmountType]);

    // client side search for grid
    const [localSearch, setLocalSearch] = useState('');

    const processedGridData = useMemo(() => {
        if (!localSearch) return employees;
        const lower = localSearch.toLowerCase();
        return employees.filter(e =>
            (e.HRME_EmployeeFirstName + ' ' + (e.HRME_EmployeeMiddleName || '') + ' ' + (e.HRME_EmployeeLastName || '')).toLowerCase().includes(lower) ||
            (e.HRME_EmployeeCode || '').toLowerCase().includes(lower)
        );
    }, [employees, localSearch]);

    // Grid Columns
    const columns = [
        {
            header: 'SNO',
            cell: ({ row }: any) => <div>{row.index + 1}</div>,
        },
        {
            accessorKey: 'HRME_EmployeeCode',
            header: 'Employee Code',
        },
        {
            accessorKey: 'HRME_EmployeeFirstName',
            header: 'Employee Name',
            cell: ({ row }: any) => (
                <div>
                    {row.original.HRME_EmployeeFirstName} {row.original.HRME_EmployeeMiddleName} {row.original.HRME_EmployeeLastName}
                </div>
            )
        },
        {
            id: 'select',
            header: ({ table }: any) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => {
                        table.toggleAllPageRowsSelected(!!value);
                        if (value) {
                            setSelectedEmployeeIds(employees.map(e => e.HRME_Id));
                        } else {
                            setSelectedEmployeeIds([]);
                        }
                    }}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }: any) => (
                <Checkbox
                    checked={selectedEmployeeIds.includes(row.original.HRME_Id)}
                    onCheckedChange={(value) => {
                        row.toggleSelected(!!value);
                        if (value) {
                            setSelectedEmployeeIds(prev => [...prev, row.original.HRME_Id]);
                        } else {
                            setSelectedEmployeeIds(prev => prev.filter(id => id !== row.original.HRME_Id));
                        }
                    }}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        }
    ];

    if (!isClient) return null;

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <h2 className="text-2xl font-bold tracking-tight">Mass Updation</h2>

                {/* Filters */}
                <CollapsibleSection defaultOpen={true} variant='outline' size='lg' className='shadow-lg'>
                    <form onSubmit={handleSubmit(onSearch)} className='space-y-6'>
                        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                            <div className='space-y-3'>
                                <Label className='font-semibold'>Group Type <span className='text-destructive'>*</span></Label>
                                <Controller name='groupType' control={control} render={({ field }) => (
                                    <MultiSelect
                                        options={[{ label: 'All', value: 'All' }, ...groupTypes.map((gt: any) => ({ label: gt.HRMGT_EmployeeGroupType, value: gt.HRMGT_Id?.toString() || '' }))]}
                                        defaultValue={Array.isArray(field.value) ? field.value : []}
                                        onValueChange={field.onChange}
                                        placeholder='Select Group Types'
                                        className='w-full'
                                    />
                                )} />
                            </div>
                            <div className='space-y-3'>
                                <Label className='font-semibold'>Department <span className='text-destructive'>*</span></Label>
                                <Controller name='department' control={control} render={({ field }) => (
                                    <MultiSelect
                                        options={[{ label: 'All', value: 'All' }, ...departments.map((d: any) => ({ label: d.HRMD_DepartmentName, value: d.HRMD_Id?.toString() || '' }))]}
                                        defaultValue={Array.isArray(field.value) ? field.value : []}
                                        onValueChange={field.onChange}
                                        placeholder='Select Departments'
                                        className='w-full'
                                    />
                                )} />
                            </div>
                            <div className='space-y-3'>
                                <Label className='font-semibold'>Designation <span className='text-destructive'>*</span></Label>
                                <Controller name='designation' control={control} render={({ field }) => (
                                    <MultiSelect
                                        options={[{ label: 'All', value: 'All' }, ...designations.map((d: any) => ({ label: d.HRMDES_DesignationName, value: d.HRMDES_Id?.toString() || '' }))]}
                                        defaultValue={Array.isArray(field.value) ? field.value : []}
                                        onValueChange={field.onChange}
                                        placeholder='Select Designations'
                                        className='w-full'
                                    />
                                )} />
                            </div>
                        </div>
                        <div className='flex justify-end'>
                            <Button type='submit' className='w-32' disabled={isSearching}>
                                {isSearching ? <RefreshCw className='h-4 w-4 animate-spin mr-2' /> : <Search className='h-4 w-4 mr-2' />}
                                Search
                            </Button>
                        </div>
                    </form>
                </CollapsibleSection>

                {/* Action & Grid Area */}
                {hasSearched && (
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                        {/* Left: Actions */}
                        <div className='lg:col-span-1 space-y-4'>
                            <CollapsibleSection defaultOpen={true} title="Update Settings" variant='default' className='shadow-md border h-full'>
                                <div className='space-y-6 pt-2'>
                                    <div className='space-y-2'>
                                        <Label>Earning / Deduction <span className='text-destructive'>*</span></Label>
                                        <Controller name="earningDeduction" control={control} render={({ field }) => (
                                            <RadioGroup
                                                value={field.value}
                                                onValueChange={(val) => {
                                                    field.onChange(val);
                                                    setValue('selectedHead', ''); // Reset head on type change
                                                }}
                                                className="flex flex-col space-y-1"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Earning" id="r-earning" />
                                                    <Label htmlFor="r-earning" className='font-normal cursor-pointer'>Earning</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Deduction" id="r-deduction" />
                                                    <Label htmlFor="r-deduction" className='font-normal cursor-pointer'>Deduction</Label>
                                                </div>
                                            </RadioGroup>
                                        )} />
                                    </div>

                                    <div className='space-y-2'>
                                        <Label>Amount / Percentage <span className='text-destructive'>*</span></Label>
                                        <Controller name="amountType" control={control} render={({ field }) => (
                                            <RadioGroup
                                                value={field.value}
                                                onValueChange={(val) => {
                                                    field.onChange(val);
                                                    setValue('selectedHead', ''); // Reset head on type change
                                                }}
                                                className="flex flex-col space-y-1"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Amount" id="r-amount" />
                                                    <Label htmlFor="r-amount" className='font-normal cursor-pointer'>Amount</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Percentage" id="r-percentage" />
                                                    <Label htmlFor="r-percentage" className='font-normal cursor-pointer'>Percentage</Label>
                                                </div>
                                            </RadioGroup>
                                        )} />
                                    </div>

                                    <div className='space-y-2'>
                                        <Label>Head <span className='text-destructive'>*</span></Label>
                                        <Controller name="selectedHead" control={control} render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Head" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredHeads.map((h: any) => (
                                                        <SelectItem key={h.HRMED_Id} value={h.HRMED_Id.toString()}>
                                                            {h.HRMED_Name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )} />
                                    </div>

                                    <div className='space-y-2'>
                                        <Label>
                                            {watchedAmountType === 'Percentage' ? 'Percentage' : 'Amount'}
                                            {watch('addRemove') !== 'Remove' && <span className='text-destructive'> *</span>}
                                        </Label>
                                        <Controller name="amountValue" control={control} render={({ field }) => (
                                            <InputText
                                                {...field}
                                                type='number'
                                                step='0.01'
                                                placeholder={watchedAmountType === 'Percentage' ? 'Enter %' : 'Enter Amount'}
                                                disabled={watch('addRemove') === 'Remove'}
                                            />
                                        )} />
                                    </div>

                                    <div className='space-y-2 border-t pt-4'>
                                        <Label>Action <span className='text-destructive'>*</span></Label>
                                        <Controller name="addRemove" control={control} render={({ field }) => (
                                            <RadioGroup
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                className="flex flex-row space-x-4"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Add" id="r-add" />
                                                    <Label htmlFor="r-add" className='font-normal cursor-pointer'>Add / Update</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Remove" id="r-remove" />
                                                    <Label htmlFor="r-remove" className='font-normal cursor-pointer'>Remove</Label>
                                                </div>
                                            </RadioGroup>
                                        )} />
                                    </div>
                                </div>
                            </CollapsibleSection>
                        </div>

                        {/* Right: Grid */}
                        <div className='lg:col-span-2 space-y-4'>
                            <CollapsibleSection defaultOpen={true} title="Employee List" variant='default' className='shadow-md border'>
                                <div className='p-2 space-y-4'>
                                    <div className='flex justify-between items-center'>
                                        <div className='text-sm text-muted-foreground'>
                                            Selected: <span className='font-bold text-primary'>{selectedEmployeeIds.length}</span> / {employees.length}
                                        </div>
                                        <div className='w-64'>
                                            <InputText
                                                name='localSearch'
                                                value={localSearch}
                                                onChange={(e) => setLocalSearch(e.target.value)}
                                                placeholder='Search by name or code...'
                                            />
                                        </div>
                                    </div>
                                    <div className="h-[400px] overflow-y-auto border rounded-md">
                                        <GenericDataTable
                                            data={processedGridData}
                                            columns={columns}
                                            totalItems={employees.length}
                                            isPaginationRequired={false}
                                            isSearchRequired={false}
                                            isLoading={isSearching}
                                        />
                                    </div>
                                </div>
                            </CollapsibleSection>

                            <div className='flex justify-end gap-2 p-4 bg-muted/20 rounded-lg border'>
                                <Button onClick={onSave} disabled={isSaving} className='bg-blue-600 hover:bg-blue-700 w-32'>
                                    <RefreshCw className={`mr-2 h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} />
                                    {isSaving ? 'Saving...' : 'Save'}
                                </Button>
                                <Button variant='outline' onClick={handleCancel} className='border-orange-500 text-orange-600 hover:bg-orange-50'>
                                    <X className='mr-2 h-4 w-4' />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
