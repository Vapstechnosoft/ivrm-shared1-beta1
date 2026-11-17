
'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import { IInvRSalesEntity, IInvRSalesPayload, IInvRSalesReportData } from '@/types/inventory/reports/inv-r-sales';

// MOCK DATA

// Mocks removed

export async function getInvRSalesLoadData() {
    try {
        const response = await api.post<any>('inventory', '/INV_R_SalesFacade/getloaddata', {});
        return {
            success: true,
            data: response.data
        };
    } catch (e) {
        console.error(e);
        return { success: false, data: {} };
    }
}

export async function getInvRSalesDetails(optionflag: string) {
    if (!optionflag) return { success: true, data: { get_salesdetails: [] } };

    const url = `/INV_R_SalesFacade/mainradiochange?type=${optionflag}`;

    try {
        const response = await api.get<any>('inventory', url);

        let rawData = response.data;
        if (rawData && rawData.$values) rawData = rawData.$values;
        if (!Array.isArray(rawData)) rawData = [];

        let mappedData = rawData;

        if (optionflag === 'Item') {
            mappedData = rawData.map((item: any) => ({
                invmI_Id: item.id ?? item.invmI_Id,
                invmI_ItemName: item.name ?? item.invmI_ItemName,
                ...item
            }));
        } else if (optionflag === 'Staff') {
            mappedData = rawData.map((item: any) => ({
                hrmE_Id: item.id ?? item.hrmE_Id,
                employeename: item.name ?? item.employeename,
                ...item
            }));
        } else if (optionflag === 'Customer') {
            mappedData = rawData.map((item: any) => ({
                invmC_Id: item.id ?? item.invmC_Id,
                invmC_CustomerName: item.name ?? item.invmC_CustomerName,
                ...item
            }));
        } else if (optionflag === 'Saleno') {
            mappedData = rawData.map((item: any) => ({
                invmsL_Id: item.id ?? item.invmsL_Id,
                invmsL_SalesNo: item.name ?? item.invmsL_SalesNo,
                ...item
            }));
        } else if (optionflag === 'Student') {
            mappedData = rawData.map((item: any) => ({
                amsT_Id: item.id ?? item.amsT_Id,
                studentname: item.name ?? item.studentname,
                amsT_AdmNo: item.code ?? item.amsT_AdmNo ?? '',
                ...item
            }));
        }

        return {
            success: true,
            data: {
                get_salesdetails: mappedData
            }
        };
    } catch (error) {
        console.error("Error fetching details:", error);
        return {
            success: false,
            data: {
                get_salesdetails: []
            }
        };
    }
}

export async function getInvRSalesClassData() {
    try {
        const response = await api.post<any>('inventory', '/INV_R_SalesFacade/radiochange', { type: 'C' });
        return {
            success: true,
            data: response.data
        };
    } catch (e) {
        console.error(e);
        return { success: false, data: {} };
    }
}

export async function getInvRSalesStudentList(payload: any) {
    try {
        const response = await api.post<any>('inventory', '/INV_R_SalesFacade/getStudentlist', payload);
        return {
            success: true,
            data: response.data
        };
    } catch (e) {
        console.error(e);
        return { success: false, data: {} };
    }
}

export async function getInvRSalesReport(payload: IInvRSalesPayload, searchParams?: any) {
    const params = {
        typeflag: payload.typeflag,
        ...searchParams
    };
    // Ensure we don't duplicate keys if payload has them, but searchParams take precedence for pagination

    const urlParams = getSearchParamsUrl(params);
    const url = `/INV_R_SalesFacade/onreport?${urlParams}`;

    // Map payload keys to match backend expectation
    // Map payload keys to match backend expectation
    const apiPayload: any = {
        ...payload,
        selectionflag: payload.individualflag,
        studentid: payload.singleStudentId ? payload.singleStudentId.toString() : payload.studentid,
        hrme_id: payload.singleStaffId ? payload.singleStaffId.toString() : payload.hrme_id,
        invmc_id: payload.singleCustomerId ? payload.singleCustomerId.toString() : payload.invmc_id,
        // Make sure arrays are initialized if undefined
        salenoarray: payload.salesArray || payload.salenoarray || [],
        itemArray: payload.itemArray || [],
        clsarray: payload.studentArray || [],
    };

    // Remove keys that are not expected by the backend
    delete apiPayload.studentArray;
    delete apiPayload.individualflag;
    delete apiPayload.singleStudentId;
    delete apiPayload.singleStaffId;
    delete apiPayload.singleCustomerId;

    try {
        const response = await api.post<any>('inventory', url, apiPayload);

        let data = response.data;
        if (data && data.$values) data = data.$values; // Handle $values if present
        if (!Array.isArray(data)) data = [];

        return {
            success: response.success ?? true,
            data: {
                get_SalesReport: data
            },
            total: response.total ?? data.length ?? 0,
            page: response.page ?? 1,
            page_size: response.page_size ?? 10,
            message: response.message || 'Report generated successfully'
        };
    } catch (error: any) {
        console.error("Report Error:", error);
        return {
            success: false,
            data: {
                get_SalesReport: []
            },
            message: error.message || 'Failed'
        };
    }
}
