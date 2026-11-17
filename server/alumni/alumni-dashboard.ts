'use server';

import { api } from '@/lib/apiService';
import type { IClasswiseStudent, IYearwiseCount } from '@/types/alumni/alumni-dashboard';

export async function getDashboardData(roleId = 30) {
    const response = await api.get<any>('alumni', `/SchoolALUDASH/getloaddata?roleId=${roleId}`);

    if (response.success && response.data) {
        if (response.data.retObject3 && response.data.retObject3.length > 0) {
            response.data.batch = response.data.retObject3.map((item: any) => ({
                BATCHES: item.batches,
                ASMAY_From_Date: item.asmay_from_date,
                ASMAY_To_Date: item.asmay_to_date,
                NOofstudents: item.noofstudents,
                ASMAY_Id: item.asmay_id
            }));
        }

        if (response.data.retObject4 && response.data.retObject4.length > 0) {
            response.data.alumnilist = response.data.retObject4.map((item: any) => ({
                Name: item.name,
                ASMAY_Year: item.asmay_year,
                ALMST_AdmNo: item.almst_admno,
                classname: item.classname,
                ALMST_MobileNo: item.almst_mobileno
            }));
        }

        if (response.data.calenderlist && response.data.calenderlist.length > 0) {
            response.data.calenderlist = response.data.calenderlist.map((item: any) => ({
                coemE_EventName: item.coemE_EventName || item.coeme_eventname || item.eventName,
                coeE_EStartDate: item.coeE_EStartDate || item.coee_estartdate || item.eventStartDate,
                coeE_EEndDate: item.coeE_EEndDate || item.coee_eenddate || item.eventEndDate
            }));
        } else if (response.data.retObject2 && response.data.retObject2.length > 0) {
            // Fallback for legacy retObject2 which often contains events
            response.data.calenderlist = response.data.retObject2.map((item: any) => ({
                coemE_EventName: item.coemE_EventName || item.coeme_eventname || item.eventName,
                coeE_EStartDate: item.coeE_EStartDate || item.coee_estartdate || item.eventStartDate,
                coeE_EEndDate: item.coeE_EEndDate || item.coee_eenddate || item.eventEndDate
            }));
        }
    }

    return response;
}

export async function getGalleryData() {
    return await api.post<any>('alumni', '/SchoolALUDASH/getgallery');
}

export async function viewGalleryItem(algA_Id: number) {
    return await api.post<any>('alumni', `/SchoolALUDASH/viewgallery?ALGA_Id=${algA_Id}`);
}

export async function getNoticeData() {
    return await api.post<any>('alumni', '/SchoolALUDASH/alumninotice');
}

export async function viewNoticeItem(alntB_Id: number) {
    return await api.post<any>('alumni', `/SchoolALUDASH/viewnotice?ALNTB_Id=${alntB_Id}`);
}

export async function getYearwiseList(asmaY_Id: number) {
    const response = await api.post<any[]>('alumni', `/SchoolALUDASH/yearwiselist?ASMAY_Id=${asmaY_Id}`, {});

    if (response.data && response.data.length > 0) {
        response.data = response.data.map((item: any) => ({
            ...item,
            BATCHES: item.batches || item.BATCHES || item.asmay_year || '',
            classname: item.classname || item.CLASSNAME || '',
            NOofstudents:
                item.noofstudents !== undefined
                    ? item.noofstudents
                    : item.NOofstudents !== undefined
                      ? item.NOofstudents
                      : item.studentcount || 0,
            ASMAY_Id: item.asmay_id || item.ASMAY_Id || asmaY_Id,
            ASMCL_Id: item.asmcL_Id || item.asmcl_id || item.ASMCL_Id || 0
        })) as IYearwiseCount[];

        if (!response.success) {
            response.success = true;
        }
    }

    return response;
}

export async function getClasswiseStudent(asmaY_Id: number, asmcL_Id: number) {
    const response = await api.post<IClasswiseStudent[]>(
        'alumni',
        `/SchoolALUDASH/classwisestudent?ASMAY_Id=${asmaY_Id}&ASMCL_Id=${asmcL_Id}`,
        {}
    );

    // Ensure we return the data array even if success is false but data is present
    if (!response.success && response.data && response.data.length > 0) {
        response.success = true;
    }

    return response;
}

export async function getBirthdayData() {
    return await api.post<any>('alumni', '/SchoolALUDASH/AluminiBirthday');
}
