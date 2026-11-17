'use server';

import { api } from '@/lib/apiService';
import { ComplaintLoadData, StudentComplaint } from './types';

const CONTROLLER = 'StudentCompliantsView';

export async function getStudentComplaintsLoadData() {
    try {
        const response = await api.get<ComplaintLoadData>('portal', `/${CONTROLLER}/get-load-data`);

        // Handle case sensitivity for API response keys
        const data = response.data;
        if (data) {
            const studentdivlist = (data as any).studentdivlist || (data as any).studentComplaintList || (data as any).StudentComplaintList || [];
            const yearlist = (data as any).yearlist || (data as any).academicYearList || (data as any).AcademicYearList || [];
            const asmaY_Id = (data as any).asmaY_Id || (data as any).ASMAY_Id || 0;

            return {
                yearlist: yearlist,
                studentdivlist: studentdivlist,
                asmaY_Id: asmaY_Id
            };
        }

        return { yearlist: [], studentdivlist: [], asmaY_Id: 0 };
    } catch (error) {
        console.error("Error fetching complaints load data:", error);
        return { yearlist: [], studentdivlist: [], asmaY_Id: 0 };
    }
}

export async function getStudentComplaintsReport(payload: { ASMAY_Id: number }) {
    try {
        const response = await api.get<any>('portal', `/${CONTROLLER}/get-report`, {
            params: payload
        });

        const data = response.data;
        // Handle case sensitivity 
        const studentdivlist = data?.studentdivlist || data?.studentComplaintList || data?.StudentComplaintList || [];

        return {
            studentdivlist: studentdivlist,
        };
    } catch (error) {
        console.error("Error fetching complaints report:", error);
        return {
            studentdivlist: [],
        };
    }
}
