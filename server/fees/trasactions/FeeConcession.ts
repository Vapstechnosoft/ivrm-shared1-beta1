'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    FeeConcessionTermDropdown,
    IFeeCategoryConcessionDropDownList,
    IFeeCommonSettingConfigSet,
    IFeeConcessionAcademicyearDropDownList,
    IFeeConcessionAdmissionNo,
    IFeeConcessionCategoryDropDownList,
    IFeeConcessionClassDropDownList,
    IFeeConcessionEdit,
    IFeeConcessionHeadList,
    IFeeConcessionOthersList,
    IFeeConcessionStaffList,
    IFeeConcessionStudentConcessionGrid,
    IFeeConcessionStudentData,
    IFeeConcessionStudentList
} from '@/types/fees/transactions/transactions';

export async function getConcessionTermDropdownData(groupOrTerm: string, asmaY_Id: number) {
    const url = `FeeConcessionFacade/term-dropdown?groupOrTerm=${groupOrTerm}&asmayId=${asmaY_Id || 0}`;

    console.info('getConcessionTermDropdownData url:', url);
    return await api.get<FeeConcessionTermDropdown[]>('fees', url);
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
export async function getConcessionAcademicDropdownData(mi_Id: number) {
    const url = 'FeeConcessionFacade/getacademicyears';
    return await api.get<IFeeConcessionAcademicyearDropDownList[]>('fees', url);
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
export async function getConcessionClassesDropdownData(mi_Id: number) {
    const url = 'FeeConcessionFacade/getclasses';
    return await api.get<IFeeConcessionClassDropDownList[]>('fees', url);
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
export async function getConcessionCategoryDropdownData(mi_Id: number) {
    //const url = 'FeeConcessionFacade/getfeeconcessioncategories';
    const url = 'FeeConcessionFacade/getadmconcessioncategories';
    return await api.get<IFeeConcessionCategoryDropDownList[]>('fees', url);
}

export async function getConcessionStudentList(
    radiobtnvalue: string,
    asmaY_Id: number,
    asmcL_Id: number,
    amcId: number,
    fmccId: number,
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    searchParams?: ApiSearchparams
) {
    const url = `FeeConcessionFacade/student-list?radiobtnvalue=${radiobtnvalue}&asmayId=${asmaY_Id || 0}&asmclId=${asmcL_Id || 0}&amcId=${amcId || 0}&fmccId=${fmccId || 0}`;

    console.info('getConcessionStudentList url:', url);
    return await api.get<IFeeConcessionStudentList[]>('fees', url);
}

export async function getConcessionStudentConcessionGrid(
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    mi_Id: number,
    asmaY_Id: number,
    asmcL_Id: number,
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    searchParams?: ApiSearchparams
) {
    const urlParams = getSearchParamsUrl(
        searchParams ?? {},
        'studentName,amsT_AdmNo,asmcL_ClassName,fmG_GroupName,fmH_FeeName,ftI_Name,fmcC_ConcessionName,fsC_ConcessionAmount'
    );
    const url = `FeeConcessionFacade/getstudentconcessions?AsmayId=${asmaY_Id || 0}&AsmclId=${asmcL_Id || 0}&${urlParams}`;
    return await api.get<IFeeConcessionStudentConcessionGrid[]>('fees', url);
}
export async function saveFeeHead(data: any) {
    const url = 'FeeConcessionFacade/save-fee-concession';
    return await api.post<any>('fees', url, data);
}

export async function deleteFeeConcession(fsC_Id: number) {
    const url = `/FeeConcessionFacade/deletefeeconcession/${fsC_Id}`;
    return await api.delete<any>('fees', url);
}

export async function getConcessionHeadDetailsList(
    asmaY_Id: number,
    amsT_Id: number,
    fmT_Id: number[], // now always array
    configSet: string
) {
    const params = new URLSearchParams();

    params.append('asmayId', String(asmaY_Id || 0));
    params.append('amstId', String(amsT_Id || 0));
    params.append('configSet', configSet || '');

    fmT_Id.forEach((id) => {
        if (id > 0) {
            params.append('fmgIds', String(id));
        }
    });

    const url = `FeeConcessionFacade/head-details?${params.toString()}`;

    console.info('getConcessionHeadDetailsList url:', url);
    return await api.get<IFeeConcessionHeadList[]>('fees', url);
}

export async function getconcessionheadgriddatadetails(data: any) {
    const url = '/FeeConcessionFacade/head-details';
    return await api.post<IFeeConcessionHeadList[]>('fees', url, data);
}

export async function getFeesCommonSettingConfigSet(asmaY_Id: number) {
    const url = `FeesCommon/master-setting-by-yearid?asmayId${asmaY_Id || 0}`;
    return await api.get<IFeeCommonSettingConfigSet[]>('fees', url);
}

export async function getFeeConcessionStaffList(asmaY_Id: number) {
    const url = `FeeConcessionFacade/fee-concession-staff-list?asmayId=${asmaY_Id || 0}`;
    return await api.get<IFeeConcessionStaffList[]>('fees', url);
}

export async function getFeeConcessionOthersList(asmaY_Id: number) {
    const url = `FeeConcessionFacade/fee-concession-others-list?asmayId=${asmaY_Id || 0}`;
    return await api.get<IFeeConcessionOthersList[]>('fees', url);
}

export async function getConcessionFeeConcessionCategoryDropdownData() {
    const url = 'FeesCommon/fee-concession-category-dropdown';
    return await api.get<IFeeCategoryConcessionDropDownList[]>('fees', url);
}

export async function getFeeConcessionEdit(asmaY_Id: number, fscI_ID: number) {
    const url = `FeeConcessionFacade/edit-fee-concession?asmayId=${asmaY_Id || 0}&fsciId=${fscI_ID || 0}`;
    return await api.get<IFeeConcessionEdit[]>('fees', url);
}

export async function getFeeConcessionAdmissionNo(asmaY_Id: number, searchfilter: string) {
    const url = `FeeConcessionFacade/get-admno-search-filtter?asmayId=${asmaY_Id || 0}&searchfilter=${searchfilter || ''}`;
    return await api.get<IFeeConcessionAdmissionNo[]>('fees', url);
}

export async function getFeesConcessionStudentData(asmaY_Id: number, amsT_Id: number) {
    const url = `/FeeConcessionFacade/get-student-data?asmayId=${asmaY_Id || 0}&amst_id=${amsT_Id || 0}`;
    return await api.get<IFeeConcessionStudentData[]>('fees', url);
}
