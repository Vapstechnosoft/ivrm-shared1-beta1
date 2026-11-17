'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';

const baseUrl = 'lessonplanner';

export async function getInitialDetails(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, '');
    return await api.get<any>(baseUrl, `/SchoolMasterUnit/Getdetailsmapping?${urlParams}`);
}

// Fetch topics based on Unit ID
export async function getTopics(lpmu_id: number) {
    return await api.post<any>(baseUrl, `/SchoolMasterUnit/Gettopicnames`, { LPMU_Id: lpmu_id });
}

// Save mapping
export async function saveMapping(data: any) {
    return await api.post<any>(baseUrl, `/SchoolMasterUnit/savemappingdetails`, data);
}

// Deactivate/Activate mapping
export async function deactivateMapping(data: any) {
    const { LPMU_Id, LPMT_Id, LPMTU_Id } = data;
    return await api.post<any>(baseUrl, `/SchoolMasterUnit/deactivatemapping`, { LPMU_Id, LPMT_Id, LPMTU_Id });
}
