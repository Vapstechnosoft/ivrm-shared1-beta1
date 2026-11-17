'use server';

import { api } from '@/lib/apiService';
import {
    IStudentEligibleReportClass,
    IStudentEligibleReportDetail,
    IStudentEligibleReportLoadData,
    IStudentEligibleReportRequest,
    IStudentEligibleReportSection,
    IStudentEligibleReportStudent
} from '@/types/sports/reports/student-eligible-report';

const API_URL = {
    GET_DETAILS: 'SportStudentEligbleReport/Getdetails',
    GET_CLASS: 'SportStudentEligbleReport/get_class',
    GET_SECTION: 'SportStudentEligbleReport/get_section',
    GET_STUDENT: 'SportStudentEligbleReport/get_student',
    SHOW_DETAILS: 'SportStudentEligbleReport/showdetails',
};

export async function getStudentEligibleReportLoadData(): Promise<IStudentEligibleReportLoadData> {
    try {
        const response = await api.post<{ yearlist: any[] }>('sports', API_URL.GET_DETAILS, {});
        return {
            yearlist: response.data?.yearlist || [],
        };
    } catch (error) {
        console.error('Error fetching Student Eligible Report Load Data:', error);
        return { yearlist: [] };
    }
}

export async function getClassesForStudentEligible(asmaY_Id: number): Promise<IStudentEligibleReportClass[]> {
    try {
        const response = await api.post<{ classList: IStudentEligibleReportClass[] }>('sports', API_URL.GET_CLASS, { asmaY_Id });
        return response.data?.classList || [];
    } catch (error) {
        console.error('Error fetching Classes:', error);
        return [];
    }
}

export async function getSectionsForStudentEligible(asmaY_Id: number, asmcL_Id: number): Promise<IStudentEligibleReportSection[]> {
    try {
        const response = await api.post<{ sectionList: IStudentEligibleReportSection[] }>('sports', API_URL.GET_SECTION, { asmaY_Id, asmcL_Id });
        return response.data?.sectionList || [];
    } catch (error) {
        console.error('Error fetching Sections:', error);
        return [];
    }
}

export async function getStudentsForStudentEligible(asmaY_Id: number, asmcL_Id: number, asmS_Id: number): Promise<IStudentEligibleReportStudent[]> {
    try {
        const response = await api.post<{ studentList1: IStudentEligibleReportStudent[] }>('sports', API_URL.GET_STUDENT, { asmaY_Id, asmcL_Id, asmS_Id });
        return response.data?.studentList1 || [];
    } catch (error) {
        console.error('Error fetching Students:', error);
        return [];
    }
}

export async function getStudentEligibleReport(data: IStudentEligibleReportRequest): Promise<IStudentEligibleReportDetail[]> {
    try {
        const response = await api.post<{ viewlist: IStudentEligibleReportDetail[] }>('sports', API_URL.SHOW_DETAILS, data);
        return response.data?.viewlist || [];
    } catch (error) {
        console.error('Error generating Student Eligible Report:', error);
        return [];
    }
}
