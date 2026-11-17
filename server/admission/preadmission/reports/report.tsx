'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IConcessionDropDown } from '@/types/admission/preadmission/masters';
import { format } from 'date-fns';
const formatDate = (date?: Date | null) => (date ? format(date, 'yyyy-MM-dd') : undefined);
export async function getStudentTcReport(data: any, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, ',ivrmmR_Name');
    const url = `/StudentTcReport/GetAdmissionTcReport?${urlParams}`;
    return await api.post<any>('admission', url, data);
}
export async function getMonthEndReport(data: any) {
    const url = `/monthendreport/GetMonthEndReport?AcayId=${data.ASMAY_Id}&Month=${data.month}&Year=${data.year}`;
    return await api.post<any>('admission', url, data);
}

// reports/report.ts
export async function getExcelMonthEndReport(data: {
    ASMAY_Id: number;
    month: string;
    year: number;
}) {
    const url = `/monthendreport/ExportMonthEndReportToExcel?AcayId=${data.ASMAY_Id}&Month=${data.month}&Year=${data.year}`;

    return api.post('admission', url, null, {
        responseType: 'blob'
    });
}

export async function getPreAdmissionMonthEndReport(data: any, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'Name');
    const url = `/PreAdmissionMonthEndReport/GetPreAdmissionMonthEndReport?Year=${data.year}&Month=${data.month}&Amay=${data.ASMAY_Id}&${urlParams}`;
    return await api.post<any>('admission', url, data);
}
export async function getPreAdmissionRegistrationReport(data: any, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'Name');
    let url = `/RegistrationReport/GetRegistrationReport?${urlParams}`;

    // YEAR WISE
    if (data?.academicYearId) {
        url += `&ASMAY_Id=${data.academicYearId}`;
    }

    // BETWEEN DATES — pass each date if available
    if (data?.fromDate !== null && data?.fromDate !== undefined) {
        url += `&From_Date=${data.fromDate}`;
    }

    if (data?.toDate !== null && data?.toDate !== undefined) {
        url += `&To_Date=${data.toDate}`;
    }

    return await api.post<any>('admission', url);
}
export async function getPreAdmissionExcelRegistrationReport(data: any, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'Name');
    let url = `/RegistrationReport/ExportRegistrationReport?${urlParams}`;

    // YEAR WISE
    if (data?.academicYearId) {
        url += `&ASMAY_Id=${data.academicYearId}`;
    }

    // BETWEEN DATES — pass each date if available
    if (data?.fromDate !== null && data?.fromDate !== undefined) {
        url += `&From_Date=${data.fromDate}`;
    }

    if (data?.toDate !== null && data?.toDate !== undefined) {
        url += `&To_Date=${data.toDate}`;
    }

    return await api.post<any>('admission', url);
}
export async function getPreAdmissionEmailSmsReport(data: any, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'Name');
    let url = `/EmailSmsReport/GetSMSEmailReport?${urlParams}`;

    // YEAR WISE
    if (data?.academicYearId) {
        url += `&ASMAY_Id=${data.academicYearId}`;
    }

    // BETWEEN DATES — pass each date if available
    if (data?.fromDate !== null && data?.fromDate !== undefined) {
        url += `&From_Date=${data.fromDate}`;
    }

    if (data?.toDate !== null && data?.toDate !== undefined) {
        url += `&To_Date=${data.toDate}`;
    }

    return await api.post<any>('admission', url);
}
export async function getStudyCertficateReport(data: any) {
    const url = `/StudyCertificateReport/GetStudyCertificateReport?&ASMAY_Id=${data.ASMAY_Id}&AllOrInd=${data.AllOrInd}&ASMCL_Id=${data.ASMCL_Id}&ASMC_Id=${data.ASMC_Id}&AMST_Id=${data.AMST_Id}`;
    return await api.post<any>('admission', url, data);
}
export async function getConcessionDropdown() {
    const url = '/Classwisestudentdetails/GetConcessionDropdown';
    return await api.get<IConcessionDropDown[]>('admission', url);
}
export async function getclasswiseStudentDetails(
    ASMAY_Id: number,
    studentScope: number,
    fmcC_Id: number,
    payload?: any,
    searchParams?: ApiSearchparams
) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'AMST_FirstName');
    const url = `/Classwisestudentdetails/Getreportdetails?ASMAY_Id=${ASMAY_Id}&Concession_Id=${studentScope}&flag=${fmcC_Id}&${urlParams}`;

    return await api.post<any[]>('admission', url, payload);
}
export async function getAttendanceAbsentSmsReport(ASMAY_Id: number, from_date: string, frequency: string, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'AMST_FirstName');
    const url = `/OveralldailyattendanceabsentsmsFacade/GetOverallDailyAbsentAttendance?${urlParams}&ASMAY_Id=${ASMAY_Id}&FromDate=${from_date}&Flag=${frequency}&AMC_Id=0&AttType=D`;
    return await api.post<any>('admission', url);
}
export async function getAttendanceReport(ASMAY_Id: number, from_date: string, frequency: string, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'AMST_FirstName');
    const url = `/OverallAttendance/GetOverallDailyAttendance?${urlParams}&ASMAY_Id=${ASMAY_Id}&FromDate=${from_date}&Flag=${frequency}`;
    return await api.post<any[]>('admission', url);
}
export async function getStudentAttendanceReport(
    ASMAY_Id: number,
    ASMCL_Id: number,
    ASMS_Id: number,
    AMST_Id: number | undefined,
    monthId: number | undefined,
    monthDateWise: number | undefined,
    fromDate: Date | null | undefined,
    toDate: Date | null | undefined,
    dailyDate: Date | null | undefined,
    selectionMode: number,
    studentStatus: number,
    searchParams?: ApiSearchparams
) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'AMST_FirstName');

    let baseUrl = `/StudentAttendanceReport/GetAttendanceMonthwiseData?ASMAY_Id=${ASMAY_Id}&ASMCL_Id=${ASMCL_Id}&ASMS_Id=${ASMS_Id}&RadioType=${studentStatus}&Type=${selectionMode}`;

    if (selectionMode === 2 && AMST_Id) {
        baseUrl += `&AMST_Id=${AMST_Id}`;
    }

    if (studentStatus === 1) {
        baseUrl += `&MonthId=${monthId ?? 0}&DateWise=${monthDateWise ?? 0}`;
    }

    if (studentStatus === 2 && fromDate && toDate) {
        baseUrl += `&FromDate=${formatDate(fromDate)}&ToDate=${formatDate(toDate)}`;
    }

    if (studentStatus === 3 && dailyDate) {
        baseUrl += `&DailyDate=${formatDate(dailyDate)}`;
    }

    const finalUrl = `${baseUrl}&${urlParams}`;

    return await api.post<any[]>('admission', finalUrl);
}
