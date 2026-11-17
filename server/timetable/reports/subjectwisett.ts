'use server';

import { api } from '@/lib/apiService';

// Subject Wise TimeTable Report
export const getSubjectWiseDetails = async (data: any) => {
    return await api.get<any>('timetable', 'Subjectwise/getdetails');
};

export const getSubjectWiseReport = async (data: any) => {
    return await api.post<any>('timetable', 'Subjectwise/savedetail', data);
};
