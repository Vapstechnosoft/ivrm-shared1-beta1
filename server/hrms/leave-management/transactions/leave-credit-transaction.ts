'use server';
import { createLocalCrud } from '@/lib/localdb';
import type { LeaveCreditTransaction } from '@/app/(root)/hrms/leave-management/transaction/leave-credit-transaction/_components/columns';
import { api, type ApiResponse } from '@/lib/apiService';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import type {
    LeaveTransactionManualRequest,
    GetLeavetransmResponseData,
    GetLeaveTransactionDepartmentsResponseData,
    GetLeaveTransactionDesignationResponseData,
    GetLeaveTransactionEmployeeResponseData,
    GetLeaveTransactionEmpLopResponseData,
    SaveLeaveTransactionRequest,
    SaveLeaveTransactionResponseData,
    DeleteLeaveTransactionRequest,
    DeleteLeaveTransactionResponseData
} from '@/types/hrms/leave-management/leave-credit-transaction';
export async function getLeaveCreditTransaction() {
    const db = createLocalCrud<LeaveCreditTransaction>('leaveCreditTransaction');
    const data = db.list();
    return {
        success: true,
        data: data,
        message: 'Data fetched successfully'
    };
}
export async function addOrUpdateLeaveCreditTransaction(transaction: LeaveCreditTransaction) {
    const db = createLocalCrud<LeaveCreditTransaction>('leaveCreditTransaction');
    if (transaction.id) {
        db.update(transaction.id, transaction);
        return {
            success: true,
            data: transaction,
            message: 'Leave credit transaction updated successfully'
        };
    }
    const newTransaction = db.create(transaction);
    return {
        success: true,
        data: newTransaction,
        message: 'Leave credit transaction created successfully'
    };
}
export async function deleteLeaveCreditTransaction(id: number) {
    const db = createLocalCrud<LeaveCreditTransaction>('leaveCreditTransaction');
    db.remove(id);
    return {
        success: true,
        message: 'Leave credit transaction deleted successfully'
    };
}
/**
 * Get leave transactions
 * POST /api/LeaveTransactionManualWrapperFacade/GetLeavetransm
 * 
 * @param request - Request payload with MI_Id and filter arrays
 * @returns Leave transactions data
 */
export async function getLeavetransm(request: LeaveTransactionManualRequest): Promise<ApiResponse<GetLeavetransmResponseData>> {
    const url = '/api/LeaveTransactionManualWrapperFacade/GetLeavetransm';
    const requestBody: LeaveTransactionManualRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID,
        EmpTypeIds: request.EmpTypeIds || [],
        DepartmentIds: request.DepartmentIds || [],
        DesignationIds: request.DesignationIds || [],
        EmployeeIds: request.EmployeeIds || []
    };
    console.log('📋 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetLeavetransmResponseData>('hmslms', url, requestBody);
        console.log('📋 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeavetransmResponseData>;
        }
        // Wrap raw response data
        const responseData = response as any;
        return {
            success: responseData?.success ?? true,
            message: responseData?.message || responseData?.retrunMsg || 'Data fetched successfully',
            data: response as unknown as GetLeavetransmResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch leave transactions';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get departments for leave transaction
 * POST /api/LeaveTransactionManualWrapperFacade/GetDepartments
 * 
 * @param request - Request payload with MI_Id and filter arrays
 * @returns Departments data
 */
export async function getLeaveTransactionDepartments(request: LeaveTransactionManualRequest): Promise<ApiResponse<GetLeaveTransactionDepartmentsResponseData>> {
    const url = '/api/LeaveTransactionManualWrapperFacade/GetDepartments';
    const requestBody: LeaveTransactionManualRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID,
        EmpTypeIds: request.EmpTypeIds || [],
        DepartmentIds: request.DepartmentIds || [],
        DesignationIds: request.DesignationIds || [],
        EmployeeIds: request.EmployeeIds || []
    };
    console.log('🏢 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetLeaveTransactionDepartmentsResponseData>('hmslms', url, requestBody);
        console.log('🏢 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveTransactionDepartmentsResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetLeaveTransactionDepartmentsResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch departments';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get designations for leave transaction
 * POST /api/LeaveTransactionManualWrapperFacade/GetDesignation
 * 
 * @param request - Request payload with MI_Id and filter arrays
 * @returns Designation data
 */
export async function getLeaveTransactionDesignation(request: LeaveTransactionManualRequest): Promise<ApiResponse<GetLeaveTransactionDesignationResponseData>> {
    const url = '/api/LeaveTransactionManualWrapperFacade/GetDesignation';
    const requestBody: LeaveTransactionManualRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID,
        EmpTypeIds: request.EmpTypeIds || [],
        DepartmentIds: request.DepartmentIds || [],
        DesignationIds: request.DesignationIds || [],
        EmployeeIds: request.EmployeeIds || []
    };
    console.log('👔 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetLeaveTransactionDesignationResponseData>('hmslms', url, requestBody);
        console.log('👔 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveTransactionDesignationResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetLeaveTransactionDesignationResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch designations';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get employees for leave transaction
 * POST /api/LeaveTransactionManualWrapperFacade/GetEmployee
 * 
 * @param request - Request payload with MI_Id and filter arrays
 * @returns Employees data
 */
export async function getLeaveTransactionEmployee(request: LeaveTransactionManualRequest): Promise<ApiResponse<GetLeaveTransactionEmployeeResponseData>> {
    const url = '/api/LeaveTransactionManualWrapperFacade/GetEmployee';
    const requestBody: LeaveTransactionManualRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID,
        EmpTypeIds: request.EmpTypeIds || [],
        DepartmentIds: request.DepartmentIds || [],
        DesignationIds: request.DesignationIds || [],
        EmployeeIds: request.EmployeeIds || []
    };
    console.log('👤 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetLeaveTransactionEmployeeResponseData>('hmslms', url, requestBody);
        console.log('👤 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveTransactionEmployeeResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetLeaveTransactionEmployeeResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch employees';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get employee LOP (Loss of Pay) for leave transaction
 * POST /api/LeaveTransactionManualWrapperFacade/GetEmpLop
 * 
 * @param request - Request payload with MI_Id and filter arrays
 * @returns Employee LOP data
 */
export async function getLeaveTransactionEmpLop(request: LeaveTransactionManualRequest): Promise<ApiResponse<GetLeaveTransactionEmpLopResponseData>> {
    const url = '/api/LeaveTransactionManualWrapperFacade/GetEmpLop';
    const requestBody: LeaveTransactionManualRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID,
        EmpTypeIds: request.EmpTypeIds || [],
        DepartmentIds: request.DepartmentIds || [],
        DesignationIds: request.DesignationIds || [],
        EmployeeIds: request.EmployeeIds || []
    };
    console.log('💰 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetLeaveTransactionEmpLopResponseData>('hmslms', url, requestBody);
        console.log('💰 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveTransactionEmpLopResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetLeaveTransactionEmpLopResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch employee LOP';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Save leave transaction
 * POST /api/LeaveTransactionManualWrapperFacade/SaveData
 * 
 * @param data - Request payload with leave transaction data
 * @returns Save response data
 */
export async function saveLeaveTransaction(data: SaveLeaveTransactionRequest): Promise<ApiResponse<SaveLeaveTransactionResponseData>> {
    const url = '/api/LeaveTransactionManualWrapperFacade/SaveData';
    const requestBody: SaveLeaveTransactionRequest = {
        ...data, // Include any additional fields first
        MI_Id: data.MI_Id || HRMS_MI_ID,
        HRME_Id: data.HRME_Id || 0,
        HRML_LeaveType: data.HRML_LeaveType || '',
        HRELT_FromDate: data.HRELT_FromDate || '',
        HRELT_ToDate: data.HRELT_ToDate || '',
        HRELT_TotDays: data.HRELT_TotDays || 0,
        HRELT_Id: data.HRELT_Id || 0,
        HRELTD_Id: data.HRELTD_Id || 0
    };
    console.log('💾 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<SaveLeaveTransactionResponseData>('hmslms', url, requestBody);
        console.log('💾 [SERVER] Response:', JSON.stringify(response, null, 2));
        let responseData: SaveLeaveTransactionResponseData;
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            responseData = (response as any).data;
        } else {
            responseData = response as unknown as SaveLeaveTransactionResponseData;
        }
        const successMessage = responseData?.retrunMsg || 
                              responseData?.message || 
                              (response as any)?.message || 
                              (responseData?.returnval_add ? 'Leave transaction created successfully' : 
                               responseData?.returnval_Update ? 'Leave transaction updated successfully' : 
                               'Leave transaction saved successfully');
        if (responseData?.dupr || responseData?.returnduplicatestatus) {
            const duplicateMessage = responseData?.returnduplicatestatus || 'Duplicate record found';
            return {
                success: false,
                message: duplicateMessage,
                data: responseData
            };
        }
        return {
            success: responseData?.returnval ?? (response as any)?.success ?? true,
            message: successMessage,
            data: responseData
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to save leave transaction';
        throw new Error(errorMessage);
    }
}
/**
 * Delete leave transaction details
 * POST /api/LeaveTransactionManualWrapperFacade/DeleteDetails
 * 
 * @param request - Request payload with HRELT_Id
 * @returns Delete response data
 */
export async function deleteLeaveTransactionDetails(request: DeleteLeaveTransactionRequest): Promise<ApiResponse<DeleteLeaveTransactionResponseData>> {
    const url = '/api/LeaveTransactionManualWrapperFacade/DeleteDetails';
    const requestBody: DeleteLeaveTransactionRequest = {
        HRELT_Id: request.HRELT_Id || 0
    };
    console.log('🗑️ [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<DeleteLeaveTransactionResponseData>('hmslms', url, requestBody);
        console.log('🗑️ [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<DeleteLeaveTransactionResponseData>;
        }
        // Wrap raw response data
        const responseData = response as unknown as DeleteLeaveTransactionResponseData;
        return {
            success: responseData?.returnval ?? (response as any)?.success ?? true,
            message: responseData?.retrunMsg || responseData?.message || (response as any)?.message || 'Leave transaction details deleted successfully',
            data: responseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to delete leave transaction details';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
