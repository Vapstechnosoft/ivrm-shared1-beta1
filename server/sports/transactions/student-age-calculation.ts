'use server';

import { api, type ApiResponse } from '@/lib/apiService';
import { IDropdown } from '@/types';
import { StudentAgeCalculationFormData, StudentAgeRecord } from '@/schemas/sports/transactions/student-age-calculation';
import { StudentAgeCalculationInitialData } from '@/types/sports/transactions/student-age-calculation';

export async function getInitialData(): Promise<ApiResponse<{ academicYears: IDropdown[], classes: IDropdown[], sections: IDropdown[], records: StudentAgeRecord[] }>> {
    try {
        const response = await api.post<StudentAgeCalculationInitialData>('sports', '/StudentAgeCalc/Getdetails', {});

        if (!response.success && !response.data) {
            return {
                success: false,
                message: response.message || 'Failed to fetch details',
                data: { academicYears: [], classes: [], sections: [], records: [] }
            };
        }

        const academicYears: IDropdown[] = response.data?.academicYear?.map(item => ({
            id: item.asmaY_Id,
            label: item.asmaY_Year,
            code: item.asmaY_AcademicYearCode,
            name: item.asmaY_Year
        })) || [];

        const classes: IDropdown[] = response.data?.classList?.map(item => ({
            id: item.asmcL_Id,
            label: item.asmcL_ClassName,
            code: item.asmcL_ClassCode,
            name: item.asmcL_ClassName
        })) || [];

        const sections: IDropdown[] = response.data?.sectionList?.map(item => ({
            id: item.asmS_Id,
            label: item.asmC_SectionName,
            code: item.asmC_SectionName,
            name: item.asmC_SectionName
        })) || [];

        const records: StudentAgeRecord[] = (response.data?.eventsStudentRecordList || []).map((r: any, index: number) => ({
            id: index + 1,
            asmaY_Year: r.asmaY_Year,
            studentName: r.studentName,
            asmcL_ClassName: r.asmcL_ClassName,
            asmC_SectionName: r.asmC_SectionName,
            age_Years: r.age_Years,
            age_Months: r.age_Months,
            age_Days: r.age_Days
        }));

        return {
            success: true,
            message: 'Initial data fetched successfully',
            data: { academicYears, classes, sections, records }
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Failed to fetch details',
            data: { academicYears: [], classes: [], sections: [], records: [] }
        };
    }
}

export async function getStudents(data: { ASMAY_Id: number, AMST_Id: number, ASMCL_Id: number, ASMS_Id: number }): Promise<ApiResponse<IDropdown[]>> {
    try {
        // Sending data in both body and params to be safe, as backend snippet lacks [FromBody]
        const response = await api.post<any>('sports', '/StudentAgeCalc/getStudents', data, { params: data });
        if (!response.success) {
            return {
                success: false,
                message: response.message || 'Failed to fetch students',
                data: []
            };
        }

        const students: IDropdown[] = (response.data?.studentList || []).map((s: any) => ({
            id: s.amsT_Id,
            label: s.studentName,
            name: s.studentName,
            code: ''
        }));

        return {
            success: true,
            message: 'Students fetched successfully',
            data: students
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Failed to fetch students',
            data: []
        };
    }
}

export async function saveStudentAge(data: StudentAgeCalculationFormData): Promise<ApiResponse<any>> {
    try {
        const payload = {
            ASMAY_Id: data.ASMAY_Id,
            ASMCL_Id: data.ASMCL_Id,
            ASMS_Id: data.ASMS_Id,
            AMST_Id: 0,
            Till_Date: data.Till_Date ? new Date(data.Till_Date).toISOString().split('T')[0] : null,
            student: data.student.map(id => ({ AMST_Id: id }))
        };

        const response = await api.post<any>('sports', '/StudentAgeCalc/save', payload);
        return {
            success: response.success,
            message: response.message,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Failed to save record',
            data: null
        };
    }
}

export async function getStudentAgeRecords(data: any): Promise<ApiResponse<StudentAgeRecord[]>> {
    try {
        const response = await api.post<any>('sports', '/StudentAgeCalc/report', data);
        if (!response.success) {
            return {
                success: false,
                message: response.message || 'Failed to fetch records',
                data: []
            };
        }

        // Mapping report data to StudentAgeRecord using correct property 'datareport'
        const rawData = response.data?.datareport || response.data?.reportData || [];
        const records: StudentAgeRecord[] = rawData.map((r: any, index: number) => ({
            id: index + 1,
            asmaY_Year: r.asmaY_Year,
            studentName: r.studentName,
            asmcL_ClassName: r.asmcL_ClassName,
            asmC_SectionName: r.asmC_SectionName,
            age_Years: r.age_Years,
            age_Months: r.age_Months,
            age_Days: r.age_Days
        }));

        return {
            success: true,
            message: 'Records fetched successfully',
            data: records
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Failed to fetch records',
            data: []
        };
    }
}
