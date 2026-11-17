'use server';

import { type ApiResponse } from '@/lib/apiService';
import { type IDropdown } from '@/types';
import { type SportStudentParticipationReportData } from '@/app/(root)/Sports/Reports/SportStudentParticipationReport/types';

const dummyData: SportStudentParticipationReportData[] = Array.from({ length: 14 }, (_, i) => ({
    id: i + 1,
    AMST_AdmNo: `ADM${202400 + i}`,
    AMST_Name: `Student ${i + 1}`,
    ASMCL_ClassName: ['Class 5', 'Class 6', 'Class 7', 'Class 8'][i % 4],
    ASMC_SectionName: ['A', 'B', 'C'][i % 3],
    SPCCMH_HouseName: ['Red House', 'Blue House', 'Green House', 'Yellow House'][i % 4],
    AMST_DOB: new Date(2010 + i % 5, i % 12, 1 + i % 28).toISOString(),
    SPCCMCL_CompitionLevel: ['Inter-House', 'Zonal', 'State'][i % 3],
    SPCCMSCC_SportsCCName: ['Cricket', 'Football', 'Basketball', 'Throwball'][i % 4],
    SPCCE_StartDate: new Date(2024, i % 12, 10 + i % 15).toISOString(),
}));

export async function getStudentParticipationReportData(data: any): Promise<ApiResponse<SportStudentParticipationReportData[]>> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
        success: true,
        message: 'Data fetched successfully',
        data: dummyData,
    };
}

export async function getInitialData(): Promise<ApiResponse<{
    academicYears: IDropdown[];
    houses: IDropdown[];
    classes: IDropdown[];
    sections: IDropdown[];
}>> {
    return {
        success: true,
        message: 'Initial data fetched',
        data: {
            academicYears: [
                { id: 1, label: '2023-2024', code: '23-24', name: '2023-2024' },
                { id: 2, label: '2024-2025', code: '24-25', name: '2024-2025' },
                { id: 3, label: '2025-2026', code: '25-26', name: '2025-2026' }
            ],
            houses: [
                { id: 1, label: 'Red House', code: 'RED', name: 'Red House' },
                { id: 2, label: 'Blue House', code: 'BLUE', name: 'Blue House' },
                { id: 3, label: 'Green House', code: 'GREEN', name: 'Green House' },
                { id: 4, label: 'Yellow House', code: 'YELLOW', name: 'Yellow House' }
            ],
            classes: [
                { id: 1, label: 'Class 5', code: 'C5', name: 'Class 5' },
                { id: 2, label: 'Class 6', code: 'C6', name: 'Class 6' },
                { id: 3, label: 'Class 7', code: 'C7', name: 'Class 7' },
                { id: 4, label: 'Class 8', code: 'C8', name: 'Class 8' }
            ],
            sections: [
                { id: 1, label: 'Section A', code: 'A', name: 'Section A' },
                { id: 2, label: 'Section B', code: 'B', name: 'Section B' },
                { id: 3, label: 'Section C', code: 'C', name: 'Section C' }
            ]
        }
    };
}
