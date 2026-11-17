'use server';

import { api } from '@/lib/apiService';
import { auth } from '@/lib/auth';
import type {
    IApproveClgAlumniResponse,
    ICheckStudentAlumniResponse,
    IClgAlumniSaveData,
    ISaveClgAlumniResponse,
    IClgAlumniSearchFilter,
    ISearchFilterClgAlumniResponse
} from '@/types/alumni/clg-alumni-approval';

export async function getAcademicYear() {
    const session = await auth();
    const ivrmrtId = (session as any)?.ivrmrT_Id || 30;
    const url = `/CLGAlumniApproval/get_intial_data?IVRMRT_Id=${ivrmrtId}`;
    return await api.get<any>('alumni', url);
}

export async function getStudentAlumni(ALCSREG_Id: number) {
    const url = `/CLGAlumniApproval/getstudata?ALCMST_Id=${ALCSREG_Id}`;
    return await api.get<ICheckStudentAlumniResponse>('alumni', url);
}

export async function checkStudentAlumni(data: { ALCSREG_Id: number; membername: string }) {
    const url = '/CLGAlumniApproval/checkstudent';
    return await api.post<ICheckStudentAlumniResponse>('alumni', url, data);
}

export async function getStudentListByYear(asmay_Id: number) {
    const url = `/CLGAlumniApproval/Getstudentlist?asmay_Id=${asmay_Id}`;
    return await api.get<any>('alumni', url);
}

export async function getStudentListByCourse(asmay_Id: number, amco_id: number) {
    const url = `/CLGAlumniApproval/Getstudentlistapp?asmay_Id=${asmay_Id}&amco_id=${amco_id}`;
    return await api.get<any>('alumni', url);
}

export async function approveClgAlumniData(data: { ALCSREG_Id: number; ALCMST_Id: number }) {
    const url = '/CLGAlumniApproval/aproovedata';
    const payload = {
        alcsreG_Id: data.ALCSREG_Id,
        alcmsT_Id: data.ALCMST_Id
    };
    return await api.post<IApproveClgAlumniResponse>('alumni', url, payload, {
        validateStatus: (status) => status < 600
    });
}

export async function saveClgAlumniData(data: IClgAlumniSaveData) {
    const url = '/CLGAlumniApproval/savedata';
    return await api.post<ISaveClgAlumniResponse>('alumni', url, data);
}

export async function searchFilterClgAlumni(data: IClgAlumniSearchFilter) {
    const session = await auth();
    const asmayId = data.ASMAY_Id;
    const url = '/CLGAlumniApproval/searchfilter';
    const payload = {
        ...data,
        ASMAY_Id: asmayId
    };
    return await api.post<ISearchFilterClgAlumniResponse>('alumni', url, payload);
}
