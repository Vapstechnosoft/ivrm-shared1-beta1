'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterUOM } from '@/types/sports/masters/uom';

export async function getMasterUOMs(searchParams?: ApiSearchparams) {
    // Controller: [HttpPost("Getdetails")] public async Task<ActionResult> Getdetails()
    // Takes no parameters, returns all data.
    const url = `/SportMasterUOM/Getdetails`;
    return await api.post<IMasterUOM[]>('sports', url, {});
}

export async function getMasterUOMDetails(id: number) {
    // Controller: [HttpPost("GetSelectedRowDetails/{id:int}")]
    const url = `/SportMasterUOM/GetSelectedRowDetails/${id}`;
    return await api.post<IMasterUOM>('sports', url, {});
}

export async function saveMasterUOM(data: any) {
    console.log('saveMasterUOM received:', JSON.stringify(data, null, 2));

    // User Request: Use specific payload format with ONLY two fields
    // { "spccmuoM_Id": ..., "spccmuoM_UOMName": ... }
    const payload = {
        spccmuoM_Id: data.spccmuoM_Id,
        spccmuoM_UOMName: data.spccmuoM_UOMName
    };

    console.log('saveMasterUOM payload:', JSON.stringify(payload, null, 2));

    const url = `/SportMasterUOM`;
    return await api.post<any>('sports', url, payload);
}

export async function deactivateMasterUOM(data: any) {
    // Controller expects DTO with PascalCase properties
    const payload = {
        ...data,
        SPCCMUOM_Id: data.spccmuoM_Id ?? data.SPCCMUOM_Id,
        SPCCMUOM_ActiveFlag: data.spccmuoM_ActiveFlag ?? data.SPCCMUOM_ActiveFlag,
        MI_Id: data.mI_Id || 0
    };

    const url = `/SportMasterUOM/deactivate`;
    return await api.post<any>('sports', url, payload);
}
