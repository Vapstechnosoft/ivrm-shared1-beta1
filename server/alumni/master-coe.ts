'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';

// Response interface for paginated Master Events data
export interface IMasterCOEResponse {
    success: boolean;
    message: string;
    data: {
        yearlist: any[];
        parameterlist: any[];
        mapped_eventlist: any[];
        stafftypelist?: any[];
        classlist?: any[];
        master_eventlist?: any[];
    };
    total?: number;
    page?: number;
    page_size?: number;
}

// Paginated data fetching for Master Events with search support
export async function getMasterCOEData(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'COEME_EventName');
    const url = `/MasterCOE/getdetails?${urlParams}`;
    return await api.get<IMasterCOEResponse>('alumni', url);
}

// Initial data fetch (non-paginated) - kept for backwards compatibility
export async function getMasterCOEInitialData() {
    const url = '/MasterCOE/getdetails';
    return await api.get<any>('alumni', url);
}

export async function saveMasterEventsData(data: any) {
    return await api.post<any>('alumni', '/MasterCOE/savedetail', data);
}

export async function getOrgValue1(coemE_Id: number) {
    const url = `/MasterCOE/getorgvalue1?COEME_Id=${coemE_Id}`;
    return await api.post<any>('alumni', url);
}

export async function switch1(coemE_Id: number) {
    const url = `/MasterCOE/switch1?COEME_Id=${coemE_Id}`;
    return await api.post<any>('alumni', url, {});
}

export async function getStudentBYYear(asmaY_Id: number) {
    const url = `/MasterCOE/getStudentBYYear?ASMAY_Id=${asmaY_Id}`;
    return await api.post<any>('alumni', url);
}

export async function getEventDetails(coemE_Id: number) {
    const url = `/MasterCOE/geteventdetails?COEME_Id=${coemE_Id}`;
    return await api.post<any>('alumni', url);
}

export async function saveEventsMapData(data: any) {
    return await api.post<any>('alumni', '/MasterCOE/save_detail', data);
}

export async function getOrgValue2(coeE_Id: number) {
    const url = `/MasterCOE/getorgvalue2?COEE_Id=${coeE_Id}`;
    return await api.post<any>('alumni', url);
}

export async function switch2(coeE_Id: number) {
    const url = `/MasterCOE/switch2?COEE_Id=${coeE_Id}`;
    return await api.post<any>('alumni', url, {});
}

export async function deactivateEvent(coeE_Id: number) {
    const url = `/MasterCOE/de_activate?COEE_Id=${coeE_Id}`;
    return await api.post<any>('alumni', url, {});
}

export async function getViewRecords(coeE_Id: number) {
    const url = `/MasterCOE/getalldetails_viewrecords?COEE_Id=${coeE_Id}`;
    return await api.post<any>('alumni', url);
}

export async function getPageDetails(coemE_Id: number) {
    const url = `/MasterCOE/getpagedetails?COEME_Id=${coemE_Id}`;
    return await api.post<any>('alumni', url);
}

export async function getPageDetailsMap(coeE_Id: number) {
    const url = `/MasterCOE/getpage_details?COEE_Id=${coeE_Id}`;
    return await api.post<any>('alumni', url);
}

export async function getViewRecordsMaster(coemE_Id: number) {
    const url = `/MasterCOE/getalldetailsviewrecords?COEME_Id=${coemE_Id}`;
    return await api.post<any>('alumni', url);
}

export async function deactivateMasterEvent(coemE_Id: number) {
    const url = `/MasterCOE/deactivate?COEME_Id=${coemE_Id}`;
    return await api.get<any>('alumni', url);
}

export async function getCOEMappingDetails() {
    const url = '/MasterCOE/getdetails';
    return await api.get<any>('alumni', url);
}
