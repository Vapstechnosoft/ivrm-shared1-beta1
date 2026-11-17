'use server';

import { api } from '@/lib/apiService';
import type {
    IEmployeeDashboardResponse,
    INoticeFilterRequest,
    IAssetFilterRequest,
    IMedicalRecordRequest
} from '@/types/staff-portal/dashboard';

/**
 * Fetch initial dashboard details
 */
export async function getDashboardDetails() {
    const url = '/api/EmployeePortal/get-portal_dashboard-asset-list-data';
    return await api.get<IEmployeeDashboardResponse>('portal', url);
}

/**
 * Fetch notice board data with filters
 */
export async function getNoticeBoard(data: INoticeFilterRequest) {
    const url = '/api/EmployeePortal/onclick-dashboard-notice-board-notice';
    return await api.post<IEmployeeDashboardResponse>('portal', url, data);
}

/**
 * Fetch calendar of events
 */
export async function getEvents(data: { flag: string; OnClickOrOnChange: string }) {
    const url = '/api/EmployeePortal/staff-onclick-events';
    return await api.post<IEmployeeDashboardResponse>('portal', url, data);
}

/**
 * Fetch asset, purchase, or book list
 */
export async function getAssetList(data: IAssetFilterRequest) {
    const url = '/api/EmployeePortal/onclick-asset-list-asset';
    return await api.post<IEmployeeDashboardResponse>('portal', url, data);
}

/**
 * Fetch employee medical records
 */
export async function getMedicalRecords(data: IMedicalRecordRequest) {
    const url = '/api/EmployeePortal/staff-onclick-employee';
    return await api.post<IEmployeeDashboardResponse>('portal', url, data);
}

/**
 * Fetch notice attachments
 */
export async function getNoticeAttachments(INTB_Id: number) {
    const url = '/api/EmployeePortal/staff-view-notice';
    return await api.post<IEmployeeDashboardResponse>('portal', url, { INTB_Id });
}

/**
 * Change employee profile picture
 */
export async function changeProfile(data: { HRME_PhotoNo: string }) {
    const url = '/api/EmployeePortal/staff-change-profile';
    return await api.post<{ messag: string; success: boolean }>('portal', url, data);
}
