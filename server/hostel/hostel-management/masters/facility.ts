'use server';
import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import { IMasterFacility } from '@/schemas/hostel/masters';


export async function fetchMasterFacilityData(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/MasterFacility/get_facility_list?${urlParams}`;
    return await api.get<any>('hostel', url);
}

export async function addOrUpdateMasterFacility(data: any) {
    const url = '/MasterFacility/save_facility';
    return await api.post<any>('hostel', url, data);
}

export async function toggleMasterFacility(HLMFTY_Id: number) {
    const url = `/MasterFacility/deactivate_facility/${HLMFTY_Id}`;
    return await api.put('exam', url);
}



