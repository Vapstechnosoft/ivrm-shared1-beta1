'use server';

import { type ApiResponse } from '@/lib/apiService';
import { IPointsRecordReportData, PointsRecordReportFormSchema, SportPointsAndRecordReportFormSchema } from '@/types/sports/reports/points-record-report';

export async function getPointsRecordReportDropdowns() {
    const response: ApiResponse<{
        academicYear: { asmaY_Id: number; asmaY_Year: string }[];
        houseList: { spccmH_Id: number; spccmH_HouseName: string }[];
        events: { spccE_Id: number; spccpM_Name: string }[]; // Program Master
        eventList: { spccmE_Id: number; spccmE_EventName: string }[];
        divisionList: { spccmD_Id: number; spccmD_DivisionName: string }[];
        classList: { asmcL_Id: number; asmcL_ClassName: string }[];
        categoryList: { spccmcC_Id: number; spccmcC_CompitionCategory: string }[];
        sectionList: { asmS_Id: number; asmC_SectionName: string }[];
        sportsList: { spccmscC_Id: number; spccmscC_SportsCCName: string }[];
    }> = {
        success: true,
        message: 'Dropdowns fetched successfully',
        data: {
            academicYear: [
                { asmaY_Id: 1, asmaY_Year: '2023-2024' },
                { asmaY_Id: 2, asmaY_Year: '2024-2025' },
            ],
            houseList: [
                { spccmH_Id: 1, spccmH_HouseName: 'Red House' },
                { spccmH_Id: 2, spccmH_HouseName: 'Blue House' },
                { spccmH_Id: 3, spccmH_HouseName: 'Green House' },
                { spccmH_Id: 4, spccmH_HouseName: 'Yellow House' },
            ],
            events: [
                { spccE_Id: 1, spccpM_Name: 'Annual Sports Meet' },
                { spccE_Id: 2, spccpM_Name: 'Inter-School Competition' },
                { spccE_Id: 3, spccpM_Name: 'Zonal Tournament' },
            ],
            eventList: [
                { spccmE_Id: 1, spccmE_EventName: '100m Dash' },
                { spccmE_Id: 2, spccmE_EventName: 'Long Jump' },
                { spccmE_Id: 3, spccmE_EventName: 'Chess' },
                { spccmE_Id: 4, spccmE_EventName: 'Swimming' },
                { spccmE_Id: 5, spccmE_EventName: 'Football' },
            ],
            divisionList: [
                { spccmD_Id: 1, spccmD_DivisionName: 'Junior Division' },
                { spccmD_Id: 2, spccmD_DivisionName: 'Senior Division' },
                { spccmD_Id: 3, spccmD_DivisionName: 'Sub-Junior Division' },
            ],
            classList: [
                { asmcL_Id: 1, asmcL_ClassName: 'Class 1' },
                { asmcL_Id: 2, asmcL_ClassName: 'Class 2' },
                { asmcL_Id: 3, asmcL_ClassName: 'Class 10' },
            ],
            categoryList: [
                { spccmcC_Id: 1, spccmcC_CompitionCategory: 'Under 14' },
                { spccmcC_Id: 2, spccmcC_CompitionCategory: 'Under 17' },
                { spccmcC_Id: 3, spccmcC_CompitionCategory: 'Open Category' },
            ],
            sectionList: [
                { asmS_Id: 1, asmC_SectionName: 'Section A' },
                { asmS_Id: 2, asmC_SectionName: 'Section B' },
                { asmS_Id: 3, asmC_SectionName: 'Section C' },
            ],
            sportsList: [
                { spccmscC_Id: 1, spccmscC_SportsCCName: 'Athletics' },
                { spccmscC_Id: 2, spccmscC_SportsCCName: 'Cricket' },
                { spccmscC_Id: 3, spccmscC_SportsCCName: 'Badminton' },
            ],
        },
    };
    return response;
}

export async function getPointsRecordReport(data: PointsRecordReportFormSchema | SportPointsAndRecordReportFormSchema) {
    // Generate dynamic mock data
    const count = 15;
    const dummyData: IPointsRecordReportData[] = [];

    const names = ['Arjun', 'Vihaan', 'Aditya', 'Sai', 'Reyansh', 'Aarav', 'Krishna', 'Ishaan'];
    const surnames = ['Sharma', 'Verma', 'Gupta', 'Kumar', 'Singh', 'Reddy', 'Patel', 'Joshi'];
    const ranks = ['1st', '2nd', '3rd', 'Participated'];

    for (let i = 0; i < count; i++) {
        const fullName = `${names[i % names.length]} ${surnames[i % surnames.length]}`;
        const admNo = `AG-2024-${1000 + i}`;
        const points = Math.floor(Math.random() * 10) + 1;
        const rank = ranks[i % ranks.length];
        const houseName = ['Red House', 'Blue House', 'Green House', 'Yellow House'][i % 4];

        dummyData.push({
            amst_Id: i + 1,
            AMST_AdmNo: admNo,
            AMST_Name: fullName,
            ASMCL_ClassName: `Class ${Math.floor(Math.random() * 10) + 1}`,
            ASMC_SectionName: ['Section A', 'Section B'][i % 2],
            SPCCMH_HouseName: houseName,
            SPCCME_EventName: ['100m Dash', 'Long Jump', 'High Jump'][i % 3],
            SPCCMEV_EventVenue: 'Main Ground',
            SPCCMSCC_SportsCCName: 'Athletics',
            SPCCESTR_Points: points,
            SPCCESTR_Rank: rank,
            SPCCESTR_Remarks: 'Good Performance',
            // Legacy/Alias properties
            adm_no: admNo,
            studentname: fullName,
            spccestR_Place: rank,
            spccestR_Points: points,
            spccmD_DivisionName: ['Junior Division', 'Senior Division'][i % 2],
            spccmH_HouseName: houseName,
        });
    }

    const response: ApiResponse<IPointsRecordReportData[]> = {
        success: true,
        message: 'Report generated successfully',
        data: dummyData,
    };

    return response;
}
