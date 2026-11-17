'use server';

import { api } from '@/lib/apiService';
import type { IMasterHouse } from '@/types/sports/masters/house';

export async function getMasterHouses() {
    // User specified /api/SportsMasterHouse/getdetails
    const url = `/SportsMasterHouse/getdetails`;
    return await api.post<IMasterHouse[]>('sports', url, {});
}

export async function getMasterHouseDetails(id: number) {
    const url = `/SportsMasterHouse/editdata?SPCCMH_Id=${id}`;
    return await api.post<any>('sports', url, {});
}

export async function saveMasterHouse(data: any) {
    const SPCCMH_Id = data.spccmH_Id || 0;
    const SPCCMH_HouseName = encodeURIComponent(data.spccmH_HouseName || '');
    const SPCCMH_HouseDescription = encodeURIComponent(data.spccmH_HouseDescription || '');
    const SPCCMH_Flag = encodeURIComponent(data.spccmH_Flag || '');

    const url = `/SportsMasterHouse/savedata?SPCCMH_Id=${SPCCMH_Id}&SPCCMH_HouseName=${SPCCMH_HouseName}&SPCCMH_HouseDescription=${SPCCMH_HouseDescription}&SPCCMH_Flag=${SPCCMH_Flag}`;
    return await api.post<any>('sports', url, {});
}

export async function deactivateMasterHouse(data: any) {
    const SPCCMH_Id = data.spccmH_Id;
    const SPCCMH_ActiveFlag = data.spccmH_ActiveFlag;

    const url = `/SportsMasterHouse/deactivate?SPCCMH_Id=${SPCCMH_Id}&SPCCMH_ActiveFlag=${SPCCMH_ActiveFlag}`;
    return await api.post<any>('sports', url, {});
}
