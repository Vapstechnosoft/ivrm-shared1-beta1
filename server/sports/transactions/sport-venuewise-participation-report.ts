'use server';

import { type ApiResponse } from '@/lib/apiService';
import { IDropdown } from '@/types';
import { SportVenuewiseParticipationReportFormData, SportVenuewiseReportData } from '@/schemas/sports/transactions/sport-venuewise-participation-report';

export async function getInitialData(): Promise<ApiResponse<{ academicYears: IDropdown[] }>> {
    const academicYears: IDropdown[] = [
        { id: 1, label: '2023-2024', code: '2023-2024', name: '2023-2024' },
        { id: 2, label: '2024-2025', code: '2024-2025', name: '2024-2025' },
        { id: 3, label: '2025-2026', code: '2025-2026', name: '2025-2026' }
    ];

    return {
        success: true,
        message: 'Initial data fetched successfully',
        data: { academicYears }
    };
}

export async function getDetails(data: { ASMAY_Id: number }): Promise<ApiResponse<{ classes: IDropdown[], houses: IDropdown[], venues: IDropdown[] }>> {
    const classes: IDropdown[] = [
        { id: 1, label: 'Class I', code: 'I', name: 'Class I' },
        { id: 2, label: 'Class II', code: 'II', name: 'Class II' },
        { id: 3, label: 'Class III', code: 'III', name: 'Class III' },
        { id: 4, label: 'Class IV', code: 'IV', name: 'Class IV' },
        { id: 5, label: 'Class V', code: 'V', name: 'Class V' }
    ];

    const houses: IDropdown[] = [
        { id: 1, label: 'Red House', code: 'RED', name: 'Red House' },
        { id: 2, label: 'Blue House', code: 'BLUE', name: 'Blue House' },
        { id: 3, label: 'Green House', code: 'GRN', name: 'Green House' },
        { id: 4, label: 'Yellow House', code: 'YEL', name: 'Yellow House' }
    ];

    const venues: IDropdown[] = [
        { id: 1, label: 'Main Ground', code: 'MAIN', name: 'Main Ground' },
        { id: 2, label: 'Indoor Stadium', code: 'INDOOR', name: 'Indoor Stadium' },
        { id: 3, label: 'Swimming Pool', code: 'POOL', name: 'Swimming Pool' },
        { id: 4, label: 'Basketball Court', code: 'COURT', name: 'Basketball Court' }
    ];

    return {
        success: true,
        message: 'Details fetched successfully',
        data: { classes, houses, venues }
    };
}

export async function getSections(data: { ASMAY_Id: number, asmcL_Id: number }): Promise<ApiResponse<IDropdown[]>> {
    const sections: IDropdown[] = [
        { id: 1, label: 'A', code: 'A', name: 'A' },
        { id: 2, label: 'B', code: 'B', name: 'B' },
        { id: 3, label: 'C', code: 'C', name: 'C' }
    ];

    return {
        success: true,
        message: 'Sections fetched successfully',
        data: sections
    };
}

export async function getReportData(data: SportVenuewiseParticipationReportFormData): Promise<ApiResponse<SportVenuewiseReportData[]>> {
    const dummyData: SportVenuewiseReportData[] = [
        { id: 1, spccmH_HouseName: 'Red House', spccmeV_EventVenue: 'Main Ground', amsT_Name: 'John Doe', amsT_AdmNo: 'ADM001', asmcL_ClassName: 'Class V', asmC_SectionName: 'A', spccmE_EventName: '100m Race', spccmscc_SportsCCName: 'Athletics', spccE_StartDate: '2025-01-15' },
        { id: 2, spccmH_HouseName: 'Blue House', spccmeV_EventVenue: 'Main Ground', amsT_Name: 'Jane Smith', amsT_AdmNo: 'ADM002', asmcL_ClassName: 'Class V', asmC_SectionName: 'B', spccmE_EventName: '200m Race', spccmscc_SportsCCName: 'Athletics', spccE_StartDate: '2025-01-15' },
        { id: 3, spccmH_HouseName: 'Green House', spccmeV_EventVenue: 'Indoor Stadium', amsT_Name: 'Michael Johnson', amsT_AdmNo: 'ADM003', asmcL_ClassName: 'Class IV', asmC_SectionName: 'A', spccmE_EventName: 'Badminton Singles', spccmscc_SportsCCName: 'Badminton', spccE_StartDate: '2025-01-16' },
        { id: 4, spccmH_HouseName: 'Yellow House', spccmeV_EventVenue: 'Indoor Stadium', amsT_Name: 'Emily Davis', amsT_AdmNo: 'ADM004', asmcL_ClassName: 'Class IV', asmC_SectionName: 'B', spccmE_EventName: 'Badminton Doubles', spccmscc_SportsCCName: 'Badminton', spccE_StartDate: '2025-01-16' },
        { id: 5, spccmH_HouseName: 'Red House', spccmeV_EventVenue: 'Swimming Pool', amsT_Name: 'David Wilson', amsT_AdmNo: 'ADM005', asmcL_ClassName: 'Class III', asmC_SectionName: 'A', spccmE_EventName: '50m Freestyle', spccmscc_SportsCCName: 'Swimming', spccE_StartDate: '2025-01-17' },
        { id: 6, spccmH_HouseName: 'Blue House', spccmeV_EventVenue: 'Swimming Pool', amsT_Name: 'Sarah Brown', amsT_AdmNo: 'ADM006', asmcL_ClassName: 'Class III', asmC_SectionName: 'B', spccmE_EventName: '100m Freestyle', spccmscc_SportsCCName: 'Swimming', spccE_StartDate: '2025-01-17' },
        { id: 7, spccmH_HouseName: 'Green House', spccmeV_EventVenue: 'Basketball Court', amsT_Name: 'James Taylor', amsT_AdmNo: 'ADM007', asmcL_ClassName: 'Class II', asmC_SectionName: 'A', spccmE_EventName: 'Basketball Match 1', spccmscc_SportsCCName: 'Basketball', spccE_StartDate: '2025-01-18' },
        { id: 8, spccmH_HouseName: 'Yellow House', spccmeV_EventVenue: 'Basketball Court', amsT_Name: 'Olivia Moore', amsT_AdmNo: 'ADM008', asmcL_ClassName: 'Class II', asmC_SectionName: 'B', spccmE_EventName: 'Basketball Match 2', spccmscc_SportsCCName: 'Basketball', spccE_StartDate: '2025-01-18' },
        { id: 9, spccmH_HouseName: 'Red House', spccmeV_EventVenue: 'Main Ground', amsT_Name: 'William Jackson', amsT_AdmNo: 'ADM009', asmcL_ClassName: 'Class I', asmC_SectionName: 'A', spccmE_EventName: 'Relay Race', spccmscc_SportsCCName: 'Athletics', spccE_StartDate: '2025-01-19' },
        { id: 10, spccmH_HouseName: 'Blue House', spccmeV_EventVenue: 'Main Ground', amsT_Name: 'Sophia Martin', amsT_AdmNo: 'ADM010', asmcL_ClassName: 'Class I', asmC_SectionName: 'B', spccmE_EventName: 'Relay Race', spccmscc_SportsCCName: 'Athletics', spccE_StartDate: '2025-01-19' },
        { id: 11, spccmH_HouseName: 'Green House', spccmeV_EventVenue: 'Indoor Stadium', amsT_Name: 'Robert Anderson', amsT_AdmNo: 'ADM011', asmcL_ClassName: 'Class V', asmC_SectionName: 'A', spccmE_EventName: 'Table Tennis Singles', spccmscc_SportsCCName: 'Table Tennis', spccE_StartDate: '2025-01-20' },
        { id: 12, spccmH_HouseName: 'Yellow House', spccmeV_EventVenue: 'Indoor Stadium', amsT_Name: 'Isabella White', amsT_AdmNo: 'ADM012', asmcL_ClassName: 'Class V', asmC_SectionName: 'B', spccmE_EventName: 'Table Tennis Doubles', spccmscc_SportsCCName: 'Table Tennis', spccE_StartDate: '2025-01-20' },
        { id: 13, spccmH_HouseName: 'Red House', spccmeV_EventVenue: 'Swimming Pool', amsT_Name: 'Charles Harris', amsT_AdmNo: 'ADM013', asmcL_ClassName: 'Class IV', asmC_SectionName: 'A', spccmE_EventName: '200m Medley', spccmscc_SportsCCName: 'Swimming', spccE_StartDate: '2025-01-21' },
        { id: 14, spccmH_HouseName: 'Blue House', spccmeV_EventVenue: 'Swimming Pool', amsT_Name: 'Amelia Clark', amsT_AdmNo: 'ADM014', asmcL_ClassName: 'Class IV', asmC_SectionName: 'B', spccmE_EventName: '200m Medley', spccmscc_SportsCCName: 'Swimming', spccE_StartDate: '2025-01-21' },
        { id: 15, spccmH_HouseName: 'Green House', spccmeV_EventVenue: 'Basketball Court', amsT_Name: 'Daniel Lewis', amsT_AdmNo: 'ADM015', asmcL_ClassName: 'Class III', asmC_SectionName: 'A', spccmE_EventName: 'Basketball Final', spccmscc_SportsCCName: 'Basketball', spccE_StartDate: '2025-01-22' },
        { id: 16, spccmH_HouseName: 'Yellow House', spccmeV_EventVenue: 'Basketball Court', amsT_Name: 'Mia Robinson', amsT_AdmNo: 'ADM016', asmcL_ClassName: 'Class III', asmC_SectionName: 'B', spccmE_EventName: 'Basketball Final', spccmscc_SportsCCName: 'Basketball', spccE_StartDate: '2025-01-22' },
        { id: 17, spccmH_HouseName: 'Red House', spccmeV_EventVenue: 'Main Ground', amsT_Name: 'Matthew Walker', amsT_AdmNo: 'ADM017', asmcL_ClassName: 'Class II', asmC_SectionName: 'A', spccmE_EventName: 'Long Jump', spccmscc_SportsCCName: 'Athletics', spccE_StartDate: '2025-01-23' }
    ];

    return {
        success: true,
        message: 'Report data fetched successfully',
        data: dummyData
    };
}
