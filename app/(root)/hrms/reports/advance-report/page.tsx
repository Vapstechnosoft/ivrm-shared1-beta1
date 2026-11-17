'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table/data-table';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import { useEmployeeAdvanceReportOnload, useSearchEmployeeAdvanceReport } from '@/hooks/hrms/useReports';
import { Calculator, CreditCard, DollarSign, Download, FileText, Printer, TrendingUp, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { type EmployeeAdvanceRecord, advanceReportColumns, advanceTypeSummaryColumns } from './_components/columns';
import { type AdvanceFilters, AdvanceReportFilters } from './_components/filters';
// Advance Summary
interface AdvanceSummary {
    totalEmployees: number;
    totalAdvanceRequests: number;
    totalAdvanceAmount: number;
    totalApprovedAmount: number;
    totalRecoveredAmount: number;
    totalRemainingAmount: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    fullyRecoveredRequests: number;
    averageAdvanceAmount: number;
}
// Advance Type Summary
interface AdvanceTypeSummary {
    advanceType: string;
    totalRequests: number;
    totalAmount: number;
    approvedRequests: number;
    approvedAmount: number;
    recoveredAmount: number;
    remainingAmount: number;
}
export default function AdvanceReportPage() {
    const roleId = HRMS_MI_ID;
    const LogInUserId = 0;
    // React Query hooks
    const { data: onloadData, isLoading: isLoadingOnload, error: onloadError } = useEmployeeAdvanceReportOnload(roleId, LogInUserId);
    const searchMutation = useSearchEmployeeAdvanceReport();
    // State
    const [advanceRecords, setAdvanceRecords] = useState<EmployeeAdvanceRecord[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<EmployeeAdvanceRecord[]>([]);
    const [showReport, setShowReport] = useState(false);
    const [filters, setFilters] = useState<AdvanceFilters>({
        selectedGroupTypes: [],
        selectedDepartments: [],
        selectedDesignations: [],
        month: '',
        year: ''
    });
    // Memoize dropdown data from API
    const months = useMemo(() => {
        const data = onloadData?.data;
        if (!data) return [];
        return (data as any).monthdropdown || [];
    }, [onloadData?.data]);
    const years = useMemo(() => {
        const data = onloadData?.data;
        if (!data) return [];
        return (data as any).leaveyeardropdown || [];
    }, [onloadData?.data]);
    const groupTypes = useMemo(() => {
        const data = onloadData?.data;
        if (!data) return [];
        return (data as any).groupTypedropdown || [];
    }, [onloadData?.data]);
    const departments = useMemo(() => {
        const data = onloadData?.data;
        if (!data) return [];
        return (data as any).departmentdropdown || [];
    }, [onloadData?.data]);
    const designations = useMemo(() => {
        const data = onloadData?.data;
        if (!data) return [];
        return (data as any).designationdropdown || [];
    }, [onloadData?.data]);
    // Show error if API fails
    useEffect(() => {
        if (onloadError || (!isLoadingOnload && onloadData && !onloadData.success)) {
            const errorMessage =
                onloadError?.message ||
                onloadData?.message ||
                'Failed to load employee advance report data. Please check if the API endpoint is available.';
            toast.error(errorMessage);
        }
    }, [onloadError, isLoadingOnload, onloadData]);
    // Filter records based on selected criteria
    useEffect(() => {
        let filtered = advanceRecords;
        // Filter by group types (by ID)
        if (filters.selectedGroupTypes.length > 0) {
            filtered = filtered.filter((record) => {
                // TODO: Map group type ID to name when API is integrated
                return filters.selectedGroupTypes.includes(record.groupType);
            });
        }
        // Filter by departments (by ID)
        if (filters.selectedDepartments.length > 0) {
            filtered = filtered.filter((record) => {
                // TODO: Map department ID to name when API is integrated
                return filters.selectedDepartments.includes(record.department);
            });
        }
        // Filter by designations (by ID)
        if (filters.selectedDesignations.length > 0) {
            filtered = filtered.filter((record) => {
                // TODO: Map designation ID to name when API is integrated
                return filters.selectedDesignations.includes(record.designation);
            });
        }
        // Filter by month
        if (filters.month) {
            filtered = filtered.filter((record) => record.month === filters.month);
        }
        // Filter by year
        if (filters.year) {
            filtered = filtered.filter((record) => record.year === filters.year);
        }
        setFilteredRecords(filtered);
    }, [filters, advanceRecords]);
    const handleFilterChange = (newFilters: AdvanceFilters) => {
        setFilters(newFilters);
    };
    const handleSearch = () => {
        if (!filters.month || !filters.year) {
            toast.error('Please select both month and year');
            return;
        }
        // Find month name from selected month
        const selectedMonthObj = months.find((m: any) => m.IVRM_Month_Name?.trim() === filters.month);
        const monthName = selectedMonthObj?.IVRM_Month_Name?.trim() || filters.month;
        // Find selected department IDs
        const selectedDepartmentIds = filters.selectedDepartments
            .map((id) => {
                const dept = departments.find((d: any) => d.HRMD_Id?.toString() === id);
                return dept?.HRMD_Id;
            })
            .filter((id): id is number => id !== undefined);
        // Find selected designation IDs
        const selectedDesignationIds = filters.selectedDesignations
            .map((id) => {
                const desg = designations.find((d: any) => d.HRMDES_Id?.toString() === id);
                return desg?.HRMDES_Id;
            })
            .filter((id): id is number => id !== undefined);
        // Find selected year
        const selectedYearObj = years.find((y: any) => y.HRMLY_LeaveYear === filters.year);
        const yearValue = selectedYearObj ? Number.parseInt(selectedYearObj.HRMLY_LeaveYear) : Number.parseInt(filters.year) || 0;
        // Prepare search request
        const searchRequest = {
            MI_Id: roleId,
            hrmD_IdList: selectedDepartmentIds.length > 0 ? selectedDepartmentIds : [],
            hrmdeS_IdList: selectedDesignationIds.length > 0 ? selectedDesignationIds : [],
            HRESA_AdvYear: yearValue,
            HRESA_AdvMonth: monthName
        };
        // Call search API
        searchMutation.mutate(searchRequest, {
            onSuccess: (response) => {
                if (response.success && response.data) {
                    // Extract employee details from response
                    const employeeData = response.data.employeeDetails || [];
                    if (Array.isArray(employeeData) && employeeData.length > 0) {
                        // Map API response to EmployeeAdvanceRecord format
                        const mappedRecords: EmployeeAdvanceRecord[] = employeeData.map((item: any, index: number) => {
                            const advanceAmount = item.HRESA_AppliedAmount || item.advanceAmount || 0;
                            const approvedAmount = item.HRESA_ApprovedAmount || item.approvedAmount || 0;
                            const recoveredAmount = item.HRESA_RecoveredAmount || item.recoveredAmount || 0;
                            const remainingAmount = item.HRESA_RemainingAmount || item.remainingAmount || approvedAmount - recoveredAmount;
                            // Determine status
                            let status: 'Pending' | 'Approved' | 'Rejected' | 'Partially Recovered' | 'Fully Recovered' = 'Pending';
                            if (item.HRESA_Status) {
                                const apiStatus = item.HRESA_Status.toLowerCase();
                                if (apiStatus.includes('rejected')) {
                                    status = 'Rejected';
                                } else if (apiStatus.includes('fully recovered') || remainingAmount === 0) {
                                    status = 'Fully Recovered';
                                } else if (apiStatus.includes('partially recovered') || recoveredAmount > 0) {
                                    status = 'Partially Recovered';
                                } else if (apiStatus.includes('approved')) {
                                    status = 'Approved';
                                }
                            }
                            // Calculate advance percentage
                            const basicSalary = item.HRME_BasicSalary || item.basicSalary || 0;
                            const advancePercentage = basicSalary > 0 ? Math.round((advanceAmount / basicSalary) * 100) : 0;
                            return {
                                id: `advance-${item.HRESA_Id || index}`,
                                employeeCode: item.HRME_EmployeeCode || item.EmployeeCode || '',
                                employeeName:
                                    `${item.HRME_EmployeeFirstName || ''} ${item.HRME_EmployeeMiddleName || ''} ${item.HRME_EmployeeLastName || ''}`.trim() ||
                                    '',
                                groupType: item.HRMGT_EmployeeGroupType || item.groupType || 'N/A',
                                department: item.HRMD_DepartmentName || item.department || 'N/A',
                                designation: item.HRMDES_DesignationName || item.designation || 'N/A',
                                advanceRequestDate: item.HRESA_EntryDate || item.advanceRequestDate || '',
                                advanceType: (item.HRESA_AdvanceType || item.advanceType || 'Salary Advance') as
                                    | 'Salary Advance'
                                    | 'Festival Advance'
                                    | 'Medical Advance'
                                    | 'Emergency Advance'
                                    | 'Travel Advance',
                                advanceAmount: Math.round(advanceAmount),
                                approvedAmount: Math.round(approvedAmount),
                                advanceReason: item.HRESA_Reason || item.advanceReason || '',
                                approvalDate: item.HRESA_ApprovalDate || item.approvalDate || '',
                                approvedBy: item.HRESA_ApprovedBy || item.approvedBy || '',
                                recoveryStartDate: item.HRESA_RecoveryStartDate || item.recoveryStartDate || '',
                                recoveryEndDate: item.HRESA_RecoveryEndDate || item.recoveryEndDate || '',
                                totalInstallments: item.HRESA_TotalInstallments || item.totalInstallments || 0,
                                installmentAmount: item.HRESA_InstallmentAmount || item.installmentAmount || 0,
                                recoveredAmount: Math.round(recoveredAmount),
                                remainingAmount: Math.round(remainingAmount),
                                status: status,
                                month: filters.month,
                                year: filters.year,
                                basicSalary: Math.round(basicSalary),
                                advancePercentage: advancePercentage
                            };
                        });
                        setAdvanceRecords(mappedRecords);
                        setShowReport(true);
                        toast.success('Employee Advance Report generated successfully');
                    } else {
                        // No data returned
                        setAdvanceRecords([]);
                        setShowReport(true);
                        toast.warning('Employee Advance Report generated but no data found for selected period');
                    }
                } else {
                    toast.error(response.message || 'Failed to generate Employee Advance Report');
                }
            },
            onError: (error: Error) => {
                toast.error(error.message || 'Failed to generate Employee Advance Report');
            }
        });
    };
    const handleCancel = () => {
        setFilters({
            selectedGroupTypes: [],
            selectedDepartments: [],
            selectedDesignations: [],
            month: '',
            year: ''
        });
        setAdvanceRecords([]);
        setFilteredRecords([]);
        setShowReport(false);
        toast.info('Filters cleared');
    };
    const handleExport = () => {
        toast.success('Employee Advance Report exported successfully');
    };
    const handlePrint = () => {
        window.print();
        toast.success('Print dialog opened');
    };
    // Calculate Advance summary
    const advanceSummary: AdvanceSummary = useMemo(() => {
        const uniqueEmployees = [...new Set(filteredRecords.map((record) => record.employeeCode))];
        const pendingRequests = filteredRecords.filter((record) => record.status === 'Pending').length;
        const approvedRequests = filteredRecords.filter(
            (record) => record.status === 'Approved' || record.status.includes('Recovered')
        ).length;
        const rejectedRequests = filteredRecords.filter((record) => record.status === 'Rejected').length;
        const fullyRecoveredRequests = filteredRecords.filter((record) => record.status === 'Fully Recovered').length;
        const summary = filteredRecords.reduce(
            (acc, record) => ({
                totalEmployees: uniqueEmployees.length,
                totalAdvanceRequests: filteredRecords.length,
                totalAdvanceAmount: acc.totalAdvanceAmount + record.advanceAmount,
                totalApprovedAmount: acc.totalApprovedAmount + record.approvedAmount,
                totalRecoveredAmount: acc.totalRecoveredAmount + record.recoveredAmount,
                totalRemainingAmount: acc.totalRemainingAmount + record.remainingAmount,
                pendingRequests: pendingRequests,
                approvedRequests: approvedRequests,
                rejectedRequests: rejectedRequests,
                fullyRecoveredRequests: fullyRecoveredRequests,
                averageAdvanceAmount: 0 // Will be calculated after
            }),
            {
                totalEmployees: 0,
                totalAdvanceRequests: 0,
                totalAdvanceAmount: 0,
                totalApprovedAmount: 0,
                totalRecoveredAmount: 0,
                totalRemainingAmount: 0,
                pendingRequests: 0,
                approvedRequests: 0,
                rejectedRequests: 0,
                fullyRecoveredRequests: 0,
                averageAdvanceAmount: 0
            }
        );
        summary.averageAdvanceAmount = filteredRecords.length > 0 ? Math.round(summary.totalAdvanceAmount / filteredRecords.length) : 0;
        return summary;
    }, [filteredRecords]);
    // Calculate Advance Type summary
    const advanceTypeSummaries: AdvanceTypeSummary[] = useMemo(() => {
        const typeMap = new Map<string, EmployeeAdvanceRecord[]>();
        filteredRecords.forEach((record) => {
            if (!typeMap.has(record.advanceType)) {
                typeMap.set(record.advanceType, []);
            }
            typeMap.get(record.advanceType)!.push(record);
        });
        return Array.from(typeMap.entries())
            .map(([advanceType, records]) => {
                const approvedRecords = records.filter((r) => r.status === 'Approved' || r.status.includes('Recovered'));
                return {
                    advanceType,
                    totalRequests: records.length,
                    totalAmount: records.reduce((sum, r) => sum + r.advanceAmount, 0),
                    approvedRequests: approvedRecords.length,
                    approvedAmount: records.reduce((sum, r) => sum + r.approvedAmount, 0),
                    recoveredAmount: records.reduce((sum, r) => sum + r.recoveredAmount, 0),
                    remainingAmount: records.reduce((sum, r) => sum + r.remainingAmount, 0)
                };
            })
            .sort((a, b) => b.totalAmount - a.totalAmount);
    }, [filteredRecords]);
    return (
        <div className='space-y-6'>
            {/* Report Configuration Section */}
            <AdvanceReportFilters
                filters={filters}
                groupTypes={groupTypes}
                departments={departments}
                designations={designations}
                months={months}
                years={years}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                onCancel={handleCancel}
                isLoading={isLoadingOnload}
            />
            {/* Report Results */}
            {showReport && (
                <div className='space-y-4'>
                    {/* Report Header */}
                    <div className='flex items-center justify-between rounded-lg border bg-card p-4'>
                        <div>
                            <h3 className='font-semibold text-foreground text-lg'>
                                Employee Advance Report - {filters.month} {filters.year}
                            </h3>
                            <p className='text-muted-foreground text-sm'>
                                Total Requests: {filteredRecords.length} | Total Amount: ₹
                                {advanceSummary.totalAdvanceAmount.toLocaleString()} | Pending: {advanceSummary.pendingRequests}
                            </p>
                        </div>
                        <div className='flex gap-2'>
                            <Button variant='outline' onClick={handleExport} prefix={<Download className='size-4' />}>
                                Export
                            </Button>
                            <Button variant='outline' onClick={handlePrint} prefix={<Printer className='size-4' />}>
                                Print
                            </Button>
                        </div>
                    </div>
                    {/* Summary Cards */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                        <Card>
                            <CardHeader className='pb-2'>
                                <CardTitle className='flex items-center gap-1 text-muted-foreground text-sm'>
                                    <Users className='h-3 w-3' />
                                    Total Employees
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='font-semibold text-foreground text-lg'>{advanceSummary.totalEmployees}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='pb-2'>
                                <CardTitle className='flex items-center gap-1 text-muted-foreground text-sm'>
                                    <CreditCard className='h-3 w-3' />
                                    Total Requests
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='font-semibold text-blue-600 text-lg'>{advanceSummary.totalAdvanceRequests}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='pb-2'>
                                <CardTitle className='flex items-center gap-1 text-muted-foreground text-sm'>
                                    <DollarSign className='h-3 w-3' />
                                    Total Amount
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='font-semibold text-lg text-orange-600'>
                                    ₹{advanceSummary.totalAdvanceAmount.toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='pb-2'>
                                <CardTitle className='flex items-center gap-1 text-muted-foreground text-sm'>
                                    <TrendingUp className='h-3 w-3' />
                                    Recovered Amount
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='font-semibold text-green-600 text-lg'>
                                    ₹{advanceSummary.totalRecoveredAmount.toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Advance Type Summary Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2 text-sm'>
                                <CreditCard className='h-4 w-4' />
                                Advance Type Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                isLoading={isLoadingOnload}
                                columns={advanceTypeSummaryColumns}
                                data={advanceTypeSummaries}
                                totalItems={advanceTypeSummaries.length}
                                showViewOptions={true}
                                columnPinning={{ left: ['advanceType'] }}
                            />
                        </CardContent>
                    </Card>
                    {/* Detailed Summary */}
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2 text-sm'>
                                    <Calculator className='h-4 w-4' />
                                    Financial Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-3'>
                                <div className='flex justify-between'>
                                    <span className='text-sm'>Total Advance Amount:</span>
                                    <span className='font-semibold'>₹{advanceSummary.totalAdvanceAmount.toLocaleString()}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-sm'>Total Approved Amount:</span>
                                    <span className='font-semibold text-green-600'>
                                        ₹{advanceSummary.totalApprovedAmount.toLocaleString()}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-sm'>Total Recovered Amount:</span>
                                    <span className='font-semibold text-blue-600'>
                                        ₹{advanceSummary.totalRecoveredAmount.toLocaleString()}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-sm'>Total Remaining Amount:</span>
                                    <span className='font-semibold text-orange-600'>
                                        ₹{advanceSummary.totalRemainingAmount.toLocaleString()}
                                    </span>
                                </div>
                                <div className='flex justify-between border-t pt-2'>
                                    <span className='text-sm'>Average Advance Amount:</span>
                                    <span className='font-semibold text-purple-600'>
                                        ₹{advanceSummary.averageAdvanceAmount.toLocaleString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2 text-sm'>
                                    <FileText className='h-4 w-4' />
                                    Request Status Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-3'>
                                <div className='flex justify-between'>
                                    <span className='text-sm'>Pending Requests:</span>
                                    <span className='font-semibold text-yellow-600'>{advanceSummary.pendingRequests}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-sm'>Approved Requests:</span>
                                    <span className='font-semibold text-green-600'>{advanceSummary.approvedRequests}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-sm'>Rejected Requests:</span>
                                    <span className='font-semibold text-red-600'>{advanceSummary.rejectedRequests}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-sm'>Fully Recovered:</span>
                                    <span className='font-semibold text-blue-600'>{advanceSummary.fullyRecoveredRequests}</span>
                                </div>
                                <div className='flex justify-between border-t pt-2'>
                                    <span className='text-sm'>Report Period:</span>
                                    <span className='font-semibold'>
                                        {filters.month} {filters.year}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Employee Advance Details Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2 text-sm'>
                                <Users className='h-4 w-4' />
                                Employee Advance Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                isLoading={isLoadingOnload}
                                columns={advanceReportColumns}
                                data={filteredRecords}
                                totalItems={filteredRecords.length}
                                showViewOptions={true}
                                columnPinning={{ left: ['id'] }}
                            />
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
