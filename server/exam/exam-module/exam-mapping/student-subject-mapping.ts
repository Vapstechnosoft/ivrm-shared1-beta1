'use server';

import { api } from '@/lib/apiService';

// --------------------------------------------
// Get All Exam Subject Wizard Records
// --------------------------------------------
export async function getStudentsForSubjectMapping(params: {
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    EME_Id: number;
    // EMCA_Id: number;
    Left_Flag: boolean;
    Deactive_Flag: boolean;
    EMG_Id: number;
}) {
    const query = new URLSearchParams({
        ASMAY_Id: String(params.ASMAY_Id),
        ASMCL_Id: String(params.ASMCL_Id),
        ASMS_Id: String(params.ASMS_Id),
        EME_Id: String(params.EME_Id),
        // EMCA_Id: String(params.EMCA_Id),
        Left_Flag: String(params.Left_Flag),
        Deactive_Flag: String(params.Deactive_Flag),
        EMG_Id: String(params.EMG_Id)
    }).toString();
    const url = `/student_mapping/student_details?${query}`;
    // const url = `student_mapping/student_details?MI_Id=30&ASMAY_Id=231&ASMCL_Id=414&ASMS_Id=164&EME_Id=0&EMCA_Id=213&Left_Flag=true&Deactive_Flag=true&EMG_Id=118`;
    return await api.get<StudentSubjectData>('exam', url);
}

export async function addOrUpdateStudentSubjectMappings(data: any) {
    const url = '/student_mapping';
    return await api.post<any>('exam', url, data);
}

export async function getSectionListbyClassSectionSubjectGroup(asmay_Id: number, emCA_Id: number, asmcl_Id: number) {
    const url = `/student_mapping/sectionlist_by_cat_group_class/${asmay_Id}/${emCA_Id}/${asmcl_Id}`;
    return await api.get<any>('exam', url);
}

export async function getSubjectlistByCatGroupClass(asmay_Id: any, emCA_ID: number) {
    const url = `/student_mapping/class_section_subjectgroup/${emCA_ID}/${asmay_Id}`;
    return await api.get<any>('exam', url);
}

export interface StudentSubjectData {
    amsT_Id?: number;
    amsT_FirstName?: string;
    amsT_AdmNo?: string;
    amaY_RollNo?: number;
    sub_list?: SubjectItem[];
    xyz?: boolean;
    sub_list_view?: SubjectItem[];
    remove_flag?: number;
}

export interface SubjectItem {
    id?: number;
    name?: string;
    abc?: boolean;
}
