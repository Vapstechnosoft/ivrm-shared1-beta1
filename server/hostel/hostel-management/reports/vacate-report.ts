'use server';

import { api } from '@/lib/apiService';

const SERVICE_NAME = 'default';
const API_BASE_URL = 'HostelVacateReport';

export const getVacateReportLoadData = async (type: string) => {
    try {
        const response = await api.post(SERVICE_NAME, `${API_BASE_URL}/loaddata`, { type });
        return response.data || {};
    } catch (error) {
        console.error('Error fetching vacate report load data:', error);
        return {};
    }
};

export const getStudentListForReport = async (ASMAY_Id: number) => {
    try {
        const response = await api.post(SERVICE_NAME, `${API_BASE_URL}/get_Studentlist`, { ASMAY_Id });
        return response.data;
    } catch (error) {
        console.error('Error fetching student list for report:', error);
        return { studentList: [] };
    }
};

export const getVacateReport = async (data: any) => {
    try {
        const payload = {
            ...data,
            Fromdate: data.Fromdate ? new Date(data.Fromdate).toISOString() : null,
            ToDate: data.ToDate ? new Date(data.ToDate).toISOString() : null
        };
        const response = await api.post(SERVICE_NAME, `${API_BASE_URL}/get_report`, payload);
        return response.data;
    } catch (error) {
        console.error('Error generating vacate report:', error);
        return { success: false, message: 'Failed to generate report', griddata: [] };
    }
};
