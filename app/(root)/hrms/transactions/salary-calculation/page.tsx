'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { Label } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useCalculateEmployeeSalary,
    useSearchEmployeesBySelection
} from '@/hooks/hrms/useTransactions';
import { useMasterMonths, useMasterYears, useReportGroupTypes, useReportDepartments, useReportDesignations } from '@/hooks/hrms/useReports';
import { MasterDropdown } from '@/server/hrms/master';
import type {
    NewSalaryCalculationGenerateRequest,
    NewSalaryCalculationSearchRequest,
    SelectionEmployee,
    ApiResponse
} from '@/types/hrms/salary-calculation';
import { Calculator, Mic, RefreshCw, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type Employee, getSalaryCalculationColumns } from './_components/columns';
interface SearchForm {
    groupType: string[];
    department: string[];
    designation: string[];
    salaryMonth: string;
    salaryYear: string;
}
export default function SalaryCalculationPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [currentSearchData, setCurrentSearchData] = useState<SearchForm | null>(null);
    const { handleSubmit, reset, watch, control } = useForm<SearchForm>({
        mode: 'onChange',
        defaultValues: {
            groupType: [],
            department: [],
            designation: [],
            salaryMonth: '',
            salaryYear: new Date().getFullYear().toString()
        }
    });
    const watchedGroupType = watch('groupType');
    const watchedDepartment = watch('department');
    const watchedDesignation = watch('designation');
    const { data: monthOptionsData } = useMasterMonths();
    const { data: yearOptionsData } = useMasterYears();
    const searchMutation = useSearchEmployeesBySelection();
    const calculateMutation = useCalculateEmployeeSalary();

    // Report-based cascading queries
    const { data: groupTypesData } = useReportGroupTypes();
    const groupTypeIds = watchedGroupType?.join(',') || '';
    const { data: departmentsData } = useReportDepartments(groupTypeIds);
    const deptIds = watchedDepartment?.join(',') || '';
    const { data: designationsData } = useReportDesignations(groupTypeIds, deptIds);

    // Memoized options for Select/MultiSelect components
    const groupTypeOptions = useMemo(() => {
        return (
            groupTypesData?.data?.map((gt: any) => ({
                label: gt.value,
                value: gt.key.toString()
            })) || []
        );
    }, [groupTypesData]);

    const departmentOptions = useMemo(() => {
        return (
            departmentsData?.data?.map((d: any) => ({
                label: d.hrmD_DepartmentName,
                value: d.hrmD_Id.toString()
            })) || []
        );
    }, [departmentsData]);

    const designationOptions = useMemo(() => {
        return (
            designationsData?.data?.map((d: any) => ({
                label: d.hrmdeS_DesignationName,
                value: d.hrmdeS_Id.toString()
            })) || []
        );
    }, [designationsData]);

    const monthOptions = useMemo<MasterDropdown[]>(() => (monthOptionsData?.data || []) as MasterDropdown[], [monthOptionsData]);
    const yearOptions = useMemo<MasterDropdown[]>(() => (yearOptionsData?.data || []) as MasterDropdown[], [yearOptionsData]);

    const onSubmit: SubmitHandler<SearchForm> = async (data: SearchForm) => {
        const payload: NewSalaryCalculationSearchRequest = {
            hreS_Year: data.salaryYear,
            hreS_Month: data.salaryMonth,
            groupTypeIdList: (data.groupType || []).map((v) => Number(v)),
            hrmD_IdList: (data.department || []).map((v) => Number(v)),
            hrmdeS_IdList: (data.designation || []).map((v) => Number(v)),
        };
        console.log('Search Payload:', payload);

        searchMutation.mutate(payload, {
            onSuccess: (responseData: ApiResponse<SelectionEmployee[]>) => {
                const employeeList = responseData.data || [];
                const employeesWithStatus: Employee[] = employeeList.map((emp: SelectionEmployee) => {
                    return {
                        ...emp,
                        HRME_Id: emp.hrmE_Id,
                        HRME_EmployeeFirstName: emp.hrmE_FirstName,
                        HRME_EmployeeMiddleName: emp.hrmE_MiddleName,
                        HRME_EmployeeLastName: emp.hrmE_LastName,
                        HRME_EmployeeCode: emp.hrmE_EmployeeCode,
                        HRME_DateOfJoining: emp.hrmE_DOJ,
                        HRME_MobileNo: emp.hrmE_MobileNo || '',
                        HRME_EmailID: emp.hrmE_EmailID || '',
                        MI_Id: 0,
                        HRMGT_Id: emp.hrmgT_Id,
                        HRMD_Id: emp.hrmD_Id,
                        HRMDES_Id: emp.hrmdeS_Id,
                        calculationStatus: 'Not Calculated' as const,
                        basicSalary: 0,
                        allowances: 0,
                        deductions: 0,
                        netSalary: 0
                    } as Employee;
                });

                setEmployees(employeesWithStatus);
                setHasSearched(true);
                setCurrentSearchData(data);

                if (data.salaryMonth && data.salaryYear) {
                    setFromDate(`01/${data.salaryMonth}/${data.salaryYear}`);
                    setToDate(`Last of ${data.salaryMonth}/${data.salaryYear}`);
                }
                toast.success(`Search completed successfully. Found ${employeesWithStatus.length} employees`);
            },
            onError: () => {
                setEmployees([]);
                setHasSearched(true);
            }
        });
    };

    const handleEmployeeSelect = (employeeId: number, selected: boolean) => {
        if (selected) {
            setSelectedEmployees([...selectedEmployees, employeeId]);
        } else {
            setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId));
        }
    };
    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedEmployees(employees.map((emp) => emp.HRME_Id));
        } else {
            setSelectedEmployees([]);
        }
    };
    const handleGenerateSalary = async () => {
        if (selectedEmployees.length === 0) {
            toast.error('Please select at least one employee to generate salary');
            return;
        }
        if (!currentSearchData) {
            toast.error('Please perform a search first before generating salary');
            return;
        }
        const payload: NewSalaryCalculationGenerateRequest = {
            hreS_Year: currentSearchData.salaryYear,
            hreS_Month: currentSearchData.salaryMonth,
            comm: "",//"cashbank",
            masterEmployeeList: selectedEmployees.map(empId => ({
                hrmE_Id: empId,
                type: "string",
                imC_Id: 0
            }))
        };
        calculateMutation.mutate(payload, {
            onSuccess: () => {
                setEmployees((prevEmployees) =>
                    prevEmployees.map((emp) =>
                        selectedEmployees.includes(emp.HRME_Id) ? { ...emp, calculationStatus: 'Calculated' as const } : emp
                    )
                );
                setSelectedEmployees([]);
            }
        });
    };

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Search Form */}
                <CollapsibleSection defaultOpen={true} variant='outline' size='lg' className='shadow-lg' headerClassName=''>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                        <div className='grid grid-cols-1 gap-6 lg:grid-cols-5'>
                            {/* Group Type */}
                            <div className='space-y-3'>
                                <Label className='font-semibold'>Group Type</Label>
                                <Controller
                                    name='groupType'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            options={groupTypeOptions}
                                            onValueChange={field.onChange}
                                            defaultValue={Array.isArray(field.value) ? field.value : []}
                                            placeholder='Select Group Types'
                                            className='w-full'
                                            maxHeight={240}
                                        />
                                    )}
                                />
                            </div>
                            {/* Department */}
                            <div className='space-y-3'>
                                <Label className='font-semibold'>Department</Label>
                                <Controller
                                    name='department'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            options={departmentOptions}
                                            onValueChange={field.onChange}
                                            defaultValue={Array.isArray(field.value) ? field.value : []}
                                            placeholder='Select Departments'
                                            className='w-full'
                                            maxHeight={240}
                                        />
                                    )}
                                />
                            </div>
                            {/* Designation */}
                            <div className='space-y-3'>
                                <Label className='font-semibold'>Designation</Label>
                                <Controller
                                    name='designation'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            options={designationOptions}
                                            onValueChange={field.onChange}
                                            defaultValue={Array.isArray(field.value) ? field.value : []}
                                            placeholder='Select Designations'
                                            className='w-full'
                                            maxHeight={240}
                                        />
                                    )}
                                />
                            </div>
                            {/* Month */}
                            <div className='space-y-3'>
                                <Label className='font-semibold'>Month</Label>
                                <Controller
                                    name='salaryMonth'
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Month' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {monthOptions.map((month) => (
                                                    <SelectItem key={month.key} value={month.value}>
                                                        {month.value}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            {/* Year */}
                            <div className='space-y-3'>
                                <Label className='font-semibold'>Year</Label>
                                <Controller
                                    name='salaryYear'
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Year' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {yearOptions.map((year) => (
                                                    <SelectItem key={year.key} value={year.value}>
                                                        {year.value}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>
                        {/* Search and Cancel Buttons */}
                        <div className='flex gap-2 pt-4'>
                            <Button type='submit' className='w-fit transition-all duration-200 hover:scale-105'>
                                <RefreshCw className='mr-2 h-4 w-4' />
                                SEARCH
                            </Button>
                            <Button
                                type='button'
                                variant='outline'
                                className='w-fit transition-all duration-200 hover:scale-105'
                                onClick={() => {
                                    reset();
                                    setHasSearched(false);
                                    setSelectedEmployees([]);
                                    setFromDate('');
                                    setToDate('');
                                }}>
                                <X className='mr-2 h-4 w-4' />
                                CANCEL
                            </Button>
                        </div>
                    </form>
                </CollapsibleSection>
                {/* Employee List Table */}
                {hasSearched && (
                    <CollapsibleSection
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                        headerClassName=''>
                        <SalaryCalculationTable
                            employees={employees}
                            isLoading={searchMutation.isPending || calculateMutation.isPending}

                            selectedEmployees={selectedEmployees}
                            onEmployeeSelect={handleEmployeeSelect}
                            onSelectAll={handleSelectAll}
                            onGenerateSalary={handleGenerateSalary}
                            fromDate={fromDate}
                            toDate={toDate}
                        />
                    </CollapsibleSection>
                )}
                {/* Initial State Message */}
                {!hasSearched && (
                    <div className='flex items-center justify-center rounded-lg bg-muted/50 py-12'>
                        <div className='space-y-2 text-center'>
                            <div className='text-lg text-muted-foreground'>
                                Please use the search form above to find employee salary records
                            </div>
                            <div className='text-muted-foreground text-sm'>Select your criteria and click "SEARCH" to view results</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
interface SalaryCalculationTableProps {
    employees: Employee[];
    isLoading: boolean;
    selectedEmployees: number[];
    onEmployeeSelect: (employeeId: number, selected: boolean) => void;
    onSelectAll: (selected: boolean) => void;
    onGenerateSalary: () => void;
    fromDate: string;
    toDate: string;
}
function SalaryCalculationTable({
    employees,
    isLoading,
    selectedEmployees,
    onEmployeeSelect,
    onSelectAll,
    onGenerateSalary,
    fromDate,
    toDate
}: SalaryCalculationTableProps) {
    const [searchTerm, setSearchTerm] = useState('');

    // Local filtering logic for search
    const filteredBySearch = useMemo(() => {
        if (!searchTerm) return employees;
        const lowerSearch = searchTerm.toLowerCase();
        return employees.filter((emp) => {
            const fullName = `${emp.HRME_EmployeeFirstName} ${emp.HRME_EmployeeMiddleName || ''} ${emp.HRME_EmployeeLastName || ''}`.toLowerCase();
            const code = (emp.HRME_EmployeeCode || '').toLowerCase();
            return fullName.includes(lowerSearch) || code.includes(lowerSearch);
        });
    }, [employees, searchTerm]);

    // Prepare table response format for useDataTableProps
    const tableResponse = useMemo(() => {
        return {
            success: true,
            data: filteredBySearch,
            total: filteredBySearch.length,
            page: 1,
            page_size: filteredBySearch.length
        };
    }, [filteredBySearch]);

    const tableProps = useDataTableProps(tableResponse);

    // Get columns with selection handlers
    const columns = useMemo(
        () =>
            getSalaryCalculationColumns({
                employees: filteredBySearch,
                selectedEmployees,
                onEmployeeSelect,
                onSelectAll
            }),
        [filteredBySearch, selectedEmployees, onEmployeeSelect, onSelectAll]
    );

    return (
        <div className='space-y-4'>
            {/* Date Range and Search Display */}
            <div className='rounded-lg bg-muted/50 p-4'>
                <div className='flex items-center justify-between gap-4'>
                    <div className='text-muted-foreground text-sm'>
                        {fromDate && toDate ? `Date From: ${fromDate} to ${toDate}` : 'Employee List'}
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='relative flex items-center'>
                            <Mic className='absolute left-3 h-4 w-4 text-muted-foreground' />
                            <input
                                type='text'
                                placeholder='Search code or name...'
                                className='w-64 rounded-md border bg-background pl-9 pr-9 py-1.5 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <X
                                    className='absolute right-3 h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground'
                                    onClick={() => setSearchTerm('')}
                                />
                            )}
                        </div>
                        <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 w-8 p-0'
                            onClick={() => setSearchTerm('')}
                            title='Refresh/Reset'
                        >
                            <RefreshCw className='h-4 w-4' />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Scrollable Container for Table - approx 10 rows height */}
            <div className='relative overflow-hidden rounded-md border'>
                <div className='max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40'>
                    <GenericDataTable<Employee>
                        {...tableProps}
                        columns={columns}
                        isLoading={isLoading}
                        error={null}
                        showViewOptions={true}
                        isSearchRequired={false}
                        isPaginationRequired={false}
                        columnPinning={{ left: ['select'] }}
                        loadingMessage='Loading employees...'
                        noDataTitle='No Employees Found'
                        noDataDescription={searchTerm ? 'No employees match your search term' : 'No employee records match your search criteria'}
                        errorTitle='Error Loading Employees'
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end gap-2'>
                <Button
                    onClick={onGenerateSalary}
                    disabled={selectedEmployees.length === 0}
                    className='w-fit transition-all duration-200 hover:scale-105 shadow-md'>
                    <Calculator className='mr-2 h-4 w-4' />
                    GENERATE PAY
                </Button>
                <Button variant='outline' className='w-fit transition-all duration-200 hover:scale-105 shadow-sm'>
                    <X className='mr-2 h-4 w-4' />
                    CANCEL
                </Button>
            </div>
        </div>
    );
}
