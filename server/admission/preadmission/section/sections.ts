'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterSectionList, IMasterSectionSetOrderList } from '@/types/admission/preadmission/masters';
import type { IPreadmissionClassDropdown } from '@/types/admission/preadmission/transactions';

export async function getMasterSection(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'asmC_SectionCode,asmC_SectionName');
    const url = `/master_section?${urlParams}`;
    return await api.get<IMasterSectionList[]>('admission', url);
}

export async function getMasterChangeSectionTable(searchParams: ApiSearchparams, asmay_id: number, asmcl_id: number, asms_id: number) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'student_name,class_name, section_name, admission_no');
    const url = `/section_allotment/section_alloted_list?asmay_id=${asmay_id}&asmcl_id=${asmcl_id}&asms_id=${asms_id}&${urlParams}`;
    return await api.get<IMasterSectionList[]>('admission', url);
}

export async function addOrUpdateMasterChangeSection(data: any) {
    const url = '/section_allotment/change_section';
    return await api.post<any>('admission', url, data);
}

export async function addOrUpdateMasterNewSection(data: any) {
    const url = '/section_allotment/new_section';
    return await api.post<any>('admission', url, data);
}

export async function addOrUpdateMasterYearLossSection(data: any) {
    const url = '/section_allotment/year_loss_section';
    return await api.post<any>('admission', url, data);
}

export async function getAdmissionClassDropdown() {
    const url = '/master_class_category/master_class_drop_down_list';
    return await api.get<IPreadmissionClassDropdown[]>('admission', url);
}

export async function getMasterStudents(asmay_id: number, asmcl_id: number, asms_id: number) {
    const url = `/section_allotment/change_section_students?asmay_id=${asmay_id}&asmcl_id=${asmcl_id}&asms_id=${asms_id}`;
    return await api.get('admission', url);
}

export async function getMasterStudentList(asmay_id: number, asmcl_id: number, asms_id: number) {
    const url = `/section_allotment/delete_section_students?asmay_id=${asmay_id}&asmcl_id=${asmcl_id}&asms_id=${asms_id}`;
    return await api.get('admission', url);
}

export async function getMasterStudentRoles(asmay_id: number, asmcl_id: number, asms_id: number) {
    const url = `/section_allotment/update_roll_no_students_list?asmay_id=${asmay_id}&asmcl_id=${asmcl_id}&asms_id=${asms_id}&is_export=true`;
    return await api.get('admission', url);
}

export async function getMasterChangeClassStudents(asmay_id: number, asmcl_id: number, asms_id: number) {
    const url = `/section_allotment/change_class_students?asmay_id=${asmay_id}&asmcl_id=${asmcl_id}&asms_id=${asms_id}&is_export=true`;
    return await api.get('admission', url);
}

export async function getPromotionSection(data: any) {
    const url = '/section_allotment/promotion_section_students_list';
    return await api.post<any>('admission', url, data);
}

export async function getMasterChangeClassStudentDetails(data: any) {
    const url = '/section_allotment/change_class_student_details';
    return await api.post<any>('admission', url, data);
}

export async function addChangeClass(data: any) {
    const url = '/section_allotment/change_class';
    return await api.post<any>('admission', url, data);
}

export async function getMasterYearLossSection(asmay_id: number, asmcl_id: number, asms_id: number) {
    const url = `/section_allotment/year_loss_students?asmay_id=${asmay_id}&asmcl_id=${asmcl_id}&asms_id=${asms_id}`;
    return await api.get('admission', url);
}

export async function getMasterNewSectionStudents(asmay_id: number, asmcl_id: number) {
    const url = `/section_allotment/new_section_students?asmay_id=${asmay_id}&asmcl_id=${asmcl_id}`;
    return await api.get('admission', url);
}

export async function postPromotionSection(data: any) {
    const url = '/section_allotment/promotion_section';
    return await api.post<any>('admission', url, data);
}

export async function deleteSection(data: any) {
    const url = '/section_allotment/delete_section_allotment';
    return await api.post<any>('admission', url, data);
}

export async function updateRollNumbers(data: any) {
    const url = '/section_allotment/students_roll_number';
    return await api.put<any>('admission', url, data);
}

export async function toggleMasterSection(id: number) {
    const url = `/master_section/toggle/${id}`;
    return await api.put('admission', url);
}
export async function getSectionSetOrder() {
    const url = '/master_section/set_order_list';
    return await api.get<IMasterSectionSetOrderList[]>('admission', url);
}
export async function updateSectionSetorder(data: any) {
    const url = '/master_section/set_order';
    return await api.put<any>('admission', url, data);
}
