'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IExamLoginPrivileges, ILoginPrivilegeDetails } from '@/types/exam/exam-module/exam-mapping';

/* ===================== LIST ===================== */

export async function getExamLoginPrivileges(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `exam_login_privileges/?${urlParams}`;
    return await api.get<IExamLoginPrivileges>('exam', url);
}

/* ===================== VIEW DETAILS ===================== */

export async function getLoginPrivilegesDetails(elp_id: number, asmcl_id: number, asms_id: number) {
    const url = `exam_login_privileges/exm_login_privilege_view_by_id/${elp_id}/${asmcl_id}/${asms_id}`;
    return await api.get<ILoginPrivilegeDetails[]>('exam', url);
}

/* ===================== EDIT DETAILS ===================== */

export async function getExamLoginPrivilegesEditDetails(elpId: number, asmclId: number, asmsId: number) {
    const url = `exam_login_privileges/exm_login_privilege_edit_by_id/${elpId}/${asmclId}/${asmsId}`;
    return await api.get('exam', url);
}

export async function addorUpdateExamLoginPrivileges(data: any) {
    const url = '/exam_login_privileges';
    return await api.post<any>('exam', url, data);
}

export async function toggleExamLoginPrivilege(data: any) {
    const url = `exam_login_privileges/exm_login_privilege_activate_deactivate/${data.elpId}`;
    return await api.put('exam', url);
}

/* ===================== DROPDOWNS ===================== */

export async function getClassTeacherDropdwonList() {
    return await api.get<any>('exam', '/exam_login_privileges/exm_login_privilege_classteacher_list');
}

export async function getUserDropdwonList() {
    return await api.get<any>('exam', '/exam_login_privileges/exm_login_privilege_user_name');
}

export async function getEmployeeDropdwonList() {
    return await api.get<any>('exam', '/exam_login_privileges/exm_login_privilege_employee_list');
}
