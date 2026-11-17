'use server';

import { api, type ApiResponse } from '@/lib/apiService';
import type { IVenueWiseReportData, IVenueWiseReportDropdowns, VenueWiseParticipationReportFormSchema } from "@/types/sports/reports/venue-wise-participation-report";

export async function getVenueWiseParticipationDropdowns(): Promise<IVenueWiseReportDropdowns> {
    console.log("Fetching venue wise participation dropdowns...");
    const response = await api.post<IVenueWiseReportDropdowns>('sports', '/SportVenuewiseParticipationReport/Getdetails', {});
    console.log("Dropdowns response:", response.data);
    return response.data!;
}

export async function getClass(asmaY_Id: number): Promise<Pick<IVenueWiseReportDropdowns, 'classList' | 'houseList' | 'venueList'>> {
    console.log("Fetching class, house, and venue list for year:", asmaY_Id);
    const response = await api.post<Pick<IVenueWiseReportDropdowns, 'classList' | 'houseList' | 'venueList'>>('sports', '/SportVenuewiseParticipationReport/get_class', { asmaY_Id });
    console.log("GetClass response data:", response.data);
    return {
        classList: response.data?.classList || [],
        houseList: response.data?.houseList || [],
        venueList: response.data?.venueList || []
    };
}

export async function getSection(asmaY_Id: number, asmcL_Id: number): Promise<IVenueWiseReportDropdowns['sectionList']> {
    const response = await api.post<{ sectionList: IVenueWiseReportDropdowns['sectionList'] }>('sports', '/SportVenuewiseParticipationReport/get_section', { asmaY_Id, asmcL_Id });
    return response.data?.sectionList || [];
}

export async function getVenueWiseParticipationReport(data: VenueWiseParticipationReportFormSchema): Promise<IVenueWiseReportData[]> {
    const response = await api.post<{ viewlist: IVenueWiseReportData[] }>('sports', '/SportVenuewiseParticipationReport/showdetails', data);
    return response.data?.viewlist || [];
}
