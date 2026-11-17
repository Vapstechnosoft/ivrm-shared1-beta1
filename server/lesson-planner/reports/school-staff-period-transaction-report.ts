'use server';

import { api } from '@/lib/apiService';
import type {
    ITransactionReportPayload,
    ITransactionReportResponse
} from '@/types/lesson-planner/reports/school-staff-period-transaction-report';

const BASE_URL = 'lessonplanner';

export async function getInitialData() {
    const url = `/SchoolStaffperiodtransactionreport/Get_detailstransaction`;
    return await api.get<ITransactionReportResponse>(BASE_URL, url);
}

export async function onChangeYear(ASMAY_Id: number) {
    const url = `/SchoolStaffperiodtransactionreport/onselect_AcdYear?ASMAY_Id=${ASMAY_Id}`;
    return await api.get<ITransactionReportResponse>(BASE_URL, url);
}

export async function onChangeClass(ASMAY_Id: number, ASMCL_Id: number) {
    const url = `/SchoolStaffperiodtransactionreport/onselectclass?ASMAY_Id=${ASMAY_Id}&ASMCL_Id=${ASMCL_Id}`;
    return await api.get<ITransactionReportResponse>(BASE_URL, url);
}

export async function onChangeSection(ASMAY_Id: number, ASMCL_Id: number, ASMS_Id: number) {
    const url = `/SchoolStaffperiodtransactionreport/on_change_section?ASMAY_Id=${ASMAY_Id}&ASMCL_Id=${ASMCL_Id}&ASMS_Id=${ASMS_Id}`;
    return await api.get<ITransactionReportResponse>(BASE_URL, url);
}

export async function getTransactionReport(payload: ITransactionReportPayload) {
    const url = `/SchoolStaffperiodtransactionreport/get_report?ASMAY_Id=${payload.ASMAY_Id}&HRME_Id=${payload.HRME_Id}&ASMCL_Id=${payload.ASMCL_Id}&ASMS_Id=${payload.ASMS_Id}`;
    return await api.get<ITransactionReportResponse>(BASE_URL, url);
}
