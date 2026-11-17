'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IBMICalculation, IBMIClassResponse, IBMISectionResponse, IBMIStudentResponse } from '@/types/sports/transactions/bmi-calculation';

export async function getBMILoadGrid(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/BMICalculation/getDetails?roleid=4&${urlParams}`;

    try {
        const response = await api.get<any>('sports', url);
        if (!response) return { success: false, data: [] };

        // 1. If response is already an array, return it wrapped
        if (Array.isArray(response)) {
            return { success: true, data: response };
        }

        // 2. Identify and lift metadata if response.data is an object
        if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
            Object.assign(response, response.data);
        }

        // 3. Look for the list in common properties (now potentially lifted to root)
        const possibleLists = [
            response.studentrecord,
            response.viewlist,
            response.viewList,
            response.studentList,
            response.viewdetails,
            response.griddata,
            response.viewDetails,
            // Fallback for direct data if it's already an array
            Array.isArray(response.data) ? response.data : null
        ];

        const list = possibleLists.find(l => Array.isArray(l) && l.length > 0);

        if (list) {
            response.data = list;
        } else if (!response.data || (!Array.isArray(response.data) && (response.amsT_Id || response.amsT_AdmNo))) {
            // 4. Fallback: single object record returned or no list found
            if (response.amsT_Id || response.amsT_AdmNo) {
                response.data = [response];
            } else {
                response.data = [];
            }
        } else if (!Array.isArray(response.data)) {
            // Ensure data is always an array for the grid if we couldn't find a better one
            response.data = [];
        }

        if (response.success === undefined) {
            response.success = true;
        }

        return response;
    } catch (error) {
        console.error('Error fetching BMI Load Grid:', error);
        return {
            success: false,
            message: 'Failed to load grid data',
            data: [],
        };
    }
}

export async function getBMIClasses(data: any): Promise<IBMIClassResponse> {
    const url = `/BMICalculation/get_classes`;
    try {
        const response = await api.post<any>('sports', url, data);
        return response as unknown as IBMIClassResponse;
    } catch (error) {
        console.error('Error fetching BMI Classes:', error);
        return {
            success: false,
            message: 'Failed to fetch classes',
            data: { classlist: [] }
        };
    }
}

export async function getBMISections(data: any): Promise<IBMISectionResponse> {
    const url = `/BMICalculation/get_section`;
    try {
        const response = await api.post<any>('sports', url, data);
        return response as unknown as IBMISectionResponse;
    } catch (error) {
        console.error('Error fetching BMI Sections:', error);
        return {
            success: false,
            message: 'Failed to fetch sections',
            data: []
        };
    }
}

export async function getBMIStudents(data: any): Promise<IBMIStudentResponse> {
    const url = `/BMICalculation/getStudents`;
    try {
        const response = await api.post<any>('sports', url, data);
        return response as unknown as IBMIStudentResponse;
    } catch (error) {
        console.error('Error fetching BMI Students:', error);
        return {
            success: false,
            message: 'Failed to fetch students',
            data: []
        };
    }
}

export async function saveBMIRecord(data: IBMICalculation) {
    const url = '/BMICalculation/save';
    return await api.post<any>('sports', url, data);
}

export async function deactivateBMIRecord(id: number) {
    const url = `/BMICalculation/deactivate?SPCCSHW_Id=${id}`;
    return await api.post<any>('sports', url, {});
}

export async function editBMIRecord(data: any) {
    const url = `/BMICalculation/editdata`;
    return await api.post<any>('sports', url, data);
}
