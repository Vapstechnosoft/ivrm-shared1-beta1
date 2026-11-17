'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';

// --- Interfaces ---

export interface IMess {
    hlmM_Id: number;
    hlmM_Name: string;
    hlmM_VegFlg?: boolean;
    hlmM_NonVegFlg?: boolean;
    hlmM_BFSStartTime?: string | null;
    hlmM_BFSEndTime?: string | null;
    hlmM_LNStartTime?: string | null;
    hlmM_LNEndTime?: string | null;
    hlmM_LNTSStartTime?: string | null;
    hlmM_LNTSEndTime?: string | null;
    hlmM_DNSStartTime?: string | null;
    hlmM_DNSEndTime?: string | null;
    hlmM_ActiveFlag?: boolean;
}

// --- Actions ---

export async function fetchMessData(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/MasterMess/get_mess_list?${urlParams}`;
    return await api.get<any>('hostel', url);
}

export async function getMessList() {
    return await api.get<any>('hostel', '/MasterMess/mess-dropdown');
}

export async function saveMess(data: any) {
    const url = '/MasterMess/save_mess';
    return await api.post<any>('hostel', url, data);
}

export async function deleteMess(HLMM_Id: number) {
    const url = `/MasterMess/deactivate_mess?HLMM_Id=${HLMM_Id}`;
    return await api.put<any>('hostel', url);
}
