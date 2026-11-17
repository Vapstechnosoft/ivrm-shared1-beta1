'use server';

import { api } from '@/lib/apiService';
import type {
    IFeeAcademicYearDropdownList,
    IFeeAuditReport,
    IFeeBusRouteDropdownList,
    IFeeClassDropdownList,
    IFeeCustomGroupDropdownList,
    IFeeGroupDropdownList,
    IFeeSectionDropdownList,
    IFeeTermDropdownList
} from '@/types/fees/reports/reports';

export async function getAcademicYeardropdown() {
    const url = '/FeesCommon/academic-year-list';
    return await api.get<IFeeAcademicYearDropdownList[]>('fees', url);
}

export async function getFeesGroupDropDown() {
    const url = '/FeesCommon/fee-group-details';
    return await api.get<IFeeGroupDropdownList[]>('fees', url);
}

export async function getFeesTermDropDown() {
    const url = '/FeesCommon/fee-term-details';
    return await api.get<IFeeTermDropdownList[]>('fees', url);
}

export async function FeesTermDropDownForReports() {
    const url = '/FeeMasterTerms/fee_term_Dropdown';
    return await api.get<IFeeTermDropdownList[]>('fees', url);
}

export async function getFeesBusRoutesDropDown() {
    const url = '/FeesCommon/fee-bus-route';
    return await api.get<IFeeBusRouteDropdownList[]>('fees', url);
}

export async function getFeesCustomGroupDropDown() {
    const url = '/FeesCommon/fee-Custom-setting';
    return await api.get<IFeeCustomGroupDropdownList[]>('fees', url);
}

export async function getFeesDefaulterReportClassList() {
    const url = '/FeesCommon/class-details';
    return await api.get<IFeeClassDropdownList[]>('fees', url);
}

export async function getFeesDefaulterReportSectionList() {
    const url = '/FeesCommon/section-details';
    return await api.get<IFeeSectionDropdownList[]>('fees', url);
}

export async function getFeesSectionListByClassId(asmaY_Id: number, asmcl_Id: number) {
    const url = `/FeesCommon/section-dropdown-by-class?asmay_Id=${asmaY_Id}&asmcl_Id=${asmcl_Id}`;

    console.info('getFeesSectionListByClassId url:', url);
    return await api.get<IFeeSectionDropdownList[]>('fees', url);
}

export async function feedefaluerreportdata(asmaY_Id: number, asmcl_Id: number) {
    const url = `/FeesCommon/section-dropdown-by-class?asmay_Id=${asmaY_Id}&asmcl_Id=${asmcl_Id}`;
    return await api.get<IFeeAuditReport[]>('fees', url);
}

export async function getfeedefaluerreport(payload: any) {
    const url = '/FeeDefaulterReportFacade/fee-defaulter-report';
    console.info('getfeedefaluerreport url:', url);
    return await api.post<any[]>('fees', url, payload);
}

export async function mastersettinglist() {
    const url = '/FeesCommon/master-setting-list';
    return await api.get<any[]>('fees', url);
}
