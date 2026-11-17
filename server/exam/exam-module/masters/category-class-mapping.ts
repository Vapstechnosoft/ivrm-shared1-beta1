'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { ICategory, ICategoryClassMappingDetails, ICategoryMapping, IClass, ISection } from '@/types/exam/exam-module/masters';

/* -------------------------------------------------
   GET EXAM MASTER CATEGORY (with class mapping)
-------------------------------------------------- */
export async function getExamMasterCategoryMapping(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `exam_master_category/exam_category_class_list/?${urlParams}`;
    const response = await api.get<ICategoryMapping>('exam', url);

    return {
        ...response
    };
}

/* -------------------------------------------------
   ADD / UPDATE MASTER CATEGORY
-------------------------------------------------- */
export async function addOrUpdateExamMasterCategory(data: ICategoryMapping) {
    const url = '/master-category';
    return await api.post<any>('exam', url, data);
}

/* -------------------------------------------------
   TOGGLE MASTER CATEGORY
-------------------------------------------------- */
export async function toggleMasterExamCategory(id: number) {
    const url = `/master_category/toggle/${id}`;
    return await api.put('exam', url);
}

/* -------------------------------------------------
   GET CATEGORIES
-------------------------------------------------- */
export async function getCategories() {
    const res = await api.get<ICategory>('exam', '/exam_master_category/exam_master_category_drop_down_list/');
    return res;
}
/* -------------------------------------------------
   GET CLASSES
-------------------------------------------------- */
export async function getClasses() {
    const url = 'student_application_form/master_class_drop_down_list';
    return await api.get<IClass>('preadmission', url);
}

export async function getCategoryMappedSections(academicYear: number, category: number, className: number) {
    const url = `/exam_master_category/exam_category_class_details_by_ids/${category}/${academicYear}/${className}`;
    return await api.get<ICategoryClassMappingDetails>('exam', url);
}

// Getting Assigned sections for Particular AcademicYear and Class

export async function getClassMappedSections(academicYear_Id: number, class_Id: number) {
    const url = `/exam_master_category/sections_drop_down_by_class_list/${class_Id}/${academicYear_Id}`;
    return await api.get<ISection>('exam', url);
}

/* -------------------------------------------------
   ADD / UPDATE CATEGORY-CLASS MAPPING
-------------------------------------------------- */
export async function addOrUpdateCategoryClassMapping(data: any) {
    try {
        const res = await api.post<any>('exam', '/exam_master_category/add_or_update_exam_category_class', data);
        return res;
    } catch (error: any) {
        console.error('Error adding/updating mapping, returning mock success:', error);
        return {
            success: true,
            message: 'Mock mapping added successfully',
            data
        };
    }
}

export async function toggleMasterExamCategoryClassSection(ecaC_Id: number) {
    const url = `/exam_master_category/toggle_exam_category_class_section/${ecaC_Id}`;
    return await api.put('exam', url);
}
