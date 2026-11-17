'use server';

import { api } from '@/lib/apiService';
import { StudentAllotmentSchema } from '@/schemas/hostel/transactions/student-allotment.schema';
import { revalidatePath } from 'next/cache';

const URL_BASE = 'HostelAllotForStudent/';

interface PaginationData {
    total: number;
    page: number;
    page_Size: number;
}

export interface ApiResponse<T> extends Partial<PaginationData> {
    success: boolean;
    message: string;
    data: T | null;
    [key: string]: unknown;
}

// Types based on JS usage
export interface StudentAllotmentLoadData {
    yearlist: { asmaY_Id: number; asmaY_Year: string }[];
    hostel_list: { hlmH_Id: number; hlmH_Name: string }[];
    student_allotlist: any[];
    classlist: { asmcL_Id: number; asmcL_ClassName: string }[];
    sectionlist: { asmS_Id: number; asmC_SectionName: string }[];
    roomcatgry_list: { hlmrcA_Id: number; hlmrcA_RoomCategory: string }[];
    room_list: { hrmrM_Id: number; hrmrM_RoomNo: string }[];
    asmaY_Id: number;
}

export const getStudentAllotmentLoadData = async (ASMAY_Id?: number): Promise<ApiResponse<StudentAllotmentLoadData>> => {
    try {
        let url = URL_BASE + 'loaddata/' + (ASMAY_Id || 0); // Assuming 0 or empty for default
        const response = await api.get<StudentAllotmentLoadData>('default', url);
        return response;
    } catch (error) {
        console.error('Error fetching student allotment load data:', error);
        return {
            success: false,
            message: 'Failed to fetch data',
            data: {
                yearlist: [],
                hostel_list: [],
                student_allotlist: [],
                classlist: [],
                sectionlist: [],
                roomcatgry_list: [],
                room_list: [],
                asmaY_Id: 0
            }
        };
    }
};

export interface StudentInfo {
    housewise_studentList: any[];
}

export const getStudentInfo = async (HLMH_Id: number): Promise<ApiResponse<StudentInfo>> => {
    try {
        const response = await api.get<StudentInfo>('default', URL_BASE + `get_studInfo/${HLMH_Id}`);
        return response;
    } catch (error) {
        console.error('Error fetching student info:', error);
        return {
            success: false,
            message: 'Failed to fetch student info',
            data: { housewise_studentList: [] }
        };
    }
};

export const getRoomDetails = async (HRMRM_Id: number): Promise<ApiResponse<any>> => {
    try {
        const response = await api.get<any>('default', URL_BASE + `get_roomdetails/${HRMRM_Id}`);
        return response;
    } catch (error) {
        console.error('Error fetching room details:', error);
        return {
            success: false,
            message: 'Failed to fetch room details',
            data: null
        };
    }
};

export const saveStudentAllotment = async (data: StudentAllotmentSchema): Promise<ApiResponse<any>> => {
    try {
        const payload = {
            ...data,
            // formatted dates if needed
        };

        const response = await api.post<any>('default', URL_BASE + 'savedata', payload);
        if (response.data?.returnval) {
            revalidatePath('/hostel/hostel-management/transactions/student-allotment');
        }
        return response;
    } catch (error) {
        console.error('Error saving student allotment:', error);
        return {
            success: false,
            message: 'Failed to save due to server error',
            data: null
        };
    }
};
