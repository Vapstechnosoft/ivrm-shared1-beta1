'use server';
import { type ApiResponse, api } from '@/lib/apiService';
import type {
    MonthEndReportOnloadRequest,
    MonthEndReportOnloadResponse,
    MonthEndReportSearchRequest,
    MonthEndReportSearchResponse
} from '@/types/hrms/reports/month-end-report';
/**
 * Get onload data for Month End Report
 * POST /api/MonthEndReportFacade/onloadgetdetails
 * Request: { MI_Id }
 * Response: { MI_Id, retrunMsg, roleId, monthdropdown, leaveyeardropdown, departmentdropdown, designationdropdown, groupTypedropdown, institutionDetails, ... }
 */
export async function getMonthEndReportOnload(MI_Id = 30): Promise<ApiResponse<MonthEndReportOnloadResponse>> {
    const url = '/api/MonthEndReportFacade/onloadgetdetails';
    const requestBody: MonthEndReportOnloadRequest = {
        MI_Id
    };
    console.log('🔵 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    let response: any;
    try {
        response = await api.post<MonthEndReportOnloadResponse>('hrms', url, requestBody);
        console.log('🔵 [SERVER] Response:', JSON.stringify(response, null, 2));
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to load month end report data',
            data: {
                MI_Id,
                retrunMsg: error?.message || 'Failed to load data',
                roleId: 0,
                HRES_Year: null,
                HRES_Month: null,
                monthdropdown: null,
                leaveyeardropdown: null,
                employeeDetails: null,
                workingEmployee: 0,
                leftEmployee: 0,
                newEmployee: 0,
                salaryGenerated: 0,
                salaryslipGenerated: 0,
                missingPhoto: 0,
                missingEmailId: 0,
                missingContactNumber: 0,
                missingContactNumberleft: 0,
                missingEmailIdleft: 0,
                missingPhotoleft: 0,
                missingPhotonew: 0,
                missingEmailIdnew: 0,
                missingContactNumbernew: 0,
                monthendDate: null,
                institutionDetails: null,
                salaryslipsent: 0,
                salaryslipsmssent: 0,
                departmentdropdown: null,
                designationdropdown: null,
                groupTypedropdown: null,
                groupTypeIdList: null,
                hrmD_IdList: null,
                hrmdeS_IdList: null,
                empid: null,
                smscount: null,
                emailcount: null
            }
        };
    }
    // The backend returns raw data, not wrapped in ApiResponse format
    // Wrap it to match the expected ApiResponse structure
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        // Already wrapped
        return response as ApiResponse<MonthEndReportOnloadResponse>;
    }
    // Wrap raw response data
    const rawResponse = response as unknown as MonthEndReportOnloadResponse;
    return {
        success: true,
        message: rawResponse?.retrunMsg || 'Data loaded successfully',
        data: rawResponse
    };
}
/**
 * Get employee details by selection for Month End Report
 * POST /api/MonthEndReportFacade/getEmployeedetailsBySelection
 * Request: { MI_Id, HRES_Year, HRES_Month, groupTypeIdList, hrmD_IdList, hrmdeS_IdList, ... }
 * Response: Returns month end report data for selected month and year
 */
export async function searchMonthEndReport(request: MonthEndReportSearchRequest): Promise<ApiResponse<MonthEndReportSearchResponse>> {
    const url = '/api/MonthEndReportFacade/getEmployeedetailsBySelection';
    const requestBody: MonthEndReportSearchRequest = {
        MI_Id: request.MI_Id || 30,
        retrunMsg: request.retrunMsg || '',
        roleId: request.roleId || 0,
        HRES_Year: request.HRES_Year || '',
        HRES_Month: request.HRES_Month || '',
        monthdropdown: request.monthdropdown || [],
        leaveyeardropdown: request.leaveyeardropdown || [],
        employeeDetails: request.employeeDetails || [],
        groupTypeIdList: request.groupTypeIdList || [],
        hrmD_IdList: request.hrmD_IdList || [],
        hrmdeS_IdList: request.hrmdeS_IdList || [],
        empid: request.empid || []
    };
    console.log('🔵 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    let response: any;
    try {
        response = await api.post<MonthEndReportSearchResponse>('hrms', url, requestBody);
        console.log('🔵 [SERVER] Response:', JSON.stringify(response, null, 2));
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to search month end report',
            data: {
                MI_Id: request.MI_Id || 30,
                retrunMsg: error?.message || 'Failed to search',
                roleId: 0,
                HRES_Year: request.HRES_Year || null,
                HRES_Month: request.HRES_Month || null,
                employeeDetails: null,
                workingEmployee: 0,
                leftEmployee: 0,
                newEmployee: 0,
                salaryGenerated: 0,
                salaryslipGenerated: 0,
                missingPhoto: 0,
                missingEmailId: 0,
                missingContactNumber: 0,
                missingContactNumberleft: 0,
                missingEmailIdleft: 0,
                missingPhotoleft: 0,
                missingPhotonew: 0,
                missingEmailIdnew: 0,
                missingContactNumbernew: 0,
                monthendDate: null,
                institutionDetails: null,
                salaryslipsent: 0,
                salaryslipsmssent: 0,
                departmentdropdown: null,
                designationdropdown: null,
                groupTypedropdown: null
            }
        };
    }
    // The backend returns raw data, not wrapped in ApiResponse format
    // Wrap it to match the expected ApiResponse structure
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        // Already wrapped
        return response as ApiResponse<MonthEndReportSearchResponse>;
    }
    // Wrap raw response data
    const rawResponse = response as unknown as MonthEndReportSearchResponse;
    return {
        success: true,
        message: rawResponse?.retrunMsg || 'Search completed successfully',
        data: rawResponse
    };
}
