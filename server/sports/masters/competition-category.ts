'use server';

import { api } from '@/lib/apiService';
import { revalidatePath } from 'next/cache';

export async function getMasterCompetitionCategories() {
    const url = '/MasterCompetitionCategory/getDetails';
    return await api.post<any>('sports', url, {});
}

export async function getMasterCompetitionCategoryDetails(id: number) {
    const url = `/MasterCompetitionCategory/EditDetails/${id}`;
    return await api.post<any>('sports', url, {});
}

export async function saveMasterCompetitionCategory(data: any) {
    const url = '/MasterCompetitionCategory/save';
    const res = await api.post<any>('sports', url, data);
    revalidatePath('/Sports/Masters/CompetitionCategory');
    return res;
}

export async function deactivateMasterCompetitionCategory(data: any) {
    const url = '/MasterCompetitionCategory/deactivate';
    const res = await api.post<any>('sports', url, data);
    revalidatePath('/Sports/Masters/CompetitionCategory');
    return res;
}
