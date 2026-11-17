'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IadmissionStudentApplicationList } from '@/types/admission/admission';

export async function saveFirstTabApi(data: any) {
    const url = '/StudentAdmissionFacade/savefirsttab';
    return await api.post<any>('admission', url, data);
}

export async function saveSecondTabApi(data: any) {
    const url = '/StudentAdmissionFacade/savesecondtab';
    return await api.post<any>('admission', url, data);
}

export async function saveThirdTabApi(data: any) {
    const url = '/StudentAdmissionFacade/savethirdtab';
    return await api.post<any>('admission', url, data);
}
export async function saveFourthTabApi(data: any) {
    const url = '/StudentAdmissionFacade/savefourthtab';
    try {
        return await api.post<any>('admission', url, data);
    } catch (err: any) {
        console.error('[Server] saveFourthTabApi error:', err);
        const message = err?.response?.data?.message || err?.message || 'Failed to save step 4';
        return { success: false, message } as any;
    }
}

export async function saveFifthTabApi(data: any) {
    const url = '/StudentAdmissionFacade/savefifthtab';
    return await api.post<any>('admission', url, data);
}

export async function saveGaurdianApi(data: any) {
    const url = '/StudentAdmissionFacade/saveguardian';
    try {
        const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
        const looksLikeFormData = !isFormData && data && typeof (data as any).get === 'function';

        if (isFormData || looksLikeFormData) {
            return await api.postMultipart<any>('admission', url, data as FormData);
        }
    } catch (_err) {
        // If any detection fails, fall back to JSON post
    }

    return await api.post<any>('admission', url, data);
}

export async function saveStudentPhotoApi(data: any) {
    const url = '/StudentAdmissionFacade/upload-student-photo';
    try {
        const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
        const looksLikeFormData = !isFormData && data && typeof (data as any).get === 'function';

        if (isFormData || looksLikeFormData) {
            return await api.postMultipart<any>('admission', url, data as FormData);
        }
    } catch (_err) {
        // If any detection fails, fall back to JSON post
    }

    return await api.post<any>('admission', url, data);
}

export async function saveFinalTabApi(data: any) {
    const url = '/StudentAdmissionFacade/savelasttab';
    try {
        const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
        const looksLikeFormData = !isFormData && data && typeof (data as any).get === 'function';

        if (isFormData || looksLikeFormData) {
            return await api.postMultipart<any>('admission', url, data as FormData);
        }
    } catch (_err) {
        // If any detection fails, fall back to JSON post
    }

    return await api.post<any>('admission', url, data);
}

export async function getAllAdmissionLists(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(
        searchParams ?? {},
        'studentName,amst_Id,className,admissionDate,gender,registrationNo,admissionNo,emailId,mobileNo'
    );
    const url = `/StudentAdmissionFacade/get-student-list${urlParams ? `?${urlParams}` : ''}`;
    return await api.get<[IadmissionStudentApplicationList]>('admission', url);
}

export async function getStudentAdmissionForm(id: number) {
    const url = `/StudentAdmissionFacade/get-all-tabs-by-amst-id/${id}`;
    return await api.post<any>('admission', url);
}

export async function getStudentAdmissionFormById(id: number) {
    const url = `/StudentAdmissionFacade/get-all-tabs-by-amst-id/${id}`;
    return await api.get<any>('admission', url);
}

export async function deleteAdmissionForm(id: number) {
    const url = `/StudentAdmissionFacade/delete-admission/${id}`;
    return await api.delete('admission', url);
}
