'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterShiftSettingList } from '@/types/hrms/attendance-management/masters';

/**
 * Get Shift Setting Master list with search, sort, and pagination
 * GET /api/ShiftSettingMasterFacade/getdata
 */
export async function getShiftSettingMaster(searchParams?: ApiSearchparams) {
    const searchableColumns = 'foms_ShiftName';
    const urlParams = getSearchParamsUrl(searchParams ?? {}, searchableColumns);
    const url = `/api/ShiftSettingMasterFacade/getdata?${urlParams}`;
    return await api.get<IMasterShiftSettingList[]>('hrmsfrontoffice', url);
}

/**
 * Save or Update Shift Setting Master record
 * POST /api/ShiftSettingMasterFacade/savedetail
 */
export async function addOrUpdateShiftSettingMaster(data: any) {
    const url = '/api/ShiftSettingMasterFacade/savedetail';
    return await api.post<any>('hrmsfrontoffice', url, data);
}

/**
 * Toggle Shift Setting Master record (activate/deactivate)
 * PUT /api/ShiftSettingMasterFacade/toggle/{id}
 */
export async function toggleShiftSettingMaster(id: number) {
    const url = `/api/ShiftSettingMasterFacade/toggle/${id}`;
    return await api.put<IMasterShiftSettingList>('hrmsfrontoffice', url);
}

// DELETE
export async function deleteShiftSettingMaster(id: number) {
    const url = `/api/ShiftSettingMasterFacade/delete/${id}`;
    return await api.delete<any>('hrmsfrontoffice', url);
}
