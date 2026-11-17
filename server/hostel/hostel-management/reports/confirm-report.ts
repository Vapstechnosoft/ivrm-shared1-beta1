'use client';

import { api } from '@/lib/apiService';
import { format } from 'date-fns';

export interface ConfirmReportDto {
    grid_list: Array<{
        studentname?: string;
        empname?: string;
        ASMCL_ClassName?: string;
        HRMD_DepartmentName?: string;
        HLMH_Name: string;
        HRMRM_RoomNo: string;
        HLHSREQC_ConfirmDate?: string;
        HLHSTREQC_ConfirmDate?: string;
        HLHSREQC_Remarks?: string;
        [key: string]: any;
    }>;
}

export async function getConfirmReport(values: any): Promise<ConfirmReportDto | null> {
    try {
        const payload = {
            "type": values.type,
            "frmdate": format(values.fromDate, 'yyyy-MM-dd'),
            "todate": format(values.toDate, 'yyyy-MM-dd'),
        };
        const res = await api.post<ConfirmReportDto>('hostel', '/Hostel_Confirm_Report/getreport', payload);
        if (res.data) return res.data;
    } catch (error) {
        console.error('Error fetching confirm report:', error);
    }
    return null;
}
