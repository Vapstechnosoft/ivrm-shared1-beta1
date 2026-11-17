'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import { format } from 'date-fns';
const formatDate = (date?: Date | null) => (date ? format(date, 'yyyy-MM-dd') : undefined);

export interface ElectiveItem {
    ismS_Id: number;
    ismS_SubjectName: string;
}

export async function getExcelAdmissionRegistrationReport(
    ASMAY_Id: number,
    AttendanceType: number,
    payload?: any,
    searchParams?: ApiSearchparams
) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});

    const url = `/AdmissionRegister/ExportAdmissionRegisterReportToExcel?ASMAY_Id=${ASMAY_Id}&AttendanceType=${AttendanceType}&TempararyArrayListclass=${encodeURIComponent(JSON.stringify(payload.TempararyArrayListclass))}&TempararyArrayListcoloumn=${encodeURIComponent(JSON.stringify(payload.TempararyArrayListcoloumn))}&${urlParams}`;

    try {
        const data = await api.postBinary('admission', url);
        return Array.from(new Uint8Array(data));
    } catch (error) {
        console.error('Excel export error:', error);
        throw error;
    }
}

export async function getExcelMonthEndReport(data: {
    ASMAY_Id: number;
    month: string;
    year: number;
}) {
    const url = `/monthendreport/ExportMonthEndReportToExcel?AcayId=${data.ASMAY_Id}&Month=${data.month}&Year=${data.year}`;

    try {
        const responseData = await api.postBinary('admission', url);
        return Array.from(new Uint8Array(responseData));
    } catch (error) {
        console.error('Excel export error:', error);
        throw error;
    }
}
export async function getExcelClassTeacherReport(ASMAY_Id: number, flag: number, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});

    const url = `/ClassTeacherReportAttendance/ExportClassTeacherReportAttendanceToExcel?ASMAY_Id=${ASMAY_Id}&flag=${flag}&${urlParams}`;

    try {
        const responseData = await api.postBinary('admission', url);
        return Array.from(new Uint8Array(responseData));
    } catch (error) {
        console.error('Excel export error:', error);
        throw error;
    }
}

export async function getExcelStudentYearlyReport(
    academicYearId: number,
    classId: number,
    sectionId: number,
    searchParams?: ApiSearchparams
) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});

    const flag = sectionId === 0 ? 'all' : 'indi';
    const url = `/StudentYearlyAttendance/ExportStudentYearlyAttendanceToExcel?ASMAY_Id=${academicYearId}&ASMCL_Id=${classId}&ASMS_Id=${sectionId}&AllOrIndiFlag=${flag}&${urlParams}`;

    try {
        const responseData = await api.postBinary('admission', url);
        return Array.from(new Uint8Array(responseData));
    } catch (error) {
        console.error('Excel export error:', error);
        throw error;
    }
}

export async function getExcelStudentTcReport(requestData: any) {
    const url = '/StudentTcReport/ExportAdmissionTcReportToExcel';

    try {
        const responseData = await api.postBinary('admission', url, requestData);

        // Make it serializable
        return Array.from(new Uint8Array(responseData));
    } catch (error) {
        console.error('Excel export error:', error);
        throw error;
    }
}

export async function getExcelClassWiseStudentReport(
    ASMAY_Id: number,
    studentScope: number,
    fmcC_Id: number,
    payload: any,
    searchParams?: ApiSearchparams
) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});

    // Matching the parameter mapping from report.tsx which is known to work
    // report.tsx maps: Concession_Id = studentScope, flag = fmcC_Id
    const url = `/Classwisestudentdetails/ExportClasswiseStudentDetailsToExcel?ASMAY_Id=${ASMAY_Id}&AMST_Id=0&Concession_Id=${studentScope}&flag=${fmcC_Id}&${urlParams}`;

    try {
        // Passing payload in the body instead of URL query string
        const responseData = await api.postBinary('admission', url, payload);
        return Array.from(new Uint8Array(responseData));
    } catch (error) {
        console.error('Excel export error:', error);
        throw error;
    }
}

export async function getExcelTotalStrengthReport(data: {
    asmay_Id: number;
    asmcL_Id: number;
    amC_Id: number;
    statusFlag: string;
    amsT_SOL: string;
    withtc: string;
    withdeactive: string;
    electivearray: ElectiveItem[];
}) {
    const url = `/TotalStrengthReport/ExportTotalStrengthReportToExcel?ASMAY_Id=${data.asmay_Id}&AMST_SOL=${data.amsT_SOL}&Status_Flag=${data.statusFlag}&withtc=${data.withtc}&withdeactive=${data.withdeactive}&ASMCL_Id=${data.asmcL_Id}&AMC_Id=${data.amC_Id}&electivearray=${encodeURIComponent(JSON.stringify(data.electivearray))}`;

    try {
        const responseData = await api.postBinary('admission', url);
        return Array.from(new Uint8Array(responseData));
    } catch (error) {
        console.error('Excel export error:', error);
        throw error;
    }
}

export async function getExcelAttendanceAbsentSmsReport(
    ASMAY_Id: number,
    from_date: string,
    frequency: string,
    searchParams?: ApiSearchparams
) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'AMST_FirstName');

    const url = `/OveralldailyattendanceabsentsmsFacade/ExportOverallDailyAttendanceToExcel?${urlParams}&ASMAY_Id=${ASMAY_Id}&FromDate=${from_date}&Flag=${frequency}`;

    try {
        const responseData = await api.postBinary('admission', url);
        return Array.from(new Uint8Array(responseData));
    } catch (error) {
        console.error('Excel export error:', error);
        throw error;
    }
}

export async function getExcelStudyCertificateReport(data: any) {
    const url = `/StudyCertificateReport/ExportStudyCertificateReportToExcel?&ASMAY_Id=${data.ASMAY_Id}&AllOrInd=${data.AllOrInd}&ASMCL_Id=${data.ASMCL_Id}&ASMC_Id=${data.ASMC_Id}&AMST_Id=${data.AMST_Id}`;

    try {
        const responseData = await api.postBinary('admission', url);
        return Array.from(new Uint8Array(responseData));
    } catch (error) {
        console.error('Excel export error:', error);
        throw error;
    }
}

export async function getExcelOverallAttendanceReport(
    ASMAY_Id: number,
    from_date: string,
    frequency: string,
    searchParams?: ApiSearchparams
) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'AMST_FirstName');

    const url = `/OverallAttendance/ExportOverallDailyAttendanceSimpleToExcel?${urlParams}&ASMAY_Id=${ASMAY_Id}&FromDate=${from_date}&Flag=${frequency}`;

    try {
        const responseData = await api.postBinary('admission', url);
        return Array.from(new Uint8Array(responseData));
    } catch (error) {
        console.error('Excel export error:', error);
        throw error;
    }
}

export async function getExcelStudentAttendanceReport(
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

    const baseUrl = process.env.NEXT_PUBLIC_ADMISSION_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '';
    let url = `${baseUrl}/StudentAttendanceReport/ExportAttendanceMonthwiseToExcel?ASMAY_Id=${ASMAY_Id}&ASMCL_Id=${ASMCL_Id}&ASMS_Id=${ASMS_Id}&RadioType=${studentStatus}&Type=${selectionMode}`;

    if (selectionMode === 2 && AMST_Id) {
        url += `&AMST_Id=${AMST_Id}`;
    }

    if (studentStatus === 1) {
        url += `&MonthId=${monthId}&DateWise=${monthDateWise}`;
    }

    if (studentStatus === 2 && fromDate && toDate) {
        url += `&FromDate=${formatDate(fromDate)}&ToDate=${formatDate(toDate)}`;
    }

    if (studentStatus === 3 && dailyDate) {
        url += `&DailyDate=${formatDate(dailyDate)}`;
    }

    const finalUrl = `${url}&${urlParams}`;

    try {
        const responseData = await api.postBinary('admission', finalUrl);
        return Array.from(new Uint8Array(responseData));
    } catch (error) {
        console.error('Excel export error:', error);
        throw error;
    }
}
export async function getExcelRegistrationReport(
    academicIdParam: number,
    fromDateParam: string | null,
    toDateParam: string | null,
    searchParams?: ApiSearchparams
) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});

    let url = `/RegistrationReport/ExportRegistrationReportToExcel?${urlParams}`;

    // YEAR WISE
    if (academicIdParam) {
        url += `&ASMAY_Id=${academicIdParam}`;
    }

    // BETWEEN DATES — pass each date if available
    if (fromDateParam !== null && fromDateParam !== undefined) {
        url += `&From_Date=${fromDateParam}`;
    }

    if (toDateParam !== null && toDateParam !== undefined) {
        url += `&To_Date=${toDateParam}`;
    }

    try {
        const responseData = await api.postBinary('admission', url);
        return Array.from(new Uint8Array(responseData));
    } catch (error) {
        console.error('Excel export error:', error);
        throw error;
    }
}
export async function getExcelEmailSmsReport(
    academicIdParam: number,
    fromDateParam: string | null,
    toDateParam: string | null,
    searchParams?: ApiSearchparams
) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});

    let url = `/EmailSmsReport/ExportSMSEmailReportToExcel?${urlParams}`;

    // YEAR WISE
    if (academicIdParam) {
        url += `&ASMAY_Id=${academicIdParam}`;
    }

    // BETWEEN DATES — pass each date if available
    if (fromDateParam !== null && fromDateParam !== undefined) {
        url += `&From_Date=${fromDateParam}`;
    }

    if (toDateParam !== null && toDateParam !== undefined) {
        url += `&To_Date=${toDateParam}`;
    }

    try {
        const responseData = await api.postBinary('admission', url);
        return Array.from(new Uint8Array(responseData));
    } catch (error) {
        console.error('Excel export error:', error);
        throw error;
    }
}
export async function getExcelPreAdmissionMonthEndReport(data: {
    amay: string;
    month: string;
    year: string;
}) {
    const url = '/PreAdmissionMonthEndReport/ExportPreAdmissionMonthEndReportToExcel';

    try {
        const responseData = await api.postBinary('admission', url, data);
        return Array.from(new Uint8Array(responseData));
    } catch (error) {
        console.error('Excel export error:', error);
        throw error;
    }
}

export async function getExcelDOBReport(
    ASMAY_Id: number,
    ASMCL_Id: number,
    ASMS_Id: number,
    AMST_Id: number,
    searchParams?: ApiSearchparams
) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});

    const url = `/DOBcertificate/ExportAdmDobCertificateToExcel?ASMAY_Id=${ASMAY_Id}&ASMCL_Id=${ASMCL_Id}&ASMS_Id=${ASMS_Id}&AMST_Id=${AMST_Id}&${urlParams}`;

    try {
        const responseData = await api.postBinary('admission', url);
        return Array.from(new Uint8Array(responseData));
    } catch (error) {
        console.error('Excel export error:', error);
        throw error;
    }
}
