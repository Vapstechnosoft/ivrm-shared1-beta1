'use server';

import { api } from '@/lib/apiService';
import type { IAlumniSearchDetailsResponse, IAlumniSearchResponse } from '@/types/alumni/alumni-search';

export async function performAlumniSearch(data: any) {
    const url = '/AlumniSearch';
    return await api.post<IAlumniSearchResponse>('alumni', url, data);
}

export async function getAlumniSearchDropdownData(data: any) {
    const url = '/AlumniSearch/Getdetails';
    return await api.post<any>('alumni', url, data);
}
