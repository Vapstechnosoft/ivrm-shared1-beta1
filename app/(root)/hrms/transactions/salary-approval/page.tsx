'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { Label } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApproveSalaries, useSalaryApprovalOnload, useSearchSalaryApproval } from '@/hooks/hrms/useTransactions';
import type { EmployeeDetail, SalaryApprovalRequest, SalaryApprovalSearchRequest } from '@/types/hrms/salary-approval';
import { CheckCircle, RefreshCw, X, XCircle } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getSalaryApprovalColumns } from './_components/columns';
interface SearchForm {
    groupType: string[];
    department: string[];
    designation: string[];
    salaryMonth: string;
    salaryYear: string;
}
export default function SalaryApprovalPage() {
    const [employees, setEmployees] = useState<EmployeeDetail[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<EmployeeDetail[]>([]);
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
    const {
        data: onloadData,
        isLoading,
        error: onloadError
    } = useSalaryApprovalOnload({
        MI_Id: 30
    });
    const searchMutation = useSearchSalaryApproval();
    const approveMutation = useApproveSalaries();
    // Memoize arrays to prevent unnecessary re-renders
    const monthOptions = useMemo(() => onloadData?.monthdropdown || [], [onloadData?.monthdropdown]);
    const leaveYearOptions = useMemo(() => onloadData?.leaveyeardropdown || [], [onloadData?.leaveyeardropdown]);
    const departmentOptions = useMemo(() => onloadData?.departmentdropdownlist || [], [onloadData?.departmentdropdownlist]);
    const designationOptions = useMemo(() => onloadData?.designationdropdownlist || [], [onloadData?.designationdropdownlist]);
    const groupTypeOptions = useMemo(() => onloadData?.groupTypedropdownlist || [], [onloadData?.groupTypedropdownlist]);
    // Memoize filterEmployees to prevent infinite loops
    const filterEmployees = useCallback(() => {
        let filtered = employees;
        if (watchedGroupType && watchedGroupType.length > 0) {
            const groupTypeNames = new Set(watchedGroupType);
            filtered = filtered.filter((emp) => groupTypeNames.has(emp.HRMGT_EmployeeGroupType));
        }
        if (watchedDepartment && watchedDepartment.length > 0) {
            const departmentNames = new Set(watchedDepartment);
            filtered = filtered.filter((emp) => departmentNames.has(emp.HRMD_DepartmentName));
        }
        if (watchedDesignation && watchedDesignation.length > 0) {
            const designationNames = new Set(watchedDesignation);
            filtered = filtered.filter((emp) => designationNames.has(emp.HRMDES_DesignationName));
        }
        setFilteredEmployees(filtered);
    }, [watchedGroupType, watchedDepartment, watchedDesignation, employees]);
    useEffect(() => {
        if (hasSearched) {
            filterEmployees();
        }
    }, [hasSearched, filterEmployees]);
    // Handle API errors gracefully - show toast but don't crash the UI
    useEffect(() => {
        if (onloadError && !isLoading) {
            // Only show error toast once, and make it less intrusive
            // Don't show toast for backend errors - they're expected if the API is down
            // The component will continue to work with empty dropdowns
        }
    }, [onloadError, isLoading]);
    const onSubmit: SubmitHandler<SearchForm> = async (data: SearchForm) => {
        const payload: SalaryApprovalSearchRequest = {
            MI_Id: 30,
            HRES_Year: data.salaryYear || '',
            HRES_Month: data.salaryMonth || '',
            groupTypeIdList:
                (data.groupType || []).length > 0
                    ? (data.groupType || []).map((v) => {
                          const groupType = groupTypeOptions.find((g) => g.HRMGT_EmployeeGroupType === v);
                          return groupType?.HRMGT_Id || 0;
                      })
                    : [0],
            hrmD_IdList:
                (data.department || []).length > 0
                    ? (data.department || []).map((v) => {
                          const dept = departmentOptions.find((d) => d.HRMD_DepartmentName === v);
                          return dept?.HRMD_Id || 0;
                      })
                    : [0],
            hrmdeS_IdList:
                (data.designation || []).length > 0
                    ? (data.designation || []).map((v) => {
                          const desg = designationOptions.find((d) => d.HRMDES_DesignationName === v);
                          return desg?.HRMDES_Id || 0;
                      })
                    : [0],
            LogInUserId: 0
        };
        searchMutation.mutate(payload, {
            onSuccess: (responseData) => {
                const employeeList = responseData.ReportData || [];
                setEmployees(employeeList);
                setFilteredEmployees(employeeList);
                setHasSearched(true);
                setCurrentSearchData(data);
                if (data.salaryMonth && data.salaryYear) {
                    // Find month data - assuming monthdropdown has similar structure
                    const monthData = monthOptions.find((m: any) => m.IVRM_Month_Name === data.salaryMonth || m.label === data.salaryMonth);
                    if (monthData) {
                        const year = Number.parseInt(data.salaryYear);
                        const monthIndex = (monthData.IVRM_Month_Id || (monthData as any).value || 1) - 1;
                        const fromDate = new Date(year, monthIndex, 1);
                        const toDate = new Date(year, monthIndex + 1, 0);
                        const fromDateStr = `${String(fromDate.getDate()).padStart(2, '0')}/${String(fromDate.getMonth() + 1).padStart(2, '0')}/${fromDate.getFullYear()}`;
                        const toDateStr = `${String(toDate.getDate()).padStart(2, '0')}/${String(toDate.getMonth() + 1).padStart(2, '0')}/${toDate.getFullYear()}`;
                        setFromDate(fromDateStr);
                        setToDate(toDateStr);
                    }
                }
                toast.success(`Search completed successfully. Found ${employeeList.length} employees`);
            },
            onError: (_error) => {
                setEmployees([]);
                setFilteredEmployees([]);
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
            setSelectedEmployees(filteredEmployees.map((emp) => emp.HRME_Id));
        } else {
            setSelectedEmployees([]);
        }
    };
    const handleApprove = async () => {
        if (selectedEmployees.length === 0) {
            toast.error('Please select at least one employee to approve');
            return;
        }
        if (!currentSearchData) {
            toast.error('Please perform a search first before approving');
            return;
        }
        const payload: SalaryApprovalRequest = {
            MI_Id: 30,
            HRES_Year: currentSearchData.salaryYear,
            HRES_Month: currentSearchData.salaryMonth,
            employeeIdList: selectedEmployees,
            LogInUserId: 0,
            approvalStatus: 'Approved'
        };
        approveMutation.mutate(payload, {
            onSuccess: (data) => {
                if (data.approvedCount > 0) {
                    toast.success(`Successfully approved ${data.approvedCount} employee(s)`);
                }
                setSelectedEmployees([]);
            },
            onError: (_error) => {
                toast.error('Failed to approve employees');
            }
        });
    };
    const handleReject = async () => {
        if (selectedEmployees.length === 0) {
            toast.error('Please select at least one employee to reject');
            return;
        }
        if (!currentSearchData) {
            toast.error('Please perform a search first before rejecting');
            return;
        }
        const payload: SalaryApprovalRequest = {
            MI_Id: 30,
            HRES_Year: currentSearchData.salaryYear,
            HRES_Month: currentSearchData.salaryMonth,
            employeeIdList: selectedEmployees,
            LogInUserId: 0,
            approvalStatus: 'Rejected'
        };
        approveMutation.mutate(payload, {
            onSuccess: (data) => {
                if (data.approvedCount > 0) {
                    toast.success(`Successfully rejected ${data.approvedCount} employee(s)`);
                }
                setSelectedEmployees([]);
            },
            onError: (_error) => {
                toast.error('Failed to reject employees');
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
                                            options={groupTypeOptions.map((g) => ({
                                                label: g.HRMGT_EmployeeGroupType,
                                                value: g.HRMGT_EmployeeGroupType
                                            }))}
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
                                            options={departmentOptions.map((d) => ({
                                                label: d.HRMD_DepartmentName,
                                                value: d.HRMD_DepartmentName
                                            }))}
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
                                            options={designationOptions.map((d) => ({
                                                label: d.HRMDES_DesignationName,
                                                value: d.HRMDES_DesignationName
                                            }))}
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
                                                {Array.isArray(monthOptions) && monthOptions.length > 0
                                                    ? monthOptions.map((month: any) => (
                                                          <SelectItem
                                                              key={month.IVRM_Month_Id || month.value}
                                                              value={month.IVRM_Month_Name || month.value || month.label}>
                                                              {month.IVRM_Month_Name || month.label || month.value}
                                                          </SelectItem>
                                                      ))
                                                    : null}
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
                                                {Array.isArray(leaveYearOptions) && leaveYearOptions.length > 0
                                                    ? leaveYearOptions.map((year) => (
                                                          <SelectItem key={year.HRMLY_Id} value={year.HRMLY_LeaveYear}>
                                                              {year.HRMLY_LeaveYear}
                                                          </SelectItem>
                                                      ))
                                                    : null}
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
                        <SalaryApprovalTable
                            employees={filteredEmployees}
                            isLoading={isLoading || searchMutation.isPending || approveMutation.isPending}
                            selectedEmployees={selectedEmployees}
                            onEmployeeSelect={handleEmployeeSelect}
                            onSelectAll={handleSelectAll}
                            onApprove={handleApprove}
                            onReject={handleReject}
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
                                Please use the search form above to find employee salary records for approval
                            </div>
                            <div className='text-muted-foreground text-sm'>Select your criteria and click "SEARCH" to view results</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
interface SalaryApprovalTableProps {
    employees: EmployeeDetail[];
    isLoading: boolean;
    selectedEmployees: number[];
    onEmployeeSelect: (employeeId: number, selected: boolean) => void;
    onSelectAll: (selected: boolean) => void;
    onApprove: () => void;
    onReject: () => void;
    fromDate: string;
    toDate: string;
}
function SalaryApprovalTable({
    employees,
    isLoading,
    selectedEmployees,
    onEmployeeSelect,
    onSelectAll,
    onApprove,
    onReject,
    fromDate,
    toDate
}: SalaryApprovalTableProps) {
    // Prepare table response format for useDataTableProps
    const tableResponse = useMemo(() => {
        return {
            success: true,
            data: employees,
            total: employees.length,
            page: 1,
            page_size: employees.length
        };
    }, [employees]);
    const tableProps = useDataTableProps(tableResponse);
    // Get columns with selection handlers
    const columns = useMemo(
        () =>
            getSalaryApprovalColumns({
                employees,
                selectedEmployees,
                onEmployeeSelect,
                onSelectAll
            }),
        [employees, selectedEmployees, onEmployeeSelect, onSelectAll]
    );
    return (
        <div className='space-y-4'>
            {/* Date Range Display */}
            {fromDate && toDate && (
                <div className='rounded-lg bg-muted/50 p-4'>
                    <div className='flex items-center justify-between'>
                        <div className='text-muted-foreground text-sm'>
                            Date From: {fromDate} to {toDate}
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type='text' placeholder='search here...' className='w-48 rounded-md border px-3 py-1 text-sm' />
                            <RefreshCw className='h-4 w-4 cursor-pointer text-muted-foreground' />
                        </div>
                    </div>
                </div>
            )}
            <GenericDataTable<EmployeeDetail>
                {...tableProps}
                columns={columns}
                isLoading={isLoading}
                error={null}
                showViewOptions={true}
                columnPinning={{ left: ['select'] }}
                loadingMessage='Loading employees...'
                noDataTitle='No Employees Found'
                noDataDescription='No employee records match your search criteria'
                errorTitle='Error Loading Employees'
            />
            {/* Action Buttons */}
            <div className='flex justify-end gap-2'>
                <Button
                    onClick={onApprove}
                    disabled={selectedEmployees.length === 0}
                    className='w-fit transition-all duration-200 hover:scale-105'>
                    <CheckCircle className='mr-2 h-4 w-4' />
                    APPROVE SELECTED
                </Button>
                <Button
                    onClick={onReject}
                    disabled={selectedEmployees.length === 0}
                    variant='destructive'
                    className='w-fit transition-all duration-200 hover:scale-105'>
                    <XCircle className='mr-2 h-4 w-4' />
                    REJECT SELECTED
                </Button>
                <Button variant='outline' className='w-fit transition-all duration-200 hover:scale-105'>
                    <X className='mr-2 h-4 w-4' />
                    CANCEL
                </Button>
            </div>
        </div>
    );
}
