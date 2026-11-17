'use server';

import { api } from '@/lib/apiService';

/**
 * ESI Report Request
 */
export interface ESIReportRequest {
    hreS_Year: string;
    hreS_Month: string;
    designationselected: number[];
    departmentselected: number[];
    groupTypeselected: number[];
    MI_Id: number;
}

/**
 * Fetch ESI Report Data
 */
export async function getESIReport(data: ESIReportRequest) {
    try {
        const response = await api.post<any>('hrms', '/api/ReportESI/get_employee_details_by_selection', data, { timeout: 120000 });
        if (response.success) return { success: true, data: response.data };
        return { success: false, message: response.message };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

/**
 * PF Form 10 Request
 */
export interface PFForm10Request {
    hreS_Month: string;
    hreS_Year: number;
}

/**
 * Fetch PF Form 10 Data
 */
export async function getPFForm10(data: PFForm10Request) {
    try {
        const response = await api.post<any>('hrms', '/api/ReportPFForm10/_get_employee_details_by_selection', data);
        if (response.success) return { success: true, data: response.data };
        return { success: false, message: response.message };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

/**
 * PF Form 5 Request
 */
export interface PFForm5Request {
    hreS_Month: string;
    hreS_Year: string;
}

/**
 * Fetch PF Form 5 Data
 */
export async function getPFForm5(data: PFForm5Request) {
    try {
        const response = await api.post<any>('hrms', '/api/ReportPFForm5/get_employee_details_by_selection', data);
        if (response.success) return { success: true, data: response.data };
        return { success: false, message: response.message };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

/**
 * PF Challan Request
 */
export interface PFChallanRequest {
    hreS_Month: string;
    hreS_Year: string;
}

/**
 * Fetch PF Challan Data
 */
export async function getPFChallan(data: PFChallanRequest) {
    try {
        const response = await api.post<any>('hrms', '/api/ReportPFChallen/report_pf_challan', data);
        if (response.success) return { success: true, data: response.data };
        return { success: false, message: response.message };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

/**
 * PF Form 6A Request
 */
export interface PFForm6ARequest {
    fromDate: string;
    toDate: string;
}

/**
 * Fetch PF Form 6A Data
 */
export async function getPFForm6A(data: PFForm6ARequest) {
    try {
        const response = await api.post<any>('hrms', '/api/ReportPFForm6A/report_pf_form_6a', data, { timeout: 120000 });
        if (response.success) return { success: true, data: response.data };
        return { success: false, message: response.message };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
