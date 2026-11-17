'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IESubject, IExamSubjectGroupMapping, IExamSubjectGroupingDetails } from '@/types/exam/exam-module/exam-mapping';
import type { ICategory } from '@/types/exam/exam-module/masters';

// Get all Exam Subject Group Mappings
export async function getExamSubjectGroupMapping(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `exam_subject_group_mapping/?${urlParams}`;
    const response = await api.get<IExamSubjectGroupMapping>('exam', url);
    return { ...response };
}

// Add or Update Yearly Category Dates Mapping
export async function addOrUpdateYearlyCategoryDatesMapping(data: any) {
    const url = '/exam_subject_group_mapping';
    return await api.post<any>('exam', url, data);
}

// Get Category Dropdown By Academic Year
export async function getCategoryDropDownByAcademicYearlist(asmay_id: number) {
    if (!asmay_id) throw new Error('Academic Year ID is required');
    const url = `/exam_master_category/exam_category_drop_down_by_academic_year_list/${asmay_id}`;
    return await api.get<ICategory>('exam', url);
}
export async function getCategoryDropDowByExamYearCategoryList(asmay_id: number) {
    if (!asmay_id) throw new Error('Academic Year ID is required');
    const url = `/exam_master_category/category_drop_down_by_exam_year_category_list/${asmay_id}`;
    return await api.get<ICategory>('exam', url);
}

// Get Exam Master Category List
export async function getExamMasterCategories() {
    const url = '/exam_master_category/exam_category_list'; // backend extracts id
    return await api.get<any>('exam', url);
}

// Get Exam Groups By Category
export async function getExamGroupsByCategory(ASMAY_Id: number, emcA_Id: number) {
    if (!emcA_Id) throw new Error('Exam Category ID is required');
    const url = `/exam_subject_group_mapping/exam_drop_down_by_exam_category_list/${ASMAY_Id}/${emcA_Id}`;
    return await api.get<any>('exam', url);
}

// Get Subjects By Exam Group
export async function getSubjectsForIndividualExam(emE_Id: number, asmay_id: number, emcA_Id: number) {
    if (!emE_Id) throw new Error('Exam Group ID is required');
    const url = `/exam_subject_group_mapping/subjects_drop_down_for_individual_exam_list/${emE_Id}/${asmay_id}/${emcA_Id}`;
    return await api.get<IESubject>('exam', url);
}

export async function getSubjectsForPromotionalExam(asmay_id: number, emcA_Id: number) {
    if (!emcA_Id) throw new Error('Exam Group ID is required');
    const url = `/exam_subject_group_mapping/subjects_drop_down_for_promotional_exam_list/${asmay_id}/${emcA_Id}`;
    return await api.get<IESubject>('exam', url);
}

export async function getExamSubjectGroupMappingDetails(compulsary_flag: string, asmay_id: number, esG_Id: number) {
    const url = `/exam_subject_group_mapping/exam_subjet_group_mapping_details_by_ids/${compulsary_flag}/${asmay_id}/${esG_Id}`;
    return await api.get<IExamSubjectGroupingDetails>('exam', url);
}

export async function toggleExamSubjectGroupMappingSubject(esgs_id: number) {
    const url = `/exam_subject_group_mapping/toggle_exam_subjet_group_mapping/${esgs_id}`;
    return await api.put('exam', url);
}
