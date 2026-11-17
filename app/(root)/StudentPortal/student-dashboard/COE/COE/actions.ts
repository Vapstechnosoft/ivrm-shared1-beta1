'use server';

import type { AcademicYear, COEDataPayload, COEDataResponse, COELoadData, COEReport } from './types';

const MOCK_ACADEMIC_YEARS: AcademicYear[] = [
    { asmaY_Id: 1, asmaY_Year: '2023-2024', Selected: true },
    { asmaY_Id: 2, asmaY_Year: '2022-2023', Selected: false },
    { asmaY_Id: 3, asmaY_Year: '2021-2022', Selected: false }
];

const MOCK_EVENTS: COEReport[] = [
    {
        coemE_EventName: 'Independence Day',
        coemE_EventDesc: 'Celebration of Independence Day',
        coeE_EStartDate: '2023-08-15T09:00:00',
        coeE_EEndDate: '2023-08-15T12:00:00',
        FMH_Id: 1
    },
    {
        coemE_EventName: 'Teachers Day',
        coemE_EventDesc: 'Honoring Teachers',
        coeE_EStartDate: '2023-09-05T09:00:00',
        coeE_EEndDate: '2023-09-05T14:00:00',
        FMH_Id: 2
    },
    {
        coemE_EventName: 'Annual Sports Meet',
        coemE_EventDesc: 'Inter-house sports competition',
        coeE_EStartDate: '2023-11-10T08:00:00',
        coeE_EEndDate: '2023-11-12T17:00:00',
        FMH_Id: 3
    },
    {
        coemE_EventName: 'Science Exhibition',
        coemE_EventDesc: 'Showcase of student science projects',
        coeE_EStartDate: '2023-12-05T10:00:00',
        coeE_EEndDate: '2023-12-05T16:00:00',
        FMH_Id: 4
    },
    {
        coemE_EventName: 'Republic Day',
        coemE_EventDesc: 'Flag raising ceremony',
        coeE_EStartDate: '2024-01-26T08:30:00',
        coeE_EEndDate: '2024-01-26T11:30:00',
        FMH_Id: 5
    }
];

export async function getCOELoadData(): Promise<COELoadData> {
    // In a real application, fetch from API
    // const response = await apiService.getDATA("COE/getloaddata");
    // return response;

    console.log('Fetching COE load data');
    return {
        coeyearlist: MOCK_ACADEMIC_YEARS,
        currentyear: [MOCK_ACADEMIC_YEARS[0]]
    };
}

export async function getCOEData(data: COEDataPayload): Promise<COEDataResponse> {
    // In a real application, fetch from API
    // const response = await apiService.create("COE/getcoedata", data);
    // return response;

    console.log('Fetching COE data for:', data);

    // Filter mock data based on month if needed, but for now return all or random subset
    // to simulate finding records.

    // Simple mock logic: if month is "01" (Jan) return Republic Day, else return others
    if (data.month === '01') {
        return {
            coereportlist: MOCK_EVENTS.filter((e) => e.coemE_EventName === 'Republic Day')
        };
    }

    if (data.month === '08') {
        return {
            coereportlist: MOCK_EVENTS.filter((e) => e.coemE_EventName === 'Independence Day')
        };
    }

    if (data.month === '09') {
        return {
            coereportlist: MOCK_EVENTS.filter((e) => e.coemE_EventName === 'Teachers Day')
        };
    }

    if (data.month === '11') {
        return {
            coereportlist: MOCK_EVENTS.filter((e) => e.coemE_EventName === 'Annual Sports Meet')
        };
    }

    if (data.month === '12') {
        return {
            coereportlist: MOCK_EVENTS.filter((e) => e.coemE_EventName === 'Science Exhibition')
        };
    }

    // Return empty if no match for simplicity in mock
    return {
        coereportlist: []
    };
}
