'use server';

import { api, type ApiResponse } from '@/lib/apiService';
import {
    IEmployeePunchAttendanceFilter,
    IEmployeePunchAttendanceInitialData,
    IEmployeePunchAttendanceReportData,
} from '@/types/staff-portal/biometric-report/employee-punch-attendance.types';

const BASE_URL = '/EmployeePunchAttendence';

export const getEmployeePunchAttendanceInitialData = async (): Promise<
    ApiResponse<IEmployeePunchAttendanceInitialData>
> => {
    const id = 2; // Hardcoded ID as per original controller
    return await api.get<IEmployeePunchAttendanceInitialData>(
        'portal',
        `${BASE_URL}/getalldetails/${id}`
    );
};

export const getEmployeePunchAttendanceReport = async (
    payload: IEmployeePunchAttendanceFilter
): Promise<ApiResponse<IEmployeePunchAttendanceReportData>> => {
    return await api.post<IEmployeePunchAttendanceReportData>(
        'portal',
        `${BASE_URL}/getrpt/`,
        payload
    );
};
