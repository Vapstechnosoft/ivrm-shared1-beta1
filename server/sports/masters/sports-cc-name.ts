'use server';

import { api } from '@/lib/apiService';
import { revalidatePath } from 'next/cache';
import { SportsCCNameMasterDataDTO, SportsCCNameEditDetailsDTO } from '@/types/sports/masters/sports-cc-name';

const BASE_URL = 'sports';

export async function getSportsCCNameDetails() {
    const url = '/MasterSportsCCName/getDetails';
    return await api.post<SportsCCNameMasterDataDTO>(BASE_URL, url, {});
}

export async function saveSportsCCName(data: any) {
    const url = '/MasterSportsCCName/save';
    const res = await api.post<any>(BASE_URL, url, data);
    revalidatePath('/Sports/Masters/SportsCCName');
    return res;
}

export async function editSportsCCNameDetails(id: number) {
    const url = `/MasterSportsCCName/EditDetails/${id}`;
    return await api.post<SportsCCNameEditDetailsDTO>(BASE_URL, url, {});
}

export async function deactivateSportsCCName(data: { spccmscC_Id: number }) {
    const url = '/MasterSportsCCName/deactivate';
    const res = await api.post<any>(BASE_URL, url, data);
    revalidatePath('/Sports/Masters/SportsCCName');
    return res;
}
