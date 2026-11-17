'use server';
import { api } from '@/lib/apiService';
// biome-ignore lint/style/useImportType: <explanation>
import { IMasterInstitution } from '@/types/exam/exam-module/report';

export async function getExamReportCard(data: any) {
    const url = '/individual_exam_report_card/exam_report_card';
    console.info('url', url);
    console.info('data', data);
    return await api.post<any>('exam', url, data);
}

//Elective Subject Report

export async function getExamElectivesReport(payload: any) {
    const {
        ASMAY_Id,
        Type = 'All',
        EMCA_Id = 0,
        EMG_Id = 0,
        ISMS_Id = 0,
        ASMCL_Id = 0,
        ASMS_Id = 0,
        mob_flg = 0,
        mail_flg = 0,
        Left_Flag = 0,
        Deactive_Flag = 0
    } = payload;

    const params = new URLSearchParams({
        // MI_Id: '30',
        ASMAY_Id: String(ASMAY_Id),
        Type,
        EMCA_Id: String(EMCA_Id),
        EMG_Id: String(EMG_Id),
        ISMS_Id: String(ISMS_Id),
        ASMCL_Id: String(ASMCL_Id),
        ASMS_Id: String(ASMS_Id),
        mob_flg: String(mob_flg),
        mail_flg: String(mail_flg),
        Left_Flag: String(Left_Flag),
        Deactive_Flag: String(Deactive_Flag)
    });

    const url = `/baldwin_elective_report/exam_elective_report?${params.toString()}`;
    const res = await api.get<any>('exam', url);
    return res;
}

export async function getCategoryDropDownByYearList(asmaY_Id: number) {
    const url = `/exam_master_category/exam_category_drop_down_by_academic_year_list/${asmaY_Id}`;
    const response = await api.get<{ data: any[] }>('exam', url);
    return response.data || [];
}

export async function getClassDropDownByYearCategoryList(asmaY_Id: number, emcA_Id?: number | 'All') {
    const id = emcA_Id === 'All' ? 0 : emcA_Id || 0;
    const url = `/exam_master_category/class_drop_down_by_academic_year_list/${asmaY_Id}/${id}`;
    const response = await api.get<{ data: any[] }>('exam', url);
    return response.data || [];
}

export async function getSectionDropDownByYearCategoryClassList(asmaY_Id: number, emcA_Id: number, asmcL_Id: number) {
    const url = `/exam_master_category/sections_dropdown_by_year_category_class/${asmaY_Id}/${emcA_Id}/${asmcL_Id}`;
    const response = await api.get<{ data: any[] }>('exam', url);
    return response.data || [];
}

export async function getSubjectGroupDropDownByYearCategoryList(asmaY_Id: number, emcA_Id?: number | 'All') {
    const id = emcA_Id === 'All' ? 0 : emcA_Id || 0;
    const url = `/baldwin_elective_report/group_drop_down_by_year_category_with_flag?asmay_id=${asmaY_Id}&emca_id=${id}`;
    const response = await api.get<{ data: any[] }>('exam', url);
    return response.data || [];
}

export async function getSubjectDropDownByYearCategorySubjectGroupList(asmaY_Id: number, emcA_Id: number | 'All', emG_Id: number) {
    const id = emcA_Id === 'All' ? 0 : emcA_Id;
    const url = `/baldwin_elective_report/subjects_drop_down_by_year_category_group_with_flag?asmay_id=${asmaY_Id}&emca_id=${id}&emg_id=${emG_Id}`;
    const response = await api.get<{ data: any[] }>('exam', url);
    return response.data || [];
}

export async function getMasterInstitution() {
    const url = '/baldwin_elective_report/master_institution_details';
    return await api.get<IMasterInstitution>('exam', url);
}
