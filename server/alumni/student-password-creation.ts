'use server';

import { api } from '@/lib/apiService';
import type {
    ICommonResponse,
    ICredentialStudent,
    IStudentPasswordCreationInitialData,
    IStudentPasswordCreationReportResponse
} from '@/types/alumni/student-password-creation';

export async function getInitialData() {
    const url = '/SMSEmailSend/getdata';
    return await api.get<IStudentPasswordCreationInitialData>('alumni', url);
}

export async function getReportDetails(data: {
    asmaY_Id: number;
    asmcL_Id: number;
    asmS_Id: number;
    filterdata: string;
}) {
    const url = `/SMSEmailSend/Getreportdetails?ASMAY_Id=${data.asmaY_Id}&ASMCL_Id=${data.asmcL_Id}&ASMS_Id=${data.asmS_Id}&filterdata=${data.filterdata}`;
    return await api.post<IStudentPasswordCreationReportResponse>('alumni', url, {});
}

export async function resetStudentPassword(student: ICredentialStudent, selectedStudents: ICredentialStudent[]) {
    const url = '/SMSEmailSend/resetUser';
    const data = {
        username: student.username,
        amsT_Id: student.amsT_Id,
        data_array: selectedStudents
    };
    return await api.post<any>('alumni', url, data);
}

export async function sendSMS(filterdata: string, selectedStudents: ICredentialStudent[]) {
    const url = '/SMSEmailSend/smssend';
    const data = {
        filterdata,
        data_array: selectedStudents
    };
    return await api.post<ICommonResponse>('alumni', url, data);
}

export async function sendEmail(filterdata: string, selectedStudents: ICredentialStudent[]) {
    const url = '/SMSEmailSend/emailsend';
    const data = {
        filterdata,
        data_array: selectedStudents
    };
    return await api.post<ICommonResponse>('alumni', url, data);
}

export async function sendWhatsApp(filterdata: string, selectedStudents: ICredentialStudent[]) {
    const url = '/SMSEmailSend/whatsapp';
    const data = {
        filterdata,
        data_array: selectedStudents
    };
    return await api.post<ICommonResponse>('alumni', url, data);
}
