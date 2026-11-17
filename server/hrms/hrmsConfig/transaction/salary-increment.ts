'use server';
import { api, type ApiResponse } from '@/lib/apiService';
import type {
    SalaryIncrementDeleteRequest,
    SalaryIncrementDeleteResponse,
    SalaryIncrementOnloadRequest,
    SalaryIncrementOnloadResponse,
    SalaryIncrementSaveRequest,
    SalaryIncrementSaveResponse
} from '@/types/hrms/salary-increment';
/**
 * Get salary increment onload details
 * POST /api/EmployeeSalaryIncreementProcessFacade/onloadgetdetails
 */
export async function getSalaryIncrementOnload(payload: SalaryIncrementOnloadRequest): Promise<ApiResponse<SalaryIncrementOnloadResponse> & { total?: number | null; page?: number | null; page_size?: number | null }> {
    console.log('📥 [SALARY INCREMENT - BACKEND] Request payload:', JSON.stringify(payload, null, 2));
    const url = '/api/EmployeeSalaryIncreementProcessFacade/onloadgetdetails';
    // Prepare request body - support both new and legacy formats
    const requestBody = {
        page: payload.page ?? 1,
        page_size: payload.page_size ?? 10,
        search_query: payload.search_query ?? '',
        search_column: payload.search_column ?? '',
        sort_column: payload.sort_column ?? '',
        sort_direction: payload.sort_direction ?? '',
        is_export: payload.is_export ?? false,
        MIID: payload.MIID ?? payload.MI_Id ?? 30,
        LoginUserId: payload.LoginUserId ?? payload.roleId ?? 0,
        UserRole: payload.UserRole ?? ''
    };
    console.log('📤 [SALARY INCREMENT - BACKEND] Request body prepared:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<{ success: boolean; message?: string; data?: SalaryIncrementOnloadResponse; total?: number | null; page?: number | null; page_size?: number | null }>('hrms', url, requestBody        );
        // The backend returns data wrapped in ApiResponse format
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped
            const responseData = response.data as any;
            // Map monthlydata to leaveyeardropdown if monthlydata exists
            if (responseData?.monthlydata && !responseData?.leaveyeardropdown) {
                responseData.leaveyeardropdown = responseData.monthlydata.map((item: any) => ({
                    HRMLY_Id: item.HRMLY_Id,
                    HRMLY_LeaveYear: item.HRMLY_LeaveYear,
                    HRMLY_FromDate: item.HRMLY_FromDate,
                    HRMLY_ToDate: item.HRMLY_ToDate
                }));
            }
            const mappedData = responseData as SalaryIncrementOnloadResponse;
            console.log('📊 [SALARY INCREMENT - BACKEND] Response data summary:', {
                hasMonths: !!(mappedData?.monthdropdown?.length),
                monthsCount: mappedData?.monthdropdown?.length || 0,
                hasMonthlyData: !!(responseData?.monthlydata?.length),
                monthlyDataCount: responseData?.monthlydata?.length || 0,
                hasLeaveYears: !!(mappedData?.leaveyeardropdown?.length),
                leaveYearsCount: mappedData?.leaveyeardropdown?.length || 0,
                hasEmployees: !!(mappedData?.employeelist?.length),
                employeesCount: mappedData?.employeelist?.length || 0,
                hasEarningDeductionTypes: !!(mappedData?.earningdeductiontype?.length),
                earningDeductionTypesCount: mappedData?.earningdeductiontype?.length || 0,
                hasGridData: !!(mappedData?.griddata?.length),
                gridDataCount: mappedData?.griddata?.length || 0,
                total: response.total,
                page: response.page,
                page_size: response.page_size
            });
            console.log('🔵 [SALARY INCREMENT - BACKEND] getSalaryIncrementOnload - END (Success)');
            return {
                ...response,
                data: mappedData
            } as ApiResponse<SalaryIncrementOnloadResponse> & { total?: number | null; page?: number | null; page_size?: number | null };
        }
        // Wrap raw response data (fallback for unexpected format)
        const rawData = response as any;
        // Map monthlydata to leaveyeardropdown if monthlydata exists
        if (rawData?.monthlydata && !rawData?.leaveyeardropdown) {
            rawData.leaveyeardropdown = rawData.monthlydata.map((item: any) => ({
                HRMLY_Id: item.HRMLY_Id,
                HRMLY_LeaveYear: item.HRMLY_LeaveYear,
                HRMLY_FromDate: item.HRMLY_FromDate,
                HRMLY_ToDate: item.HRMLY_ToDate
            }));
        }
        const wrappedResponse = {
            success: true,
            message: 'Data loaded successfully',
            data: rawData as SalaryIncrementOnloadResponse,
            total: undefined,
            page: undefined,
            page_size: undefined
        };
        console.log('📊 [SALARY INCREMENT - BACKEND] Response data summary:', {
            hasMonths: !!(wrappedResponse.data?.monthdropdown?.length),
            monthsCount: wrappedResponse.data?.monthdropdown?.length || 0,
            hasMonthlyData: !!(rawData?.monthlydata?.length),
            monthlyDataCount: rawData?.monthlydata?.length || 0,
            hasLeaveYears: !!(wrappedResponse.data?.leaveyeardropdown?.length),
            leaveYearsCount: wrappedResponse.data?.leaveyeardropdown?.length || 0,
            hasEmployees: !!(wrappedResponse.data?.employeelist?.length),
            employeesCount: wrappedResponse.data?.employeelist?.length || 0,
            hasEarningDeductionTypes: !!(wrappedResponse.data?.earningdeductiontype?.length),
            earningDeductionTypesCount: wrappedResponse.data?.earningdeductiontype?.length || 0,
            hasGridData: !!(wrappedResponse.data?.griddata?.length),
            gridDataCount: wrappedResponse.data?.griddata?.length || 0
        });
        console.log('🔵 [SALARY INCREMENT - BACKEND] getSalaryIncrementOnload - END (Success)');
        return wrappedResponse as unknown as ApiResponse<SalaryIncrementOnloadResponse> & { total?: number | null; page?: number | null; page_size?: number | null };
    } catch (error) {
        console.error('💥 [SALARY INCREMENT - BACKEND] Error message:', error instanceof Error ? error.message : String(error));
        throw error;
    }
}
export async function saveSalaryIncrement(payload: SalaryIncrementSaveRequest) {
    const url = '/api/EmployeeSalaryIncreementProcessFacade';
    return await api.post<SalaryIncrementSaveResponse>('hrms', url, payload);
}
/**
 * Deactivate salary increment record by ID
 * POST /api/EmployeeSalaryIncreementProcessFacade/deactivateRecordById?id={id}
 */
export async function deleteSalaryIncrement(id: number): Promise<ApiResponse<SalaryIncrementDeleteResponse>> {
    const url = '/api/EmployeeSalaryIncreementProcessFacade/deactivateRecordById';
    try {
        const response = await api.post<SalaryIncrementDeleteResponse>('hrms', url, undefined, {
            params: { id }
        });
        console.log('📤 [SALARY INCREMENT - BACKEND] Response:', JSON.stringify(response, null, 2));
        console.log('🔵 [SALARY INCREMENT - BACKEND] deleteSalaryIncrement - END (Success)');
        return response;
    } catch (error) {
        console.error('💥 [SALARY INCREMENT - BACKEND] Error message:', error instanceof Error ? error.message : String(error));
        throw error;
    }
}
