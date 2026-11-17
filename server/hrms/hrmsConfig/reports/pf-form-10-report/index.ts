'use server';
import { type ApiResponse, api } from '@/lib/apiService';
import type {
    PFForm10ReportFilterRequest,
    PFForm10ReportFilterResponse,
    PFForm10ReportOnloadRequest,
    PFForm10ReportOnloadResponse,
    PFForm10ReportSearchRequest,
    PFForm10ReportSearchResponse
} from '@/types/hrms/reports/pf-form-10-report';
/**
 * Get onload data for PF Form 10 Report
 * POST /api/PFForm10Facade/onloadgetdetails
 * Request: { MI_Id }
 * Response: { MI_Id, retrunMsg, roleId, monthdropdown, leaveyeardropdown, employeedropdown, institutionDetails, ... }
 */
export async function getPFForm10ReportOnload(MI_Id = 30): Promise<ApiResponse<PFForm10ReportOnloadResponse>> {
    const url = '/api/PFForm10Facade/onloadgetdetails';
    const requestBody: PFForm10ReportOnloadRequest = {
        MI_Id
    };
    console.log('🔵 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    let response: any;
    try {
        response = await api.post<PFForm10ReportOnloadResponse>('hrms', url, requestBody);
        console.log('🔵 [SERVER] Response:', JSON.stringify(response, null, 2));
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to load PF Form 10 report data',
            data: {
                MI_Id,
                retrunMsg: error?.message || 'Failed to load data',
                roleId: 0,
                HRME_EmployeeCode: null,
                HRME_EPFNotApplicableFlg: null,
                HRME_RetiredFlg: null,
                HRME_FPFNotApplicableFlg: null,
                HRME_PensionStoppedDate: null,
                HRES_WorkingDays: null,
                departmentname: null,
                employeedropdown: null,
                leaveyeardropdown: null,
                monthdropdown: null,
                HRME_Age: 0,
                HRME_Id: 0,
                HRES_Year: null,
                HRES_Month: null,
                FromDate: null,
                ToDate: null,
                getpfgriddata: null,
                pfreport: null,
                employeeDetails: null,
                contactnum: null,
                institutionDetails: null,
                MI_Name: null,
                MI_Address1: null,
                finYearFromDate: null,
                finYearToDate: null,
                HeadType: null,
                PFVPFflag: null,
                DepositWithdrow: null,
                Remark: null,
                IMFY_Id: 0,
                IVRM_Month_Id: 0,
                UserId: 0,
                TransAmount: null,
                Schoolamount: null,
                Procedure: null,
                Flag: null,
                EmployeePFreportDetails: null,
                TransactionID: 0,
                STJOwnPF: null,
                HRESD_Id: 0,
                HRMED_Id: 0,
                HRMED_Name: null,
                HRESD_Amount: null,
                HRME_DOJ: null,
                AmountofWages: null,
                PFAmount: null,
                HRES_Id: 0,
                HRES_EPF: null,
                HRES_FPF: null,
                VPFAmount: null,
                PayrollStandard: null,
                HRC_RetirementYrs: null,
                FatherHusbandName: null,
                HRME_PFAccNo: null,
                HRME_FatherName: null,
                HRME_EmployeeFirstName: null,
                HRME_EmployeeMiddleName: null,
                HRME_EmployeeLastName: null,
                HRME_DOL: null,
                HRME_LeavingReason: null,
                HRME_PFDate: null,
                HRME_DOB: null,
                IVRMMG_GenderName: null,
                TotalServicePeriod: null,
                HRES_Ac21: null,
                HRES_Ac22: null,
                HRES_Ac5: null,
                HRES_Ac10: null,
                HRMED_EDTypeFlag: null,
                bankdetails: null,
                professionaltaxamount: null,
                HRME_PFuAN: null,
                empGrossSal: null,
                netsalary: null,
                groupTypeIdList: null,
                hrmgT_IdList: null,
                employeeTypeIdList: null,
                hrmD_IdList: null,
                hrmdeS_IdList: null,
                abc: 0,
                currentemployeeDetails: null,
                employee: null,
                H_DOB: null,
                H_Month: 0,
                basicamount: 0,
                DAamount: 0,
                Othersamount: 0,
                emptotdedSal: null,
                basicvalue: null,
                davalue: null,
                HRMS_Age: 0,
                HRMPFVPFINT_Id: 0,
                HRMPFVPFINT_PFInterestRate: 0,
                HRMPFVPFINT_VPFInterestRate: 0,
                HRMPFVPFINT_ActiveFlg: false,
                HRMPFVPFINT_RecalculationConsentFlg: false,
                HRMPFVPFINT_ApplicableDate: '0001-01-01T00:00:00',
                HRMPFVPFINT_CreatedDate: '0001-01-01T00:00:00',
                HRMPFVPFINT_UpdatedDate: '0001-01-01T00:00:00',
                HRMPFVPFINT_CreatedBy: 0,
                HRMPFVPFINT_UpdatedBy: 0,
                returnduplicatestatus: null,
                returnval: false,
                message: null,
                get_store: null,
                IMFY_FinancialYear: null,
                vpfTranaction: null,
                pfTranaction: null
            }
        };
    }
    // The backend returns raw data, not wrapped in ApiResponse format
    // Wrap it to match the expected ApiResponse structure
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        // Already wrapped
        return response as ApiResponse<PFForm10ReportOnloadResponse>;
    }
    // Wrap raw response data
    const rawResponse = response as unknown as PFForm10ReportOnloadResponse;
    return {
        success: true,
        message: rawResponse?.retrunMsg || 'Data loaded successfully',
        data: rawResponse
    };
}
/**
 * Filter employee data for PF Form 10 Report
 * POST /api/PFForm10Facade/FilterEmployeeData
 * Request: { MI_Id }
 * Response: Typically returns employee dropdown data or filtered employee list
 */
export async function filterPFForm10EmployeeData(request: PFForm10ReportFilterRequest): Promise<ApiResponse<PFForm10ReportFilterResponse>> {
    const url = '/api/PFForm10Facade/FilterEmployeeData';
    const requestBody: PFForm10ReportFilterRequest = {
        MI_Id: request.MI_Id || 30
    };
    console.log('🔵 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    let response: any;
    try {
        response = await api.post<PFForm10ReportFilterResponse>('hrms', url, requestBody);
        console.log('🔵 [SERVER] Response:', JSON.stringify(response, null, 2));
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to filter PF Form 10 employee data',
            data: {
                MI_Id: request.MI_Id || 30,
                retrunMsg: error?.message || 'Failed to filter',
                roleId: 0
            }
        };
    }
    // The backend returns raw data, not wrapped in ApiResponse format
    // Wrap it to match the expected ApiResponse structure
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        // Already wrapped
        return response as ApiResponse<PFForm10ReportFilterResponse>;
    }
    // Wrap raw response data
    const rawResponse = response as unknown as PFForm10ReportFilterResponse;
    return {
        success: true,
        message: rawResponse?.retrunMsg || 'Filter completed successfully',
        data: rawResponse
    };
}
/**
 * Get employee details by selection for PF Form 10 Report
 * POST /api/PFForm10Facade/getEmployeedetailsBySelection
 * Request: { MI_Id, HRES_Month, HRES_Year }
 * Response: Returns PF Form 10 data for selected month and year
 */
export async function searchPFForm10Report(request: PFForm10ReportSearchRequest): Promise<ApiResponse<PFForm10ReportSearchResponse>> {
    const url = '/api/PFForm10Facade/getEmployeedetailsBySelection';
    const requestBody: PFForm10ReportSearchRequest = {
        MI_Id: request.MI_Id || 0,
        HRES_Month: request.HRES_Month || '',
        HRES_Year: request.HRES_Year || ''
    };
    console.log('🔵 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    let response: any;
    try {
        response = await api.post<PFForm10ReportSearchResponse>('hrms', url, requestBody);
        console.log('🔵 [SERVER] Response:', JSON.stringify(response, null, 2));
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to search PF Form 10 report',
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
        return response as ApiResponse<PFForm10ReportSearchResponse>;
    }
    // Wrap raw response data
    const rawResponse = response as unknown as PFForm10ReportSearchResponse;
    return {
        success: true,
        message: rawResponse?.retrunMsg || 'Search completed successfully',
        data: rawResponse
    };
}
