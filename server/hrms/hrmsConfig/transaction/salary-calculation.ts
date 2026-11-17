'use server';
import { api } from '@/lib/apiService';
import type {
    SalaryCalculationGenerateRequest,
    SalaryCalculationGenerateResponse,
    SalaryCalculationOnloadRequest,
    SalaryCalculationOnloadResponse,
    SalaryCalculationSearchRequest,
    NewSalaryCalculationSearchRequest,
    NewSalaryCalculationGenerateRequest,
    SelectionEmployee
} from '@/types/hrms/salary-calculation';
/**
 * Get onload details for salary calculation (dropdowns, config, etc.)
 * POST /api/employeeSalaryCalculationFacade/onloadgetdetailsNew
 */
export async function getSalaryCalculationOnload(payload: SalaryCalculationOnloadRequest) {
    console.log('📥 [SALARY CALCULATION - BACKEND] Request payload:', JSON.stringify(payload, null, 2));
    const url = '/api/employeeSalaryCalculationFacade/onloadgetdetailsNew';
    // Prepare request body
    const requestBody = {
        MI_Id: payload.MI_Id || 30,
        LogInUserId: payload.LogInUserId || 0
    };
    console.log('📤 [SALARY CALCULATION - BACKEND] Request body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<SalaryCalculationOnloadResponse>('hrms', url, requestBody);
        // The backend returns raw data, not wrapped in ApiResponse format
        // Wrap it to match the expected ApiResponse structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped
            console.log('📊 [SALARY CALCULATION - BACKEND] Response data summary:', {
                hasMonths: !!(response.data?.monthdropdown?.length),
                monthsCount: response.data?.monthdropdown?.length || 0,
                hasLeaveYears: !!(response.data?.leaveyeardropdown?.length),
                leaveYearsCount: response.data?.leaveyeardropdown?.length || 0,
                hasDepartments: !!(response.data?.departmentdropdown?.length),
                departmentsCount: response.data?.departmentdropdown?.length || 0,
                hasDesignations: !!(response.data?.designationdropdown?.length),
                designationsCount: response.data?.designationdropdown?.length || 0,
                hasGroupTypes: !!(response.data?.groupTypedropdown?.length),
                groupTypesCount: response.data?.groupTypedropdown?.length || 0,
                hasEmployees: !!(response.data?.employeedropdown?.length),
                employeesCount: response.data?.employeedropdown?.length || 0,
                hasConfiguration: !!response.data?.configurationDetails
            });
            console.log('🔵 [SALARY CALCULATION - BACKEND] getSalaryCalculationOnload - END (Success)');
            return response;
        }
        // Wrap raw response data
        const wrappedResponse = {
            success: true,
            message: 'Data loaded successfully',
            data: response as unknown as SalaryCalculationOnloadResponse
        };
        console.log('📊 [SALARY CALCULATION - BACKEND] Response data summary:', {
            hasMonths: !!(wrappedResponse.data?.monthdropdown?.length),
            monthsCount: wrappedResponse.data?.monthdropdown?.length || 0,
            hasLeaveYears: !!(wrappedResponse.data?.leaveyeardropdown?.length),
            leaveYearsCount: wrappedResponse.data?.leaveyeardropdown?.length || 0,
            hasDepartments: !!(wrappedResponse.data?.departmentdropdown?.length),
            departmentsCount: wrappedResponse.data?.departmentdropdown?.length || 0,
            hasDesignations: !!(wrappedResponse.data?.designationdropdown?.length),
            designationsCount: wrappedResponse.data?.designationdropdown?.length || 0,
            hasGroupTypes: !!(wrappedResponse.data?.groupTypedropdown?.length),
            groupTypesCount: wrappedResponse.data?.groupTypedropdown?.length || 0,
            hasEmployees: !!(wrappedResponse.data?.employeedropdown?.length),
            employeesCount: wrappedResponse.data?.employeedropdown?.length || 0,
            hasConfiguration: !!wrappedResponse.data?.configurationDetails
        });
        console.log('🔵 [SALARY CALCULATION - BACKEND] getSalaryCalculationOnload - END (Success)');
        return wrappedResponse;
    } catch (error) {
        console.error('💥 [SALARY CALCULATION - BACKEND] Error message:', error instanceof Error ? error.message : String(error));
        throw error;
    }
}
/**
 * Save salary calculation
 * POST /api/SalaryCalculation/
 */
export async function saveSalaryCalculation(data: any) {
    const url = '/api/SalaryCalculation/';
    return await api.post<SalaryCalculationOnloadResponse>('hrms', url, data);
}
/**
 * Search salary calculation by selection criteria
 * POST /api/employeeSalaryCalculationFacade/getEmployeedetailsBySelectionNew
 */
export async function searchSalaryCalculationBySelection(payload: SalaryCalculationSearchRequest) {
    console.log('📥 [SALARY CALCULATION - BACKEND] Request payload:', JSON.stringify(payload, null, 2));
    const url = '/api/employeeSalaryCalculationFacade/getEmployeedetailsBySelectionNew';
    // Prepare request body - ensure arrays are [0] when empty, as API expects
    // Use empty strings for Year and Month when not provided
    const trimmedYear = payload.HRES_Year ? payload.HRES_Year.trim() : '';
    const trimmedMonth = payload.HRES_Month ? payload.HRES_Month.trim() : '';
    const requestBody = {
        MI_Id: payload.MI_Id || 30,
        LogInUserId: payload.LogInUserId || 0,
        hrmdeS_IdList: payload.hrmdeS_IdList && payload.hrmdeS_IdList.length > 0 ? payload.hrmdeS_IdList : [0],
        hrmD_IdList: payload.hrmD_IdList && payload.hrmD_IdList.length > 0 ? payload.hrmD_IdList : [0],
        hrmgT_IdList: payload.groupTypeIdList && payload.groupTypeIdList.length > 0 ? payload.groupTypeIdList : [0],
        HRES_Year: trimmedYear,
        HRES_Month: trimmedMonth
    };
    console.log('📤 [SALARY CALCULATION - BACKEND] Request body prepared:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<SalaryCalculationOnloadResponse>('hrms', url, requestBody);
        // The backend returns raw data, not wrapped in ApiResponse format
        // Wrap it to match the expected ApiResponse structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped
            const employeeCount = (response.data as any)?.ReportData?.length || (response.data as any)?.employeeDetails?.length || 0;
            console.log('🔵 [SALARY CALCULATION - BACKEND] searchSalaryCalculationBySelection - END (Success)');
            return response;
        }
        // Wrap raw response data
        const wrappedResponse = {
            success: true,
            message: 'Data loaded successfully',
            data: response as unknown as SalaryCalculationOnloadResponse
        };
        const employeeCount = (wrappedResponse.data as any)?.ReportData?.length || (wrappedResponse.data as any)?.employeeDetails?.length || 0;
        if (employeeCount > 0) {
            const reportData = (wrappedResponse.data as any)?.ReportData || (wrappedResponse.data as any)?.employeeDetails;
            if (reportData && Array.isArray(reportData) && reportData.length > 0) {
                console.log('📋 [SALARY CALCULATION - BACKEND] First employee sample:', JSON.stringify(reportData[0], null, 2));
            }
        }
        console.log('🔵 [SALARY CALCULATION - BACKEND] searchSalaryCalculationBySelection - END (Success)');
        return wrappedResponse;
    } catch (error) {
        console.error('💥 [SALARY CALCULATION - BACKEND] Error message:', error instanceof Error ? error.message : String(error));
        throw error;
    }
}
/**
 * Generate salary for selected employees
 * POST /api/employeeSalaryCalculationFacade/calculateSelectedEmployeeSalaryNew
 */
export async function generateSalaryForSelectedEmployees(data: SalaryCalculationGenerateRequest) {
    const url = '/api/employeeSalaryCalculationFacade/calculateSelectedEmployeeSalaryNew';
    // Prepare request body with proper structure
    const requestBody = {
        MI_Id: data.MI_Id || 30,
        HRES_Year: data.HRES_Year || '',
        HRES_Month: data.HRES_Month || '',
        employeeIdList: data.employeeIdList && data.employeeIdList.length > 0 ? data.employeeIdList : [0],
        LogInUserId: data.LogInUserId || 0
    };
    const response = await api.post<SalaryCalculationGenerateResponse>('hrms', url, requestBody);
    // The backend returns raw data, not wrapped in ApiResponse format
    // Wrap it to match the expected ApiResponse structure
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        // Already wrapped
        return response;
    }
    // Wrap raw response data
    return {
        success: true,
        message: 'Salary calculation completed',
        data: response as unknown as SalaryCalculationGenerateResponse
    };
}

/**
 * Search employees by selection criteria (New API)
 * POST /api/TransEmployeeSalaryCalculation/employee_details_by_selection
 */
export async function searchEmployeesBySelection(payload: NewSalaryCalculationSearchRequest) {
    const url = '/api/TransEmployeeSalaryCalculation/employee_details_by_selection';
    try {
        const response = await api.post<SelectionEmployee[]>('hrms', url, payload);
        // Ensure success: true is returned in the response
        if (response && typeof response === 'object' && 'success' in response) {
            return response;
        }
        return {
            success: true,
            data: response as unknown as SelectionEmployee[],
            message: 'Employee details fetched successfully'
        };
    } catch (error) {
        console.error('Error searching employees:', error);
        throw error;
    }
}

/**
 * Calculate selected employee salary (New API)
 * POST /api/TransEmployeeSalaryCalculation/calculate_selected_employee_salary
 */
export async function calculateEmployeeSalary(payload: NewSalaryCalculationGenerateRequest) {
    const url = '/api/TransEmployeeSalaryCalculation/calculate_selected_employee_salary';
    try {
        const response = await api.post<any>('hrms', url, payload);
        if (response && typeof response === 'object' && 'success' in response) {
            return response;
        }
        return {
            success: true,
            data: response,
            message: 'Salary calculated successfully'
        };
    } catch (error) {
        console.error('Error calculating salary:', error);
        throw error;
    }
}
