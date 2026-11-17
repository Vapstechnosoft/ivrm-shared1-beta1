'use server';

import { api } from '@/lib/apiService';

export interface StudentTcDTO {
    amsT_Id: number;
    studentName: string;
    amsT_AdmNo: string;
    // Add other fields if known/needed
}

export const getStudentsByAcademicYear = async (asmayId: number): Promise<any> => {
    return api.get<StudentTcDTO[]>('admission', `/StudentTc/GetStudentsByAcademicYear?asmayId=${asmayId}`);
};

export const getTCCancelDetails = async (asmayId: number, amstId: number, reason = 'tmp'): Promise<any> => {
    return api.post('admission', `/StudentTc/GetTCCancelDetails?ASMAY_Id=${asmayId}&AMST_Id=${amstId}&TC_CancelReason=${reason}`, {});
};
