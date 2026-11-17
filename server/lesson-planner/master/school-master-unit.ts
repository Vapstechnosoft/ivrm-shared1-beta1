'use server';

import { api } from '@/lib/apiService';
import { getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterSchoolUnitResponse } from '@/types/lesson-planner/master/school-master-unit';

// Fetch initial data
export async function getSchoolMasterUnitData(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'lpmU_UnitName');
    const url = `/SchoolMasterUnit/get_details?${urlParams}`;
    return await api.get<IMasterSchoolUnitResponse>('lessonplanner', url);
}

// Save/Update unit
export async function saveSchoolMasterUnit(data: any) {
    const url = '/SchoolMasterUnit/save_details';
    return await api.post<IMasterSchoolUnitResponse>('lessonplanner', url, data);
}

// Edit details
export async function editSchoolMasterUnit(id: number) {
    const url = `/SchoolMasterUnit/edit_deatils/${id}`;
    try {
        console.info(`[editSchoolMasterUnit] Attempting GET: ${url}`);
        const res = await api.get<IMasterSchoolUnitResponse>('lessonplanner', url);
        // If it's a 405 or fails, the catch block will handle it
        return res;
    } catch (error) {
        console.warn(`[editSchoolMasterUnit] GET failed, attempting POST fallback for: ${url}`);
        // Some endpoints require POST even for fetching details
        return await api.post<IMasterSchoolUnitResponse>('lessonplanner', url, { lpmU_Id: id });
    }
}

// Deactivate/Activate
export async function deactivateSchoolMasterUnit(id: number, activeFlag: boolean) {
    const url = `/SchoolMasterUnit/Deactivate?LPMU_Id=${id}`;
    return await api.post<IMasterSchoolUnitResponse>('lessonplanner', url, { lpmU_Id: id, lpmU_ActiveFlag: activeFlag });
}

// Save unit order
export async function saveUnitOrder(orderArray: any[]) {
    const url = '/SchoolMasterUnit/validate_ordernumber';
    return await api.post<IMasterSchoolUnitResponse>('lessonplanner', url, { schoolMasterUnitTempDTO: orderArray });
}
