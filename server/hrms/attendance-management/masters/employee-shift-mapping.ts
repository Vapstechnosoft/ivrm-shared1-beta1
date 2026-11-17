'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IGroupType, IHolidayType, IMasterEmployeeShiftMappingList, IShiftName } from '@/types/hrms/attendance-management/masters';

/**
 * Get Employee Shift Mapping list with search, sort, and pagination
 * GET /api/EmployeeShiftMappingFacade/getdata
 * Note: User mentioned /api/MasterHolidayFacade/delete but that seems incorrect.
 * Using /api/EmployeeShiftMappingFacade/getdata based on context.
 */
export async function getEmployeeShiftMapping(searchParams?: ApiSearchparams) {
    const searchableColumns = 'EmployeeName,ShiftName,DayType';
    const urlParams = getSearchParamsUrl(searchParams ?? {}, searchableColumns);
    const url = `/api/EmployeeShiftMappingFacade/getdata?${urlParams}`;
    return await api.get<IMasterEmployeeShiftMappingList[]>('hrmsfrontoffice', url);
}

/**
 * Save or Update Employee Shift Mapping record
 * POST /api/EmployeeShiftMappingFacade/SaveDetail
 */
export async function addOrUpdateEmployeeShiftMapping(data: any) {
    const url = '/api/EmployeeShiftMappingFacade/SaveDetail';
    return await api.post<any>('hrmsfrontoffice', url, data);
}

/**
 * Delete Employee Shift Mapping record
 * DELETE /api/EmployeeShiftMappingFacade/delete/{FOEST_Id}
 */
export async function deleteEmployeeShiftMapping(id: number) {
    const url = `/api/EmployeeShiftMappingFacade/delete/${id}`;
    return await api.delete<IMasterEmployeeShiftMappingList>('hrmsfrontoffice', url);
}

// Helper function: Get dropdown data
export async function getEmployeeShiftMappingDropdowns(data?: any) {
    const url = '/api/EmployeeShiftMappingFacade/getdetails';
    return await api.post<any>('hrmsfrontoffice', url, data || {});
}

// Helper function: Get shift names
export async function getEmployeeShiftMappingShiftNames(data?: any) {
    const url = '/api/EmployeeShiftMappingFacade/Shiftname';
    return await api.post<any>('hrmsfrontoffice', url, data || {});
}

// Helper function: Get employees (old version - kept for backward compatibility)
export async function getEmployeeShiftMappingEmployeesOld(data?: any) {
    const url = '/api/EmployeeShiftMappingFacade/get_employee';
    return await api.post<any>('hrmsfrontoffice', url, data || {});
}

/**
 * Get Group Types for Employee Shift Mapping
 * GET /api/EmployeeShiftMappingFacade/get-group-types
 */
export async function getEmployeeShiftMappingGroupTypes() {
    const url = '/api/EmployeeShiftMappingFacade/get-group-types';
    return await api.get<IGroupType[]>('hrmsfrontoffice', url);
}

/**
 * Get Holiday Types for Employee Shift Mapping
 * GET /api/EmployeeShiftMappingFacade/getholiday_types
 */
export async function getEmployeeShiftMappingHolidayTypes() {
    const url = '/api/EmployeeShiftMappingFacade/getholiday_types';
    return await api.get<IHolidayType[]>('hrmsfrontoffice', url);
}

/**
 * Get Shift Names for Employee Shift Mapping
 * GET /api/EmployeeShiftMappingFacade/getshift_names
 */
export async function getEmployeeShiftMappingShiftNamesList() {
    const url = '/api/EmployeeShiftMappingFacade/getshift_names';
    return await api.get<IShiftName[]>('hrmsfrontoffice', url);
}

/**
 * Get Shift Details for Employee Shift Mapping
 * GET /api/EmployeeShiftMappingFacade/GetShiftDetails?FOMS_Id={id}
 */
export async function getEmployeeShiftMappingShiftDetails(id: number) {
    const url = `/api/EmployeeShiftMappingFacade/GetShiftDetails?FOMS_Id=${id}`;
    return await api.get<any>('hrmsfrontoffice', url);
}

/**
 * Get Departments for Employee Shift Mapping
 * GET /api/EmployeeShiftMappingFacade/get_departments?GroupTypeIds={id1}&GroupTypeIds={id2}
 */
export async function getEmployeeShiftMappingDepartments(groupTypeIds: number[]) {
    if (!groupTypeIds || groupTypeIds.length === 0) {
        return { success: false, data: [], message: 'No group type IDs provided' };
    }
    // Build query string with multiple GroupTypeIds parameters
    const queryParams = groupTypeIds.map((id) => `GroupTypeIds=${id}`).join('&');
    const url = `/api/EmployeeShiftMappingFacade/get_departments?${queryParams}`;
    return await api.get<any>('hrmsfrontoffice', url);
}

/**
 * Get Designations for Employee Shift Mapping
 * GET /api/EmployeeShiftMappingFacade/get_designation?DepartmentIds={id1}&DepartmentIds={id2}
 */
export async function getEmployeeShiftMappingDesignations(departmentIds: number[]) {
    if (!departmentIds || departmentIds.length === 0) {
        return { success: false, data: [], message: 'No department IDs provided' };
    }
    // Build query string with multiple DepartmentIds parameters
    const queryParams = departmentIds.map((id) => `DepartmentIds=${id}`).join('&');
    const url = `/api/EmployeeShiftMappingFacade/get_designation?${queryParams}`;
    return await api.get<any>('hrmsfrontoffice', url);
}

/**
 * Get Employees for Employee Shift Mapping (Filtered by Group Types, Departments, and Designations)
 * GET /api/EmployeeShiftMappingFacade/get_employee?GroupTypeIds={id1}&GroupTypeIds={id2}&DepartmentIds={id1}&DepartmentIds={id2}&DesignationIds={id1}&DesignationIds={id2}
 */
export async function getEmployeeShiftMappingEmployeesFiltered(groupTypeIds: number[], departmentIds: number[], designationIds: number[]) {
    // Build query string with multiple parameters
    const queryParams: string[] = [];

    if (groupTypeIds && groupTypeIds.length > 0) {
        queryParams.push(...groupTypeIds.map((id) => `GroupTypeIds=${id}`));
    }

    if (departmentIds && departmentIds.length > 0) {
        queryParams.push(...departmentIds.map((id) => `DepartmentIds=${id}`));
    }

    if (designationIds && designationIds.length > 0) {
        queryParams.push(...designationIds.map((id) => `DesignationIds=${id}`));
    }

    if (queryParams.length === 0) {
        return { success: false, data: [], message: 'No filter IDs provided' };
    }

    const url = `/api/EmployeeShiftMappingFacade/get_employee?${queryParams.join('&')}`;
    return await api.get<any>('hrmsfrontoffice', url);
}
