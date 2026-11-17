'use server';

import { api } from '@/lib/apiService';
import type { IDeviationReportResponse } from '@/types/lesson-planner/reports/school-staff-period-transaction-deviation-report';

const BASE_URL = 'lessonplanner';

export async function getInitialData() {
    const url = `/SchoolStaffperiodtransactionreport/Get_detailstransaction`;
    return await api.get<IDeviationReportResponse>(BASE_URL, url);
}

export async function onChangeYear(ASMAY_Id: number) {
    const url = `/SchoolStaffperiodtransactionreport/onselect_AcdYear?ASMAY_Id=${ASMAY_Id}`;
    return await api.get<IDeviationReportResponse>(BASE_URL, url);
}

export async function onChangeClass(ASMAY_Id: number, ASMCL_Id: number) {
    const url = `/SchoolStaffperiodtransactionreport/onselectclass?ASMAY_Id=${ASMAY_Id}&ASMCL_Id=${ASMCL_Id}`;
    return await api.get<IDeviationReportResponse>(BASE_URL, url);
}

export async function onChangeSection(ASMAY_Id: number, ASMCL_Id: number, ASMS_Id: number) {
    const url = `/SchoolStaffperiodtransactionreport/on_change_section?ASMAY_Id=${ASMAY_Id}&ASMCL_Id=${ASMCL_Id}&ASMS_Id=${ASMS_Id}`;
    return await api.get<IDeviationReportResponse>(BASE_URL, url);
}

export async function getDeviationReport(ASMAY_Id: number, ASMCL_Id: number, ASMS_Id: number, HRME_Id: number) {
    const url = `/SchoolStaffperiodtransactionreport/getdevation_report?ASMAY_Id=${ASMAY_Id}&HRME_Id=${HRME_Id}&ASMCL_Id=${ASMCL_Id}&ASMS_Id=${ASMS_Id}`;
    return await api.get<IDeviationReportResponse>(BASE_URL, url);
}
