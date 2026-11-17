'use server';

import { api } from '@/lib/apiService';
import type { HeadwiseClassCategoryDropDown, IduedateReportData } from '@/types/fees/reports/reports';

export async function feeHeadwiseReportClassCategoryGropDown(asmay_Id: number) {
    const url = `FeesCommon/fee-class-category-list?asmay_id=${asmay_Id}`;
    return await api.get<HeadwiseClassCategoryDropDown[]>('fees', url);
}

export async function getDueDateReportData(asmaY_Id: number, classcategoryid: number) {
    //const url = `FeeDueDateReportFacade/get-fee-duedate-report?asmay_id=${asmaY_Id}&fmcc_id=${classcategoryid}`;
    const url = `/FeeheadWiseReportFacade/get-fee-headwise-report?asmay_id=${asmaY_Id}&fmcc_id=${classcategoryid}`;
    return await api.get<IduedateReportData[]>('fees', url);
}
