'use server';

import { api } from '@/lib/apiService';
import { staffAllotmentSchema } from '@/schemas/hostel/transactions/staff-allotment.schema';
import { revalidatePath } from 'next/cache';

const SERVICE_NAME = 'default';
const API_BASE_URL = 'HostelAllotForStaff';

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

export interface StaffAllotmentLoadData {
    yearlist: { asmaY_Id: number; asmaY_Year: string }[];
    hostel_list: { hlmH_Id: number; hlmH_Name: string }[];
    student_allotlist: any[]; // API might return this name even for staff
    deptlist: any[];
    desglist: any[];
    roomcatgry_list: any[];
    room_list: any[];
}

export interface StaffInfo {
    HRME_Id: number;
    staffname: string;
    HRME_EmployeeCode: string;
    HRMD_Id: number;
    HRMDES_Id: number;
    HLMRCA_Id: number;
    HLHSTREQC_VegMessFlg?: boolean;
    HLHSTREQC_NonVegMessFlg?: boolean;
    HLHSTREQC_ACRoomFlg?: boolean;
    HLHSTREQC_SingleRoomFlg?: boolean;
    hrmrM_Id?: number;
}

export interface StaffInfoResponse {
    housewise_studentList: StaffInfo[];
}

export const getStaffAllotmentLoadData = async (): Promise<ApiResponse<StaffAllotmentLoadData>> => {
  try {
    const response = await api.get<StaffAllotmentLoadData>(SERVICE_NAME, `${API_BASE_URL}/loaddata/2`);
    return response;
  } catch (error) {
    console.error('Error fetching staff allotment load data:', error);
    return {
        success: false,
        message: 'Failed to fetch data',
        data: {
            yearlist: [],
            hostel_list: [],
            student_allotlist: [],
            deptlist: [],
            desglist: [],
            roomcatgry_list: [],
            room_list: []
        }
    }
  }
};

export const getStaffInfo = async (payload: { HLMH_Id: number }): Promise<ApiResponse<StaffInfoResponse>> => {
  try {
    const response = await api.post<StaffInfoResponse>(SERVICE_NAME, `${API_BASE_URL}/get_studInfo`, payload);
    return response;
  } catch (error) {
    console.error('Error fetching staff info:', error);
    return {
        success: false,
        message: 'Failed to fetch staff info',
        data: { housewise_studentList: [] }
    };
  }
};

export const getRoomDetails = async (payload: { HRMRM_Id: number }): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<any>(SERVICE_NAME, `${API_BASE_URL}/get_roomdetails`, payload);
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

export const saveStaffAllotment = async (data: any): Promise<ApiResponse<any>> => {
  try {
    const payload = {
      ...data,
      HLHSTALT_AllotmentDate: data.HLHSTALT_AllotmentDate,
    };

    const response = await api.post<any>(SERVICE_NAME, `${API_BASE_URL}/savedata`, payload);
    
    if (response.data?.returnval === true) {
       revalidatePath('/hostel/hostel-management/transactions/staff-allotment');
    }
    return response;

  } catch (error) {
    console.error('Error saving staff allotment:', error);
    return {
        success: false,
        message: 'Failed to save staff allotment',
        data: null
    };
  }
};
