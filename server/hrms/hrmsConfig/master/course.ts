'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterCourseList, IMasterCourseSetOrderList } from '@/types/hrms/hrms-config/master';

export async function getMasterCourse(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'hrmC_QulaificationName,hrmC_QualificationDesc');
    const url = `/api/MasterCourse?${urlParams}`;
    try {
        const response = await api.get<IMasterCourseList[]>('hrms', url);
        return response;
    } catch (error: any) {
        console.error('🔴 [MasterCourse] Error:', error);
        return {
            success: false,
            message: error?.message || 'Failed to load course details',
            data: [],
            total: 0,
            page: searchParams?.page || 1,
            page_size: searchParams?.page_size || 10
        };
    }
}
export async function addOrUpdateMasterCourse(data: any) {
    const url = '/api/MasterCourse';
    return await api.post<any>('hrms', url, data);
}

export async function toggleMasterCourse(id: number) {
    const url = `/api/MasterCourse/toggle_master_course/${id}`;
    return await api.put('hrms', url);
}

export async function getMasterCourseDetails(id: number) {
    const url = `/api/MasterCourse/course_details_by_id/${id}`;
    return await api.get<any>('hrms', url);
}
export async function getCourseSetOrder() {
    const url = '/api/MasterCourse/set_order_list';
    return await api.getArray<IMasterCourseSetOrderList>('hrms', url);
}

export async function updateCourseSetorder(data: any) {
    console.log('🔙 [SERVER ACTION] updateCourseSetorder called with data:', JSON.stringify(data, null, 2));
    const url = '/api/MasterCourse/update_course_order_number';
    try {
        const response = await api.post<any>('hrms', url, data);
        console.log('🔙 [SERVER ACTION] updateCourseSetorder response:', JSON.stringify(response, null, 2));
        return response;
    } catch (error: any) {
        console.error('🔙 [SERVER ACTION] updateCourseSetorder error:', error);
        // Throw an actual Error object instead of a string to avoid serialization issues in Next.js Server Actions
        throw new Error(typeof error === 'string' ? error : (error?.message || 'An unknown error occurred during order update'));
    }
}
