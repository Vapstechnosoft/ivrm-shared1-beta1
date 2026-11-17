'use server';

import { api } from '@/lib/apiService';
import type {
    IAcademicYear,
    IAlumniLettersReportResponse,
    IAlumniLettersShowReportResponse,
    IClassDetails
} from '@/types/alumni/alumni-letters';

export async function getAlumniLettersYearData() {
    const url = '/AlumnilettersContoller/bind_year_data';
    return await api.get<IAcademicYear[]>('alumni', url);
}

export async function getAlumniLettersClassData() {
    const url = '/AlumnilettersContoller/bind_class_data';
    return await api.get<IClassDetails[]>('alumni', url);
}

export async function getAlumniLettersShowReport(data: { ASMAY_Id: number; ASMCL_Id: number; logoname: string }) {
    const url = '/AlumnilettersContoller/ShowReport';
    return await api.post<IAlumniLettersShowReportResponse>('alumni', url, data);
}

export async function getAlumniLettersReport(data: {
    ASMAY_Id: number;
    ASMCL_Id: number;
    letter_list: string;
    logoname: string;
    studlistdata: { AMST_ID: number }[];
}) {
    const url = '/AlumnilettersContoller/letterReport';
    return await api.post<IAlumniLettersReportResponse>('alumni', url, data);
}
