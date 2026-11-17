'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IAcademicYearandClassandsection } from '@/types/exam/exam-module/report';

// 🔹 Cumulative Report Submit

export async function getCumulativeReport(data: any, apiSearchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(apiSearchParams ?? {});
    const url = `/cumulative_report?${urlParams}`;
    const response = await api.post<any>('exam', url, data);
    return response;
}

// 🔹 Class Dropdown
export async function getClassDropDownByAcademicYearlist(asmaY_Id: number) {
    if (!asmaY_Id) throw new Error('Academic Year ID is required');
    const url = `/exam_master_category/class_drop_down_by_academic_year_list/${asmaY_Id}`;
    return await api.get<IAcademicYearandClassandsection[]>('exam', url);
}

// 🔹 Section Dropdown
export async function getSectionsDropDownByAcademicYearandClasslist(asmaY_Id: number, asmcL_Id: number) {
    if (!asmaY_Id) throw new Error('Academic Year ID is required');
    if (!asmcL_Id) throw new Error('Class ID is required');
    const url = `/exam_master_category/sections_drop_down_by_class_list/${asmcL_Id}/${asmaY_Id}`;
    return await api.get<IAcademicYearandClassandsection[]>('exam', url);
}

// 🔹 Exam Dropdown
export async function getExamsDropDownByAcademicYearandClassandSectionlist(asmaY_Id: number, asmcL_Id: number, asmS_Id: number) {
    if (!asmaY_Id) throw new Error('Academic Year ID is required');
    if (!asmcL_Id) throw new Error('Class ID is required');
    if (!asmS_Id) throw new Error('Section ID is required');
    const url = `/exam_master/exam_drop_down_by_year_class_section_list/${asmaY_Id}/${asmcL_Id}/${asmS_Id}`;
    return await api.get<IAcademicYearandClassandsection[]>('exam', url);
}

// 🔹 Student Dropdown
export async function getStudentsDropDownByAcademicYearandClassandSectionlist(asmaY_Id: number, asmcL_Id: number, asmS_Id: number) {
    if (!asmaY_Id) throw new Error('Academic Year ID is required');
    if (!asmcL_Id) throw new Error('Class ID is required');
    if (!asmS_Id) throw new Error('Section ID is required');
    const url = `/exam_master_category/students_drop_down_by_year_class_section_list?ASMAY_Id=${asmaY_Id}&ASMCL_Id=${asmcL_Id}&ASMS_Id=${asmS_Id}`;
    console.info('url', url);
    return await api.get<IAcademicYearandClassandsection[]>('exam', url);
}

export async function getExamReportCard(data: any) {
    const url = '/individual_exam_report_card/exam_report_card';
    return await api.post<any>('exam', url, data);
}
