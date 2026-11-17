'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterGroupDeptDessgMappingList } from '@/types/hrms/hrms-config/master';

/**
 * Get group department designation mapping list with search, sort, and pagination
 * GET /api/MasterGroupDeptDessgFacade/GetBasicData
 */
export async function getGroupDeptDessgMappingList(searchParams?: ApiSearchparams) {
    const searchableColumns = 'hrmgT_EmployeeGroupType,hrmD_DepartmentName,hrmdeS_DesignationName';
    const urlParams = getSearchParamsUrl(searchParams ?? {}, searchableColumns);
    const url = `/api/MasterGroupDepartmentDesignation?${urlParams}`;
    return await api.get<IMasterGroupDeptDessgMappingList[]>('hrms', url);
}

/**
 * Save/Update group department designation mapping
 * POST /api/MasterGroupDepartmentDesignation
 */
export async function saveGroupDeptDessgMapping(data: any) {
    const url = '/api/MasterGroupDepartmentDesignation';
    return await api.post<any>('hrms', url, data);
}

/**
 * Toggle group department designation mapping (activate/deactivate)
 * PUT /api/MasterGroupDepartmentDesignation/toggle_group_dept_designation/{id}
 */
export async function toggleGroupDeptDessgMapping(id: number) {
    const url = `/api/MasterGroupDepartmentDesignation/toggle_group_dept_designation/${id}`;
    return await api.put<any>('hrms', url);
}

/**
 * Delete group department designation mapping
 * DELETE /api/MasterGroupDepartmentDesignation/delete_group_dept_designation_by_id/{id}
 */
export async function deleteGroupDeptDessgMapping(id: number) {
    const url = `/api/MasterGroupDepartmentDesignation/delete_group_dept_designation_by_id/${id}`;
    return await api.delete<any>('hrms', url);
}
