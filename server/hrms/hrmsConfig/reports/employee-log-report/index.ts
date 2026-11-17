import { type ApiResponse, api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    EmployeeLogReportGetDataResponse,
    EmployeeLogReportOnloadRequest,
    EmployeeLogReportOnloadResponse
} from '@/types/hrms/reports/employee-log-report';

/**
 * Get employee log report data
 * POST /api/EmployeeLogReportFacade/search
 */
export async function getEmployeeLogReportOnload(
    MI_Id = 30,
    LoginUserId = 0,
    UserRole = ''
): Promise<ApiResponse<EmployeeLogReportOnloadResponse>> {
    const url = '/api/EmployeeLogReportFacade/getdata';

    // Build request body
    const requestBody: EmployeeLogReportOnloadRequest = {
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

    const response = await api.post<EmployeeLogReportGetDataResponse>('hrmsfrontoffice', url, requestBody);

    // The backend returns data in ApiResponse format
    // Structure: { success: true, message: "OK", data: { types: [...] }, total: 0, page: 1, page_size: 10 }
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        const responseData = response.data;

        if (responseData) {
            // The data property of EmployeeLogReportGetDataResponse is EmployeeLogReportOnloadResponse
            // But sometimes the API structure might be slightly different, so we ensure we return the inner data
            return {
                success: response.success,
                message: response.message || 'Data loaded successfully',
                data: responseData.data
            };
        }
    }

    // Return empty data if response structure is unexpected
    return {
        success: false,
        message: 'Failed to load data',
        data: {
            types: [],
            months: null,
            years: null
        }
    };
}

/**
 * Get employee log report data with pagination, search, and sort
 * TODO: Replace this with the actual search endpoint once provided
 * This is a placeholder that will be updated when the search endpoint is available
 */
export async function getEmployeeLogReportList(
    searchParams?: ApiSearchparams,
    filterParams?: {
        MIID?: number;
        LoginUserId?: number;
        UserRole?: string;
        is_export?: boolean;
        typeIdList?: number[];
        departmentIdList?: number[];
        designationIdList?: number[];
        allOrIndividual?: 'All' | 'Individual';
        employeeCode?: string;
        employeeName?: string;
        codeOrName?: 'Code' | 'Name';
        dateMode?: 'Date' | 'Monthly' | 'From Date';
        date?: string;
        fromDate?: string;
        toDate?: string;
        month?: string;
        year?: string;
    }
): Promise<ApiResponse<any>> {
    const url = '/api/EmployeeLogReportFacade/search';

    // Build request body with pagination, search, sort, and filter params
    const requestBody: any = {
        page: searchParams?.page || 1,
        page_size: searchParams?.page_size || 10,
        search_query: searchParams?.search_query || '',
        search_column: searchParams?.search_column || '',
        sort_column: searchParams?.sort_column || '',
        sort_direction: searchParams?.sort_direction || '',
        is_export: filterParams?.is_export || false,
        miid: filterParams?.MIID || 30,
        loginUserId: filterParams?.LoginUserId || 0,
        userRole: filterParams?.UserRole || ''
    };

    // Add filter parameters
    if (filterParams?.typeIdList && filterParams.typeIdList.length > 0) {
        requestBody.typeIdList = filterParams.typeIdList;
    }
    if (filterParams?.departmentIdList && filterParams.departmentIdList.length > 0) {
        requestBody.departmentIdList = filterParams.departmentIdList;
    }
    if (filterParams?.designationIdList && filterParams.designationIdList.length > 0) {
        requestBody.designationIdList = filterParams.designationIdList;
    }
    if (filterParams?.allOrIndividual) {
        requestBody.allOrIndividual = filterParams.allOrIndividual;
    }
    if (filterParams?.employeeCode) {
        requestBody.employeeCode = filterParams.employeeCode;
    }
    if (filterParams?.employeeName) {
        requestBody.employeeName = filterParams.employeeName;
    }
    if (filterParams?.codeOrName) {
        requestBody.codeOrName = filterParams.codeOrName;
    }
    if (filterParams?.dateMode) {
        requestBody.dateMode = filterParams.dateMode;
    }
    if (filterParams?.date) {
        requestBody.date = filterParams.date;
    }
    if (filterParams?.fromDate) {
        requestBody.fromDate = filterParams.fromDate;
    }
    if (filterParams?.toDate) {
        requestBody.toDate = filterParams.toDate;
    }
    if (filterParams?.month) {
        requestBody.month = filterParams.month;
    }
    if (filterParams?.year) {
        requestBody.year = filterParams.year;
    }

    // TODO: Uncomment and update when search endpoint is available
    // const response = await api.post<any>('hrmsfrontoffice', url, requestBody);

    // For now, return empty response until search endpoint is provided
    return {
        success: false,
        message: 'Search endpoint not yet configured. Please provide the search endpoint URL.',
        data: {
            rows: [],
            total: 0,
            page: searchParams?.page || 1,
            page_size: searchParams?.page_size || 10
        }
    };
}

/**
 * Get employee log report data (Legacy/Alternative)
 * POST /api/EmployeeLogReportFacade/search
 */
export async function getEmployeeLogReport(data: any, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'searchableColumns');
    const url = `/api/EmployeeLogReportFacade/search?${urlParams}`;
    return await api.post<any>('hrmsfrontoffice', url, data);
}
