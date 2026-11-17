'use client';

import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import {
    useReportGroupTypes,
    useReportDepartments,
    useReportDesignations,
    useSalarySlipOnload,
    useFilterEmployeesByYearMonth,
    useGenerateSalarySlip
} from '@/hooks/hrms/useReports';
import { useLeaveYearDropdown } from '@/hooks/hrms/useMasters';
import { SalarySlipFilters, type SalarySlipFilters as SalarySlipFiltersType } from './_components/filters';
import { SalarySlipTemplate } from './_components/salary-slip-template';
import { printSalarySlips } from './_components/print-utils';
import type { EmployeeSalarySlipDisplay } from './_components/columns';
import { Loader2, Printer, Mail, MessageSquare, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MONTH_LIST = [
    { id: 1, name: 'January' }, { id: 2, name: 'February' }, { id: 3, name: 'March' },
    { id: 4, name: 'April' }, { id: 5, name: 'May' }, { id: 6, name: 'June' },
    { id: 7, name: 'July' }, { id: 8, name: 'August' }, { id: 9, name: 'September' },
    { id: 10, name: 'October' }, { id: 11, name: 'November' }, { id: 12, name: 'December' }
];

export default function SalarySlipPage() {
    const [filters, setFilters] = useState<SalarySlipFiltersType>({
        groupType: [],
        department: [],
        designation: [],
        month: '',
        year: '',
        slipPerPage: '1',
        options: {
            lopDays: false,
            leaveDetails: false,
            panCardNo: false,
            bankDetails: false,
        }
    });

    const [employees, setEmployees] = useState<EmployeeSalarySlipDisplay[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [reportData, setReportData] = useState<any>(null);
    const [showReport, setShowReport] = useState(false);
    const [institutionDetails, setInstitutionDetails] = useState({
        name: '',
        address: '',
        logo: ''
    });

    // Cascading Dropdown Hooks
    const { data: yearsData } = useLeaveYearDropdown();
    const { data: groupTypesData } = useReportGroupTypes();

    const groupTypeIds = filters.groupType?.join(',') || '';
    const { data: departmentsData } = useReportDepartments(groupTypeIds);

    const deptIds = filters.department?.join(',') || '';
    const { data: designationsData } = useReportDesignations(groupTypeIds, deptIds);

    const { data: onloadData, isLoading: isOnloadLoading } = useSalarySlipOnload(30, 0);
    const { mutate: filterEmployees, isPending: isFiltering } = useFilterEmployeesByYearMonth();
    const { mutate: generateSlip, isPending: isGenerating } = useGenerateSalarySlip();

    useEffect(() => {
        if (onloadData?.data?.institutionDetails?.[0]) {
            const inst = onloadData.data.institutionDetails[0];
            setInstitutionDetails({
                name: inst.mI_Name || '',
                address: inst.mI_Address1 || '',
                logo: inst.mI_Logo || ''
            });
        }
    }, [onloadData]);

    const handleFilterChange = (newFilters: SalarySlipFiltersType) => {
        setFilters(newFilters);

        if (newFilters.year && newFilters.month) {
            filterEmployees({
                MI_Id: 30,
                LogInUserId: 0,
                hreS_Year: newFilters.year,
                hreS_Month: newFilters.month,
                hrmgt_ids: newFilters.groupType.join(','),
                hrmd_ids: newFilters.department.join(','),
                hrmdes_ids: newFilters.designation.join(',')
            }, {
                onSuccess: (res) => {
                    if (res.success && res.data) {
                        const empList = Array.isArray(res.data) ? res.data : (res.data as any).data || [];
                        const mapped = empList.map((emp: any, index: number) => ({
                            id: index + 1,
                            employeeCode: emp.hrmE_EmployeeCode || emp.HRME_EmployeeCode,
                            employeeName: `${emp.hrmE_EmployeeFirstName || emp.HRME_EmployeeFirstName} ${emp.hrmE_EmployeeMiddleName || emp.HRME_EmployeeMiddleName || ''} ${emp.hrmE_EmployeeLastName || emp.HRME_EmployeeLastName || ''}`.trim(),
                            groupTypeId: emp.hrmgT_Id || emp.HRMGT_Id,
                            departmentId: emp.hrmD_Id || emp.HRMD_Id,
                            designationId: emp.hrmdeS_Id || emp.HRMDES_Id,
                            HRME_Id: emp.hrmE_Id || emp.HRME_Id,
                            isSelected: false
                        }));
                        setEmployees(mapped);
                    } else {
                        setEmployees([]);
                    }
                }
            });
        }
    };

    const filteredEmployeesList = useMemo(() => {
        return employees.filter(emp => {
            const matchGroup = filters.groupType.length === 0 || filters.groupType.includes(emp.groupTypeId);
            const matchDept = filters.department.length === 0 || filters.department.includes(emp.departmentId);
            const matchDesig = filters.designation.length === 0 || filters.designation.includes(emp.designationId);
            const matchSearch = searchTerm === '' ||
                emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());
            return matchGroup && matchDept && matchDesig && matchSearch;
        });
    }, [employees, filters.groupType, filters.department, filters.designation, searchTerm]);

    const selectedCount = filteredEmployeesList.filter(e => e.isSelected).length;

    const handleSelectAll = (checked: boolean) => {
        setEmployees(prev => prev.map(emp => {
            const isVisible = filteredEmployeesList.some(fe => fe.HRME_Id === emp.HRME_Id);
            if (isVisible) {
                return { ...emp, isSelected: checked };
            }
            return emp;
        }));
    };

    const handleSelectEmployee = (id: number, checked: boolean) => {
        setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, isSelected: checked } : emp));
    };

    const handleOptionChange = (option: keyof SalarySlipFiltersType['options'], checked: boolean) => {
        setFilters(prev => ({
            ...prev,
            options: { ...prev.options, [option]: checked }
        }));
    };

    const handleGenerateSlip = () => {
        const selectedEmpIds = employees.filter(e => e.isSelected).map(e => e.HRME_Id);
        if (selectedEmpIds.length === 0) {
            toast.error('Please select at least one employee');
            return;
        }

        generateSlip({
            MI_Id: 30,
            hreS_Year: filters.year,
            hreS_Month: filters.month,
            empid: selectedEmpIds,
            hrmdeS_IdList: filters.designation,
            hrmD_IdList: filters.department,
            groupTypeIdList: filters.groupType
        }, {
            onSuccess: (res) => {
                if (res.success && res.data?.salarySlipList && res.data.salarySlipList.length > 0) {
                    // Update institution details from the first slip if available
                    const firstSlip = res.data.salarySlipList[0];
                    const inst = firstSlip.institutionDetails;
                    if (inst) {
                        setInstitutionDetails({
                            name: inst.mI_Name || inst.institutionname || institutionDetails.name,
                            address: inst.mI_Address1 || institutionDetails.address,
                            logo: inst.mI_Logo || institutionDetails.logo
                        });
                    }

                    const mappedReports = res.data.salarySlipList.map((rawData: any) => {
                        const empDetails = rawData.currentemployeeDetails;
                        const earningsDeductions = rawData.employeeSalaryslipDetails || rawData.earningdeductiondetails || [];

                        const earningsList = earningsDeductions.filter((item: any) =>
                            item.hrmeD_EarnDedFlag === 'Earning' || item.hrmeD_EarnDedFlag === 'E'
                        );
                        const deductionsList = earningsDeductions.filter((item: any) =>
                            item.hrmeD_EarnDedFlag === 'Deduction' || item.hrmeD_EarnDedFlag === 'D'
                        );

                        const totalEarnings = earningsList.reduce((acc: number, curr: any) => acc + (curr.amount || curr.hreeD_Amount || 0), 0);
                        const totalDeductions = deductionsList.reduce((acc: number, curr: any) => acc + (curr.amount || curr.hreeD_Amount || 0), 0);

                        return {
                            employeeName: `${empDetails?.hrmE_EmployeeFirstName || ''} ${empDetails?.hrmE_EmployeeMiddleName || ''} ${empDetails?.hrmE_EmployeeLastName || ''}`.trim(),
                            employeeCode: empDetails?.hrmE_EmployeeCode || '-',
                            designation: rawData.designationName || empDetails?.hrmdeS_DesignationName,
                            payLevel: empDetails?.hrmP_SalaryType || '-',
                            bankName: empDetails?.hrmE_PaymentType || '-',
                            bankAccountNo: empDetails?.hrmE_BankAccountNo || '-',
                            pfNo: empDetails?.hrmE_PFAccNo || '-',
                            esiNo: empDetails?.hrmE_ESIAccNo || '-',
                            panNo: empDetails?.hrmE_PANCardNo || '-',
                            lopDays: rawData.lopdays || 0,
                            earnings: earningsList.map((e: any) => ({
                                name: e.hrmeD_Name || e.hreeD_EarnDedName,
                                amount: e.amount || e.hreeD_Amount
                            })),
                            deductions: deductionsList.map((d: any) => ({
                                name: d.hrmeD_Name || d.hreeD_EarnDedName,
                                amount: d.amount || d.hreeD_Amount
                            })),
                            grossPay: totalEarnings || rawData.empGrossSal || 0,
                            totalDeduction: totalDeductions,
                            netPayable: (totalEarnings || rawData.empGrossSal || 0) - totalDeductions,
                            amountInWords: rawData.NetAmountInwords || '',
                            leaveDetails: (rawData.employeeLeaveDetails || []).map((l: any, idx: number) => ({
                                serialNo: idx + 1,
                                leaveName: l.hrmL_LeaveName,
                                totalLeaves: l.hrelS_TotalLeaves,
                                availedLeaves: l.hrelS_TransLeaves,
                                balanceLeaves: l.hrelS_CBLeaves
                            }))
                        };
                    });

                    setReportData(mappedReports);
                    setShowReport(true);
                    toast.success(`Successfully generated ${mappedReports.length} salary slip(s)`);
                } else {
                    toast.error(res.message || 'No salary slip data found for the selected criteria');
                }
            }
        });
    };

    const handlePrint = () => {
        if (!reportData) return;
        const slips = Array.isArray(reportData) ? reportData : [reportData];
        const monthName = MONTH_LIST.find(m => m.id.toString() === filters.month.toString())?.name || filters.month;
        printSalarySlips(slips, institutionDetails, monthName, filters.year);
    };

    if (isOnloadLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading Page...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Salary Slip</h1>
            </div>

            {!showReport ? (
                <SalarySlipFilters
                    filters={filters}
                    groupTypes={groupTypesData?.data || []}
                    departments={departmentsData?.data || []}
                    designations={designationsData?.data || []}
                    months={MONTH_LIST}
                    years={yearsData?.data || []}
                    employees={employees}
                    filteredEmployees={filteredEmployeesList}
                    searchTerm={searchTerm}
                    selectedCount={selectedCount}
                    isLoading={isFiltering || isGenerating}
                    onFilterChange={handleFilterChange}
                    onSearchChange={setSearchTerm}
                    onOptionChange={handleOptionChange}
                    onSelectAll={handleSelectAll}
                    onSelectEmployee={handleSelectEmployee}
                    onGenerateSlip={handleGenerateSlip}
                    onCancel={() => { }}
                />
            ) : (
                <div className="space-y-6">
                    {/* Global Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm print:hidden">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setShowReport(false)}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Filters
                            </Button>
                            <div className="h-6 w-px bg-border mx-2" />
                            <h3 className="font-semibold">Salary Slips ({Array.isArray(reportData) ? reportData.length : 0})</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button variant="outline" onClick={() => setShowReport(false)}>
                                <X className="h-4 w-4 mr-2" />
                                CANCEL
                            </Button>

                            <Button variant="default" onClick={handlePrint}>
                                <Printer className="h-4 w-4 mr-2" />
                                PRINT ALL
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-8 print:space-y-0">
                        {Array.isArray(reportData) ? (
                            reportData.map((data, index) => (
                                <div key={index} className={index > 0 ? "print:break-before-page pt-8 print:pt-0" : ""}>
                                    <SalarySlipTemplate
                                        schoolName={institutionDetails.name}
                                        schoolAddress={institutionDetails.address}
                                        schoolLogo={institutionDetails.logo}
                                        month={filters.month}
                                        year={filters.year}
                                        salarySlipData={data}
                                        showLopDays={filters.options.lopDays}
                                        showLeaveDetails={filters.options.leaveDetails}
                                        showPanCardNo={filters.options.panCardNo}
                                        showBankDetails={filters.options.bankDetails}
                                        showActions={false}
                                        onPrint={() => window.print()}
                                        onSendMail={() => { }}
                                        onSendSMS={() => { }}
                                        onCancel={() => setShowReport(false)}
                                    />
                                </div>
                            ))
                        ) : (
                            <SalarySlipTemplate
                                schoolName={institutionDetails.name}
                                schoolAddress={institutionDetails.address}
                                schoolLogo={institutionDetails.logo}
                                month={filters.month}
                                year={filters.year}
                                salarySlipData={reportData}
                                showLopDays={filters.options.lopDays}
                                showLeaveDetails={filters.options.leaveDetails}
                                showPanCardNo={filters.options.panCardNo}
                                showBankDetails={filters.options.bankDetails}
                                showActions={false}
                                onPrint={() => window.print()}
                                onSendMail={() => { }}
                                onSendSMS={() => { }}
                                onCancel={() => setShowReport(false)}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
