'use server';

import { type ApiResponse, api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    EmployeeInOutReportGetDataResponse,
    EmployeeInOutReportOnloadRequest,
    EmployeeInOutReportOnloadResponse
} from '@/types/hrms/reports/employee-inout-report';

/**
 * Get onload data for employee in-out report
 * This endpoint returns filter dropdowns (types/group types)
 * POST /api/EmployeeInOutReportFacade/getdata
 */
export async function getEmployeeInOutReportOnload(
    MI_Id = 30,
    LoginUserId = 0,
    UserRole = ''
): Promise<ApiResponse<EmployeeInOutReportOnloadResponse>> {
    const url = '/api/EmployeeInOutReportFacade/getdata';
    // Build request body
    const requestBody: EmployeeInOutReportOnloadRequest = {
        page: 1,
        page_size: 10,
        search_query: '',
        search_column: '',
        sort_column: '',
        sort_direction: '',
        is_export: false,
        miid: MI_Id,
        loginUserId: LoginUserId,
        userRole: UserRole
    };
    const response = await api.post<EmployeeInOutReportGetDataResponse>('hrmsfrontoffice', url, requestBody);
    // The backend returns data in ApiResponse format
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        const responseData = response.data;
        if (responseData) {
            const data = responseData as any;
            return {
                success: response.success,
                message: response.message || 'Data loaded successfully',
                data: {
                    types: data.types || [],
                    lieo: data.lieo || null,
                    lateInApproval: data.lateInApproval || null
                }
            };
        }
    }
    // Return empty data if response structure is unexpected
    return {
        success: true,
        message: 'Data loaded successfully',
        data: {
            types: [],
            lieo: null,
            lateInApproval: null
        }
    };
}

/**
 * Get employee in-out report data
 * POST /api/EmployeeInOutReportFacade/search
 */
export async function getEmployeeInOutReport(data: any, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'searchableColumns');
    const url = `/api/EmployeeInOutReportFacade/search?${urlParams}`;
    return await api.post<any>('hrmsfrontoffice', url, data);
}

/**
 * Get employee in-out report list
 * POST /api/EmployeeInOutReportFacade/getdata
 */
export async function getEmployeeInOutReportList(
    searchParams?: ApiSearchparams,
    filterParams?: {
        MIID?: number;
        LoginUserId?: number;
        UserRole?: string;
        is_export?: boolean;
        fromDate?: string;
        toDate?: string;
        typeIdList?: number[];
        departmentIdList?: number[];
        designationIdList?: number[];
        allOrIndividual?: 'All' | 'Individual';
        employeeCode?: string;
        timeInTimeOut?: 'Time In' | 'Time Out' | 'In Out';
    }
) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'searchableColumns');
    const url = `/api/EmployeeInOutReportFacade/getdata?${urlParams}`;
    const requestBody = {
        ...filterParams,
        miid: filterParams?.MIID || 30,
        loginUserId: filterParams?.LoginUserId || 0,
        userRole: filterParams?.UserRole || ''
    };
    return await api.post<any>('hrmsfrontoffice', url, requestBody);
}

/**
 * Get departments for employee in-out report
 * POST /api/EmployeeInOutReportFacade/getdepartments
 */
export async function getEmployeeInOutReportDepartments(MI_Id = 30, UserId = 0, IVRMRT_Id = 0, multipletype = '') {
    const url = '/api/EmployeeInOutReportFacade/getdepartments';
    const requestBody = {
        MI_Id,
        UserId,
        IVRMRT_Id,
        multipletype
    };
    return await api.post<any>('hrmsfrontoffice', url, requestBody);
}

/**
 * Get designations for employee in-out report
 * POST /api/EmployeeInOutReportFacade/getdesignations
 */
export async function getEmployeeInOutReportDesignations(MI_Id = 30, multipledep = '') {
    const url = '/api/EmployeeInOutReportFacade/getdesignations';
    const requestBody = {
        MI_Id,
        multipledep
    };
    return await api.post<any>('hrmsfrontoffice', url, requestBody);
}

/**
 * Get employees for employee in-out report
 * POST /api/EmployeeInOutReportFacade/getemployees
 */
export async function getEmployeeInOutReportEmployees(MI_Id = 30, multipledes = '', multipledep = '', multipletype = '') {
    const url = '/api/EmployeeInOutReportFacade/getemployees';
    const requestBody = {
        MI_Id,
        multipledes,
        multipledep,
        multipletype
    };
    return await api.post<any>('hrmsfrontoffice', url, requestBody);
}
