'use server';
import { api } from '@/lib/apiService';
import type {
    IFeeAcademicYearDropdownList,
    IFeeClassDropdownList,
    IFeeSectionDropdownList,
    IFeeTermDropdownList
} from '@/types/fees/reports/reports';

export async function gettermwiseAcademicYeardropdown() {
    const url = '/FeesCommon/academic-year-list';
    return await api.get<IFeeAcademicYearDropdownList[]>('fees', url);
}

export async function getFeesTermWiseReportClassList() {
    const url = '/FeesCommon/class-details';
    return await api.get<IFeeClassDropdownList[]>('fees', url);
}

export async function getFeesTermWiseReportSectionList() {
    const url = '/FeesCommon/section-details';
    return await api.get<IFeeSectionDropdownList[]>('fees', url);
}

export async function getFeesTermDropDownforStudentTermWiseReport() {
    const url = '/FeesCommon/fee-term-details';
    return await api.get<IFeeTermDropdownList[]>('fees', url);
}

export async function getFeeStudentTermWisePaidReport(payload: any) {
    const url = '/FeeDefaulterReportStthomas/get-student-paid-report';
    return await api.post<any[]>('fees', url, payload);
}
