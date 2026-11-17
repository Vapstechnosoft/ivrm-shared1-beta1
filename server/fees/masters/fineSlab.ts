'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IFineSlabList } from '@/types/fees/masters/masters';

export async function getFineSlab(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'fmfS_FineType,fmfS_ECSFlag,fmfS_ToDay,fmfS_FromDay,fs_FineSlabName');
    const url = `/FeeFineSlab/MasterFineSlabList?${urlParams}`;
    return await api.get<IFineSlabList[]>('fees', url);
}

export async function addOrUpdateFineSlab(data: any) {
    const url = '/FeeFineSlab/AddOrUpdate';
    return await api.post<any>('fees', url, data);
}

export async function toggleFineSlab(id: number) {
    const url = `/FeeFineSlab/Toggle/${id}`;
    return await api.put('fees', url);
}
