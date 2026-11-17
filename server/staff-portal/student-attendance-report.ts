
'use server';

import { api } from '@/lib/apiService';
import {
    IStudentAttendanceReportInitialData,
    IClass,
    ISection,
    IStudentItem,
    IReportResponse,
    IReportFilterRequest
} from '@/types/staff-portal/student-attendance-report';

const BASE_URL = 'StudentAttendanceReport';

export async function getInitialReportData() {
    try {
        const url = `/${BASE_URL}/getdetails/`;
        const response = await api.get<IStudentAttendanceReportInitialData>('portal', url);
        if (!response.data) throw new Error('Failed to load initial report data');
        return response.data;
    } catch (error) {
        console.error('Error fetching initial report data:', error);
        throw error;
    }
}

export async function getReportClasses(asmaY_Id: number, amC_Id: number = 0) {
    try {
        const url = `/${BASE_URL}/getclass`;
        const response = await api.post<{ fillclass: IClass[] }>('portal', url, {
            ASMAY_Id: asmaY_Id,
            AMC_Id: amC_Id
        });
        if (!response.data) throw new Error('Failed to load classes');
        return response.data.fillclass;
    } catch (error) {
        console.error('Error fetching report classes:', error);
        throw error;
    }
}

export async function getReportSections(asmaY_Id: number, classList: { ASMCL_Id: number }[]) {
    try {
        const url = `/Classwisestudentconteoller/getsection`;
        const response = await api.post<{ fillsection: ISection[] }>('portal', url, {
            ASMAY_Id: asmaY_Id,
            classlsttwo: classList
        });
        if (!response.data) throw new Error('Failed to load sections');
        return response.data.fillsection;
    } catch (error) {
        console.error('Error fetching report sections:', error);
        throw error;
    }
}

export async function getReportStudents(data: any) {
    try {
        const url = `/${BASE_URL}/getdatatype`;
        const response = await api.post<{ studentAttendanceList: IStudentItem[] }>('portal', url, data);
        if (!response.data) throw new Error('Failed to load students');
        return response.data.studentAttendanceList;
    } catch (error) {
        console.error('Error fetching report students:', error);
        throw error;
    }
}

export async function getReportDetails(data: IReportFilterRequest) {
    try {
        const url = `/${BASE_URL}/getAttendetails`;
        const response = await api.post<IReportResponse>('portal', url, data);
        if (!response.data) throw new Error('Failed to load report details');
        return response.data;
    } catch (error) {
        console.error('Error fetching report details:', error);
        throw error;
    }
}

export async function sendAbsentNotice(students: any[], template: string = 'AbsentNotice') {
    try {
        const url = `/${BASE_URL}/OnChangeClassAbsent`;
        const response = await api.post<{ message: string }>('portal', url, {
            AbsentSMS: students,
            TemplateName: template
        });
        if (!response.data) throw new Error('Failed to send notice');
        return response.data;
    } catch (error) {
        console.error('Error sending absent notice:', error);
        throw error;
    }
}
