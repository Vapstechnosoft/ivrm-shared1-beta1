'use server';

import { api } from '@/lib/apiService';
import type { IAlumniReportInitialData, IAlumniReportResponse, IAlumniReportSearchPayload } from '@/types/alumni/alumni-report';

export async function getInitialData() {
    return await api.post<IAlumniReportInitialData>('alumni', '/AlumniSearch/Getdetails', {});
}

export async function getStates(countryIds: { IVRMMC_Id: number }[]) {
    const response = await api.post<any>('alumni', '/AlumniSearch/getstate', {
        countrylistarray: countryIds
    });
    if (response.success && response.data) {
        response.data.statelist = response.data.statelist || response.data.retObject || [];
    }
    return response;
}

export async function getDistricts(stateIds: { IVRMMS_Id: number }[]) {
    const response = await api.post<any>('alumni', '/AlumniSearch/getdistrict', {
        statelistarray: stateIds
    });
    if (response.success && response.data) {
        response.data.districtlist = response.data.districtlist || response.data.retObject || [];
    }
    return response;
}

export async function getReportData(payload: IAlumniReportSearchPayload) {
    return await api.post<IAlumniReportResponse>('alumni', '/AlumniSearch/Getdetailsreport', payload);
}

export async function getDetailsByType(type: 'City' | 'Occupation') {
    return await api.post<any>('alumni', '/AlumniSearch/Getdetails', { p_type: type });
}
