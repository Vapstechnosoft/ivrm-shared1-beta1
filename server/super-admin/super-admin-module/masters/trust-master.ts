'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { ITrustMaster } from '@/types/super-admin/super-admin-module/trust-masters';
import type { CountryDropdown } from './institution-facade';

export async function getCountryList() {
    const url = `/OrganisationFacade/get_country_dropdown`;
    try {
        const response = await api.get<CountryDropdown[]>('sadmin', url);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function getStateList(ivrmmC_Id: number) {
    const url = `/OrganisationFacade/get_state_dropdown_onchnageof_country/${ivrmmC_Id}`;
    try {
        const response = await api.get<any[]>('sadmin', url);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function saveTrustMaster(data: any) {
    const url = `/OrganisationFacade/add_or_update_master_organization`;
    try {
        const response = await api.post<any>('sadmin', url, data);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function activateDeactivateTrustMaster(id: number) {
    const url = `/OrganisationFacade/activate_deactivate_master_organization/${id}`;
    try {
        const response = await api.put<any>('sadmin', url, {});
        return response;
    } catch (error) {
        throw error;
    }
}

export async function getTrustMasterData(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/OrganisationFacade/get_on_load_details?${urlParams}`;
    try {
        const response = await api.get<ITrustMaster[]>(
            'sadmin',
            url
        );
        return response;
    } catch (error) {
        throw error;
    }
}
