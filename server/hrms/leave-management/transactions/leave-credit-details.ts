'use server';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import { api, type ApiResponse } from '@/lib/apiService';
import { createLocalCrud } from '@/lib/localdb';
import type { LeaveCreditDetail } from '@/app/(root)/hrms/leave-management/transaction/leave-credit-details/_components/columns';
import type {
    GetLeaveCreditDetailsRequest,
    GetLeaveCreditDetailsResponseData,
    LeaveCreditDetailItem,
    GetLeaveCodeRequest,
    GetLeaveCodeResponseData,
    LeaveCodeItem,
    GetLeaveCreditDepartmentsRequest,
    GetLeaveCreditDepartmentsResponseData,
    DepartmentItem,
    GetLeaveCreditDesignationRequest,
    GetLeaveCreditDesignationResponseData,
    DesignationItem,
    GetLeaveCreditGradeRequest,
    GetLeaveCreditGradeResponseData,
    GradeItem,
    GetLeaveMasterRequest,
    GetLeaveMasterResponseData,
    LeaveMasterItem,
    SaveLeaveCreditDetailsRequest,
    SaveLeaveCreditDetailsResponseData,
    GetLeaveDetailsCreditMonthRequest,
    GetLeaveDetailsCreditMonthResponseData,
    LeaveDetailsCreditMonthItem,
    GetLeaveDetailsCFRequest,
    GetLeaveDetailsCFResponseData,
    LeaveDetailsCFItem,
    GetLeaveDetailsCFMonthRequest,
    GetLeaveDetailsCFMonthResponseData,
    LeaveDetailsCFMonthItem,
    GetLeaveDetailsEnCashRequest,
    GetLeaveDetailsEnCashResponseData,
    LeaveDetailsEnCashItem,
    LeaveNameDropdownItem,
    CreditMonthDropdownItem
} from '@/types/hrms/leave-management/leave-credit-details';
/**
 * Map API response data to LeaveCreditDetail format
 */
function mapApiDataToLeaveCreditDetail(apiData: LeaveCreditDetailItem, index: number): LeaveCreditDetail {
    return {
        id: apiData.HRMLD_Id || apiData.id || index + 1,
        leaveId: apiData.HRML_Id || 0,
        createdAt: apiData.createdAt || new Date(),
        // Multiple IDs are usually not returned in a single record by this legacy API 
        // unless it's a comma separated string or a related array.
        // For now, we handle the single ID case which is common in grid results.
        type: apiData.HRMGT_Id ? [String(apiData.HRMGT_Id)] : [],
        department: apiData.HRMD_Id ? [String(apiData.HRMD_Id)] : [],
        designation: apiData.HRMDES_Id ? [String(apiData.HRMDES_Id)] : [],
        grade: apiData.HRMG_Id ? [String(apiData.HRMG_Id)] : [],

        typeName: apiData.HRMGT_EmployeeGroupType ? [apiData.HRMGT_EmployeeGroupType] : [],
        departmentName: apiData.HRMD_DepartmentName ? [apiData.HRMD_DepartmentName] : [],
        designationName: apiData.HRMDES_DesignationName ? [apiData.HRMDES_DesignationName] : [],
        gradeName: apiData.HRMG_GradeName ? [apiData.HRMG_GradeName] : [],

        leaveName: apiData.HRML_LeaveName || apiData.leaveName || '',
        leaveCode: apiData.HRML_LeaveCode || apiData.leaveCode || '',
        noOfDays: typeof apiData.HRMLD_NoOfDays === 'string'
            ? parseFloat(apiData.HRMLD_NoOfDays) || 0
            : (apiData.HRMLD_NoOfDays || apiData.noOfDays || 0),
        maxLeaveApplicable: apiData.HRMLD_MaxLeaveApplicable || apiData.maxLeaveApplicable || 0,
        leaveCarryForward: apiData.HRMLD_CarryForFlg ?? apiData.leaveCarryForward ?? false,
        leaveEncashment: apiData.HRMLD_EncashFlg ?? apiData.leaveEncashment ?? false,
        leaveCreditMonthWise: false, // Default value
        creditMonths: [],
        months: {}
    };
}
/**
 * Get leave credit details
 * POST /api/LeaveCreditWrapperFacade/GetLeave
 * 
 * @param request - Request payload with MI_Id
 * @returns Leave credit details data
 */
export async function getLeaveCreditDetails(request?: { MI_Id?: number }): Promise<ApiResponse<LeaveCreditDetail[]>> {
    const miId = request?.MI_Id || HRMS_MI_ID;
    const url = `/api/LeaveCreditWrapperFacade/GetLeave/${miId}`;
    try {
        const response = await api.get<any>('hmslms', url);
        console.log(`📝 [SERVER] Leave Credit Details Response (MI_Id: ${miId}):`, JSON.stringify(response, null, 2));

        // Handle the response structure
        let responseData: GetLeaveCreditDetailsResponseData;
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            responseData = (response as any).data;
        } else {
            // Raw response data
            responseData = response as unknown as GetLeaveCreditDetailsResponseData;
        }

        console.log('📝 [SERVER] Extracted Response Data Fields:', Object.keys(responseData || {}));

        // Extract leave credit details list from response
        let detailsList: LeaveCreditDetailItem[] = [];
        if (responseData.GridviewDetails && Array.isArray(responseData.GridviewDetails)) {
            detailsList = responseData.GridviewDetails;
            console.log(`📝 [SERVER] Found ${detailsList.length} items in GridviewDetails`);
        } else if (responseData.leaveCreditDetails && Array.isArray(responseData.leaveCreditDetails)) {
            detailsList = responseData.leaveCreditDetails;
            console.log(`📝 [SERVER] Found ${detailsList.length} items in leaveCreditDetails`);
        } else if (responseData.leaveCreditList && Array.isArray(responseData.leaveCreditList)) {
            detailsList = responseData.leaveCreditList;
            console.log(`📝 [SERVER] Found ${detailsList.length} items in leaveCreditList`);
        } else if (responseData.leaveDetails && Array.isArray(responseData.leaveDetails)) {
            detailsList = responseData.leaveDetails;
            console.log(`📝 [SERVER] Found ${detailsList.length} items in leaveDetails`);
        } else if (Array.isArray(responseData)) {
            detailsList = responseData;
            console.log(`📝 [SERVER] Found ${detailsList.length} items in raw array response`);
        } else {
            console.log('📝 [SERVER] No recognizable list field found in response data');
        }
        // Map API data to frontend format
        const mappedData = detailsList.map((item, index) => mapApiDataToLeaveCreditDetail(item, index));
        const responseDataAny = responseData as any;
        return {
            success: true,
            message: responseDataAny?.retrunMsg || responseDataAny?.message || 'Leave credit details fetched successfully',
            data: mappedData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message ||
            error?.response?.data?.retrunMsg ||
            error?.message ||
            'Failed to fetch leave credit details';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get leave code
 * POST /api/LeaveCreditWrapperFacade/GetLeaveCode
 * 
 * @param request - Request payload with leavecode
 * @returns Leave code data
 */
export async function getLeaveCode(request: GetLeaveCodeRequest): Promise<ApiResponse<GetLeaveCodeResponseData>> {
    const leavecode = request.leavecode || 0;
    const url = `/api/LeaveCreditWrapperFacade/GetLeaveCode/${leavecode}`;
    console.log('🔑 [SERVER] GET Request URL:', url);
    try {
        const response = await api.get<any>('hmslms', url);
        console.log('🔑 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveCodeResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || 'Data fetched successfully',
            data: response as unknown as GetLeaveCodeResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message ||
            error?.response?.data?.retrunMsg ||
            error?.message ||
            'Failed to fetch leave code';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get departments for leave credit details
 * POST /api/LeaveCreditWrapperFacade/GetDepartments
 * 
 * @param request - Request payload with MI_Id and emptypes array
 * @returns Departments data
 */
export async function getLeaveCreditDepartments(request: GetLeaveCreditDepartmentsRequest): Promise<ApiResponse<GetLeaveCreditDepartmentsResponseData>> {
    const url = '/api/LeaveCreditWrapperFacade/GetDepartments';
    const requestBody: GetLeaveCreditDepartmentsRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID,
        emptypes: request.emptypes || []
    };
    console.log('🏢 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetLeaveCreditDepartmentsResponseData>('hmslms', url, requestBody);
        console.log('🏢 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveCreditDepartmentsResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetLeaveCreditDepartmentsResponseData
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
 * Get designation for leave credit details
 * POST /api/LeaveCreditWrapperFacade/GetDesignation
 * 
 * @param request - Request payload with MI_Id and emptypes array
 * @returns Designation data
 */
export async function getLeaveCreditDesignation(request: GetLeaveCreditDesignationRequest): Promise<ApiResponse<GetLeaveCreditDesignationResponseData>> {
    const url = '/api/LeaveCreditWrapperFacade/GetDesignation';
    const requestBody: GetLeaveCreditDesignationRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID,
        emptypes: request.emptypes || []
    };
    console.log('👔 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetLeaveCreditDesignationResponseData>('hmslms', url, requestBody);
        console.log('👔 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveCreditDesignationResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetLeaveCreditDesignationResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message ||
            error?.response?.data?.retrunMsg ||
            error?.message ||
            'Failed to fetch designation';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get grade for leave credit details
 * POST /api/LeaveCreditWrapperFacade/GetGrade
 * 
 * @param request - Request payload with MI_Id and emptypes array
 * @returns Grade data
 */
export async function getLeaveCreditGrade(request: GetLeaveCreditGradeRequest): Promise<ApiResponse<GetLeaveCreditGradeResponseData>> {
    const url = '/api/LeaveCreditWrapperFacade/GetGrade';
    const requestBody: GetLeaveCreditGradeRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID,
        emptypes: request.emptypes || []
    };
    console.log('⭐ [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetLeaveCreditGradeResponseData>('hmslms', url, requestBody);
        console.log('⭐ [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveCreditGradeResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetLeaveCreditGradeResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message ||
            error?.response?.data?.retrunMsg ||
            error?.message ||
            'Failed to fetch grade';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get leave master (credit months) data
 * POST /api/LeaveCreditWrapperFacade/LeaveMaster
 * 
 * @param request - Request payload with MI_Id, HRML_LeaveCode, and HRMLDCM_Id
 * @returns Leave master data
 */
export async function getLeaveMaster(request: GetLeaveMasterRequest): Promise<ApiResponse<GetLeaveMasterResponseData>> {
    const url = '/api/LeaveCreditWrapperFacade/LeaveMaster';
    const requestBody: GetLeaveMasterRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID,
        HRML_LeaveCode: request.HRML_LeaveCode || '',
        HRMLDCM_Id: request.HRMLDCM_Id || 0
    };
    console.log('📅 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetLeaveMasterResponseData>('hmslms', url, requestBody);
        console.log('📅 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveMasterResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetLeaveMasterResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message ||
            error?.response?.data?.retrunMsg ||
            error?.message ||
            'Failed to fetch leave master';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get leave details CF Month data
 * POST /api/LeaveCreditWrapperFacade/LeaveDetailsCFMonth
 * 
 * @param request - Request payload with HRMLDCFM_Id and HRMLDCFM_MonthId
 * @returns Leave details CF Month data
 */
export async function getLeaveDetailsCFMonth(request: GetLeaveDetailsCFMonthRequest): Promise<ApiResponse<GetLeaveDetailsCFMonthResponseData>> {
    const url = '/api/LeaveCreditWrapperFacade/LeaveDetailsCFMonth';
    const requestBody: GetLeaveDetailsCFMonthRequest = {
        HRMLDCFM_Id: request.HRMLDCFM_Id || 0,
        HRMLDCFM_MonthId: request.HRMLDCFM_MonthId || 0
    };
    console.log('📆🔄 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetLeaveDetailsCFMonthResponseData>('hmslms', url, requestBody);
        console.log('📆🔄 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveDetailsCFMonthResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetLeaveDetailsCFMonthResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message ||
            error?.response?.data?.retrunMsg ||
            error?.message ||
            'Failed to fetch leave details CF month';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get leave details EnCash (Encashment) data
 * POST /api/LeaveCreditWrapperFacade/LeaveDetailsEnCash
 * 
 * @param request - Request payload with encashment details
 * @returns Leave details EnCash data
 */
export async function getLeaveDetailsEnCash(request: GetLeaveDetailsEnCashRequest): Promise<ApiResponse<GetLeaveDetailsEnCashResponseData>> {
    const url = '/api/LeaveCreditWrapperFacade/LeaveDetailsEnCash';
    const requestBody: GetLeaveDetailsEnCashRequest = {
        HRMLDEC_Id: request.HRMLDEC_Id || 0,
        HRMLDEC_ServiceAplFlg: request.HRMLDEC_ServiceAplFlg ?? true,
        HRMLDEC_ServiceYear: request.HRMLDEC_ServiceYear || '',
        HRMLDEC_ServiceMonth: request.HRMLDEC_ServiceMonth || '',
        HRMLDEC_ServiceDays: request.HRMLDEC_ServiceDays || '',
        HRMLDEC_MaxLeaveFlg: request.HRMLDEC_MaxLeaveFlg ?? true,
        HRMLDEC_MaxLeaves: request.HRMLDEC_MaxLeaves || 0,
        HRMLDEC_MinLeaveFlg: request.HRMLDEC_MinLeaveFlg ?? true,
        HRMLDEC_MinLeaves: request.HRMLDEC_MinLeaves || 0,
        HRMLDEC_ScheduleFlg: request.HRMLDEC_ScheduleFlg || '',
        HRMLDEC_ScheduleYear: request.HRMLDEC_ScheduleYear || '',
        HRMLDEC_ScheduleMonth: request.HRMLDEC_ScheduleMonth || ''
    };
    console.log('💰 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetLeaveDetailsEnCashResponseData>('hmslms', url, requestBody);
        console.log('💰 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveDetailsEnCashResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetLeaveDetailsEnCashResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message ||
            error?.response?.data?.retrunMsg ||
            error?.message ||
            'Failed to fetch leave details encash';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get leave details CF (Carry Forward) data
 * POST /api/LeaveCreditWrapperFacade/LeaveDetailsCF
 * 
 * @param request - Request payload with HRMLDCF_Id and HRMLDCF_MaxLeaveAplFlg
 * @returns Leave details CF data
 */
export async function getLeaveDetailsCF(request: GetLeaveDetailsCFRequest): Promise<ApiResponse<GetLeaveDetailsCFResponseData>> {
    const url = '/api/LeaveCreditWrapperFacade/LeaveDetailsCF';
    const requestBody: GetLeaveDetailsCFRequest = {
        HRMLDCF_Id: request.HRMLDCF_Id || 0,
        HRMLDCF_MaxLeaveAplFlg: request.HRMLDCF_MaxLeaveAplFlg ?? true
    };
    console.log('🔄 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetLeaveDetailsCFResponseData>('hmslms', url, requestBody);
        console.log('🔄 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveDetailsCFResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetLeaveDetailsCFResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message ||
            error?.response?.data?.retrunMsg ||
            error?.message ||
            'Failed to fetch leave details CF';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get leave details credit month data
 * POST /api/LeaveCreditWrapperFacade/LeaveDetailsCreditMonth
 * 
 * @param request - Request payload with HRMLDCM_Id and HRMLDCM_LCMonthCode
 * @returns Leave details credit month data
 */
export async function getLeaveDetailsCreditMonth(request: GetLeaveDetailsCreditMonthRequest): Promise<ApiResponse<GetLeaveDetailsCreditMonthResponseData>> {
    const url = '/api/LeaveCreditWrapperFacade/LeaveDetailsCreditMonth';
    const requestBody: GetLeaveDetailsCreditMonthRequest = {
        HRMLDCM_Id: request.HRMLDCM_Id || 0,
        HRMLDCM_LCMonthCode: request.HRMLDCM_LCMonthCode || ''
    };
    console.log('📆 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetLeaveDetailsCreditMonthResponseData>('hmslms', url, requestBody);
        console.log('📆 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveDetailsCreditMonthResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetLeaveDetailsCreditMonthResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message ||
            error?.response?.data?.retrunMsg ||
            error?.message ||
            'Failed to fetch leave details credit month';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Save leave credit details
 * POST /api/LeaveCreditWrapperFacade/SaveData
 * 
 * @param data - Request payload with leave credit details data
 * @returns Save response
 */
export async function saveLeaveCreditDetails(data: SaveLeaveCreditDetailsRequest): Promise<ApiResponse<SaveLeaveCreditDetailsResponseData>> {
    const url = '/api/LeaveCreditWrapperFacade/SaveData';
    const requestBody: SaveLeaveCreditDetailsRequest = {
        ...data, // Include any additional fields first
        MI_Id: data.MI_Id || HRMS_MI_ID,
        HRML_Id: data.HRML_Id || 0,
        HRMLD_NoOfDays: data.HRMLD_NoOfDays || '',
        HRMLD_MaxLeaveApplicable: data.HRMLD_MaxLeaveApplicable || 0,
        LoginId: data.LoginId || 0,
        Emp_types: data.Emp_types || [],
        dept_types: data.dept_types || [],
        desig_types: data.desig_types || [],
        grade_types: data.grade_types || [],
        HRMLD_CarryForFlg: data.HRMLD_CarryForFlg ?? false,
        HRMLD_EncashFlg: data.HRMLD_EncashFlg ?? false,
        HRMLDCF_MaxLeaveAplFlg: data.HRMLDCF_MaxLeaveAplFlg ?? false,
        HRMLDCF_MaxLeaveCF: data.HRMLDCF_MaxLeaveCF || 0,
        selectedcarryMonthList: data.selectedcarryMonthList || [],
        selectedMonthList: data.selectedMonthList || []
    };
    console.log('💾 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<SaveLeaveCreditDetailsResponseData>('hmslms', url, requestBody);
        console.log('💾 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        let responseData: SaveLeaveCreditDetailsResponseData;
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            responseData = (response as any).data || {};
        } else {
            // Raw response data
            responseData = (response as unknown as SaveLeaveCreditDetailsResponseData) || {};
        }
        // Extract success message
        const successMessage = responseData?.retrunMsg ||
            responseData?.message ||
            (response as any)?.message ||
            (responseData?.returnval_add ? 'Leave credit detail created successfully' :
                responseData?.returnval_Update ? 'Leave credit detail updated successfully' :
                    'Leave credit detail saved successfully');
        // Check for duplicate status
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
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message ||
            error?.response?.data?.retrunMsg ||
            error?.message ||
            'Failed to save leave credit details';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
export async function addOrUpdateLeaveCreditDetails(detail: LeaveCreditDetail) {
    const db = createLocalCrud<LeaveCreditDetail>('leaveCreditDetails');
    if (detail.id) {
        db.update(detail.id, detail);
        return {
            success: true,
            data: detail,
            message: 'Leave credit detail updated successfully'
        };
    }
    const newDetail = db.create(detail);
    return {
        success: true,
        data: newDetail,
        message: 'Leave credit detail created successfully'
    };
}
export async function deleteLeaveCreditDetails(id: number) {
    const db = createLocalCrud<LeaveCreditDetail>('leaveCreditDetails');
    db.remove(id);
    return {
        success: true,
        message: 'Leave credit detail deleted successfully'
    };
}

/**
 * Get leave name dropdown data
 * GET /api/LeaveCredit/get_leave_name_dropdown
 * 
 * @returns Leave name dropdown data
 */
export async function getLeaveNameDropdown(): Promise<ApiResponse<LeaveNameDropdownItem[]>> {
    const url = '/api/LeaveCredit/get_leave_name_dropdown';
    try {
        const response = await api.get<any>('hmslms', url);
        console.log('📝 [SERVER] Leave Name Dropdown Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            return response as ApiResponse<LeaveNameDropdownItem[]>;
        }
        return {
            success: true,
            data: response as unknown as LeaveNameDropdownItem[],
            message: 'Leave Name Data fetched successfully'
        };
    } catch (error: any) {
        console.error('❌ [SERVER] Error fetching leave name dropdown:', error);
        throw new Error(error?.message || 'Failed to fetch leave name dropdown');
    }
}

/**
 * Get credit month dropdown data
 * GET /api/LeaveCredit/get_creditmonth_dropdown
 * 
 * @returns Credit month dropdown data
 */
export async function getCreditMonthDropdown(): Promise<ApiResponse<CreditMonthDropdownItem[]>> {
    const url = '/api/LeaveCredit/get_creditmonth_dropdown';
    try {
        const response = await api.get<any>('hmslms', url);
        console.log('📅 [SERVER] Credit Month Dropdown Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            return response as ApiResponse<CreditMonthDropdownItem[]>;
        }
        return {
            success: true,
            data: response as unknown as CreditMonthDropdownItem[],
            message: 'Credit Month Data fetched successfully'
        };
    } catch (error: any) {
        console.error('❌ [SERVER] Error fetching credit month dropdown:', error);
        throw new Error(error?.message || 'Failed to fetch credit month dropdown');
    }
}
