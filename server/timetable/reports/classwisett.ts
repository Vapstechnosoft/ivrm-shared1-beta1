'use server';

import { api } from '@/lib/apiService';

// Class Wise TimeTable Report
export const getClassWiseReportDetails = async (data: any) => {
    return await api.get<any>('timetable', 'ClassWiseTT/getdetails');
};

export const getClassWiseReport = async (data: any) => {
    return await api.post<any>('timetable', 'ClassWiseTT/getrpt', data);
};

export const getClassByCategory = async (data: any) => {
    return await api.post<any>('timetable', 'ClassWiseTT/getclass_catg', data);
};
