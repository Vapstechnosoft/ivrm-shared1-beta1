'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterHouseDesignation } from '@/types/sports/masters/house-designation.ts';

export async function getMasterHouseDesignations(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/SportMasterHouseDessignation/Getdetails?${urlParams}`;
    return await api.post<IMasterHouseDesignation[]>('sports', url, {});
}

export async function getMasterHouseDesignationDetails(id: number) {
    const url = `/SportMasterHouseDessignation/GetSelectedRowDetails/${id}`;
    return await api.get<IMasterHouseDesignation>('sports', url);
}

export async function saveMasterHouseDesignation(data: any) {
    const SPCCMHD_Id = data.spccmhD_Id || 0;
    const SPCCMHD_DesignationName = encodeURIComponent(data.spccmhD_DesignationName || '');
    const SPCCMHD_DesignationDescription = encodeURIComponent(data.spccmhD_DesignationDescription || '');

    const url = `/SportMasterHouseDessignation/Post?SPCCMHD_Id=${SPCCMHD_Id}&SPCCMHD_DesignationName=${SPCCMHD_DesignationName}&SPCCMHD_DesignationDescription=${SPCCMHD_DesignationDescription}`;
    return await api.post<any>('sports', url, {});
}

export async function deactivateMasterHouseDesignation(data: any) {
    const SPCCMHD_Id = data.spccmhD_Id;
    const SPCCMHD_ActiveFlag = data.spccmhD_ActiveFlag;

    const url = `/SportMasterHouseDessignation/deactivate?SPCCMHD_Id=${SPCCMHD_Id}&SPCCMHD_ActiveFlag=${SPCCMHD_ActiveFlag}`;
    return await api.post<any>('sports', url, {});
}
