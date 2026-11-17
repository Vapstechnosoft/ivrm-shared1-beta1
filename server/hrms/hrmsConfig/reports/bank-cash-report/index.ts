'use server';
import { api, type ApiResponse } from '@/lib/apiService';
import type {
    BankCashReportOnloadRequest,
    BankCashReportOnloadResponse,
    BankCashReportSearchRequest,
    BankCashReportSearchResponse
} from '@/types/hrms/reports/bank-cash-report';
/**
 * Get onload data for Bank Cash Report
 * POST /api/BankCashReportFacade/onloadgetdetails
 * Request: { MI_Id, LogInUserId }
 * Response: { MI_Id, retrunMsg, roleId, HRES_Year, HRES_Month, AllOrIndividual, monthdropdown, leaveyeardropdown, departmentdropdown, designationdropdown, employeeTypedropdown, groupTypedropdown, bankdropdown, ... }
 */
export async function getBankCashReportOnload(
    MI_Id = 30,
    LogInUserId = 0
): Promise<ApiResponse<BankCashReportOnloadResponse>> {
    const url = '/api/BankCashReportFacade/onloadgetdetails';
    const requestBody: BankCashReportOnloadRequest = {
        MI_Id,
        LogInUserId
    };
    console.log('🔵 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    let response: any;
    try {
        response = await api.post<BankCashReportOnloadResponse>('hrms', url, requestBody);
        console.log('🔵 [SERVER] Response:', JSON.stringify(response, null, 2));
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to load bank cash report data',
            data: {
                MI_Id,
                retrunMsg: error?.message || 'Failed to load data',
                roleId: 0,
                HRES_Year: null,
                HRES_Month: null,
                AllOrIndividual: null,
                monthdropdown: null,
                leaveyeardropdown: null,
                departmentdropdown: null,
                designationdropdown: null,
                employeeTypedropdown: null,
                groupTypedropdown: null,
                groupTypeselected: null,
                employeeTypeselected: null,
                departmentselected: null,
                designationselected: null,
                employeeDetails: null,
                EmployeeCode: null,
                EmployeeName: null,
                BankAcNumber: null,
                NetSalary: null,
                institutionDetails: null,
                BankCash: null,
                bankdropdown: null,
                companyacc: null,
                hrmgT_IdList: null,
                employeeTypeIdList: null,
                hrmD_IdList: null,
                hrmdeS_IdList: null,
                groupTypeIdList: null,
                LogInUserId,
                HRME_EmployeeOrder: null,
                bankCashReportDTO: null,
                HRME_ActiveFlag: false,
                HRME_Id: 0,
                HRES_Id: 0,
                HRMBD_BranchName: null,
                HRMBD_BankName: null,
                HRMBD_IFSCCode: null
            }
        };
    }
    // The backend returns raw data, not wrapped in ApiResponse format
    // Wrap it to match the expected ApiResponse structure
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        // Already wrapped
        return response as ApiResponse<BankCashReportOnloadResponse>;
    }
    // Wrap raw response data
    const rawResponse = response as unknown as BankCashReportOnloadResponse;
    return {
        success: true,
        message: rawResponse?.retrunMsg || 'Data loaded successfully',
        data: rawResponse
    };
}
/**
 * Search Bank Cash report by selection criteria
 * POST /api/BankCashReportFacade/getEmployeedetailsBySelection
 * Request: { MI_Id, HRES_Year, HRES_Month, BankCash, departmentselected, groupTypeselected }
 * Note: HRES_Year and HRES_Month are numbers, not strings. Arrays should be empty [] when no selection is made.
 */
export async function searchBankCashReport(
    request: BankCashReportSearchRequest
): Promise<ApiResponse<BankCashReportSearchResponse>> {
    const url = '/api/BankCashReportFacade/getEmployeedetailsBySelection';
    const requestBody: BankCashReportSearchRequest = {
        MI_Id: request.MI_Id || 0,
        HRES_Year: request.HRES_Year || 0,
        HRES_Month: request.HRES_Month || 0,
        BankCash: request.BankCash || '',
        departmentselected: request.departmentselected || [],
        groupTypeselected: request.groupTypeselected || []
    };
    console.log('🔵 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    let response: any;
    try {
        response = await api.post<BankCashReportSearchResponse>('hrms', url, requestBody);
        console.log('🔵 [SERVER] Response:', JSON.stringify(response, null, 2));
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to search bank cash report',
            data: {
                MI_Id: request.MI_Id || 0,
                retrunMsg: error?.message || 'Failed to search',
                roleId: 0
            }
        };
    }
    // The backend returns raw data, not wrapped in ApiResponse format
    // Wrap it to match the expected ApiResponse structure
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        // Already wrapped
        return response as ApiResponse<BankCashReportSearchResponse>;
    }
    // Wrap raw response data
    const rawResponse = response as unknown as BankCashReportSearchResponse;
    return {
        success: true,
        message: rawResponse?.retrunMsg || 'Search completed successfully',
        data: rawResponse
    };
}
