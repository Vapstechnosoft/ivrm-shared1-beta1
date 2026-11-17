'use server';

import { api, getSearchParamsUrl, type ApiResponse } from '@/lib/apiService';
import { IEventsMappingData, IEventsMappingDropdowns, EventsMappingFormSchema } from "@/types/sports/events-mapping";

export async function getEventsMappingDropdowns(): Promise<IEventsMappingDropdowns> {
    // Mock Data
    return {
        academicYear: [
            { asmaY_Id: 1, asmaY_Year: '2023-2024' },
            { asmaY_Id: 2, asmaY_Year: '2024-2025' },
        ],
        eventsList: [
            { spccmE_Id: 1, spccmE_EventName: '100m Sprint' },
            { spccmE_Id: 2, spccmE_EventName: 'Football' },
            { spccmE_Id: 3, spccmE_EventName: 'Annual Sports Meet' },
            { spccmE_Id: 4, spccmE_EventName: 'Cricket Tournament' },
            { spccmE_Id: 5, spccmE_EventName: 'Kho-Kho Championship' },
        ],
        venueList: [
            { spccmeV_Id: 1, spccmeV_EventVenue: 'Main Stadium' },
            { spccmeV_Id: 2, spccmeV_EventVenue: 'School Ground' },
            { spccmeV_Id: 3, spccmeV_EventVenue: 'Indoor Arena' },
        ],
        sponsorList: [
            { spccmsP_Id: 1, spccmsP_SponsorName: 'Cricket' },
            { spccmsP_Id: 2, spccmsP_SponsorName: 'Mahindra' },
            { spccmsP_Id: 3, spccmsP_SponsorName: 'TEST1' },
            { spccmsP_Id: 4, spccmsP_SponsorName: 'abc1 Tech. LLP' },
            { spccmsP_Id: 5, spccmsP_SponsorName: 'BAT SPT' },
            { spccmsP_Id: 6, spccmsP_SponsorName: 'Principal' },
            { spccmsP_Id: 7, spccmsP_SponsorName: 'prem kumar' },
            { spccmsP_Id: 8, spccmsP_SponsorName: 'KhoKHO' },
            { spccmsP_Id: 9, spccmsP_SponsorName: 'TATA' },
            { spccmsP_Id: 10, spccmsP_SponsorName: 'Sponsor 1' },
            { spccmsP_Id: 11, spccmsP_SponsorName: 'IVRM' },
            { spccmsP_Id: 12, spccmsP_SponsorName: 'raj company' },
            { spccmsP_Id: 13, spccmsP_SponsorName: 'dulquer salman' },
            { spccmsP_Id: 14, spccmsP_SponsorName: 'test25sponser' },
            { spccmsP_Id: 15, spccmsP_SponsorName: 'Vaps' },
            { spccmsP_Id: 16, spccmsP_SponsorName: 'Vaps Sponsor' },
            { spccmsP_Id: 17, spccmsP_SponsorName: 'My Library' },
            { spccmsP_Id: 18, spccmsP_SponsorName: 'ABC-Test' },
            { spccmsP_Id: 19, spccmsP_SponsorName: 'Best_Sponser' },
        ]
    };
}

export async function getEventsMappingList(): Promise<ApiResponse<IEventsMappingData[]>> {
    const dummyDataCount = 17;
    const dummyData: IEventsMappingData[] = Array.from({ length: dummyDataCount }, (_, i) => ({
        spccE_Id: 100 + i,
        asmaY_Id: i % 2 === 0 ? 1 : 2,
        asmaY_Year: i % 2 === 0 ? '2023-2024' : '2024-2025',
        spccmE_Id: (i % 5) + 1,
        spccmE_EventName: ['100m Sprint', 'Football', 'Cricket Tournament', 'Volleyball', 'Tennis'][i % 5],
        spccmeV_Id: (i % 3) + 1,
        spccmeV_EventVenue: ['Main Stadium', 'School Ground', 'Indoor Arena'][i % 3],
        spccE_StartDate: new Date('2024-01-01').toISOString(),
        spccE_StartTime: '10:00',
        spccE_EndDate: new Date('2024-01-02').toISOString(),
        spccE_EndTime: '16:00',
        spccE_Remarks: `Event Mapping Record ${i + 1}`,
        spccE_SponsorFlag: i % 3 === 0,
        spccE_ActiveFlag: ![2, 5, 8, 12, 15].includes(i)
    }));

    // Return dummy data wrapped in ApiResponse
    return {
        success: true,
        message: 'Data fetched successfully (Mock)!!',
        data: dummyData
    };
}

export async function saveEventsMapping(data: EventsMappingFormSchema): Promise<ApiResponse<any>> {
    console.log('Saving Events Mapping:', data);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Record Saved Successfully', data: null };
}

export async function deactivateEventsMapping(id: number, activeFlag: boolean): Promise<ApiResponse<any>> {
    console.log('Deactivating:', id, activeFlag);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Correct message logic: If we deactivated (new state false), message "Deactivated".
    // Wait, typical API behavior: "Deactivate" action returns "Deactivated successfully".
    // If we passed the *target* state:
    // If target is false (activeFlag=false), we deactivated.
    // If target is true (activeFlag=true), we activated.
    return {
        success: true,
        message: activeFlag ? 'Activated successfully' : 'Deactivated successfully',
        data: null
    };
}
