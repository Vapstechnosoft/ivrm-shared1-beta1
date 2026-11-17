'use server';

import { api } from '@/lib/apiService';

// Interface for the payload sent to the API
export interface StudentAttendanceSearchParams {
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    ClassSecFlag: number;
    ASA_FromDate: string;
    MonthFlag1: string;
}

// Interface for individual student object
export interface StudentAttendanceStudent {
    amaY_RollNo: number;
    amsT_AdmNo: string;
    amsT_Id: number;
    studentName: string;
    pDays: number | null;
    selected: boolean | null;
    asaS_Id: number | null;
    firstHalfflag: boolean | null;
    secondHalfflag: boolean | null;
    asA_Dailytwice_Flag: boolean | null;
    asA_Id: number;
    ttmP_Id: number | null;
    ismS_Id: number;
    asasB_Id: number;
    amsT_RegistrationNo: string;
    asasmdM_Id: number;
    asamdM_Id: number;
}

// Interface for successful data response
export interface StudentAttendanceData {
    admissionStandard: any[];
    standardConfig: any[];
    attendanceEntryFlag: string;
    attDefaultDisplay: number;
    countClass1: number;
    asA_Att_EntryType: string;
    studentList: StudentAttendanceStudent[];
    sectionList: any | null;
    subjectList: any | null;
}

export type StudentAttendanceResponse = {
    success: boolean;
    message: string;
    data: StudentAttendanceData | null;
};

export const getStudentAttendanceData = async (params: StudentAttendanceSearchParams): Promise<StudentAttendanceResponse> => {
    const searchParams = new URLSearchParams();
    searchParams.append('ASMAY_Id', params.ASMAY_Id.toString());
    searchParams.append('ASMCL_Id', params.ASMCL_Id.toString());
    searchParams.append('ASMS_Id', params.ASMS_Id.toString());
    searchParams.append('ClassSecFlag', params.ClassSecFlag.toString());
    searchParams.append('ASA_FromDate', params.ASA_FromDate);
    searchParams.append('MonthFlag1', params.MonthFlag1);

    // Construct the URL with query parameters manually
    const url = `/StudentAttEntry/get-student-data?${searchParams.toString()}`;

    // Pass empty body as per curl request: -d ''
    return api.post<StudentAttendanceData>('admission', url, {});
};

// -------------------- VIEW PERIOD WISE --------------------

export interface StudentAttendanceDetail {
    asA_Id: number;
    asmaY_Year: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    asA_FROMDATE: string;
    asA_Entry_DateTime: string;
    asA_FromDateTemp: string;
    employeename: string;
    ismS_SUBJECTNAME: string;
    ttmP_PeriodName: string;
    asmcL_Order: number;
    asmC_Order: number;
    deletE_FLAG: number;
    totalCount: number;
    presentCount: number;
    absentCount: number;
}

export interface ViewAttendanceDetailsResponse {
    success: boolean;
    message: string;
    data: {
        attendanceDetails: StudentAttendanceDetail[];
        hrmE_Id: number;
    } | null;
    total: number;
    page: number;
    page_size: number;
}

export interface ViewAttendanceParams {
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    att_entry_type: string;
}

export const viewAttendanceDetailsStaffwise = async (params: ViewAttendanceParams): Promise<ViewAttendanceDetailsResponse> => {
    const searchParams = new URLSearchParams();
    searchParams.append('ASMAY_Id', params.ASMAY_Id.toString());
    searchParams.append('ASMCL_Id', params.ASMCL_Id.toString());
    searchParams.append('ASMS_Id', params.ASMS_Id.toString());
    searchParams.append('att_entry_type', params.att_entry_type);

    const url = `/StudentAttEntry/view-attendance-details-staffwise?${searchParams.toString()}`;
    return api.post<any>('admission', url, {}) as unknown as Promise<ViewAttendanceDetailsResponse>;
};

// -------------------- DELETE ATTENDANCE --------------------

export interface DeleteAttendanceResponse {
    success: boolean;
    message: string;
    data: any;
}

export const deleteAttendanceRecord = async (asaId: number): Promise<DeleteAttendanceResponse> => {
    // URL pattern assumed based on common practices, or we might need to adjust.
    // The user showed response: "Attendance record not found with ASA_Id: 0"
    // Usually implies an endpoint that takes ID.
    // I'll assume a standard delete endpoint or similar structure to view.
    // NOTE: If this 404s, we'll need the exact endpoint URL.
    const url = `/StudentAttEntry/delete-attendance-record?ASA_Id=${asaId}`;
    return api.post<any>('admission', url, {});
};
// -------------------- SAVE ATTENDANCE --------------------

export interface StudentAttendanceSavePayload {
    username: string;
    asmaY_Id: number;
    asmcL_Id: number;
    asmS_Id: number;
    asA_Att_Type: string;
    asA_Entry_DateTime: string;
    asA_FromDate: string;
    asA_ToDate: string;
    asA_ClassHeld: number;
    asA_Network_IP: string;
    asA_Regular_Extra: string;
    ttmP_Id: number;
    ismS_Id: number;
    asasB_Id: number;
    asA_Id: number;
    ismP_Id: number;
    pamS_Id: number;
    stdList: StudentAttendanceStudent[];
    apsentStdList: StudentAttendanceStudent[];
}

export const saveStudentAttendance = async (payload: StudentAttendanceSavePayload): Promise<any> => {
    return api.post('admission', '/StudentAttEntry/save-student-attendance', payload);
};
