'use server';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import { type ApiResponse, api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    LeaveAuthorizationGetResponseData,
    LeaveAuthorizationSaveRequest,
    LeaveAuthorizationDeleteRequest,
} from '@/types/hrms/leave-management/leave-authorization';
/**
 * Get institutions based on login
 * GET /api/LeaveAuthorization/get_institutions_by_loginbased
 */
export async function getInstitutionsByLoginBased(): Promise<ApiResponse<any[]>> {
    const url = '/api/LeaveAuthorization/get_institutions_by_loginbased';
    console.log('🔵 [SERVER] GET Request URL:', url);
    try {
        const response = await api.get<any>('hmslms', url);
        console.log('🔵 [SERVER] GET Response:', JSON.stringify(response, null, 2));

        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        return {
            success: isSuccess,
            message: res.message || 'Institutions fetched successfully',
            data: res.data || []
        };
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to fetch institutions');
    }
}

/**
 * Get leave authorization details by MI_Id
 * GET /api/LeaveAuthorization/get_authorization_details_by_miid?mi_id={mi_id}
 *
 * @param searchParams - Search parameters for filtering
 * @returns Leave authorization data
 */
export async function getLeaveAuthorization(
    searchParams?: ApiSearchparams & { MI_Id?: string | number; UserId?: number }
): Promise<ApiResponse<LeaveAuthorizationGetResponseData | any[]>> {
    const miId = searchParams?.MI_Id || HRMS_MI_ID;

    // Build URL with pagination parameters
    const baseUrl = `/api/LeaveAuthorization/get_authorization_grid_by_miid`;
    const queryParams = getSearchParamsUrl(searchParams);
    let url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;

    // Append mi_id to the URL
    if (miId) {
        url += `${url.includes('?') ? '&' : '?'}mi_id=${miId}`;
    }

    console.log('🔵 [SERVER] GET Request URL:', url);
    try {
        const response = await api.get<any>('hmslms', url);
        // console.log('🔵 [SERVER] GET Response:', JSON.stringify(response, null, 2));

        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        if (isSuccess) {
            return {
                ...res,
                success: true,
                data: res.data || []
            };
        }

        return {
            success: false,
            message: res.message || 'Failed to fetch data',
            data: []
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch leave authorization data';
        throw new Error(errorMessage);
    }
}
/**
 * Save or update leave authorization
 * POST /api/LeaveAuthorization/add_or_update_leave_authorisation
 *
 * @param data - Leave authorization data to save or update
 * @returns Save/Update response
 */
export async function saveLeaveAuthorization(data: LeaveAuthorizationSaveRequest): Promise<ApiResponse<LeaveAuthorizationGetResponseData>> {
    const url = '/api/LeaveAuthorization/add_or_update_leave_authorisation';

    // Check if it's an edit operation (HRLA_Id > 0)
    // Note: The interface might need HRLA_Id added if not present, but usually data has it if it's "any" or loosely typed at runtime
    // Casting data to any to access potentially unmapped HRLA_Id if the type def is incomplete
    const inputData = data as any;
    const isEdit = inputData.HRLA_Id && Number(inputData.HRLA_Id) > 0;
    const hrlaId = isEdit ? Number(inputData.HRLA_Id) : 0;

    // Map to the structure expected by the NEW API
    const requestBody = {
        hrlA_Id: hrlaId,
        // mI_Id: data.MI_Id || HRMS_MI_ID, // Use token MI_Id
        hrmG_Id: Number(data.HRMG_Id || 0),
        hrmgT_Id: Number(data.HRMGT_Id || 0),
        hrmD_Id: Number(data.HRMD_Id || 0),
        hrmdeS_Id: Number(data.HRMDES_Id || 0),
        hrmL_Id: Number(data.HRML_Id || 0),
        userId: Number(data.UserId || 0),
        approvalUser: (data.approvaluser_array || []).map((item) => ({
            approval_HRME_Id: Number(item.Approval_HRME_Id),
            approvalLevelNo: Number(item.ApprovalLevelNo),
            approvalFinalFlag: !!item.ApprovalFinalFlag
        }))
    };

    console.log('🟠 [SERVER] POST Request URL:', url);
    console.log('🟠 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));

    try {
        const response = await api.post<any>('hmslms', url, requestBody);
        // console.log('🟢 [SERVER] Response:', JSON.stringify(response, null, 2));

        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true' || res.returnval === true;

        return {
            success: isSuccess,
            message: res.message || (isEdit ? 'Updated successfully' : 'Saved successfully'),
            data: res.data || null
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save leave authorization';
        throw new Error(errorMessage);
    }
}
/**
 * Get leave authorization for editing
 * GET /api/LeaveAuthorization/leave_authorisation_by_id/{hrlaon_id}
 *
 * @param hrlaoN_Id - Leave authorization ID to edit
 * @returns Leave authorization data for editing
 */
export async function getLeaveAuthorizationForEdit(hrlaoN_Id: number): Promise<ApiResponse<any>> {
    const url = `/api/LeaveAuthorization/leave_authorisation_by_id/${hrlaoN_Id}`;
    console.log('🔵 [SERVER] GET Request URL:', url);
    try {
        const response = await api.get<any>('hmslms', url);
        console.log('🔵 [SERVER] GET Response:', JSON.stringify(response, null, 2));

        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        if (isSuccess && res.data) {
            // The API returns an array in 'data' even for a single record
            const data = Array.isArray(res.data) ? res.data[0] : res.data;
            return {
                success: true,
                message: res.message || 'Data fetched successfully',
                data: data
            };
        }

        throw new Error(res.message || 'Failed to fetch leave authorization for editing');
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to fetch leave authorization data for editing');
    }
}
/**
 * Delete leave authorization
 * DELETE /api/LeaveAuthorization/delete_leave_authorisation/{hrla_id}/{hrlaon_id}
 *
 * @param request - Delete request with HRLA_Id and HRLAON_Id
 * @returns Delete response
 */
export async function deleteLeaveAuthorization(request: LeaveAuthorizationDeleteRequest): Promise<ApiResponse<any>> {
    const hrla_Id = Number(request.HRLA_Id || 0);
    const hrlaon_Id = Number(request.HRLAON_Id || 0);

    // Reverting to documented order: /api/LeaveAuthorization/delete_leave_authorisation/${hrla_Id}/${hrlaon_Id}
    const url = `/api/LeaveAuthorization/delete_leave_authorisation/${hrla_Id}/${hrlaon_Id}`;

    console.log(`🔴 [SERVER] DELETE Request URL: ${url} (HRLA_Id: ${hrla_Id}, HRLAON_Id: ${hrlaon_Id})`);

    try {
        const response = await api.delete<any>('hmslms', url);
        console.log('🔴 [SERVER] Response:', JSON.stringify(response, null, 2));

        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true' || res.returnval === true;

        return {
            success: isSuccess,
            message: res.message || (isSuccess ? 'Deleted successfully' : 'Failed to delete'),
            data: res.data || null
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete leave authorization';
        throw new Error(errorMessage);
    }
}
/**
 * Get leave authorization dropdown options
 * GET /api/LeaveAuthorization/get_authorization_details_by_miid?mi_id={mi_id}
 * This returns comprehensive dropdown data including grades, leaves, groupType, department, designation, applicationUsers
 */
export async function getLeaveAuthorizationDropdowns(request: { MI_Id?: number; UserId?: number }): Promise<{
    grades: Array<{ value: string; label: string }>;
    groupTypes: Array<{ value: string; label: string }>;
    departments: Array<{ value: string; label: string }>;
    designations: Array<{ value: string; label: string }>;
    leaveTypes: Array<{ value: string; label: string }>;
    approvalPersons: Array<{ value: string; label: string }>;
}> {
    const miId = request.MI_Id || HRMS_MI_ID;
    const url = `/api/LeaveAuthorization/get_authorization_details_by_miid?mi_id=${miId}`;

    console.log('🔵 [SERVER] GET Dropdowns URL:', url);
    try {
        const response = await api.get<any>('hmslms', url);
        console.log('🔵 [SERVER] Dropdowns Response:', JSON.stringify(response, null, 2));

        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        if (!isSuccess || !res.data) {
            return {
                grades: [],
                groupTypes: [],
                departments: [],
                designations: [],
                leaveTypes: [],
                approvalPersons: []
            };
        }

        const data = res.data;

        // Map grades from API response structure
        const grades = (data.grades || [])
            .map((item: any) => ({
                value: String(item.hrmG_Id || ''),
                label: String(item.hrmG_GradeName || '')
            }))
            .filter((item: { value: string; label: string }) => item.value && item.label);

        // Map leaves from API response structure
        const leaveTypes = (data.leaves || [])
            .map((item: any) => ({
                value: String(item.hrmL_Id || ''),
                label: String(item.hrmL_LeaveName || '')
            }))
            .filter((item: { value: string; label: string }) => item.value && item.label);

        // Map groupType from API response structure
        const groupTypes = (data.groupType || [])
            .map((item: any) => ({
                value: String(item.hrmgT_Id || ''),
                label: String(item.hrmgT_EmployeeGroupType || '')
            }))
            .filter((item: { value: string; label: string }) => item.value && item.label);

        // Map department from API response structure
        const departments = (data.department || [])
            .map((item: any) => ({
                value: String(item.hrmD_Id || ''),
                label: String(item.hrmD_DepartmentName || '')
            }))
            .filter((item: { value: string; label: string }) => item.value && item.label);

        // Map designation from API response structure
        const designations = (data.designation || [])
            .map((item: any) => ({
                value: String(item.hrmdeS_Id || ''),
                label: String(item.hrmdeS_DesignationName || '')
            }))
            .filter((item: { value: string; label: string }) => item.value && item.label);

        // Map applicationUsers from API response structure
        const approvalPersons = (data.applicationUsers || [])
            .map((item: any) => ({
                value: String(item.id || ''),
                label: String(item.userName || '')
            }))
            .filter((item: { value: string; label: string }) => item.value && item.label);

        return {
            grades,
            groupTypes,
            departments,
            designations,
            leaveTypes,
            approvalPersons
        };
    } catch (error: any) {
        console.error('❌ [SERVER] Error fetching dropdowns:', error);
        return {
            grades: [],
            groupTypes: [],
            departments: [],
            designations: [],
            leaveTypes: [],
            approvalPersons: []
        };
    }
}
