'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import {
    getCumulativeSalaryReport,
    getDepartmentsByGroupType,
    getDesignationsByGroupAndDept,
    getGroupTypes,
    type CumulativeSalaryReportRequest
} from '@/server/hrms/reports/cumulative-salary-report';
import {
    getDepartmentSalaryReport,
    type DepartmentSalaryReportRequest
} from '@/server/hrms/reports/department-salary-report';
import {
    getEmployeeAdvanceReportOnload,
    searchEmployeeAdvanceReport
} from '@/server/hrms/hrmsConfig/reports/advance-report';
import {
    getEmployeeContributionReportOnload,
    searchEmployeeContributionDetails
} from '@/server/hrms/hrmsConfig/reports/employee-contribution-report';
import {
    getBankCashReportOnload,
    searchBankCashReport
} from '@/server/hrms/hrmsConfig/reports/bank-cash-report';
import {
    getMasterDepartments,
    getMasterDesignations,
    getMasterEmployeeTypes,
    getMasterGroupTypes,
    getMasterMonths,
    getMasterPaymentModeList,
    getMasterYears,
    type MasterDropdown
} from '@/server/hrms/master';
import {
    getEmployeeStrengthReportOnload,
    searchEmployeeStrengthReport,
} from '@/server/hrms/hrmsConfig/reports/employee-strength-report';
import {
    getEmployeesByFilter,
    getEmployeeLetterDetails
} from '@/server/hrms/reports/employee-offer-letter';
import {
    getESIReportOnload,
    searchESIReport
} from '@/server/hrms/hrmsConfig/reports/esi-report';
import {
    getPFChallan,
    getESIReport,
    getPFForm10,
    getPFForm5,
    getPFForm6A,
    type ESIReportRequest,
    type PFForm10Request,
    type PFForm5Request,
    type PFChallanRequest,
    type PFForm6ARequest
} from '@/server/hrms/reports/esi-pf-reports';
import {
    getPFChallanReportOnload,
} from '@/server/hrms/hrmsConfig/reports/pf-challan-report';
import {
    getSalarySlipOnload,
    filterEmployeesByYearMonth,
    generateSalarySlip
} from '@/server/hrms/hrmsConfig/reports/salary-slip-report';
import {
    getYearWiseSalaryDetails,
    getMonthWiseSalaryDetails,
    type YearWiseSalaryResponse,
    type MonthWiseSalaryResponse
} from '@/server/hrms/reports/employee-salary-details';
import type {
    SalarySlipFilterRequest,
    SalarySlipGenerateRequest
} from '@/types/hrms/reports/salary-slip-report';
import { toast } from 'sonner';


export function useCumulativeSalaryReport() {
    return useMutation({
        mutationFn: (data: CumulativeSalaryReportRequest) => getCumulativeSalaryReport(data),
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to fetch report');
        }
    });
}

export function useReportGroupTypes() {
    return useQuery({
        queryKey: ['report-group-types'],
        queryFn: () => getGroupTypes(),
        staleTime: 1000 * 60 * 10
    });
}

export function useReportDepartments(groupTypeIds: string) {
    return useQuery({
        queryKey: ['report-departments', groupTypeIds],
        queryFn: () => getDepartmentsByGroupType(groupTypeIds),
        enabled: !!groupTypeIds && groupTypeIds.length > 0,
        staleTime: 1000 * 60 * 5
    });
}

export function useReportDesignations(groupTypeIds: string, deptIds: string) {
    return useQuery({
        queryKey: ['report-designations', groupTypeIds, deptIds],
        queryFn: () => getDesignationsByGroupAndDept(groupTypeIds, deptIds),
        enabled: !!groupTypeIds && !!deptIds,
        staleTime: 1000 * 60 * 5
    });
}


export function useDepartmentSalaryReport() {
    return useMutation({
        mutationFn: (data: DepartmentSalaryReportRequest) => getDepartmentSalaryReport(data),
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to fetch report');
        }
    });
}

/**
 * Hook for Employee Advance Report Onload
 */
export function useEmployeeAdvanceReportOnload(MI_Id: number, LogInUserId: number) {
    return useQuery({
        queryKey: ['employee-advance-report-onload', MI_Id, LogInUserId],
        queryFn: () => getEmployeeAdvanceReportOnload(MI_Id, LogInUserId),
        staleTime: 1000 * 60 * 10
    });
}

/**
 * Hook for Bank Cash Report Onload
 */
export function useBankCashReportOnload(MI_Id: number, LogInUserId: number) {
    return useQuery({
        queryKey: ['bank-cash-report-onload', MI_Id, LogInUserId],
        queryFn: () => getBankCashReportOnload(MI_Id, LogInUserId),
        staleTime: 1000 * 60 * 10
    });
}

/**
 * Hook for searching Bank Cash Report
 */
export function useSearchBankCashReport() {
    return useMutation({
        mutationFn: (data: any) => searchBankCashReport(data),
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to search bank cash report');
        }
    });
}

export function useMasterGroupTypes() {
    return useQuery({
        queryKey: ['master-group-types'],
        queryFn: () => getMasterGroupTypes(),
        staleTime: 1000 * 60 * 10
    });
}

export function useMasterDepartments() {
    return useQuery({
        queryKey: ['master-departments'],
        queryFn: () => getMasterDepartments(),
        staleTime: 1000 * 60 * 10
    });
}

export function useMasterDesignations() {
    return useQuery({
        queryKey: ['master-designations'],
        queryFn: () => getMasterDesignations(),
        staleTime: 1000 * 60 * 10
    });
}

export function useMasterMonths() {
    return useQuery({
        queryKey: ['master-months'],
        queryFn: () => getMasterMonths(),
        staleTime: 1000 * 60 * 10
    });
}

export function useMasterYears() {
    return useQuery({
        queryKey: ['master-years'],
        queryFn: () => getMasterYears(),
        staleTime: 1000 * 60 * 10
    });
}

export function useMasterPaymentModeList() {
    return useQuery({
        queryKey: ['master-payment-mode-list'],
        queryFn: () => getMasterPaymentModeList(),
        staleTime: 1000 * 60 * 10
    });
}

export function useMasterEmployeeTypes() {
    return useQuery({
        queryKey: ['master-employee-types'],
        queryFn: () => getMasterEmployeeTypes(),
        staleTime: 1000 * 60 * 10
    });
}

/**
 * Hook for searching Employee Advance Report
 */
export function useSearchEmployeeAdvanceReport() {
    return useMutation({
        mutationFn: (data: any) => searchEmployeeAdvanceReport(data),
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to search employee advance report');
        }
    });
}

export function useEmployeeStrengthReport() {
    return useMutation({
        mutationFn: (data: any) => searchEmployeeStrengthReport(data),
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to fetch strength report');
        }
    });
}

export function useEmployeeStrengthOnload(MI_Id: number, LogInUserId: number) {
    return useQuery({
        queryKey: ['employee-strength-report-onload', MI_Id, LogInUserId],
        queryFn: () => getEmployeeStrengthReportOnload(MI_Id, LogInUserId),
        staleTime: 1000 * 60 * 10
    });
}

export function useReportEmployees(designationId: number, deptId: number, groupTypeId: number) {
    return useQuery({
        queryKey: ['report-employees-filter', designationId, deptId, groupTypeId],
        queryFn: () => getEmployeesByFilter(designationId, deptId, groupTypeId),
        enabled: !!designationId && !!deptId && !!groupTypeId,
        staleTime: 1000 * 60 * 5
    });
}

export function useEmployeeLetterDetails() {
    return useMutation({
        mutationFn: ({ designationId, deptId, groupTypeId, employeeId }: { designationId: number, deptId: number, groupTypeId: number, employeeId: number }) =>
            getEmployeeLetterDetails(designationId, deptId, groupTypeId, employeeId),
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to fetch details');
        }
    });
}

export function useESIReport() {
    return useMutation({
        mutationFn: (data: ESIReportRequest) => getESIReport(data),
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to fetch ESI report');
        }
    });
}

export function useESIReportOnload(MI_Id: number, LogInUserId: number) {
    return useQuery({
        queryKey: ['esi-report-onload', MI_Id, LogInUserId],
        queryFn: () => getESIReportOnload(MI_Id, LogInUserId),
        staleTime: 1000 * 60 * 10
    });
}

export function usePFForm10() {
    return useMutation({
        mutationFn: (data: PFForm10Request) => getPFForm10(data),
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to fetch PF Form 10');
        }
    });
}

export function usePFForm5() {
    return useMutation({
        mutationFn: (data: PFForm5Request) => getPFForm5(data),
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to fetch PF Form 5');
        }
    });
}

export function usePFChallan() {
    return useMutation({
        mutationFn: (data: PFChallanRequest) => getPFChallan(data),
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to fetch PF Challan');
        }
    });
}

export function usePFChallanOnload(MI_Id: number) {
    return useQuery({
        queryKey: ['pf-challan-onload', MI_Id],
        queryFn: () => getPFChallanReportOnload(MI_Id),
        staleTime: 1000 * 60 * 10
    });
}

export function usePFForm6A() {
    return useMutation({
        mutationFn: (data: PFForm6ARequest) => getPFForm6A(data),
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to fetch PF Form 6A');
        }
    });
}

export function useEmployeeContributionOnload(MI_Id: number, LogInUserId: number) {
    return useQuery({
        queryKey: ['employee-contribution-onload', MI_Id, LogInUserId],
        queryFn: () => getEmployeeContributionReportOnload(MI_Id, LogInUserId),
        staleTime: 1000 * 60 * 10
    });
}

export function useSearchEmployeeContribution() {
    return useMutation({
        mutationFn: (data: any) => searchEmployeeContributionDetails(data),
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to fetch employee contribution');
        }
    });
}

/**
 * Hook for Salary Slip Onload
 */
export function useSalarySlipOnload(MI_Id: number, LogInUserId: number) {
    return useQuery({
        queryKey: ['salary-slip-onload', MI_Id, LogInUserId],
        queryFn: () => getSalarySlipOnload(MI_Id, LogInUserId),
        staleTime: 1000 * 60 * 10
    });
}

/**
 * Hook for Filtering Employees for Salary Slip
 */
export function useFilterEmployeesByYearMonth() {
    return useMutation({
        mutationFn: (data: SalarySlipFilterRequest) => filterEmployeesByYearMonth(data),
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to filter employees');
        }
    });
}

/**
 * Hook for Generating Salary Slip
 */
export function useGenerateSalarySlip() {
    return useMutation({
        mutationFn: (data: SalarySlipGenerateRequest) => generateSalarySlip(data),
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to generate salary slip');
        }
    });
}

/**
 * Hook for Year-wise Employee Salary Details
 */
export function useYearWiseSalaryDetails(year: string) {
    return useQuery({
        queryKey: ['year-wise-salary-details', year],
        queryFn: () => getYearWiseSalaryDetails(year),
        enabled: !!year,
        staleTime: 1000 * 60 * 5
    });
}

/**
 * Hook for Month-wise Employee Salary Details (Department breakdown)
 */
export function useMonthWiseSalaryDetails(year: string, month: string) {
    return useQuery({
        queryKey: ['month-wise-salary-details', year, month],
        queryFn: () => getMonthWiseSalaryDetails(year, month),
        enabled: !!year && !!month,
        staleTime: 1000 * 60 * 5
    });
}

