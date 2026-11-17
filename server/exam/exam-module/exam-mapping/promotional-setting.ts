'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    IPromotionSetting,
    IPromotionCategory,
    IPromotionalGroupDetails,
    IPromotionalGroupMappedExamDetails,
    IPromotionalSubjectDetails,
    IPromotionDetailsByIdResponse
} from '@/types/exam/exam-module/exam-mapping';
export async function getPromotionalSettings(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/promotion_setting?${urlParams}`;
    return await api.get<IPromotionSetting>('exam', url);
}
// Promotional Setting Details
export async function getPromotionalSettingDetails(emp_Id: number) {
    const url = `promotion_setting/view_individual_promotion_details/${emp_Id}`;
    return await api.get<IPromotionalSubjectDetails[]>('exam', url);
}

export async function UpdateOrderedPromotionalSettingDetails(data: any) {
    const url = 'promotion_setting/view_promotion_group_details';
    return await api.post('exam', url, data);
}

/* =========================================================
   PROMOTION SETTINGS – MAIN LIST
========================================================= */

export async function getPromotionSubjectMappingList(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/promotion_setting?${urlParams}`;
    return await api.get<IPromotionSetting[]>('exam', url);
}

/* =========================================================
   PROMOTION CATEGORY BY ACADEMIC YEAR
========================================================= */

export async function getPromotionCategoryByAcademicYear(asmay_Id: number, emp_Id: number) {
    const url = `/promotion_setting/promotion_category_by_academic_year/${asmay_Id}/${emp_Id}`;
    return await api.get<IPromotionCategory[]>('exam', url);
}

/* =========================================================
   EXAM SUBJECTS BY CATEGORY
========================================================= */

export async function getExamSubjectsByCategoryId(eyc_Id: number) {
    const url = `/promotion_setting/exam_subjects_by_category_id/${eyc_Id}`;
    return await api.get('exam', url);
}

/* =========================================================
   SET SUBJECT ORDER
========================================================= */

export async function getSetSubjectOrderList(emp_Id: number) {
    const url = `/promotion_setting/set_subject_order_list/${emp_Id}`;
    return await api.get('exam', url);
}

export async function addPromotionSubjectsOrder(emp_Id: number, payload: any[]) {
    const url = `/promotion_setting/add_promotion_subjects_order/${emp_Id}`;
    return await api.post('exam', url, payload);
}

/* =========================================================
   VIEW INDIVIDUAL PROMOTION DETAILS
========================================================= */

export async function viewIndividualPromotionDetails(emp_Id: number) {
    const url = `/promotion_setting/view_individual_promotion_details/${emp_Id}`;
    return await api.get('exam', url);
}

export async function getIndividualPromotionDetailsById(emp_Id: number) {
    const url = `/promotion_setting/individual_promotion_details_by_id/${emp_Id}`;
    return await api.get<IPromotionDetailsByIdResponse>('exam', url);
}

/* =========================================================
   SUBJECT GROUPS & EXAMS
========================================================= */
// Groups of each subject
export async function viewIndividualSubjectGroups(emps_Id: number) {
    const url = `/promotion_setting/view_individual_subjects_groups/${emps_Id}`;
    return await api.get<IPromotionalGroupDetails[]>('exam', url);
}
// Exams of each group
export async function viewSubjectsGroupExams(empsg_Id: number) {
    const url = `/promotion_setting/view_subjects_group_exams/${empsg_Id}`;
    return await api.get<IPromotionalGroupMappedExamDetails[]>('exam', url);
}

/* =========================================================
   ACTIVATE / DEACTIVATE
========================================================= */

export async function togglePromotionDetails(emp_Id: number) {
    const url = `/promotion_setting/active_deactive_promotion_details/${emp_Id}`;
    return await api.put('exam', url);
}

export async function togglePromotionSubjects(emps_Id: number) {
    const url = `/promotion_setting/active_deactive_subjects/${emps_Id}`;
    return await api.put('exam', url);
}

export async function togglePromotionSubjectGroups(empsg_Id: number) {
    const url = `/promotion_setting/active_deactive_subject_groups/${empsg_Id}`;
    return await api.put('exam', url);
}

export async function togglePromotionSubjectGroupExams(empsge_Id: number) {
    const url = `/promotion_setting/active_deactive_subject_group_exams/${empsge_Id}`;
    return await api.put('exam', url);
}

/* =========================================================
   ADD / UPDATE PROMOTION SETTINGS
========================================================= */

export async function addOrUpdatePromotionSettings(payload: any) {
    const url = '/promotion_setting/add_update_promotion_settings';
    return await api.post('exam', url, payload);
}
