'use server';

import { api } from '@/lib/apiService';

export interface AttendanceLoadData {
    attyearlist: {
        asmaY_Id: number;
        asmaY_Year: string;
    }[];
    currentyear: {
        asmaY_Id: number;
    }[];
}

export interface AttendanceData {
    attList: {
        CLASS_HELD: number;
        TOTAL_PRESENT: number;
        ABSENT_COUNT: number;
        score: number;
        ABSENT_DATES: string;
        MONTH_NAME: string;
    }[];
}

const MOCK_ACADEMIC_YEARS = [
    { asmaY_Id: 1, asmaY_Year: '2023-2024' },
    { asmaY_Id: 2, asmaY_Year: '2022-2023' }
];

const MOCK_ATTENDANCE_DATA = [
    {
        CLASS_HELD: 25,
        TOTAL_PRESENT: 22,
        ABSENT_COUNT: 3,
        score: 88,
        ABSENT_DATES: '01/06/2023, 15/06/2023, 20/06/2023',
        MONTH_NAME: 'June'
    },
    {
        CLASS_HELD: 24,
        TOTAL_PRESENT: 24,
        ABSENT_COUNT: 0,
        score: 100,
        ABSENT_DATES: '',
        MONTH_NAME: 'July'
    },
    {
        CLASS_HELD: 22,
        TOTAL_PRESENT: 20,
        ABSENT_COUNT: 2,
        score: 90,
        ABSENT_DATES: '05/08/2023, 10/08/2023',
        MONTH_NAME: 'August'
    }
];

export async function getAttendanceLoadData(data: any): Promise<AttendanceLoadData> {
    // Assumption: The backend API path follows the pattern /api/[Controller]/[Action]
    // or /api/StudentPortal/[Controller]/[Action]
    // Based on legacy code: "AttendanceDetails/getloaddata"
    // const url = `/AttendanceDetails/getloaddata`;
    // return await api.post<any>('default', url, data);

    return {
        attyearlist: MOCK_ACADEMIC_YEARS,
        currentyear: [{ asmaY_Id: 1 }]
    };
}

export async function getAttendanceData(data: { ASMAY_Id: number }): Promise<AttendanceData> {
    // const url = `/AttendanceDetails/getAttdata`;
    // return await api.post<any>('default', url, data);

    console.log('Fetching Attendance data (mock) for year:', data.ASMAY_Id);
    return {
        attList: MOCK_ATTENDANCE_DATA
    };
}
