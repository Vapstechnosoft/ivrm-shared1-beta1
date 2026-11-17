'use server';

import { api } from '@/lib/apiService';

// Staff Wise TimeTable Report
export const getStaffWiseDetails = async (data: any) => {
    return await api.get<any>('timetable', 'StaffWiseTT/getdetails');
};

export const getStaffWiseReport = async (data: any) => {
    return await api.post<any>('timetable', 'StaffWiseTT/getrpt', data);
};
