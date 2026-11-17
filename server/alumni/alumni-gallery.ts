'use server';

import { api } from '@/lib/apiService';
import type { IAlumniGallery, IAlumniGalleryDetail } from '@/types/alumni/alumni-gallery';

import { getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';

// Updated interface to match expected response structure with pagination
export interface IAlumniGalleryResponse {
    success: boolean;
    message: string;
    data: IAlumniGallery[];
    get_galleryimg?: IAlumniGallery[];
    total: number;
    page: number;
    page_size: number;
    mI_Id?: number;
    asmaY_Id?: number;
}

export async function getAlumniGalleryData(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'algA_GalleryName');
    const url = `/Alumni_Gallery/get_loaddata?IVRMRT_Id=30&Role_flag=Alumni&${urlParams}`;
    return await api.get<IAlumniGalleryResponse>('alumni', url);
}

export async function saveAlumniGallery(data: any) {
    const url = '/Alumni_Gallery';
    return await api.post('alumni', url, data);
}

export async function getCoverModelDetails(alga_Id: number) {
    const url = `/Alumni_Gallery/get_covermodel?ALGA_Id=${alga_Id}`;
    return await api.get<IAlumniGalleryDetail[]>('alumni', url);
}

export async function saveCoverPhoto(data: any) {
    const url = '/Alumni_Gallery/savecover';
    const payload = {
        ...data
    };
    return await api.post('alumni', url, payload);
}

export async function toggleAlumniGalleryItem(alga_Id: number, algap_Id: number, algav_Id: number) {
    let url = `/Alumni_Gallery/toggle?ALGA_Id=${alga_Id}`;
    if (algap_Id > 0) url += `&ALGAP_Id=${algap_Id}`;
    if (algav_Id > 0) url += `&ALGAV_Id=${algav_Id}`;
    return await api.post('alumni', url, {});
}
