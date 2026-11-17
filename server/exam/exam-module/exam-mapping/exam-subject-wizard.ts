'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IExamSubjectWizard } from '@/types/exam/exam-module/exam-mapping';

// --------------------------------------------
// Get All Exam Subject Wizard Records
// --------------------------------------------
export async function getExamSubjectWizard(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `exam_subject_mapping?${urlParams}`;
    console.info(url);
    return await api.get<IExamSubjectWizard>('exam', url);
}

// --------------------------------------------
// Get Exam Subject Wizard Details By ID
// --------------------------------------------

export async function getExamSubjectWizardDetails(ecycE_Id: number) {
    if (!ecycE_Id) throw new Error('Exam Subject Wizard ID is required');
    const url = `exam_subject_mapping/grade_and_exam_subject_mapping_list/${ecycE_Id}`;
    return await api.get<IExamSubjectWizard>('exam', url);
}

// --------------------------------------------
// Toggle Exam Subject Wizard Active / Inactive
// --------------------------------------------
export async function toggleExamSubjectWizard(ecysE_Id: number) {
    if (!ecysE_Id) throw new Error('Exam Subject Wizard ID is required');
    const url = `exam_subject_mapping/toggle_exam_yearly_category/${ecysE_Id}`;
    return await api.put('exam', url);
}

export async function toggleExamSubjectWizardDetails(eyceS_Id: number) {
    if (!eyceS_Id) throw new Error('Exam Subject Wizard ID is required');
    const url = `exam_subject_mapping/toggle_exam_subject/${eyceS_Id}`;
    return await api.put('exam', url);
}

export async function UpdateOrderedSubjectDetails(data: any) {
    const url = '/exam_subject_mapping/set_subject_order_number';
    return await api.put<any>('exam', url, data);
}

export async function addOrUpdateExamSubjectWizard(data: any) {
    const url = 'exam_subject_mapping';
    return await api.post<any>('exam', url, data);
}

export async function deleteExamSubjectWizard(ecysE_Id: number) {
    if (!ecysE_Id) throw new Error('Exam Subject Wizard ID is required');
    const url = `exam_subject_wizard/delete/${ecysE_Id}`;
    return await api.delete('exam', url);
}

export async function saveSubExamMapping(data: any) {
    const url = 'exam_subject_wizard/save_sub_exam_mapping';
    return await api.post<any>('exam', url, data);
}

export async function saveSubSubjectMapping(data: any) {
    const url = 'exam_subject_wizard/save_sub_subject_mapping';
    return await api.post<any>('exam', url, data);
}

export async function getSubjectsByCategory(emCA_Id: number) {
    const url = `exam_subject_mapping/subjects_by_yearly_exam_category_list/${emCA_Id}`;
    return await api.get('exam', url);
}

export async function getSubSubjectSubExamList() {
    const url = 'exam_subject_mapping/sub_subjects_and_sub_exam_list';
    return await api.get('exam', url);
}

export async function getExamDropdownForWizardSubjectMapping(eyC_Id: number) {
    const url = `exam_subject_mapping/exam_drop_down_for_wizard_subject_mapping/${eyC_Id}`;
    return await api.get<any>('exam', url);
}
// --------------------------------------------
// Get Sub Subjects Mapped List
// --------------------------------------------
export async function getSubSubjectsMappedList(eyceS_Id: number) {
    const url = `exam_subject_mapping/sub_subjects_mapped_popup_list/${eyceS_Id}`;
    return await api.get<any>('exam', url);
}
// --------------------------------------------
// Get Sub Exams Mapped List
// --------------------------------------------
export async function getSubExamsMappedList(eyceS_Id: number) {
    console.info('subexams', eyceS_Id);
    const url = `exam_subject_mapping/sub_exams_mapped_popup_list/${eyceS_Id}`;
    return await api.get<any>('exam', url);
}

// --------------------------------------------
// Get Sub Subjects and Sub Exams Mapped List
// --------------------------------------------
export async function getSubSubjectsAndSubExamsMappedList(eyceS_Id: number) {
    const url = `exam_subject_mapping/sub_subjects_and_sub_exams_mapped_popup_list/${eyceS_Id}`;
    return await api.get<any>('exam', url);
}

export async function toggleMappedSubSubjectOrSubExam(eycesssId: number) {
    if (!eycesssId) throw new Error('Mapped SubSubject/SubExam ID is required');

    const url = `exam_subject_mapping/toggle_sub_subjects_or_sub_exam_mapped_popup/${eycesssId}`;
    return await api.put<{ success: boolean; message: string }>('exam', url);
}
