'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';

const extractData = (res: any, key?: string) => {
    if (!res) return [];
    const data = res.data ?? res;
    if (key && data[key]) {
        if (Array.isArray(data[key])) return data[key];
        if (data[key].$values) return data[key].$values;
    }
    if (Array.isArray(data)) return data;
    if (data.$values) return data.$values;
    return [];
};

export async function getPaymentModes() {
    const url = `/INV_VendorPaymentFacade/loadPaymentModes`;
    try {
        const response = await api.get<any>('inventory', url);
        return {
            success: response.success ?? true,
            data: extractData(response, 'data')
        };
    } catch (error) {
        console.error("Error fetching Payment Modes:", error);
        return { success: false, data: [] };
    }
}

export async function getSuppliers() {
    const url = `/INV_T_GRNFacade/loadsuppliers`;
    try {
        const response = await api.get<any>('inventory', url);
        return {
            success: response.success ?? true,
            data: extractData(response, 'data')
        };
    } catch (error) {
        console.error("Error fetching Suppliers:", error);
        return { success: false, data: [] };
    }
}

export async function getInvVendorPaymentLoadData(searchParams?: ApiSearchparams) {
    // Assuming pageid = 2 as per angular code, but usually passed via searchParams or handled by backend
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    // Angular used pageid=2 in getURI. The backend might expect it in route or query.
    // getURI(url, id) usually constructs url/id.
    // So `INV_VendorPayment/getloaddata/2`
    const url = `/INV_VendorPayment/getloaddata/2`;

    try {
        const response = await api.get<any>('inventory', url);
        return {
            success: response.success ?? true, // Angular code doesn't explicitly check success property on getURI usually
            data: {
                get_supplier: extractData(response, 'get_supplier'),
                get_paymentMode: extractData(response, 'get_paymentMode'),
                get_vendorpayment: extractData(response, 'get_vendorpayment'),
                total: response.total || extractData(response, 'get_vendorpayment').length
            }
        };
    } catch (error) {
        console.error("Error fetching Vendor Payment load data:", error);
        return {
            success: false,
            data: {
                get_supplier: [],
                get_paymentMode: [],
                get_vendorpayment: [],
                total: 0
            }
        };
    }
}

export async function getInvVendorPaymentGRNDetails(invmS_Id: number, invmgrN_Id?: number) {
    // Controller signature: getGRNdetail(long INVMS_Id, long INVMGRN_Id)
    // This expects query parameters.
    const url = `/INV_VendorPaymentFacade/getGRNdetail?INVMS_Id=${invmS_Id}&INVMGRN_Id=${invmgrN_Id || 0}`;

    try {
        const response = await api.get<any>('inventory', url);
        return {
            success: true,
            data: {
                get_GRNpayment: extractData(response, 'data')
            }
        };
    } catch (error) {
        console.error("Error fetching GRN details:", error);
        return { success: false, data: { get_SuplierGRNno: [], get_GRNpayment: [] } };
    }
}



export async function saveInvVendorPayment(data: any) {
    console.log("saveInvVendorPayment: Received data:", JSON.stringify(data, null, 2));

    // Updated to match the working API endpoint provided by the user
    const url = `/INV_VendorPaymentFacade/saveVendorPayment`;

    // Transform data to match the DTO expected by the backend
    // Removing injected MI_Id and UserId to match the user's provided working JSON example perfectly.
    // If the backend needs them, they might be extracted from the token or the DTO doesn't require them explicitly in this payload.
    const payload = {
        INVSPT_Id: data.invspT_Id || 0,
        INVMS_Id: data.invmS_Id,
        INVSPT_PaymentDate: data.invspT_PaymentDate ? new Date(data.invspT_PaymentDate).toISOString() : null,
        INVSPT_ModeOfPayment: data.invspT_ModeOfPayment,
        INVSPT_PaymentReference: data.invspT_PaymentReference,
        INVSPT_ChequeDDNo: data.invspT_ChequeDDNo,
        INVSPT_BankName: data.invspT_BankName,
        INVSPT_ChequeDDDate: data.invspT_ChequeDDDate ? new Date(data.invspT_ChequeDDDate).toISOString() : null,
        INVSPT_Amount: data.invspT_Amount,
        INVSPT_Remarks: data.invspT_Remarks,
        paymentArray: data.paymentArray?.map((p: any) => ({
            INVSPTGRN_Id: p.invsptgrN_Id || 0,
            INVMGRN_Id: p.invmgrN_Id,
            INVSPTGRN_Amount: p.invsptgrN_Amount,
            INVSPTGRN_Remarks: p.invsptgrN_Remarks,
            INVMGRN_TotalPaid: p.invmgrN_TotalPaid,
            INVMGRN_TotalBalance: p.invmgrN_TotalBalance,
            INVMGRN_PurchaseValue: p.invmgrN_PurchaseValue
        })) || []
    };

    console.log("Saving Vendor Payment Payload:", JSON.stringify(payload, null, 2));

    try {
        const response = await api.post<any>('inventory', url, payload);
        return {
            success: response.success === true,
            message: response.message || (response.success ? 'Record saved successfully' : 'Failed to save record')
        };
    } catch (error: any) {
        console.error("Error saving Vendor Payment:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
        // Try to extract validation errors if any
        let errorMsg = error.response?.data?.message || error.message || 'An error occurred while saving';
        if (error.response?.data?.errors) {
            errorMsg += ': ' + JSON.stringify(error.response.data.errors);
        } else if (typeof error.response?.data === 'string') {
            errorMsg += ': ' + error.response.data;
        }

        return {
            success: false,
            message: errorMsg
        };
    }
}

export async function deactivateInvVendorPayment(invspT_Id: number) {
    const url = `/INV_VendorPaymentFacade/deactiveVendorPayment?INVSPT_Id=${invspT_Id}`;
    try {
        const response = await api.post<any>('inventory', url, {});
        return {
            success: response.returnval === true || response.success === true,
            message: response.message || (response.returnval === true ? 'Status updated successfully' : 'Failed to update status')
        };
    } catch (error) {
        console.error("Error deactivating Vendor Payment:", error);
        return { success: false, message: 'An error occurred' };
    }
}

export async function getInvVendorPaymentModelDetails(invspT_Id: number) {
    const url = `/INV_VendorPayment/getmodeldetail`;
    const payload = { INVSPT_Id: invspT_Id };
    try {
        const response = await api.post<any>('inventory', url, payload);
        return {
            success: true,
            data: extractData(response, 'get_modeldetails')
        };
    } catch (error) {
        console.error("Error fetching model details:", error);
        return { success: false, data: [] };
    }
}

export async function getInvGRNItemDetails(invmgrN_Id: number) {
    const url = `/INV_T_GRN/get_GRNitemDetails`;
    const payload = { INVMGRN_Id: invmgrN_Id };
    try {
        const response = await api.post<any>('inventory', url, payload);
        return {
            success: true,
            data: extractData(response, 'get_GRNItemDetails')
        };
    } catch (error) {
        console.error("Error fetching GRN Item details:", error);
        return { success: false, data: [] };
    }
}
export async function loadVendorPayments(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    // Append defaults if needed, though they might be handled by token
    const url = `/INV_VendorPaymentFacade/loadVendorPayments?${urlParams}&MI_Id=0&ASMAY_Id=0`;

    try {
        const response = await api.get<any>('inventory', url);
        return {
            success: response.success ?? true,
            data: extractData(response, 'data'),
            total: response.total ?? 0,
            page: response.page ?? 1,
            page_size: response.page_size ?? 10
        };
    } catch (error) {
        console.error("Error loading Vendor Payments:", error);
        return { success: false, data: [], total: 0 };
    }
}

export async function getGRNList(invmS_Id: number) {
    const url = `/INV_VendorPaymentFacade/getGRNList?INVMS_Id=${invmS_Id}`;
    try {
        const response = await api.get<any>('inventory', url);
        return {
            success: response.success ?? true,
            data: extractData(response, 'data')
        };
    } catch (error) {
        console.error("Error fetching GRN List:", error);
        return { success: false, data: [] };
    }
}

export async function getGRNDetail(invmS_Id: number, invmgrN_Id: number) {
    // Updated to use GET and query params matching the C# controller
    const url = `/INV_VendorPaymentFacade/getGRNdetail?INVMS_Id=${invmS_Id}&INVMGRN_Id=${invmgrN_Id}`;

    try {
        const response = await api.get<any>('inventory', url);
        return {
            success: response.success ?? true,
            data: extractData(response, 'data') // User confirmed data is in 'data' property
        };
    } catch (error) {
        console.error("Error fetching GRN detail:", error);
        return { success: false, data: [] };
    }
}


