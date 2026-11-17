'use server';

import { api } from '@/lib/apiService';
import { IInstitutionSubscription } from '@/types/super-admin/super-admin-module/institution/institution-subscription';

export interface CountryDropdown {
    ivrmmC_Id: number;
    ivrmmC_CountryName: string;
    ivrmmC_CountryCode: string;
    ivrmmC_CountryCode2: string;
    ivrmmC_MobileNo: number;
}

export interface InstitutionDropdown {
    mI_Id: number;
    mI_Name: string;
}

export async function getCountryDropdown() {
    const url = 'InstitutionFacade/get_drop_down_country';
    return await api.get<CountryDropdown[]>('exam', url);
}

export async function getInstitutionSubscriptionData() {
    const url = 'InstitutionFacade/get_grid_subscription';
    return await api.get<IInstitutionSubscription[]>('sadmin', url);
}

export async function getInstitutionDropdown() {
    const url = 'InstitutionFacade/get_institution_drop_down_superadmin';
    return await api.get<InstitutionDropdown[]>('sadmin', url);
}
