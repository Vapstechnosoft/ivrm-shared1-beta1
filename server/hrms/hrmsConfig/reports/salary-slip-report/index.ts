'use server';
import { api, type ApiResponse } from '@/lib/apiService';
import type {
    SalarySlipFilterRequest,
    SalarySlipFilterResponse,
    SalarySlipGenerateRequest,
    SalarySlipGenerateResponse,
    SalarySlipOnloadRequest,
    SalarySlipOnloadResponse,
    SalarySlipResponse
} from '@/types/hrms/reports/salary-slip-report';
/**
 * Get onload details for salary slip report
 * POST /api/EmployeeSalarySlipGenerationFacade/GetAllDropdownAndDatatableDetailsNew
 * Request: { MI_Id: number, LogInUserId: number }
 */
export async function getSalarySlipOnload(
    MI_Id = 30,
    LogInUserId = 0
): Promise<ApiResponse<SalarySlipResponse>> {
    const requestBody: SalarySlipOnloadRequest = {
        MI_Id,
        LogInUserId
    };
    const response = await api.post<SalarySlipResponse>(
        'hrms',
        '/api/EmployeeSalarySlipGenerationFacade/GetAllDropdownAndDatatableDetailsNew',
        requestBody
    );
    // The backend returns raw data, not wrapped in ApiResponse format
    // Wrap it to match the expected ApiResponse structure
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        // Already wrapped
        return response as ApiResponse<SalarySlipResponse>;
    }
    // Wrap raw response data
    return {
        success: true,
        message: 'Data loaded successfully',
        data: response as unknown as SalarySlipResponse
    };
}
/**
 * Filter employees by year and month
 * POST /api/ReportEmployeeSalarySlipGeneration/get_employee_list_by_leave_year_and_month
 * Request: { MI_Id?: number, LogInUserId?: number, hreS_Year: string, hreS_Month: string, hrmdes_ids: string, hrmd_ids: string, hrmgt_ids: string }
 * Response: Returns employees in data field
 */
export async function filterEmployeesByYearMonth(
    requestBody: SalarySlipFilterRequest
): Promise<ApiResponse<SalarySlipResponse>> {
    const response = await api.post<SalarySlipResponse>(
        'hrms',
        '/api/ReportEmployeeSalarySlipGeneration/get_employee_list_by_leave_year_and_month',
        requestBody
    );
    // The backend returns raw data, not wrapped in ApiResponse format
    // Wrap it to match the expected ApiResponse structure
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        // Already wrapped
        return response as ApiResponse<SalarySlipResponse>;
    }
    // Wrap raw response data
    const rawResponse = response as unknown as SalarySlipResponse;
    return {
        success: true,
        message: 'Filter completed successfully',
        data: rawResponse
    };
}
/**
 * Generate employee salary slip
 * POST /api/ReportEmployeeSalarySlipGeneration/generate_employee_salary_slip
 * Request: { MI_Id?: number, hreS_Year: string, hreS_Month: string, empid: number[], hrmdeS_IdList: number[], hrmD_IdList: number[], groupTypeIdList: number[] }
 * Note: Arrays should be empty [] when no values are selected, not [0]
 */
export async function generateSalarySlip(
    requestBody: SalarySlipGenerateRequest
): Promise<ApiResponse<SalarySlipResponse>> {
    const response = await api.post<SalarySlipResponse>(
        'hrms',
        '/api/ReportEmployeeSalarySlipGeneration/generate_employee_salary_slip',
        requestBody
    );
    // The backend returns raw data, not wrapped in ApiResponse format
    // Wrap it to match the expected ApiResponse structure
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        // Already wrapped
        return response as ApiResponse<SalarySlipResponse>;
    }
    // Wrap raw response data
    const rawResponse = response as unknown as SalarySlipResponse;
    return {
        success: true,
        message: 'Salary slip generated successfully',
        data: rawResponse
    };
}
