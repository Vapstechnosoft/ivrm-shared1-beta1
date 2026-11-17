'use server';

import { api } from '@/lib/apiService';
import type { IBackendSearchResponse, ISearchMarksEntryParams } from '@/types/exam/exam-module/exam-mapping';
import type { IAcademicYearandClassandsection } from '@/types/exam/exam-module/report';

// -------------------------------
// 1) GET – Student Data Grid
// -------------------------------
export async function GetLoginPrivilegeClassesDropdown(asmaY_Id: number) {
    if (!asmaY_Id) throw new Error('Academic Year ID is required');
    const url = `/exam_marks_entry/exam_login_privilege_classes_dropdown/${asmaY_Id}`;
    return await api.get<IAcademicYearandClassandsection>('exam', url);
}

export async function GetLoginPrivilegeSectionsDropdown(asmaY_Id: number, asmcL_Id: number) {
    if (!asmaY_Id) throw new Error('Academic Year ID is required');
    if (!asmcL_Id) throw new Error('Class ID is required');
    const url = `/exam_marks_entry/exam_login_privilege_sections_dropdown/${asmaY_Id}/${asmcL_Id}`;
    return await api.get<IAcademicYearandClassandsection>('exam', url);
}

export async function getSubjectsByAcademicYearandClassandSectionlist(asmaY_Id: number, asmcL_Id: number, asmS_Id: number, emE_Id: number) {
    const url = `/exam_marks_entry/exam_login_privilege_subjects_dropdown/${asmaY_Id}/${asmcL_Id}/${asmS_Id}/${emE_Id}`;
    return await api.get<any>('exam', url);
}

// services/examMarksEntry.ts
export async function GetExamMarksEntryOnSearch(params: ISearchMarksEntryParams) {
    const { ASMS_Id, ASMCL_Id, ASMAY_Id, EME_Id, ISMS_Id } = params;
    const url = `/exam_marks_entry/on_search_marks_entry?ASMS_Id=${ASMS_Id}&ASMCL_Id=${ASMCL_Id}&ASMAY_Id=${ASMAY_Id}&EME_Id=${EME_Id}&ISMS_Id=${ISMS_Id}`;
    return await api.get<IBackendSearchResponse>('exam', url);
}

export async function addOrUpdateStudentMarks(data: any) {
    const url = 'exam_marks_entry/save_marks';
    return await api.post<any>('exam', url, data);
}
