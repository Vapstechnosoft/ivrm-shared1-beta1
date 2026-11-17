'use server';

import { api } from '@/lib/apiService';
import { getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { ISchoolSubjectTopicMappingResponse } from '@/types/lesson-planner/transactions/school-subject-master-topic-mapping';

export async function getSchoolSubjectTopicMappingData(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'lpmT_TopicName');
    const url = `/SchoolSubjectWithMasterTopicMapping/Getdetailsdata?${urlParams}`;
    return await api.get<ISchoolSubjectTopicMappingResponse>('lessonplanner', url);
}

export async function onChangeYear(asmaY_Id: number) {
    const url = `/SchoolSubjectWithMasterTopicMapping/change_year?ASMAY_Id=${asmaY_Id}`;
    return await api.post<ISchoolSubjectTopicMappingResponse>('lessonplanner', url);
}

export async function onChangeClass(asmaY_Id: number, asmcL_Id: number) {
    const url = `/SchoolSubjectWithMasterTopicMapping/on_change_classes?ASMAY_Id=${asmaY_Id}&ASMCL_Id=${asmcL_Id}`;
    return await api.post<ISchoolSubjectTopicMappingResponse>('lessonplanner', url);
}

// Note: The legacy code had two onchangeclass(es) calls, one for section and one for class.
// "onchangesection" fetched subjects in legacy.
export async function onChangeSection(asmaY_Id: number, asmcL_Id: number, asmS_Id: number) {
    const url = `/SchoolSubjectWithMasterTopicMapping/onchange_section?ASMAY_Id=${asmaY_Id}&ASMCL_Id=${asmcL_Id}&ASMS_Id=${asmS_Id}`;
    return await api.post<ISchoolSubjectTopicMappingResponse>('lessonplanner', url);
}

// Legacy "onchangeclass" (singular) fetched subjects directly (likely for ordering or cases without section)
export async function onChangeClassSingular(asmaY_Id: number, asmcL_Id: number) {
    const url = `/SchoolSubjectWithMasterTopicMapping/onchange_class?ASMAY_Id=${asmaY_Id}&ASMCL_Id=${asmcL_Id}`;
    return await api.post<ISchoolSubjectTopicMappingResponse>('lessonplanner', url);
}

export async function onChangeSubject(asmaY_Id: number, asmcL_Id: number, ismS_Id: number) {
    const url = `/SchoolSubjectWithMasterTopicMapping/onchange_subjectdata?ASMAY_Id=${asmaY_Id}&ASMCL_Id=${asmcL_Id}&ISMS_Id=${ismS_Id}`;
    return await api.post<ISchoolSubjectTopicMappingResponse>('lessonplanner', url);
}

export async function onChangeUnit(asmaY_Id: number, asmcL_Id: number, ismS_Id: number, lpmU_Id: number) {
    const url = `/SchoolSubjectWithMasterTopicMapping/onchange_unitdata?ASMAY_Id=${asmaY_Id}&ASMCL_Id=${asmcL_Id}&ISMS_Id=${ismS_Id}&LPMU_Id=${lpmU_Id}`;
    return await api.post<ISchoolSubjectTopicMappingResponse>('lessonplanner', url);
}

export async function onSelectTopic(lpmmT_Id: number) {
    const url = `/SchoolSubjectWithMasterTopicMapping/onselect_topic?LPMMT_Id=${lpmmT_Id}`;
    return await api.post<ISchoolSubjectTopicMappingResponse>('lessonplanner', url);
}

export async function saveDetails(data: any) {
    const url = '/SchoolSubjectWithMasterTopicMapping/savedata';
    return await api.post<ISchoolSubjectTopicMappingResponse>('lessonplanner', url, data);
}

export async function editDetails(LPMU_Id: number, ISMS_Id: number, LPMT_Id: number, LPMMT_Id: number, ASMAY_Id: number, ASMCL_Id: number) {
    const url = `/SchoolSubjectWithMasterTopicMapping/editdata?LPMU_Id=${LPMU_Id}&ISMS_Id=${ISMS_Id}&LPMT_Id=${LPMT_Id}&LPMMT_Id=${LPMMT_Id}&ASMAY_Id=${ASMAY_Id}&ASMCL_Id=${ASMCL_Id}`;
    return await api.post<ISchoolSubjectTopicMappingResponse>('lessonplanner', url);
}

export async function deactivateDetails(id: number, activeFlag: boolean) {
    const url = `/SchoolSubjectWithMasterTopicMapping/De-activate?LPMT_Id=${id}`;
    return await api.post<ISchoolSubjectTopicMappingResponse>('lessonplanner', url);
}

export async function validateOrder(orderArray: any[]) {
    const url = '/SchoolSubjectWithMasterTopicMapping/validateorder_number';
    return await api.post<ISchoolSubjectTopicMappingResponse>('lessonplanner', url, {
        schoolSubjectWithMasterTopicMappingTemporderDTO: orderArray
    });
}

export async function viewUploadFiles(lpmT_Id: number, ismS_Id: number, lpmU_Id: number, type: string) {
    const url = `/SchoolSubjectWithMasterTopicMapping/viewupload_flies?LPMTR_ResourceType=${type}&LPMT_Id=${lpmT_Id}&LPMU_Id=${lpmU_Id}&ISMS_Id=${ismS_Id}`;
    return await api.post<ISchoolSubjectTopicMappingResponse>('lessonplanner', url);
}

export async function deleteUploadFile(lpmtR_Id: number) {
    const url = `/SchoolSubjectWithMasterTopicMapping/deleteupload_file?LPMTR_Id=${lpmtR_Id}`;
    return await api.post<ISchoolSubjectTopicMappingResponse>('lessonplanner', url);
}
