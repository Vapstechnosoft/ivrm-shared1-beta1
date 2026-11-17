'use server';

import { api } from '@/lib/apiService';
import { auth } from '@/lib/auth';

import type {
    IAcademicYear,
    IClgAlumniSearchResponse,
    IClgAlumniStudentSearchPayload
} from '@/types/alumni/clg-alumni-student-search';


export async function getAcademicYear() {
    const session = await auth();
    const ivrmrtId = (session as any)?.ivrmrT_Id || 30;
    const url = `/CLGAlumniApproval/get_intial_data?IVRMRT_Id=${ivrmrtId}`;
    return await api.get<any>('alumni', url);
}

export async function getCoursesByYear(params: { ASMAY_Id: number; status_type: string }) {
    const url = `/CLGAlumnistudentsearch/getCourse?status_type=${params.status_type}&ASMAY_Id=${params.ASMAY_Id}`;
    return await api.get<any>('alumni', url);
}

export async function getBranchesByCourse(data: { AMCO_Id: number; ASMAY_Id: number }) {
    const url = `/CLGAlumnistudentsearch/getBranch?AMCO_Id=${data.AMCO_Id}&ASMAY_Id=${data.ASMAY_Id}`;
    return await api.get<any>('alumni', url);
}

export async function getSemestersByBranch(data: { AMB_Id: number; ASMAY_Id: number; ACAYCB_Id: number }) {
    const url = `/CLGAlumnistudentsearch/getsemdata?AMB_Id=${data.AMB_Id}&ASMAY_Id=${data.ASMAY_Id}&ACAYCB_Id=${data.ACAYCB_Id}`;
    return await api.get<any>('alumni', url);
}


export async function getClgAlumniStudentSearchData(data: IClgAlumniStudentSearchPayload) {
    const url = '/CLGAlumnistudentsearch/getsearchdata';
    return await api.post<IClgAlumniSearchResponse>('alumni', url, data);
}

export async function getClgAlumniStudentSemData(params: { AMCO_Id: number; AMB_Id: number; AMSE_Id: number; ASMAY_Id: number; ACAYCB_Id: number }) {
    const url = `/CLGAlumnistudentsearch/getdata?AMCO_Id=${params.AMCO_Id}&AMB_Id=${params.AMB_Id}&AMSE_Id=${params.AMSE_Id}&ASMAY_Id=${params.ASMAY_Id}&ACAYCB_Id=${params.ACAYCB_Id}`;
    return await api.get<IClgAlumniSearchResponse>('alumni', url);
}
