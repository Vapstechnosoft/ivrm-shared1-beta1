'use server';
import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    IMasterAdmClassCategoryMappingList,
    IMasterClassYearlyList,
    IMasterFeeBusAreaList,
    IMasterFeeBusRoutingMappingList,
    IMasterFeeCasteCategoryMappingList,
    IMasterFeeClassCategoryList,
    IMasterFeeClassDropDownList,
    IMasterFeeGroupList,
    IMasterFeeHeadList,
    IMasterFeeInstallmentList,
    IMasterFeeSectionDropDownList,
    IMasterStudentClassMappingList,
    IMasterStudentFeeGroupMappingList,
    StudentFeeGroupSummaryById
} from '@/types/fees/masters/masters';

// export async function getStudentFeeGroupMapping(searchParams?: ApiSearchparams) {
//     const urlParams = getSearchParamsUrl(searchParams ?? {});
//     const url = `/StudentFeeGroupMappingFacade/getalldetails?${urlParams}`;
//     return await api.get<IMasterStudentFeeGroupMappingList[]>('fees', url);
// }

export async function getStudentFeeGroupMapping(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(
        searchParams ?? {},
        'amsT_FirstName,amsT_MiddleName,amsT_LastName,asmcL_ClassName,asmC_SectionName,amsT_Mobile,fmG_GroupName'
    );
    const url = `/StudentFeeGroupMappingFacade/getalldetails?${urlParams}`;
    return await api.get<IMasterStudentFeeGroupMappingList[]>('fees', url);
}

export async function deleteStudentFeeGroupMapping(AMST_Id: number, FMG_Id: number, FMSG_Id: number, asmay_Id: number, mi_Id: number) {
    const url = `/StudentFeeGroupMappingFacade/deleteStudentFeeGroupMapping?MI_Id=${mi_Id}&AMST_Id=${AMST_Id}&ASMAY_Id=${asmay_Id}&FMG_Id=${FMG_Id}&FMSG_Id=${FMSG_Id}`;
    console.info('deleteStudentFeeGroupMapping', url);
    return await api.delete('fees', url);
}

export async function getStudentFeeGroupMappingAcademicYearDropdown() {
    const url = '/fee_class_category/academicyearlist';
    return await api.get<IMasterClassYearlyList[]>('fees', url);
}

export async function getAdmClassCategorydropdown() {
    const url = '/StudentFeeGroupMappingFacade/getAdmissionCategories';
    return await api.get<IMasterAdmClassCategoryMappingList[]>('fees', url);
}

export async function getFeeClassCategorydropdown() {
    const url = '/StudentFeeGroupMappingFacade/get-fee-class-category';
    return await api.get<IMasterFeeClassCategoryList[]>('fees', url);
}

export async function getclassdropdown() {
    const url = '/FeeStudentTransaction/class-details';
    return await api.get<IMasterFeeClassDropDownList[]>('fees', url);
}

export async function getSectionropdown() {
    const url = '/FeeStudentTransaction/section-details';
    return await api.get<IMasterFeeSectionDropDownList[]>('fees', url);
}

export async function getFeeBusRoutingdropdown() {
    const url = '/StudentFeeGroupMappingFacade/getBusRoutes';
    return await api.get<IMasterFeeBusRoutingMappingList[]>('fees', url);
}

export async function getFeeBusAreadropdown() {
    const url = '/StudentFeeGroupMappingFacade/get-bus-arealist';
    return await api.get<IMasterFeeBusAreaList[]>('fees', url);
}

export async function getFeeCasteCategorydropdown() {
    const url = '/StudentFeeGroupMappingFacade/getCasteList';
    return await api.get<IMasterFeeCasteCategoryMappingList[]>('fees', url);
}

export async function getStudentClassMapping(
    academicYear: number,
    classId: number,
    sectionId: number,
    admCategoryId: number,
    radioFilter: string,
    searchParams?: ApiSearchparams
) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/StudentFeeGroupMappingFacade/getStudentClassMapping?AcademicYearId=${academicYear}&ClassId=${classId}&SectionId=${sectionId}&AdmissionCategoryId=${admCategoryId}&RadioFilter=${radioFilter}&${urlParams}`;
    return await api.get<IMasterStudentClassMappingList[]>('fees', url);
}

export async function getStudentFeeGroupList(academicYear: number) {
    const url = `/StudentFeeGroupMappingFacade/getGroupMappingList?asmay_id=${academicYear}`;
    return await api.get<IMasterFeeGroupList[]>('fees', url);
}

export async function getStudentFeeHeadList(groupId: any, academicYear: number) {
    const url = `/StudentFeeGroupMappingFacade/getHeadMappingList?asmay_id=${academicYear}`;
    return await api.post<IMasterFeeHeadList[]>('fees', url, groupId);
}

export async function getStudentFeeInstallmentList(groupId: any, academicYear: number) {
    const url = `/StudentFeeGroupMappingFacade/getInstallmentMappingList?asmay_id=${academicYear}`;
    return await api.post<IMasterFeeInstallmentList[]>('fees', url, groupId);
}

// export async function getStudentFeeGeoupHeadMapping() {
//     const url = '/StudentFeeGroupMappingFacade/getFeeMappingSummaryById?MI_Id=30&ASMAY_Id=231';
//     return await api.get<IMasterFeeGroupHeadMappinList[]>('fees', url);
// }

export async function getStudentFeeSummaryById(academicId: number, studentId: number): Promise<StudentFeeGroupSummaryById[]> {
    const url = `/StudentFeeGroupMappingFacade/getFeeMappingSummaryById?ASMAY_Id=${academicId}&AMST_Id=${studentId}`;

    console.info('getStudentFeeSummaryById URL:', url);
    const response = await api.get<any>('fees', url);
    return response.data?.feeGroups ?? [];
}

export async function getStudentFeeSave(palyload: any) {
    const url = '/StudentFeeGroupMappingFacade/saveStudentFeeMappings';
    return await api.post<any>('fees', url, palyload);
}

export async function updtaeStudentFeeGroupMapping(payload: any) {
    const url = '/StudentFeeGroupMappingFacade/updateStudentFeeMappings';
    return await api.post<any>('fees', url, payload);
}
