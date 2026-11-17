'use server';

import { type ApiResponse } from '@/lib/apiService';
import { IMonthEndReportData, MonthEndReportFormSchema } from '@/types/sports/reports/month-end-report';

export async function getMonthEndReportDropdowns() {
    const years = [];
    for (let year = 1998; year <= 2026; year++) {
        years.push({
            asmaY_Id: year,
            asmaY_Year: `${year}-${year + 1}`
        });
    }

    const response: ApiResponse<{
        academicYear: { asmaY_Id: number; asmaY_Year: string }[];
        monthList: { month: number; monthname: string }[];
    }> = {
        success: true,
        message: 'Dropdowns fetched successfully',
        data: {
            academicYear: years,
            monthList: [
                { month: 1, monthname: 'January' },
                { month: 2, monthname: 'February' },
                { month: 3, monthname: 'March' },
                { month: 4, monthname: 'April' },
                { month: 5, monthname: 'May' },
                { month: 6, monthname: 'June' },
                { month: 7, monthname: 'July' },
                { month: 8, monthname: 'August' },
                { month: 9, monthname: 'September' },
                { month: 10, monthname: 'October' },
                { month: 11, monthname: 'November' },
                { month: 12, monthname: 'December' },
            ],
        },
    };
    return response;
}

export async function getMonthEndReport(data: MonthEndReportFormSchema) {
    // Generate dynamic mock data based on inputs
    // Requirement: "report result counts in below 50" for Non Position and Position Holders
    // And "change with change in input data" (randomized)

    const getRandomUnder50 = () => Math.floor(Math.random() * 50);

    const nonPositionHolders = getRandomUnder50();
    const positionHolders = getRandomUnder50();
    const winners = Math.floor(Math.random() * positionHolders); // Winners should be subset of position holders or independent? Usually subset.
    const totalStudents = nonPositionHolders + positionHolders;

    const dummyData: IMonthEndReportData = {
        total_count_student: totalStudents,
        not_patr_std: nonPositionHolders,
        total_partic_student: positionHolders,
        total_winner_student: winners,
    };

    const response: ApiResponse<IMonthEndReportData> = {
        success: true,
        message: 'Report generated successfully',
        data: dummyData,
    };

    return response;
}
