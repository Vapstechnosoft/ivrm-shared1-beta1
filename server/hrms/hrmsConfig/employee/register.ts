'use server';

import { type ApiResponse, api, getSearchParamsUrl } from '@/lib/apiService';
import { auth } from '@/lib/auth';
import type { ApiSearchparams } from '@/types';
import type {
    IBankDropdown,
    IBloodGroupDropdown,
    ICasteCategoryDropdown,
    ICasteDropdown,
    IContactTypeDropdown,
    ICountryDropdown,
    ICourseDropdown,
    IDepartmentDropdown,
    IDesignationDropdown,
    IEmployeeDetailResponse,
    IEmployeeList,
    IEmployeeSaveRequest,
    IEmployeeSaveResponse,
    IEmployeeTypeDropdown,
    IGenderDropdown,
    IGradeDropdown,
    IGroupTypeDropdown,
    IInstitutionDropdown,
    ILeaveReasonDropdown,
    IMaritalStatusDropdown,
    IPaymentModeDropdown,
    IReligionDropdown,
    ISalaryTypeDropdown,
    IScoreTypeDropdown,
    ISpecializationDropdown,
    IStateDropdown,
    ITeachingTypeDropdown
} from '@/types/hrms/hrms-config/employee';
import type { EmployeeRegisterOnloadResponse } from '@/types/hrms/employee-register';

// ==================== Dropdown Endpoints ====================

/**
 * Get Grade List for dropdowns
 * GET /api/MasterDropDown/GetGradeList
 */
export async function getGradeDropdown() {
    const url = '/api/MasterDropDown/GetGradeList';
    try {
        const response = await api.get<IGradeDropdown[]>('hrms', url);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Grade Dropdown:', error);
        return [];
    }
}

/**
 * Get Employee Type List for dropdowns
 * GET /api/MasterDropDown/GetEmployeeType
 */
export async function getEmployeeTypeDropdown() {
    const url = '/api/MasterEmployeeType';
    console.log('🔍 [API DEBUG] Fetching Employee Type Dropdown from:', url);
    try {
        const response = await api.get<IEmployeeTypeDropdown[]>('hrms', url);
        console.log('✅ [API DEBUG] Employee Type Dropdown Response:', JSON.stringify(response, null, 2));
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Employee Type Dropdown:', error);
        return [];
    }
}

/**
 * Get Group Type List for dropdowns
 * GET /api/MasterDropDown/GroupType
 */
export async function getGroupTypeDropdown() {
    const url = '/api/MasterDropDown/GroupType';
    try {
        const response = await api.get<IGroupTypeDropdown[]>('hrms', url);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Group Type Dropdown:', error);
        return [];
    }
}

/**
 * Get Department List for dropdowns
 * GET /api/MasterDepartment
 */
export async function getDepartmentDropdown() {
    const url = '/api/MasterDropDown/GetDepartments';
    console.log('🔍 [API DEBUG] Fetching Departments from:', url);
    try {
        const response = await api.get<IDepartmentDropdown[]>('hrms', url);
        console.log('✅ [API DEBUG] Departments Response:', response);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Department Dropdown:', error);
        return [];
    }
}

/**
 * Get Designation List for dropdowns
 * GET /api/MasterDropDown/GetDesignation
 */
export async function getDesignationDropdown() {
    const url = '/api/MasterDropDown/GetDesignation';
    try {
        const response = await api.get<IDesignationDropdown[]>('hrms', url);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Designation Dropdown:', error);
        return [];
    }
}

/**
 * Get Gender List for dropdowns
 * GET /api/MasterDropDown/GetGenderList
 */
export async function getGenderDropdown() {
    const url = '/api/MasterDropDown/GetGenderList';
    try {
        const response = await api.get<IGenderDropdown[]>('hrms', url);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Gender Dropdown:', error);
        return [];
    }
}

/**
 * Get Marital Status List for dropdowns
 * GET /api/MasterDropDown/GetMaritalStateList
 */
export async function getMaritalStatusDropdown() {
    const url = '/api/MasterDropDown/GetMaritalStateList';
    try {
        const response = await api.get<IMaritalStatusDropdown[]>('hrms', url);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Marital Status Dropdown:', error);
        return [];
    }
}

/**
 * Get Religion List for dropdowns
 * GET /api/MasterDropDown/get_religion_drop_down
 */
export async function getReligionDropdown() {
    const url = '/api/MasterDropDown/get_religion_drop_down';
    console.log('🔍 [API DEBUG] Fetching Religions from:', url);
    try {
        const response = await api.get<IReligionDropdown[]>('hrms', url);
        console.log('✅ [API DEBUG] Religions Response:', response);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Religion Dropdown:', error);
        return [];
    }
}

/**
 * Get Caste Category List for dropdowns
 * GET /api/MasterDropDown/caste_category_drop_down_by_religion/{ivrmmr_ids}
 */
export async function getCasteCategoryDropdown(religionIds: number | string) {
    if (!religionIds) return { success: true, message: '', data: [] };
    const url = `/api/MasterDropDown/caste_category_drop_down_by_religion/${religionIds}`;
    try {
        const response = await api.get<ICasteCategoryDropdown[]>('hrms', url);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Caste Category Dropdown:', error);
        return [];
    }
}

/**
 * Get Caste List for dropdowns
 * GET /api/MasterDropDown/caste_drop_down_by_caste_category/{imcc_ids}
 */
export async function getCasteDropdown(casteCategoryIds: number | string) {
    if (!casteCategoryIds) return { success: true, message: '', data: [] };
    const url = `/api/MasterDropDown/caste_drop_down_by_caste_category/${casteCategoryIds}`;
    try {
        const response = await api.get<ICasteDropdown[]>('hrms', url);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Caste Dropdown:', error);
        return [];
    }
}

/**
 * Get Bank List for dropdowns
 * GET /api/MasterDropDown/GetBankList
 */
export async function getBankDropdown() {
    const url = '/api/MasterDropDown/GetBankList';
    try {
        const response = await api.get<IBankDropdown[]>('hrms', url);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Bank Dropdown:', error);
        return [];
    }
}

/**
 * Get Country List for dropdowns
 * GET /api/MasterDropDown/GetCountryList
 */
export async function getCountryDropdown() {
    const url = '/api/MasterDropDown/GetCountryList';
    try {
        const response = await api.get<ICountryDropdown[]>('hrms', url);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Country Dropdown:', error);
        return [];
    }
}

/**
 * Get State List for dropdowns by country ID
 * GET /api/MasterDropDown/GetStateList?CountryId={country_id}
 */
export async function getStateDropdown(country_id: number) {
    const url = `/api/MasterDropDown/GetStateList?CountryId=${country_id}`;
    try {
        const response = await api.get<IStateDropdown[]>('hrms', url);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch State Dropdown:', error);
        return [];
    }
}

/**
 * Get Course List for dropdowns
 * GET /api/MasterDropDown/GetCourseList
 */
export async function getCourseDropdown() {
    const url = '/api/MasterDropDown/GetCourseList';
    try {
        const response = await api.get<ICourseDropdown[]>('hrms', url);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Course Dropdown:', error);
        return [];
    }
}

/**
 * Get Specialisation List for dropdowns
 * GET /api/MasterDropDown/GetSpecialisationList
 */
export async function getSpecializationDropdown() {
    const url = '/api/MasterSpecialisation';
    console.log('🔍 [API DEBUG] Fetching Specializations from:', url);
    try {
        const response = await api.get<ISpecializationDropdown[]>('hrms', url);
        console.log('✅ [API DEBUG] Specializations Response:', response);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Specializations:', error);
        return [];
    }
}

/**
 * Get Institution List for dropdowns
 * GET /api/MasterDropDown/GetInstitutionList
 */
export async function getInstitutionDropdown() {
    const url = '/api/MasterDropDown/GetInstitutionList';
    try {
        const response = await api.get<IInstitutionDropdown[]>('hrms', url);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Institution Dropdown:', error);
        return [];
    }
}

/**
 * Get Payment Mode List for dropdowns
 * GET /api/MasterDropDown/GetPaymentModeList
 */
export async function getPaymentModeDropdown() {
    const url = '/api/MasterDropDown/GetPaymentModeList';
    try {
        const response = await api.get<IPaymentModeDropdown[]>('hrms', url);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Payment Mode Dropdown:', error);
        return [];
    }
}

/**
 * Get Leave Reason List for dropdowns
 * GET /api/MasterDropDown/GetLeaveReasonList
 */
export async function getLeaveReasonDropdown() {
    const url = '/api/MasterDropDown/GetLeaveReasonList';
    try {
        const response = await api.get<ILeaveReasonDropdown[]>('hrms', url);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Leave Reason Dropdown:', error);
        return [];
    }
}

/**
 * Get Blood Group List for dropdowns
 * GET /api/MasterDropDown/GetBloodGroupList
 */
export async function getBloodGroupDropdown() {
    const url = '/api/MasterDropDown/GetBloodGroupList';
    try {
        const response = await api.get<IBloodGroupDropdown[]>('hrms', url);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Blood Group Dropdown:', error);
        return [];
    }
}

/**
 * Get Salary Type List for dropdowns
 * GET /api/MasterDropDown/GetSalaryTypeList
 */
export async function getSalaryTypeDropdown() {
    const url = '/api/MasterDropDown/GetSalaryTypeList';
    try {
        const response = await api.get<ISalaryTypeDropdown[]>('hrms', url);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Salary Type Dropdown:', error);
        return [];
    }
}

/**
 * Get Teaching Type List for dropdowns
 * GET /api/MasterDropDown/GetTeachingTypeList
 */
export async function getTeachingTypeDropdown() {
    const url = '/api/MasterDropDown/GetTeachingTypeList';
    try {
        const response = await api.get<ITeachingTypeDropdown[]>('hrms', url);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Teaching Type Dropdown:', error);
        return [];
    }
}

/**
 * Get Score Type List for dropdowns (CGPA Or Percentage)
 * GET /api/MasterDropDown/ScoreTypeList
 */
export async function getScoreTypeDropdown() {
    const url = '/api/MasterDropDown/ScoreTypeList';
    try {
        const response = await api.get<IScoreTypeDropdown[]>('hrms', url);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Score Type Dropdown:', error);
        return [];
    }
}

/**
 * Get Contact Type List for dropdowns (Default/Alternate for mobile, email, bank)
 * GET /api/MasterDropDown/GetContactType
 */
export async function getContactTypeDropdown() {
    const url = '/api/MasterDropDown/GetContactType';
    try {
        const response = await api.get<IContactTypeDropdown[]>('hrms', url);
        return response || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Contact Type Dropdown:', error);
        return [];
    }
}

/**
 * Get Earning List
 * GET /api/MasterDropDown/GetEarningList
 */
export async function getEarningList() {
    const url = '/api/MasterDropDown/GetEarningList';
    try {
        const response = await api.getArray<any>('hrms', url);
        return response.data || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Earning List:', error);
        return [];
    }
}

/**
 * Get Deduction List
 * GET /api/MasterDropDown/GetDeductionList
 */
export async function getDeductionList() {
    const url = '/api/MasterDropDown/GetDeductionList';
    try {
        const response = await api.getArray<any>('hrms', url);
        return response.data || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Deduction List:', error);
        return [];
    }
}

/**
 * Get Arrears List
 * GET /api/MasterDropDown/GetArrearsList
 */
export async function getArrearsList() {
    const url = '/api/MasterDropDown/GetArrearsList';
    try {
        const response = await api.getArray<any>('hrms', url);
        return response.data || [];
    } catch (error) {
        console.error('❌ [API ERROR] Failed to fetch Arrear List:', error);
        return [];
    }
}

// ==================== Employee Onload Endpoint ====================

/**
 * Get Employee Registration Onload Data
 * GET /api/EmployeeRegistration/employee_registration_get_employee_details
 * This endpoint fetches all initial data including dropdowns and configurations
 */
export async function getEmployeeRegisterOnload(MI_Id: number, HRME_Id?: number) {
    let url = `/api/EmployeeRegistration/employee_registration_get_employee_details?MI_Id=${MI_Id}`;
    if (HRME_Id && HRME_Id > 0) {
        url += `&HRME_Id=${HRME_Id}`;
    }
    console.log('🔍 [API DEBUG] Fetching Employee Onload from:', url);
    try {
        const response = await api.get<any>('hrms', url);
        return response || { success: false, data: {} };
    } catch (error: any) {
        console.error('❌ [API ERROR] Failed to fetch Employee Onload:', error);
        return {
            success: false,
            data: {},
            message: error?.message || 'Failed to fetch onload data'
        };
    }
}

// ==================== Employee CRUD Endpoints ====================

/**
 * Get Employee List with search, sort, and pagination
 * GET /api/EmployeeRegistration/employee_registration_get_employee_details
 */
export async function getEmployeeList(searchParams?: ApiSearchparams) {
    const session = await auth();
    const MI_Id = session?.user?.mi_id || 30;

    // Define columns to search against if not already specified
    const searchColumns =
        searchParams?.search_columns || 'HRME_EmployeeFirstName,HRME_EmployeeLastName,HRME_EmployeeCode';
    const queryParams = getSearchParamsUrl(searchParams, searchColumns);

    const url = `/api/EmployeeRegistration/employee_registration_get_employee_details?MI_Id=${MI_Id}${queryParams ? `&${queryParams}` : ''}`;

    try {
        const response = await api.get<any>('hrms', url);
        return response || { success: false, data: [] };
    } catch (error: any) {
        console.error('API Error in getEmployeeList:', error);
        return {
            success: false,
            data: [],
            message: error?.message || 'Failed to fetch employee list'
        };
    }
}

/**
 * Get Employee by ID
 * GET /api/EmployeeRegistration/GetEmployeeDetailsById/{id}
 */
export async function getEmployeeById(id: number) {
    const url = `/api/EmployeeRegistration/GetEmployeeDetailsById/${id}`;
    try {
        const response = await api.get<IEmployeeDetailResponse>('hrms', url);
        return response;
    } catch (error: any) {
        console.error('❌ [API ERROR] Failed to fetch Employee by ID:', error);
        return { success: false, message: error?.message || 'Failed to fetch employee details' } as any;
    }
}

/**
 * Save or Update Employee Personal Details
 * POST /api/EmployeeRegistration/employee_registration_save_employee_details
 * Note: This endpoint is used for both Employee Information and Address tabs
 */
export async function saveEmployee(data: IEmployeeSaveRequest) {
    const url = '/api/EmployeeRegistration/employee_registration_save_employee_details';
    console.log('📦 [API DEBUG] saveEmployee Payload:', JSON.stringify(data, null, 2));
    try {
        const response = await api.post<IEmployeeSaveResponse>('hrms', url, data);
        console.log('✅ [API DEBUG] saveEmployee Response:', JSON.stringify(response, null, 2));
        return response;
    } catch (error: any) {
        console.error('❌ [API ERROR] saveEmployee Failed:', error);
        console.error('❌ [API ERROR] Details:', JSON.stringify(error?.response?.data || {}, null, 2));
        const backendMessage = error?.response?.data?.message || (typeof error?.response?.data === 'string' ? error.response.data : null);
        return { success: false, message: backendMessage || error?.message || 'Failed to save personal details' };
    }
}

/**
 * Toggle Employee (Activate/Deactivate)
 * PUT /api/EmployeeRegistration/employee_registration_activate_deactivate/{id}
 */
export async function toggleEmployee(id: number) {
    try {
        if (!id) {
            return { success: false, message: 'Invalid Employee ID' };
        }

        // Exact pattern from working curl: GET with ID in path
        const url = `/api/EmployeeRegistration/employee_registration_activate_deactivate/${id}`;

        console.info(`📡 [API CALL] Toggling employee status (GET): ${url}`);

        // Method is GET as per user's working backend test
        const response = await api.get<any>('hrms', url);

        return response;
    } catch (error: any) {
        console.error('❌ [SERVER ACTION ERROR] toggleEmployee:', error);
        const backendMessage = error?.response?.data?.message || JSON.stringify(error?.response?.data);
        const errorMessage = backendMessage || error?.message || 'An unknown error occurred';
        return { success: false, message: `Toggle Failed: ${errorMessage}` };
    }
}

/**
 * Delete Employee
 * DELETE /api/EmployeeRegistrationNew/delete/{id}
 */
export async function deleteEmployee(id: number) {
    const url = `/api/EmployeeRegistrationNew/delete/${id}`;
    return await api.delete<any>('hrms', url);
}

/**
 * Save Employee Qualification Details
 * POST /api/EmployeeRegistration/SaveQualificationDetails
 */
export async function saveEmployeeQualification(data: any[]) {
    // Reverting to the exact URL provided by the user in turnover 1056
    const url = '/api/EmployeeRegistration/employee_registration_save_qulaification';
    try {
        return await api.post<any>('hrms', url, data);
    } catch (error: any) {
        console.error('❌ [API ERROR] saveEmployeeQualification:', error);
        return { success: false, message: error?.message || 'Failed to save qualification details' };
    }
}

/**
 * Save Employee Experience Details
 * POST /api/EmployeeRegistration/SaveExperienceDetails
 */
export async function saveEmployeeExperience(data: any[]) {
    // Reverting to the exact URL provided by the user in turnover 1056
    const url = '/api/EmployeeRegistration/employee_registration_save_experience_details';
    try {
        return await api.post<any>('hrms', url, data);
    } catch (error: any) {
        console.error('❌ [API ERROR] saveEmployeeExperience:', error);
        return { success: false, message: error?.message || 'Failed to save experience details' };
    }
}

/**
 * Save Employee Document Details
 * POST /api/EmployeeRegistration/employee_registration_save_document_details
 */
export async function saveEmployeeDocument(data: any) {
    const url = '/api/EmployeeRegistration/employee_registration_save_document_details';
    try {
        return await api.post<any>('hrms', url, data);
    } catch (error: any) {
        console.error('❌ [API ERROR] saveEmployeeDocument:', error);
        return { success: false, message: error?.message || 'Failed to save document details' };
    }
}

/**
 * Save Employee Medical Details
 * POST /api/EmployeeRegistration/employee_registration_save_medical_details
 */
export async function saveEmployeeMedical(data: any) {
    const url = '/api/EmployeeRegistration/employee_registration_save_medical_details';
    try {
        return await api.post<any>('hrms', url, data);
    } catch (error: any) {
        console.error('❌ [API ERROR] saveEmployeeMedical:', error);
        return { success: false, message: error?.message || 'Failed to save medical details' };
    }
}

/**
 * Save Employee Other Details
 * POST /api/EmployeeRegistration/employee_registration_save_other_details
 */
export async function saveEmployeeOtherDetails(data: any) {
    const url = '/api/EmployeeRegistration/employee_registration_save_other_details';
    try {
        return await api.post<any>('hrms', url, data);
    } catch (error: any) {
        console.error('❌ [API ERROR] saveEmployeeOtherDetails:', error);
        return { success: false, message: error?.message || 'Failed to save other details' };
    }
}

/**
 * Upload Staff Photo
 * POST /api/EmployeeRegistration/UploadStaffPhoto
 */
export async function uploadStaffPhoto(formData: FormData) {
    const url = '/api/EmployeeRegistration/upload-staff-photo';
    try {
        return await api.post<any>('hrms', url, formData);
    } catch (error: any) {
        console.error('❌ [API ERROR] uploadStaffPhoto:', error);
        return { success: false, message: error?.message || 'Failed to upload staff photo' };
    }
}
/**
 * Save Employee Earning Details
 * POST /api/EmployeeRegistration/employee_registration_save_earning_details
 */
export async function saveEmployeeEarnings(data: any) {
    const url = '/api/EmployeeRegistration/employee_registration_save_earning_details';
    try {
        // Ensure data follows the requested structure: { employee: { hrmE_Id: number }, employeeEarningDeductionArrear: [...] }
        return await api.post<any>('hrms', url, data);
    } catch (error: any) {
        console.error('❌ [API ERROR] saveEmployeeEarnings:', error);
        return { success: false, message: error?.message || 'Failed to save earning details' };
    }
}

/**
 * Save Employee Deduction Details
 * POST /api/EmployeeRegistration/employee_registration_save_deduction_details
 */
export async function saveEmployeeDeductions(data: any) {
    const url = '/api/EmployeeRegistration/employee_registration_save_deduction_details';
    try {
        return await api.post<any>('hrms', url, data);
    } catch (error: any) {
        console.error('❌ [API ERROR] saveEmployeeDeductions:', error);
        return { success: false, message: error?.message || 'Failed to save deduction details' };
    }
}

/**
 * Save Employee Arrear Details
 * POST /api/EmployeeRegistration/employee_registration_save_arrear_details
 */
export async function saveEmployeeArrears(data: any) {
    const url = '/api/EmployeeRegistration/employee_registration_save_arrear_details';
    try {
        return await api.post<any>('hrms', url, data);
    } catch (error: any) {
        console.error('❌ [API ERROR] saveEmployeeArrears:', error);
        return { success: false, message: error?.message || 'Failed to save arrear details' };
    }
}



/**
 * Save Employee Bank Details
 * POST /api/EmployeeRegistration/employee_registration_save_bank_details
 */
export async function saveBankDetails(data: any) {
    const url = '/api/EmployeeRegistration/employee_registration_save_bank_details';
    try {
        return await api.post<any>('hrms', url, data);
    } catch (error: any) {
        console.error('❌ [API ERROR] saveBankDetails:', error);
        return { success: false, message: error?.message || 'Failed to save bank details' };
    }
}

/**
 * Get Employee Salary Details By Head (Calculated)
 * POST /api/EmployeeRegistration/getEmployeeSalaryDetailsByHead
 */
export async function getEmployeeSalaryDetailsByHead(data: any) {
    const url = '/api/EmployeeRegistration/getEmployeeSalaryDetailsByHead';
    try {
        return await api.post<any>('hrms', url, data);
    } catch (error: any) {
        console.error('❌ [API ERROR] getEmployeeSalaryDetailsByHead:', error);
        return { success: false, message: error?.message || 'Failed to calculate salary details' };
    }
}
/**
 * Update Employee Salary Details By Head
 * POST /api/EmployeeRegistration/update_employee_salary_details_by_head
 */
export async function updateEmployeeSalaryDetailsByHead(data: any) {
    const url = '/api/EmployeeRegistration/update_employee_salary_details_by_head';
    try {
        return await api.post<any>('hrms', url, data);
    } catch (error: any) {
        console.error('❌ [API ERROR] updateEmployeeSalaryDetailsByHead:', error);
        return { success: false, message: error?.message || 'Failed to update salary detail by head' };
    }
}
/**
 * Save/Initialize Employee Salary Details
 * GET /api/EmployeeRegistration/save_employee_salary_details/{hrme_id}
 */
export async function saveEmployeeSalaryDetails(hrme_id: number, MI_Id: number) {
    const url = `/api/EmployeeRegistration/save_employee_salary_details/${hrme_id}?MI_Id=${MI_Id}`;
    try {
        console.log('📡 [API DEBUG] Calling saveEmployeeSalaryDetails (GET):', url);
        const response = await api.get<any>('hrms', url);
        console.log('✅ [API DEBUG] saveEmployeeSalaryDetails Response:', response);
        return response;
    } catch (error: any) {
        console.error('❌ [API ERROR] saveEmployeeSalaryDetails:', error);
        return { success: false, message: error?.message || 'Failed to save employee salary details' };
    }
}

/**
 * Get Employee Earnings and Deduction Details
 * GET /api/EmployeeRegistration/get_employee_earnings_deduction_details/{hrme_id}
 */
export async function getEmployeeEarningsDeductions(hrme_id: number) {
    const url = `/api/EmployeeRegistration/get_employee_earnings_deduction_details/${hrme_id}`;
    try {
        console.log('📡 [API DEBUG] Calling getEmployeeEarningsDeductions (GET):', url);
        const response = await api.get<any>('hrms', url);
        console.log('✅ [API DEBUG] getEmployeeEarningsDeductions Response:', response);
        // The API returns { success, data: [...] }
        return response?.data || [];
    } catch (error: any) {
        console.error('❌ [API ERROR] getEmployeeEarningsDeductions:', error);
        return [];
    }
}
