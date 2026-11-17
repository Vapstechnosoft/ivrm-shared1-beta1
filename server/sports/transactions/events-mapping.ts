'use server';

import { api } from '@/lib/apiService';
import { IEventMappingDTO } from '@/types/sports/transactions/events-mapping';

export async function getEventMappingDetails() {
    const url = '/EventVenueMapping/getDetails';
    return await api.get<any>('sports', url);
}

export async function saveEventMapping(data: IEventMappingDTO) {
    const url = '/EventVenueMapping/save';
    return await api.post<any>('sports', url, data);
}

export async function editEventMapping(data: { ASMAY_Id: number; SPCCE_Id: number }) {
    const url = `/EventVenueMapping/EditDetails?ASMAY_Id=${data.ASMAY_Id}&SPCCE_Id=${data.SPCCE_Id}`;
    return await api.post<any>('sports', url, data);
}

export async function deactivateEventMapping(data: { ASMAY_Id: number; SPCCE_Id: number }) {
    const url = `/EventVenueMapping/deactivate?ASMAY_Id=${data.ASMAY_Id}&SPCCE_Id=${data.SPCCE_Id}`;
    return await api.post<any>('sports', url, data);
}

export async function getModelData(data: { ASMAY_Id: number; SPCCE_Id: number }) {
    const url = `/EventVenueMapping/get_modeldata?ASMAY_Id=${data.ASMAY_Id}&SPCCE_Id=${data.SPCCE_Id}`;
    return await api.post<any>('sports', url, data);
}
