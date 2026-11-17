'use server';

import { api } from '@/lib/apiService';

// Consolidated Report
export const getConsolidatedReportDetails = async (data: any) => {
    return await api.get<any>('timetable', 'TTConsolidated/getalldetails');
};

export const getConsolidatedReport = async (data: any) => {
    return await api.post<any>('timetable', 'TTConsolidated/getrpt', data);
};
