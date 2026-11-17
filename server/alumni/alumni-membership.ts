'use server';

import { api } from '@/lib/apiService';
import type { IAlumnusInitialData } from '@/types/alumni/alumni-membership';

export async function getInitialData(pageId = 2) {
    const url = `/AlumniMembership/get_intial_data/${pageId}`;
    return await api.get<IAlumnusInitialData>('alumni', url);
}

export async function getAlumniMembershipInitialData(roleId: number, flag: boolean) {
    const url = `/AlumniMembership/get_intial_data?roleId=${roleId}&flag=${flag}`;
    return await api.get<{ success: boolean; data: IAlumnusInitialData; message: string }>('alumni', url);
}

export async function getStudentList(asmaY_Id: number) {
    const url = `/AlumniMembership/get_studentlist?ASMAY_Id=${asmaY_Id}`;
    return await api.post<any>('alumni', url, {});
}

export async function onCountryChange(ivrmmC_Id: number) {
    const url = `/AlumniMembership/onchange_country?ALMST_PerCountry=${ivrmmC_Id}`;
    return await api.get<any>('alumni', url);
}

export async function onStateChange(ivrmmS_Id: number) {
    const url = `/AlumniMembership/onchange_state?ALMST_PerState=${ivrmmS_Id}`;
    return await api.get<any>('alumni', url);
}

export async function onDistrictChange(ivrmmS_Id: number) {
    const url = `/AlumniMembership/onchange_district?IVRMMS_Id=${ivrmmS_Id}`;
    return await api.get<any>('alumni', url);
}

export async function getStudentData(almsT_Id: number) {
    const url = `/AlumniMembership/view_data?ALMST_Id=${almsT_Id}`;
    return await api.get<any>('alumni', url);
}

export async function getAlumniStudentData(params: {
    ALMST_Id: number;
    ALSREG_Id?: number;
    ASMCL_Id_Left?: number;
    ASMCL_Id_Join?: number;
    ASMAY_Id_Left?: number;
    ALMST_ConState?: number;
    ASMAY_Id_Join?: number;
    Readmitted_student?: boolean;
}) {
    const query = new URLSearchParams();
    query.append('ALMST_Id', params.ALMST_Id.toString());
    if (params.ALSREG_Id) query.append('ALSREG_Id', params.ALSREG_Id.toString());
    if (params.ASMCL_Id_Left) query.append('ASMCL_Id_Left', params.ASMCL_Id_Left.toString());
    if (params.ASMCL_Id_Join) query.append('ASMCL_Id_Join', params.ASMCL_Id_Join.toString());
    if (params.ASMAY_Id_Left) query.append('ASMAY_Id_Left', params.ASMAY_Id_Left.toString());
    if (params.ALMST_ConState) query.append('ALMST_ConState', params.ALMST_ConState.toString());
    if (params.ASMAY_Id_Join) query.append('ASMAY_Id_Join', params.ASMAY_Id_Join.toString());
    if (params.Readmitted_student !== undefined) query.append('Readmitted_student', params.Readmitted_student.toString());

    const url = `/AlumniMembership/get_studata?${query.toString()}`;
    return await api.get<any>('alumni', url);
}

export async function editAlumniHomepages(almsT_Id: number) {
    const url = `/AlumniMembership/edit_alumni_homepages?ALMST_Id=${almsT_Id}`;
    return await api.get<any>('alumni', url);
}

export async function saveAlumnusData(data: any) {
    return await api.post<any>('alumni', '/AlumniMembership/svedata_newalumni', data);
}

export async function saveNewAlumnus(data: any) {
    return await api.post<any>('alumni', '/AlumniMembership/svedata_newalumni', data);
}

export async function deactivateAlumnus(almst_Id: number) {
    const url = `/AlumniMembership/deactive?ALMST_Id=${almst_Id}`;
    return await api.post<any>('alumni', url);
}

export async function approveAlumnusData(data: any) {
    return await api.post<any>('alumni', '/AlumniMembership/aproove_data', data);
}

export async function searchFilter(search: string, asmaY_Id: number) {
    const url = `/AlumniMembership/search_filter?ASMAY_Id=${asmaY_Id}&searchfilter=${search}`;
    return await api.get<any>('alumni', url);
}

export async function checkStudent(alsreg_Id: number) {
    const url = `/AlumniMembership/check_student?alsreg_Id=${alsreg_Id}`;
    return await api.get<any>('alumni', url);
}
