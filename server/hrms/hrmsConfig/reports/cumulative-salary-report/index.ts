'use server';
import { type ApiResponse, api } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    CumulativeSalaryReportListRequest,
    CumulativeSalaryReportListResponse,
    CumulativeSalaryReportOnloadResponse,
    CumulativeSalaryReportSearchRequest,
    CumulativeSalaryReportSearchResponse,
    DesignationDropdown,
    SalaryReportRecord
} from '@/types/hrms/reports/cumulative-salary-report';
/**
 * Get onload data for cumulative salary report
 * POST /api/CumulativeSalaryReportFacade/onloadgetdetails
 * Returns dropdown data (group types, departments, designations, months, years) and initial rows
 */
export async function getCumulativeSalaryReportOnload(
    MI_Id = 30,
    LoginUserId = 0,
    UserRole = '',
    is_export = false,
    page = 1,
    page_size = 10
): Promise<ApiResponse<CumulativeSalaryReportOnloadResponse>> {
    const url = '/api/CumulativeSalaryReportFacade/onloadgetdetails';
    // Build request body matching the exact API structure
    const requestBody: CumulativeSalaryReportListRequest = {
        page,
        page_size,
        search_query: '',
        search_column: '',
        sort_column: '',
        sort_direction: '',
        is_export,
        MIID: MI_Id,
        LoginUserId,
        UserRole
    };
    const response = await api.post<any>('hrms', url, requestBody);
    // The backend returns data in ApiResponse format
    // Structure: { success: true, message: "Success", data: { dropdown: {...}, rows: [...] }, total, page, page_size }
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        const dropdownData = response.data?.dropdown;
        if (dropdownData) {
            return {
                success: response.success,
                message: response.message || 'Data loaded successfully',
                data: {
                    MI_Id: dropdownData.MI_Id || MI_Id,
                    groupTypedropdownlist: dropdownData.groupTypedropdownlist || [],
                    departmentdropdownlist: dropdownData.departmentdropdownlist || [],
                    designationdropdownlist: dropdownData.designationdropdownlist || [],
                    monthdropdown: dropdownData.monthdropdown || [],
                    leaveyeardropdown: dropdownData.leaveyeardropdown || []
                }
            };
        }
    }
    // Return empty dropdowns if response structure is unexpected
    return {
        success: false,
        message: 'Failed to load data',
        data: {
            MI_Id: MI_Id,
            groupTypedropdownlist: [],
            departmentdropdownlist: [],
            designationdropdownlist: [],
            monthdropdown: [],
            leaveyeardropdown: []
        }
    };
}
/**
 * Get full onload data for cumulative salary report including rows
 * POST /api/CumulativeSalaryReportFacade/onloadgetdetails
 * Returns complete response with dropdown data and rows (designations or other data)
 */
export async function getCumulativeSalaryReportOnloadFull(
    MI_Id = 30,
    LoginUserId = 0,
    UserRole = '',
    is_export = false,
    page = 1,
    page_size = 10
): Promise<ApiResponse<CumulativeSalaryReportListResponse>> {
    const url = '/api/CumulativeSalaryReportFacade/onloadgetdetails';
    // Build request body matching the exact API structure
    const requestBody: CumulativeSalaryReportListRequest = {
        page,
        page_size,
        search_query: '',
        search_column: '',
        sort_column: '',
        sort_direction: '',
        is_export,
        MIID: MI_Id,
        LoginUserId,
        UserRole
    };
    const response = await api.post<any>('hrms', url, requestBody);
    // The backend returns data in ApiResponse format
    // Structure: { success: true, message: "Success", data: { dropdown: {...}, rows: [...] }, total, page, page_size }
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        const dropdownData = response.data?.dropdown;
        const rows = response.data?.rows || [];
        if (dropdownData) {
            return {
                success: response.success,
                message: response.message || 'Data loaded successfully',
                data: {
                    data: {
                        dropdown: {
                            MI_Id: dropdownData.MI_Id || MI_Id,
                            groupTypedropdownlist: dropdownData.groupTypedropdownlist || [],
                            departmentdropdownlist: dropdownData.departmentdropdownlist || [],
                            designationdropdownlist: dropdownData.designationdropdownlist || [],
                            monthdropdown: dropdownData.monthdropdown || [],
                            leaveyeardropdown: dropdownData.leaveyeardropdown || []
                        },
                        rows: rows as DesignationDropdown[] | SalaryReportRecord[]
                    },
                    total: response.total || 0,
                    page: (typeof response.page === 'number' ? response.page : page) || page,
                    page_size: (typeof response.page_size === 'number' ? response.page_size : page_size) || page_size
                }
            };
        }
    }
    // Return empty response if structure is unexpected
    return {
        success: false,
        message: 'Failed to load data',
        data: {
            data: {
                dropdown: {
                    MI_Id: MI_Id,
                    groupTypedropdownlist: [],
                    departmentdropdownlist: [],
                    designationdropdownlist: [],
                    monthdropdown: [],
                    leaveyeardropdown: []
                },
                rows: []
            },
            total: 0,
            page: page,
            page_size: page_size
        }
    };
}
/**
 * Search cumulative salary report by selection criteria
 * POST /api/CumulativeSalaryReportFacade/GetEmployeedetailsBySelection
 * Returns employee salary report data based on filters (year, month, designations, departments, group types)
 */
export async function searchCumulativeSalaryReport(
    requestBody: CumulativeSalaryReportSearchRequest
): Promise<ApiResponse<CumulativeSalaryReportSearchResponse>> {
    const url = '/api/CumulativeSalaryReportFacade/GetEmployeedetailsBySelection';
    // Prepare request body - ensure arrays are [0] when empty, as API expects
    const request: CumulativeSalaryReportSearchRequest = {
        MI_Id: requestBody.MI_Id || 30,
        HRES_Year: requestBody.HRES_Year || '',
        HRES_Month: requestBody.HRES_Month || '',
        hrmdeS_IdList: requestBody.hrmdeS_IdList && requestBody.hrmdeS_IdList.length > 0 ? requestBody.hrmdeS_IdList : [],
        hrmD_IdList: requestBody.hrmD_IdList && requestBody.hrmD_IdList.length > 0 ? requestBody.hrmD_IdList : [],
        groupTypeIdList: requestBody.groupTypeIdList && requestBody.groupTypeIdList.length > 0 ? requestBody.groupTypeIdList : [],
        LogInUserId: requestBody.LogInUserId || 0
    };
    console.log('🔵 [CUMULATIVE SALARY] Server action - searchCumulativeSalaryReport called', {
        url,
        request,
        timestamp: new Date().toISOString()
    });
    try {
        const response = await api.post<CumulativeSalaryReportSearchResponse>('hrms', url, request);
        console.log('🔵 [CUMULATIVE SALARY] Server action - API response received', {
            hasResponse: !!response,
            responseType: typeof response,
            hasSuccess: response && typeof response === 'object' && 'success' in response,
            timestamp: new Date().toISOString()
        });
        // The backend returns raw data, not wrapped in ApiResponse format
        // Wrap it to match the expected ApiResponse structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped
            return response as ApiResponse<CumulativeSalaryReportSearchResponse>;
        }
        // Wrap raw response data
        const rawResponse = response as unknown as CumulativeSalaryReportSearchResponse;
        return {
            success: true,
            message: rawResponse?.retrunMsg || 'Search completed successfully',
            data: rawResponse
        };
    } catch (error: any) {
        console.error('🔴 [CUMULATIVE SALARY] Server action - API error:', {
            error,
            message: error?.message,
            status: error?.status,
            statusText: error?.statusText,
            response: error?.response,
            request: {
                url,
                body: request
            },
            timestamp: new Date().toISOString()
        });
        // Return error response
        return {
            success: false,
            message: error?.message || 'Failed to fetch cumulative salary report data',
            data: null as any
        };
    }
}
/**
 * Get cumulative salary report data with pagination, search, and sort
 * This function provides a wrapper around searchCumulativeSalaryReport for compatibility
 */
export async function getCumulativeSalaryReportList(
    searchParams?: ApiSearchparams,
    filterParams?: {
        MIID?: number;
        LoginUserId?: number;
        UserRole?: string;
        is_export?: boolean;
        // Filter parameters for salary report
        month?: string;
        year?: string;
        groupTypeIdList?: number[];
        hrmD_IdList?: number[];
        hrmdeS_IdList?: number[];
    }
): Promise<ApiResponse<CumulativeSalaryReportListResponse>> {
    // Convert filter params to search request format
    const searchRequest: CumulativeSalaryReportSearchRequest = {
        MI_Id: filterParams?.MIID || 30,
        HRES_Year: filterParams?.year || '',
        HRES_Month: filterParams?.month || '',
        hrmdeS_IdList: filterParams?.hrmdeS_IdList || [],
        hrmD_IdList: filterParams?.hrmD_IdList || [],
        groupTypeIdList: filterParams?.groupTypeIdList || [],
        LogInUserId: filterParams?.LoginUserId || 0
    };
    // Call the search endpoint
    const searchResponse = await searchCumulativeSalaryReport(searchRequest);
    // Transform the search response to match CumulativeSalaryReportListResponse format
    if (searchResponse.success && searchResponse.data) {
        return {
            success: searchResponse.success,
            message: searchResponse.message,
            data: {
                data: {
                    dropdown: {
                        MI_Id: searchResponse.data.MI_Id || filterParams?.MIID || 30,
                        groupTypedropdownlist: [],
                        departmentdropdownlist: [],
                        designationdropdownlist: [],
                        monthdropdown: [],
                        leaveyeardropdown: []
                    },
                    rows: searchResponse.data.ReportData || []
                },
                total: searchResponse.data.ReportData?.length || 0,
                page: searchParams?.page || 1,
                page_size: searchParams?.page_size || 10
            }
        };
    }
    // Return empty response on error
    return {
        success: false,
        message: searchResponse.message || 'Failed to fetch report data',
        data: {
            data: {
                dropdown: {
                    MI_Id: filterParams?.MIID || 30,
                    groupTypedropdownlist: [],
                    departmentdropdownlist: [],
                    designationdropdownlist: [],
                    monthdropdown: [],
                    leaveyeardropdown: []
                },
                rows: []
            },
            total: 0,
            page: searchParams?.page || 1,
            page_size: searchParams?.page_size || 10
        }
    };
}
