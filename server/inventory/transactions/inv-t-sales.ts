'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IInvTSales, IInvTSalesLoadData } from '@/types/inventory/transactions/inv-t-sales';

const MOCK_SALES_DATA: IInvTSales[] = Array.from({ length: 20 }, (_, i) => ({
    invmsL_Id: i + 1,
    invmsL_SalesNo: `SALES-${2024000 + i + 1}`,
    invmsL_SalesDate: new Date(2024, 0, i + 1).toISOString(),
    invmsL_SalesValue: 2000 + (i * 200),
    invmsL_TotDiscount: 50 + (i * 5),
    invmsL_TotTaxAmt: 100 + (i * 10),
    invmsL_TotalAmount: 2150 + (i * 215),
    invmsL_Remarks: `Mock Sales record ${i + 1}`,
    invmsL_StuOtherFlg: i % 3 === 0 ? 'Student' : (i % 3 === 1 ? 'Staff' : 'Customer'),
    invmsT_Id: 1,
    invmS_StoreName: 'Main Store',
    invmsL_ActiveFlg: true,
    studentName: i % 3 === 0 ? `Student ${i + 1}` : undefined,
    employeeName: i % 3 === 1 ? `Staff ${i + 1}` : undefined,
    customerName: i % 3 === 2 ? `Customer ${i + 1}` : undefined,
}));

export async function getInvTSalesLoadData(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/INV_T_SalesFacade/loadSales?${urlParams}`;

    try {
        const response = await api.get<any>('inventory', url);

        // Robust extraction logic
        const extractData = (res: any, key?: string) => {
            if (!res) return [];
            if (key && res.data?.[key] && Array.isArray(res.data[key])) return res.data[key];
            if (key && res[key] && Array.isArray(res[key])) return res[key];
            if (Array.isArray(res.data)) return res.data; // Matches user's structure: { data: [...] }
            if (Array.isArray(res)) return res;
            if (res.data?.$values) return res.data.$values;
            return [];
        };

        const rawSales = extractData(response); // Will grab response.data
        const salesList = rawSales.map((item: any) => {
            return {
                ...item,
                // Ensure explicit boolean
                invmsL_ActiveFlg: item.invmsL_ActiveFlg === true
            };
        });

        return {
            success: true,
            data: {
                get_Sale: salesList,
                total: response.total || salesList.length,
                // These other lists seem not present in the new API based on the snippet, 
                // but keeping empty arrays or extracting if present to prevent undefined errors
                get_Store: extractData(response, 'get_Store'),
                get_Product: extractData(response, 'get_Product'),
                get_employee: extractData(response, 'get_employee'),
                get_customer: extractData(response, 'get_customer'),
                get_item: extractData(response, 'get_item')
            }
        };

    } catch (error) {
        console.error('Error fetching Sales load data:', error);
        return {
            success: false,
            data: {
                get_Sale: [],
                total: 0,
                get_Store: [],
                get_Product: [],
                get_employee: [],
                get_customer: [],
                get_item: []
            }
        };
    }
}

export async function saveInvTSalesDetails(data: any) {
    const url = `/INV_T_SalesFacade/savedetails`;

    // Robustly check for ASMS_Id in data object if it exists with different casing
    let sectionId = data.asmS_Id || data.ASMS_Id || data.asms_Id || data.ASMCL_Id_Section || 0;

    // Fallback: If Section ID is missing for Student, try to fetch it
    if (data.invmsL_StuOtherFlg === 'Student' && (!sectionId || sectionId == 0) && data.amsT_Id) {
        try {
            console.log("Attempting fallback fetch for Section ID for student:", data.amsT_Id);
            const res = await getStudentClsSec('I');
            const students = Array.isArray(res) ? res : (res.data ? res.data : []);
            const student = Array.isArray(students) ? students.find((s: any) => (s.amsT_Id == data.amsT_Id || s.AMST_Id == data.amsT_Id)) : null;
            if (student) {
                const foundSectionId = student.asmS_Id || student.ASMS_Id || 0;
                if (foundSectionId > 0) {
                    sectionId = foundSectionId;
                    console.log(`Fallback successful. Found Section ID: ${sectionId}`);
                }
            } else {
                console.log("Fallback student not found in list.");
            }
        } catch (error) {
            console.error("Error in fallback fetch for Section ID:", error);
        }
    }

    const payload = {
        ...data,
        INVMST_Id: data.invmsT_Id,
        INVMP_Id: 0,
        INVMSL_StuOtherFlg: data.invmsL_StuOtherFlg,
        INVMSL_SalesNo: data.invmsL_SalesNo,
        INVMSL_SalesDate: data.invmsL_SalesDate,
        INVMSL_SalesValue: data.invmsL_SalesValue,
        INVMSL_TotDiscount: data.invmsL_TotDiscount,
        INVMSL_TotTaxAmt: data.invmsL_TotTaxAmt,
        INVMSL_TotalAmount: data.invmsL_TotalAmount,
        INVMSL_CreditFlg: false,
        INVMSL_ActiveFlg: true,
        ASMAY_Id: 0,

        // Map conditional IDs
        HRME_Id: data.invmsL_StuOtherFlg === 'Staff' ? data.hrmE_Id : 0,
        INVMC_Id: data.invmsL_StuOtherFlg === 'Customer' ? data.invmC_Id : 0,

        // Create studentlist array
        studentlist: data.invmsL_StuOtherFlg === 'Student' ? [{
            AMST_Id: data.amsT_Id,
            ASMCL_Id: data.asmcL_Id,
            ASMS_Id: sectionId
        }] : [],

        // Map Items and nested Taxes
        SaleItem: data.SaleItem?.map((item: any) => ({
            INVMI_Id: item.invmI_Id,
            INVMUOM_Id: item.invmuoM_Id,
            INVTSL_BatchNo: item.invtsL_BatchNo,
            INVTSL_SalesQty: item.invtsL_SalesQty,
            INVTSL_SalesPrice: item.invtsL_SalesPrice,
            INVTSL_TaxAmt: item.invtsL_TaxAmt,
            INVTSL_DiscountAmt: item.invtsL_DiscountAmt,
            INVTSL_Amount: item.invtsL_Amount,
            INVTSL_Naration: item.invtsL_Naration || '',

            // Map Taxes to lowercase 'saleItemTax' as per C# DTO usage (item.saleItemTax)
            saleItemTax: (item.SalesItemTax || []).map((tax: any) => ({
                INVMT_Id: tax.invmT_Id,
                INVTSLT_TaxPer: tax.invtslT_TaxPer,
                INVTSLT_TaxAmt: tax.invtslT_TaxAmt
            }))
        })) || []
    };

    return await api.post<any>('inventory', url, payload);
}

export async function deleteInvTSales(data: any) {
    const url = `/INV_T_Sales/deactive`; // The angular code uses 'deactive' for delete/active toggle logic often, but checks flag. 
    // Actually Angular code has `deactive` function calling `INV_T_Sales/deactive`.
    // And there's no explicit delete. Usually deactive serves as soft delete.
    return await api.post<any>('inventory', url, data);
}

export async function toggleInvTSalesActive(data: any) {
    const url = `/INV_T_SalesFacade/deactiveS?id=${data.invmsL_Id}`;
    return await api.post<any>('inventory', url, {});
}

export async function getInvTSalesItemDetails(invmsL_Id: number, saletype: string) {
    const data = { INVMSL_Id: invmsL_Id, saletype: saletype };
    const url = `/INV_T_Sales/getSaleItemDetails`;
    return await api.post<any>('inventory', url, data);
}

export async function getStudentClsSec(type: string) {
    const url = `/INV_T_SalesFacade/getStudentClsSec?type=${type}`;
    return await api.get<any>('inventory', url);
}

export async function getStudentList(data: any) {
    const params = new URLSearchParams();
    if (data.ASMCL_Id) params.append('ASMCL_Id', data.ASMCL_Id.toString());
    if (data.ASMS_Id) params.append('ASMS_Id', data.ASMS_Id.toString());
    if (data.type) params.append('type', data.type);

    // Fallback: older code might send body. Trying Facade GET pattern.
    const url = `/INV_T_SalesFacade/getStudentlist?${params.toString()}`;
    return await api.get<any>('inventory', url);
}

export async function getSectionList(data: any) {
    const url = `/INV_T_SalesFacade/getsectionlist?ASMCL_Id=${data.ASMCL_Id}`;
    return await api.get<any>('inventory', url);
}

export async function getItemOnStoreChange(data: any) {
    const params = new URLSearchParams();
    if (data.INVMST_Id) params.append('INVMST_Id', data.INVMST_Id.toString());
    if (data.AMST_Id) params.append('AMST_Id', data.AMST_Id.toString());
    if (data.INVC_LIFOFIFOFlg) params.append('INVC_LIFOFIFOFlg', data.INVC_LIFOFIFOFlg);

    // Allow passing other params if needed
    Object.keys(data).forEach(key => {
        if (!['INVMST_Id', 'AMST_Id', 'INVC_LIFOFIFOFlg'].includes(key) && data[key]) {
            params.append(key, data[key].toString());
        }
    });

    const url = `/INV_T_SalesFacade/getitem?${params.toString()}`;
    return await api.get<any>('inventory', url);
}

export async function getItemDetail(data: any) {
    const params = new URLSearchParams();
    Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
            params.append(key, data[key].toString());
        }
    });
    // URL points to Facade as per user request
    const url = `/INV_T_SalesFacade/getitemDetail?${params.toString()}`;
    return await api.get<any>('inventory', url);
}

export async function getInvTSalesEmployees() {
    const url = `/INV_T_SalesFacade/loadEmployees`;
    return await api.get<any>('inventory', url);
}

export async function getInvTSalesCustomers() {
    const url = `/INV_T_SalesFacade/loadCustomers`;
    return await api.get<any>('inventory', url);
}

export async function getInvTSalesStores() {
    const url = `/INV_T_SalesFacade/loadStores`;
    return await api.get<any>('inventory', url);
}

export async function getSaleItemDetails(invmsL_Id: number) {
    const url = `/INV_T_SalesFacade/getSaleItemDetails?INVMSL_Id=${invmsL_Id}`;
    return await api.get<any>('inventory', url);
}

export async function getSaletypes(invmsL_Id: number, saletype: string) {
    const url = `/INV_T_SalesFacade/getSaletypes?INVMSL_Id=${invmsL_Id}&saletype=${saletype}`;
    return await api.get<any>('inventory', url);
}
