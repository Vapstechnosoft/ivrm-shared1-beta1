'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterSponsor } from '@/types/sports/masters/sponsors';

export async function getMasterSponsors(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/MasterSponser/getDetails?${urlParams}`;
    return await api.post<IMasterSponsor[]>('sports', url, {});
}

export async function getMasterSponsorDetails(id: number) {
    const url = `/MasterSponser/EditDetails/${id}`;
    return await api.get<IMasterSponsor>('sports', url);
}

export async function saveMasterSponsor(data: any) {
    const SPCCMSP_Id = data.spccmsP_Id || 0;
    const SPCCMSP_SponsorName = encodeURIComponent(data.spccmsP_SponsorName || '');
    const SPCCMSP_ContactPerson = encodeURIComponent(data.spccmsP_ContactPerson || '');
    const SPCCMSP_ContactNo = encodeURIComponent(data.spccmsP_ContactNo || '');
    const SPCCMSP_SponsorDetails = encodeURIComponent(data.spccmsP_SponsorDetails || '');

    const url = `/MasterSponser/save?SPCCMSP_Id=${SPCCMSP_Id}&SPCCMSP_SponsorName=${SPCCMSP_SponsorName}&SPCCMSP_ContactPerson=${SPCCMSP_ContactPerson}&SPCCMSP_ContactNo=${SPCCMSP_ContactNo}&SPCCMSP_SponsorDetails=${SPCCMSP_SponsorDetails}`;
    return await api.post<any>('sports', url, {});
}

export async function deactivateMasterSponsor(data: any) {
    const SPCCMSP_Id = data.spccmsP_Id;
    const SPCCMSP_ActiveFlag = data.spccmsP_ActiveFlag;

    const url = `/MasterSponser/deactivate?SPCCMSP_Id=${SPCCMSP_Id}&SPCCMSP_ActiveFlag=${SPCCMSP_ActiveFlag}`;
    return await api.post<any>('sports', url, {});
}
