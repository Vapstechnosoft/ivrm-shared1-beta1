'use server';

import { api, type ApiResponse } from '@/lib/apiService';
import type { IEligibilityCertificateReport, IEligibilityCertificateReportDetail } from '@/types/sports/reports/eligibility-certificate-report';

export async function getEligibilityCertificateReport(): Promise<any> {
    // Mock Data for Dropdowns
    return {
        yearlist: [
            { asmaY_Id: 1, asmaY_Year: '2023-2024' },
            { asmaY_Id: 2, asmaY_Year: '2024-2025' }
        ],
        classList: [
            { asmcL_Id: 1, asmcL_ClassName: 'Class 1' },
            { asmcL_Id: 2, asmcL_ClassName: 'Class 2' }
        ],
        sectionList: [
            { asmS_Id: 1, asmC_SectionName: 'Section A' },
            { asmS_Id: 2, asmC_SectionName: 'Section B' }
        ],
        eventList: [
            { spccmE_Id: 1, spccmE_EventName: '100m Dash' },
            { spccmE_Id: 2, spccmE_EventName: 'Long Jump' }
        ]
    };
}

export async function getStudents(data: any): Promise<any> {
    // Mock Data for Students based on selection
    const studentList: any[] = [];
    for (let i = 1; i <= 5; i++) {
        studentList.push({
            amsT_Id: i,
            adm_no: `ADM${100 + i}`,
            studentname: `Student ${i}`,
            classname: 'Class 1',
            sectionname: 'Section A',
            Selected: false
        });
    }
    return { studentList };
}

export async function getAge(data: any): Promise<any> {
    // Simulated age calculation
    return {
        age_tilldate: [
            {
                spccsH_Age: '14 Years, 2 Months, 15 Days',
                spccsH_Age_Format: '14-2-15'
            }
        ]
    };
}

export async function generateEligibilityCertificateReport(data: IEligibilityCertificateReport): Promise<ApiResponse<IEligibilityCertificateReportDetail[]>> {
    // Return empty list to simulate "No Records Found" initially as requested
    // Logic can be added here to return mock data if needed later
    return {
        success: true,
        data: [],
        message: 'No Records Found',
        statusCode: 200 // Or appropriate status code
    };
}
