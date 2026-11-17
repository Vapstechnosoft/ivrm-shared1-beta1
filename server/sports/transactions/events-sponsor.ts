'use server';

import { api, type ApiResponse } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IEventSponsorInitialData } from '@/types/sports/transactions/events-sponsor';

/**
 * Fetch Events Sponsor Mapping details.
 */
export async function getEventsSponsorMapping(searchParams?: ApiSearchparams): Promise<ApiResponse<IEventSponsorInitialData>> {
    try {
        // Controller uses [HttpPost("getDetails")]
        const response = await api.post<IEventSponsorInitialData>('sports', '/EventsSponsor/getDetails', {});
        return response;
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Failed to fetch details',
            data: { events: [], sponsorList: [], sponsormappingList: [] }
        };
    }
}

/**
 * Save or Update Events Sponsor Mapping.
 */
export async function saveEventsSponsorMapping(data: any): Promise<ApiResponse<any>> {
    // Mapping keys to match the requested body format
    const payload = {
        SPCCESP_Id: data.spccesP_Id || 0,
        SPCCE_Id: data.spccE_Id,
        SPCCMSP_Id: data.spccmsP_Id
    };
    return await api.post<any>('sports', '/EventsSponsor/save', payload);
}

/**
 * Get Edit Details.
 */
export async function getEditEventsSponsorMapping(id: number): Promise<ApiResponse<any>> {
    // Controller uses [HttpPost("EditDetails/{id:int}")]
    return await api.post<any>('sports', `/EventsSponsor/EditDetails/${id}`, {});
}

/**
 * Deactivate or Activate Events Sponsor Mapping.
 */
export async function deactivateEventsSponsorMapping(data: { spccesP_Id: number, spccesP_ActiveFlag: boolean }): Promise<ApiResponse<any>> {
    const payload = {
        SPCCESP_Id: data.spccesP_Id,
        SPCCESP_ActiveFlag: data.spccesP_ActiveFlag
    };
    return await api.post<any>('sports', '/EventsSponsor/deactivate', payload);
}
