'use server';

import { api } from '@/lib/apiService';

export const getDeputationReportLoadData = async () => {
    return await api.get<any>('timetable', 'Deputation/getdetails');
};

export const getDeputationReportDetails = async (data: any) => {
    return await api.post<any>('timetable', 'Deputation/getreport', data);
};
