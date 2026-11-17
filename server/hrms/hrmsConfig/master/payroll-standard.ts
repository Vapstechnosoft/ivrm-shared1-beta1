'use server';

import { api } from '@/lib/apiService';
import type { IMasterPayrollStandardList, IMonthDropdown } from '@/types/hrms/hrms-config/master';

/**
 * Get basic data for master payroll standard
 * GET /api/MasterPayrollStandard
 */
export async function getMasterPayrollStandardList() {
    const url = '/api/MasterPayrollStandard';
    return await api.get<IMasterPayrollStandardList>('hrms', url);
}

/**
 * Save or Update master payroll standard record
 * POST /api/MasterPayrollStandard
 */
export async function saveMasterPayrollStandard(data: any) {
    const url = '/api/MasterPayrollStandard';
    return await api.post<any>('hrms', url, data);
}


/**
 * Get Month List for dropdowns
 * GET /api/MasterDropDown/GetMonths
 */
export async function getMonthDropdown() {
    const url = '/api/MasterDropDown/GetMonths';
    return await api.get<IMonthDropdown[]>('hrms', url);
}
