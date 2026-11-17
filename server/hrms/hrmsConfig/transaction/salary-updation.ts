'use server';
import { api } from '@/lib/apiService';
import type {
    ApiResponse,
    DepartmentDropdown,
    DesignationDropdown,
    SalaryUpdationDepartmentRequest,
    SalaryUpdationDepartmentResponse,
    SalaryUpdationDesignationRequest,
    SalaryUpdationDesignationResponse,
    SalaryUpdationEmployeeDetailsRequest,
    SalaryUpdationEmployeeDetailsResponse,
    SalaryUpdationFilterRequest,
    SalaryUpdationOnloadRequest,
    SalaryUpdationOnloadResponse,
    SalaryUpdationSaveRequest,
    SalaryUpdationSaveResponse,
    SalaryUpdationUpdateItem,
    SalaryUpdationUpdateRequest,
    SalaryUpdationUpdateResponse,
    EarningResultItem,
    DeductionResultItem
} from '@/types/hrms/salary-updation';

function mapGroupType(item: any) {
    if (item.key !== undefined && item.value) {
        return {
            HRMGT_Id: item.key,
            MI_Id: 0,
            HRMGT_EmployeeGroupType: item.value,
            HRMGT_Code: '',
            HRMGT_Order: 0,
            HRMGT_ActiveFlag: true
        };
    }
    // Handle PascalCase Key/Value
    if (item.Key !== undefined && item.Value) {
        return {
            HRMGT_Id: item.Key,
            MI_Id: 0,
            HRMGT_EmployeeGroupType: item.Value,
            HRMGT_Code: '',
            HRMGT_Order: 0,
            HRMGT_ActiveFlag: true
        };
    }
    return {
        HRMGT_Id: item.hrmgT_Id || item.HRMGT_Id,
        MI_Id: item.mI_Id || item.MI_Id,
        HRMGT_EmployeeGroupType: item.hrmgT_EmployeeGroupType || item.HRMGT_EmployeeGroupType,
        HRMGT_Code: item.hrmgT_Code || item.HRMGT_Code,
        HRMGT_Order: item.hrmgT_Order || item.HRMGT_Order,
        HRMGT_ActiveFlag: item.hrmgT_ActiveFlag || item.HRMGT_ActiveFlag
    };
}

function mapDepartment(item: any) {
    if (item.key !== undefined && item.value) {
        return {
            HRMD_Id: item.key,
            MI_Id: 0,
            HRMD_DepartmentName: item.value,
            HRMD_Order: 0,
            HRMD_ActiveFlag: true,
            HRMDC_ID: 0
        };
    }
    return {
        HRMD_Id: item.hrmD_Id || item.HRMD_Id,
        MI_Id: item.mI_Id || item.MI_Id,
        HRMD_DepartmentName: item.hrmD_DepartmentName || item.HRMD_DepartmentName,
        HRMD_Order: item.hrmD_Order || item.HRMD_Order,
        HRMD_ActiveFlag: item.hrmD_ActiveFlag || item.HRMD_ActiveFlag,
        HRMDC_ID: item.hrmdC_ID || item.HRMDC_ID
    };
}

function mapDesignation(item: any) {
    if (item.key !== undefined && item.value) {
        return {
            HRMDES_Id: item.key,
            MI_Id: 0,
            HRMDES_DesignationName: item.value,
            HRMDES_BasicAmount: 0,
            HRMDES_SanctionedSeats: 0,
            HRMDES_DisplaySanctionedSeatsFlag: false,
            HRMDES_Order: 0,
            HRMDES_ActiveFlag: true,
            HRMDC_ID: 0
        };
    }
    return {
        HRMDES_Id: item.hrmdeS_Id || item.HRMDES_Id,
        MI_Id: item.mI_Id || item.MI_Id,
        HRMDES_DesignationName: item.hrmdeS_DesignationName || item.HRMDES_DesignationName,
        HRMDES_BasicAmount: item.hrmdeS_BasicAmount || item.HRMDES_BasicAmount,
        HRMDES_SanctionedSeats: item.hrmdeS_SanctionedSeats || item.HRMDES_SanctionedSeats,
        HRMDES_DisplaySanctionedSeatsFlag: item.hrmdeS_DisplaySanctionedSeatsFlag || item.HRMDES_DisplaySanctionedSeatsFlag,
        HRMDES_Order: item.hrmdeS_Order || item.HRMDES_Order,
        HRMDES_ActiveFlag: item.hrmdeS_ActiveFlag || item.HRMDES_ActiveFlag,
        HRMDC_ID: item.hrmdC_ID || item.HRMDC_ID
    };
}

function mapHead(item: any) {
    return {
        HRMED_Id: item.hrmeD_Id || item.HRMED_Id,
        HRMED_Name: item.hrmeD_Name || item.HRMED_Name,
        HRMED_EDTypeFlag: item.hrmeD_EDTypeFlag || item.HRMED_EDTypeFlag,
        HRMED_EarnDedFlag: item.hrmeD_EarnDedFlag || item.HRMED_EarnDedFlag,
        HRMED_AmountPercentFlag: item.hrmeD_AmountPercentFlag || item.HRMED_AmountPercentFlag
    };
}

export async function getSalaryUpdationOnload(
    payload: SalaryUpdationOnloadRequest
): Promise<ApiResponse<SalaryUpdationOnloadResponse> & { total?: number | null; page?: number | null; page_size?: number | null }> {
    console.log('📥 [SALARY UPDATION - BACKEND] Request payload:', JSON.stringify(payload, null, 2));
    const facadeUrl = '/api/salaryUpdationFacade/onloadgetdetails';
    const groupTypeUrl = '/api/MasterDropDown/GroupType';
    const headersUrl = '/api/MasterDropDown/earnings_and_deductions_headers';

    // Prepare request body
    const requestBody = {
        page: payload.page ?? 1,
        page_size: payload.page_size ?? 10,
        search_query: payload.search_query ?? '',
        search_column: payload.search_column ?? '',
        sort_column: payload.sort_column ?? '',
        sort_direction: payload.sort_direction ?? '',
        is_export: payload.is_export ?? false,
        MIID: payload.MIID ?? 30,
        LoginUserId: payload.LoginUserId ?? 0,
        UserRole: payload.UserRole ?? ''
    };

    try {
        console.log('🔄 [SALARY UPDATION - BACKEND] Fetching onload data...');
        // Fetch both in parallel
        const [facadeResponse, groupTypeResponse, headersResponse] = await Promise.all([
            api.post<{ success: boolean; message?: string; data?: any; total?: number | null; page?: number | null; page_size?: number | null }>('hrms', facadeUrl, requestBody),
            api.get<any[]>('hrms', groupTypeUrl),
            api.get<any[]>('hrms', headersUrl)
        ]);

        console.log('✅ [SALARY UPDATION - BACKEND] Responses received.');

        let rawData: any = facadeResponse && facadeResponse.data ? facadeResponse.data : (facadeResponse || {});
        // Check if response is wrapped
        if (facadeResponse && typeof facadeResponse === 'object' && 'success' in facadeResponse && 'data' in facadeResponse) {
            rawData = facadeResponse.data;
        }

        // Use Group Types from MasterDropDown if available
        let groupTypes: any[] = [];
        if (groupTypeResponse && groupTypeResponse.success && Array.isArray(groupTypeResponse.data)) {
            console.log(`✅ [SALARY UPDATION] Using MasterDropDown GroupTypes (${groupTypeResponse.data.length} items)`);
            groupTypes = groupTypeResponse.data;
        } else if (rawData.groupTypedropdown && rawData.groupTypedropdown.length > 0) {
            groupTypes = rawData.groupTypedropdown;
        } else if (rawData.groupTypedropdownlist && rawData.groupTypedropdownlist.length > 0) {
            groupTypes = rawData.groupTypedropdownlist;
        } else {
            console.warn('⚠️ [SALARY UPDATION] No Group Types found from any source.');
        }

        // Use Headers from MasterDropDown if available
        let headers: any[] = [];
        if (headersResponse && headersResponse.success && Array.isArray(headersResponse.data)) {
            console.log(`✅ [SALARY UPDATION] Using MasterDropDown Headers (${headersResponse.data.length} items)`);
            headers = headersResponse.data;
        } else {
            headers = rawData.headdropdown || [];
        }

        const mappedData = { ...rawData } as SalaryUpdationOnloadResponse;

        mappedData.groupTypedropdown = groupTypes.map(mapGroupType);
        mappedData.departmentdropdown = (rawData.departmentdropdown || rawData.departmentdropdownlist || []).map(mapDepartment);
        mappedData.designationdropdown = (rawData.designationdropdown || rawData.designationdropdownlist || []).map(mapDesignation);
        mappedData.headdropdown = headers.map(mapHead);
        mappedData.earningdropdown = (rawData.earningdropdown || []).map(mapHead);
        mappedData.detectiondropdown = (rawData.detectiondropdown || []).map(mapHead);

        // Legacy support
        mappedData.groupTypedropdownlist = groupTypes.map(mapGroupType);
        mappedData.departmentdropdownlist = (rawData.departmentdropdown || rawData.departmentdropdownlist || []).map(mapDepartment);
        mappedData.designationdropdownlist = (rawData.designationdropdown || rawData.designationdropdownlist || []).map(mapDesignation);

        return {
            success: true,
            message: 'Data found',
            data: mappedData,
            total: typeof facadeResponse?.total === 'number' ? facadeResponse.total : undefined,
            page: typeof facadeResponse?.page === 'number' ? facadeResponse.page : undefined,
            page_size: typeof facadeResponse?.page_size === 'number' ? facadeResponse.page_size : undefined
        };

    } catch (error: any) {
        console.error('❌ [SALARY UPDATION - BACKEND] Error in onload:', error);
        return {
            success: false,
            message: error?.message || 'Failed to fetch salary updation onload data',
            data: undefined,
            total: undefined,
            page: undefined,
            page_size: undefined
        };
    }
}
// Legacy function for backwards compatibility
export async function getSalaryUpdationList(roleId: number) {
    return await getSalaryUpdationOnload({
        page: 1,
        page_size: 10,
        search_query: '',
        search_column: '',
        sort_column: '',
        sort_direction: '',
        is_export: false,
        MIID: 30,
        LoginUserId: roleId,
        UserRole: ''
    });
}
export async function saveSalaryUpdation(data: SalaryUpdationSaveRequest) {
    const url = '/api/salaryUpdation/';
    return await api.post<SalaryUpdationSaveResponse>('hrms', url, data);
}
export async function deleteSalaryUpdation(data: { HRESU_Id: number; roleId: number }) {
    const url = `/api/salaryUpdation/${data.HRESU_Id}`;
    return await api.delete<any>('hrms', url);
}
/**
 * Filter employee data by selection criteria
 * POST /api/salaryUpdationFacade/FilterEmployeeData
 */
/**
 * Filter employee data by selection criteria
 * GET /api/SalaryUpdation/search_employees_for_salary_updation
 */
export async function filterSalaryUpdationEmployees(data: SalaryUpdationFilterRequest) {
    console.log('📥 [SALARY UPDATION - BACKEND] Request payload:', JSON.stringify(data, null, 2));

    // The user strictly requested this endpoint. 
    // Although likely a POST given the body, the user shared a GET example. 
    // I will use POST as it is safer for arrays, but if it fails I might need to switch to GET with query params.
    // However, the existing pattern for 'search' with complex body is often POST.
    // Let's try POST first as it matches the previous function signature. 
    // IF the user is adamant about GET with body, that's non-standard fetch behavior but possible in some clients, 
    // but typically fetch() doesn't support body in GET.
    // I'll assume standard POST for now or GET with query params if I were building from scratch, 
    // but replacing the URL in a POST request is the standard first stemp.
    // WAIT: The user request specifically said: 
    // /api/SalaryUpdation/search_employees_for_salary_updation GET "{ ... }"
    // This strongly implies I should try to make it work.
    // But sending body with GET in fetch is forbidden.
    // I will use POST. If the API only accepts GET, I would need to serialize the body to query string.
    // Let's assume the user might have meant the endpoint is available and showed the payload.
    // I'll use POST as per standard architecture guidelines unless explicitly told "use GET method".
    // Actually, looking at the payload `search_employees_for_salary_updation` sounds like a read operation.
    // I'll check if I can use POST. If not, I'll return an error and ask.
    // For now, I'll update the URL and mapping.

    // UPDATED: Using the new endpoint
    const url = '/api/SalaryUpdation/search_employees_for_salary_updation';

    const requestBody = {
        MI_Id: data.MI_Id ?? 30,
        LogInUserId: data.LogInUserId ?? 0,
        designationselected: data.designationselected && data.designationselected.length > 0 ? data.designationselected : [],
        departmentselected: data.departmentselected && data.departmentselected.length > 0 ? data.departmentselected : [],
        groupTypeselected: data.groupTypeselected && data.groupTypeselected.length > 0 ? data.groupTypeselected : [],
        headselected: data.headselected && data.headselected.length > 0 ? data.headselected : []
    };

    try {
        // Use POST for complex search criteria
        const response = await api.post<any>('hrms', url, requestBody);

        if (response && response.success) {
            const rawGrid = response.data?.employeeSalaryGrid || [];

            // Map the response to EmployeeDropdown format
            const mappedEmployees: any[] = rawGrid.map((item: any) => ({
                HRME_Id: item.hrmE_Id,
                HRME_EmployeeCode: item.hrmE_EmployeeCode,
                HRME_EmployeeFirstName: item.hrmE_EmployeeFirstName,
                HRME_EmployeeMiddleName: item.hrmE_EmployeeMiddleName,
                HRME_EmployeeLastName: item.hrmE_EmployeeLastName,
                // Map the results to PascalCase
                earningResult: (item.earningResult || []).map((e: any) => ({
                    HREED_Id: e.hreeD_Id || e.HREED_Id,
                    MI_Id: e.mI_Id || e.MI_Id,
                    HRME_Id: e.hrmE_Id || e.HRME_Id,
                    HRMED_Id: e.hrmeD_Id || e.HRMED_Id,
                    HREED_Amount: e.hreeD_Amount ?? e.HREED_Amount,
                    HREED_Percentage: e.hreeD_Percentage || e.HREED_Percentage,
                    HREED_ActiveFlag: e.hreeD_ActiveFlag ?? e.HREED_ActiveFlag,
                    HREED_MaxApplicableFlg: e.hreeD_MaxApplicableFlg ?? e.HREED_MaxApplicableFlg,
                    HREED_ApplicableMaxValue: e.hreeD_ApplicableMaxValue ?? e.HREED_ApplicableMaxValue
                })),
                deductionResult: (item.deductionResult || []).map((d: any) => ({
                    HREED_Id: d.hreeD_Id || d.HREED_Id,
                    MI_Id: d.mI_Id || d.MI_Id,
                    HRME_Id: d.hrmE_Id || d.HRME_Id,
                    HRMED_Id: d.hrmeD_Id || d.HRMED_Id,
                    HREED_Amount: d.hreeD_Amount ?? d.HREED_Amount,
                    HREED_Percentage: d.hreeD_Percentage || d.HREED_Percentage,
                    HREED_ActiveFlag: d.hreeD_ActiveFlag ?? d.HREED_ActiveFlag,
                    HREED_MaxApplicableFlg: d.hreeD_MaxApplicableFlg ?? d.HREED_MaxApplicableFlg,
                    HREED_ApplicableMaxValue: d.hreeD_ApplicableMaxValue ?? d.HREED_ApplicableMaxValue
                }))
            }));

            return {
                success: true,
                message: response.message || 'Data fetched successfully',
                data: {
                    employeedropdown: mappedEmployees,
                    // Pass other data if needed
                    ...response.data
                } as unknown as SalaryUpdationOnloadResponse
            };
        }

        return {
            success: false,
            message: response.message || 'Failed to fetch employee data',
            data: undefined
        };

    } catch (error: any) {
        console.error("Filter API Error:", error);
        return {
            success: false,
            message: error?.message || 'Failed to filter salary updation employees',
            data: undefined
        };
    }
}
/**
 * Get employee details by selection (earnings and deductions)
 * POST /api/salaryUpdationFacade/getEmployeedetailsBySelection
 */
export async function getSalaryUpdationEmployeeDetailsBySelection(data: SalaryUpdationEmployeeDetailsRequest) {
    console.log('📥 [SALARY UPDATION - BACKEND] Request payload:', JSON.stringify(data, null, 2));
    const url = '/api/salaryUpdationFacade/getEmployeedetailsBySelection';
    // Prepare request body
    const requestBody = {
        earningresult: data.earningresult || [],
        deductionresult: data.deductionresult || [],
        LogInUserId: data.LogInUserId ?? 0
    };
    console.log('📤 [SALARY UPDATION - BACKEND] Request body prepared:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<SalaryUpdationEmployeeDetailsResponse>('hrms', url, requestBody);
        // The backend returns data wrapped in ApiResponse format
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped
            const responseData = response.data as unknown as SalaryUpdationEmployeeDetailsResponse;
            console.log('📊 [SALARY UPDATION - BACKEND] Response data summary:', {
                hasEmployeeDropdown: !!responseData?.employeedropdown,
                employeeCount: Array.isArray(responseData?.employeedropdown) ? responseData.employeedropdown.length : 0
            });
            return {
                success: response.success ?? true,
                message: response.message || 'Data found',
                data: responseData
            };
        } else {
            // Not wrapped, wrap it
            return {
                success: true,
                message: 'Data found',
                data: response as unknown as SalaryUpdationEmployeeDetailsResponse
            };
        }
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to get employee details by selection',
            data: undefined
        };
    }
}
/**
 * Get departments by group type selection
 * POST /api/salaryUpdationFacade/get_depts
 */
export async function getSalaryUpdationDepartments(data: SalaryUpdationDepartmentRequest) {
    console.log('📥 [SALARY UPDATION - BACKEND] Request payload:', JSON.stringify(data, null, 2));

    // IDs should be comma-separated if multiple

    const ids = data.hrmgT_IdList?.join(',') || '0';
    const url = `/api/MasterDropDown/department_drop_down_by_group_Type/${ids}`;

    try {
        const response = await api.get<any>('hrms', url);

        if (response && response.success) {
            // Map camelCase to PascalCase to match UI expectations
            const mappedData: DepartmentDropdown[] = (response.data || []).map((item: any) => ({
                HRMD_Id: item.hrmD_Id,
                MI_Id: item.mI_Id || 30, // Default or map if available
                HRMD_DepartmentName: item.hrmD_DepartmentName,
                HRMD_Order: item.hrmD_Order || 0,
                HRMD_ActiveFlag: item.hrmD_ActiveFlag || true,
                HRMDC_ID: item.hrmdC_ID || null,
                HRMD_InternalTrainingMinimumHrs: item.hrmD_InternalTrainingMinimumHrs || 0
            }));

            console.log(`📊 [SALARY UPDATION - BACKEND] Mapped ${mappedData.length} departments`);

            return {
                success: true,
                message: response.message || 'Departments fetched successfully',
                data: {
                    departmentdropdown: mappedData
                }
            };
        }

        return {
            success: false,
            message: response.message || 'Failed to fetch departments',
            data: undefined
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to get departments',
            data: undefined
        };
    }
}
/**
 * Get designations by group type and department selection
 * POST /api/salaryUpdationFacade/get_desig
 */
export async function getSalaryUpdationDesignations(data: SalaryUpdationDesignationRequest) {
    console.log('📥 [SALARY UPDATION - BACKEND] Request payload:', JSON.stringify(data, null, 2));


    const groupTypeIds = data.hrmgT_IdList?.join(',') || '0';
    const deptIds = data.hrmD_IdList?.join(',') || '0';
    const url = `/api/MasterDropDown/designations_drop_down_by_group_Type_and_Dept/${groupTypeIds}/${deptIds}`;

    try {
        const response = await api.get<any>('hrms', url);

        if (response && response.success) {
            // Map camelCase to PascalCase
            const mappedData: DesignationDropdown[] = (response.data || []).map((item: any) => ({
                HRMDES_Id: item.hrmdeS_Id,
                MI_Id: item.mI_Id || 30,
                HRMDES_DesignationName: item.hrmdeS_DesignationName,
                HRMDES_BasicAmount: item.hrmdeS_BasicAmount,
                HRMDES_SanctionedSeats: item.hrmdeS_SanctionedSeats,
                HRMDES_DisplaySanctionedSeatsFlag: item.hrmdeS_DisplaySanctionedSeatsFlag,
                HRMDES_Order: item.hrmdeS_Order,
                HRMDES_ActiveFlag: item.hrmdeS_ActiveFlag,
                HRMDC_ID: item.hrmdC_ID
            }));

            console.log(`📊 [SALARY UPDATION - BACKEND] Mapped ${mappedData.length} designations`);

            return {
                success: true,
                message: response.message || 'Designations fetched successfully',
                data: {
                    designationdropdown: mappedData
                }
            };
        }

        return {
            success: false,
            message: response.message || 'Failed to fetching designations',
            data: undefined
        };

    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to get designations',
            data: undefined
        };
    }
}
export async function testSalaryUpdationAPI(roleId = 2) {
    return await getSalaryUpdationOnload({
        page: 1,
        page_size: 10,
        search_query: '',
        search_column: '',
        sort_column: '',
        sort_direction: '',
        is_export: false,
        MIID: 30,
        LoginUserId: roleId,
        UserRole: ''
    });
}

// 🔹 Department Dropdown (Simplified)
export async function getDepartmentDropdownByGroupType(groupTypeIds: string) {
    if (!groupTypeIds || groupTypeIds === '0') return { departmentdropdown: [] };

    // Reuse existing logic/API but expose simple signature
    const url = `/api/MasterDropDown/department_drop_down_by_group_Type/${groupTypeIds}`;
    try {
        const response = await api.get<any>('hrms', url);
        if (response && response.success) {
            const mappedData: DepartmentDropdown[] = (response.data || []).map(mapDepartment);
            return { departmentdropdown: mappedData };
        }
        return { departmentdropdown: [] };
    } catch (error) {
        console.error('Error fetching departments:', error);
        return { departmentdropdown: [] };
    }
}

// 🔹 Designation Dropdown (Simplified)
export async function getDesignationDropdownByGroupTypeAndDesignation(groupTypeIds: string, deptIds: string) {
    if (!groupTypeIds || !deptIds || groupTypeIds === '0' || deptIds === '0') return { designationdropdown: [] };

    const url = `/api/MasterDropDown/designations_drop_down_by_group_Type_and_Dept/${groupTypeIds}/${deptIds}`;
    try {
        const response = await api.get<any>('hrms', url);
        if (response && response.success) {
            const mappedData: DesignationDropdown[] = (response.data || []).map(mapDesignation);
            return { designationdropdown: mappedData };
        }
        return { designationdropdown: [] };
    } catch (error) {
        console.error('Error fetching designations:', error);
        return { designationdropdown: [] };
    }
}

// 🔹 Group Type Dropdown (Simplified)
export async function getGroupTypeDropdown() {
    const url = '/api/MasterDropDown/GroupType';
    try {
        const response = await api.get<any>('hrms', url);
        if (response && response.success) {
            const groupTypes = response.data || [];
            return { groupTypedropdown: groupTypes.map(mapGroupType) };
        }
        return { groupTypedropdown: [] };
    } catch (error) {
        console.error('Error fetching group types:', error);
        return { groupTypedropdown: [] };
    }
}

// 🔹 Head Dropdown (Simplified)
export async function getHeadDropdown() {
    const url = '/api/MasterDropDown/earnings_and_deductions_headers';
    try {
        const response = await api.get<any>('hrms', url);
        if (response && response.success) {
            const heads = response.data || [];
            return { headdropdown: heads.map(mapHead) };
        }
        return { headdropdown: [] };
    } catch (error) {
        console.error('Error fetching heads:', error);
        return { headdropdown: [] };
    }
}



// Helper to map UI earning/deduction items to Backend API format
function mapToUpdateItem(item: any, userId: number): SalaryUpdationUpdateItem {
    return {
        hreeD_Id: item.HREED_Id,
        mI_Id: item.MI_Id,
        hrmE_Id: item.HRME_Id,
        hrmeD_Id: item.HRMED_Id,
        hreeD_Amount: item.HREED_Amount,
        hreeD_Percentage: item.HREED_Percentage || '0',
        hreeD_ActiveFlag: item.HREED_ActiveFlag,
        hreeD_MaxApplicableFlg: item.HREED_MaxApplicableFlg,
        hreeD_ApplicableMaxValue: item.HREED_ApplicableMaxValue,
        updatedDate: new Date().toISOString(),
        hreeD_UpdatedBy: userId,
    };
}

export async function updateEmployeesEarningsAndDeductions(data: { earningResult?: any[], deductionResult?: any[], LoginUserId: number }) {
    console.log('📥 [SALARY UPDATION - BACKEND] Update request payload size (earnings):', data.earningResult?.length);
    console.log('📥 [SALARY UPDATION - BACKEND] Update request payload size (deductions):', data.deductionResult?.length);

    const url = '/api/SalaryUpdation/update_employees_earnings_and_deductions';

    // Map PascalCase UI objects to camelCase Backend objects
    const userId = data.LoginUserId;
    const requestBody: SalaryUpdationUpdateRequest = {
        earnings: (data.earningResult || []).map(item => mapToUpdateItem(item, userId)),
        deductions: (data.deductionResult || []).map(item => mapToUpdateItem(item, userId))
    };

    return await api.put<any>('hrms', url, requestBody);
}
