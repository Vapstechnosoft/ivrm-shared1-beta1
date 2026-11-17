'use server';

import { api } from '@/lib/apiService';
import { IInvVendorPaymentReportPayload, IInvVendorPaymentDetailsPayload } from '@/types/inventory/reports/inv-r-vendor-payment';

export async function getInvVendorPaymentReport(payload: IInvVendorPaymentReportPayload, searchParams?: any) {
    let url = `/INV_VendorPayment_ReportFacade/onreport`;

    if (searchParams) {
        const queryString = new URLSearchParams(searchParams).toString();
        url += `?${queryString}`;
    }

    try {
        const response = await api.post<any>('inventory', url, payload);

        // API might return the body directly or wrapped in axios response
        // Check for 'total' in various possible locations
        let total = 0;
        let data = [];

        // Scenario 1: response is the body, containing data array and total
        if (response.total !== undefined) {
            total = response.total;
        }
        // Scenario 2: response.data is the body (Axios wrapper)
        else if (response.data && response.data.total !== undefined) {
            total = response.data.total;
        }

        // Data extraction
        const possibleBody = response.data || response;

        if (Array.isArray(possibleBody.data)) {
            data = possibleBody.data;
        } else if (Array.isArray(possibleBody)) {
            data = possibleBody;
        } else if (possibleBody.get_overallpayment) {
            data = payload.reporttype === "Overall" ? possibleBody.get_overallpayment : possibleBody.get_vendorpayment;
            // If legacy structure has total
            if (total === 0 && possibleBody.total) total = possibleBody.total;
        } else {
            // Fallback if data is inside get_overallpayment/get_vendorpayment but deeply nested or named differently?
            // Based on user feedback, data is in 'data' array standard format now.
            data = [];
        }

        return {
            success: true,
            data: data,
            total: total || (Array.isArray(data) ? data.length : 0),
            page: response.page || (response.data && response.data.page),
            page_size: response.page_size || (response.data && response.data.page_size),
            message: 'Report generated successfully'
        };
    } catch (error: any) {
        console.error("Error generating Vendor Payment Report:", error);
        return {
            success: false,
            data: [],
            total: 0,
            message: error.response?.data?.message || error.message || 'Failed to generate report'
        };
    }
}

export async function getInvVendorDetails(payload: IInvVendorPaymentDetailsPayload) {
    const url = `/INV_VendorPayment_ReportFacade/getvendordetail`;
    try {
        const response = await api.post<any>('inventory', url, payload);
        return {
            success: true,
            data: response.data || response,
            message: 'Details fetched successfully'
        };
    } catch (error: any) {
        console.error("Error fetching vendor details:", error);
        return {
            success: false,
            data: null,
            message: error.response?.data?.message || error.message || 'Failed to fetch details'
        };
    }
}
