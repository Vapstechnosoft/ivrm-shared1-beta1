'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterClassSectionDropDown, IMasterClassTeacherList } from '@/types/admission/preadmission/masters';

export async function getMasterClassTeacher(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'asmcL_ClassName,asmaY_Year,asmC_SectionName,employee_name,employee_code');
    const url = `/class_teacher_mapping?${urlParams}`;
    return await api.get<IMasterClassTeacherList[]>('admission', url);
}
export async function ToggleMasterClassTeacherForm(id: number) {
    const url = `class_teacher_mapping/toggle/${id}`;
    return await api.put('admission', url);
}
export async function addOrUpdateMasterClassTeacher(data: any) {
    const url = '/class_teacher_mapping';
    return await api.post<any>('admission', url, data);
}
export async function getEmployeeDrowpDown(id: number) {
    const url = `/class_teacher_mapping/get_academic_teacher_drop_down_list/${id}`;
    return await api.get('admission', url);
}
export async function getTeacherClassSection(asmaY_Id: number, hrmE_Id: number) {
    const url = `class_teacher_mapping/get_teacher_class_section_drop_down_list/${asmaY_Id}/${hrmE_Id}`;
    return await api.get<IMasterClassSectionDropDown[]>('admission', url);
}
export async function ExchangeEmployee(data: any) {
    const url = '/class_teacher_mapping/exchange_class_teacher_mapping';
    return await api.put('admission', url, data);
}
