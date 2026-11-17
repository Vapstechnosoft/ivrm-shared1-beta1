'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IInvMasterCustomer } from '@/types/inventory/masters/inv-master-customer';

export async function getInvMasterCustomer(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/INV_MasterCustomerFacade/getloaddata?${urlParams}`;

    try {
        const response: any = await api.get<any>('inventory', url);

        if (response.success === false && response.total === 0) {
            return {
                success: true,
                data: {
                    get_customer: [],
                    total: 0
                },
                message: response.message
            };
        }

        // User response structure direct data array
        const rawData = response.data || [];

        const customers: IInvMasterCustomer[] = (Array.isArray(rawData) ? rawData : []).map((item: any) => ({
            invmC_Id: item.invmC_Id,
            invmC_CustomerName: item.invmC_CustomerName,
            invmC_CustomerContactPerson: item.invmC_CustomerContactPerson,
            invmC_CustomerContactNo: item.invmC_CustomerContactNo?.toString() || '',
            invmC_CustomerAddress: item.invmC_CustomerAddress,
            invmC_ActiveFlg: item.invmC_ActiveFlg
        }));

        return {
            success: true,
            data: {
                get_customer: customers,
                total: response.total || customers.length
            }
        };

    } catch (error) {
        console.error('getInvMasterCustomer: Error', error);
        return {
            success: false,
            data: { get_customer: [], total: 0 }
        };
    }
}

export async function saveInvMasterCustomer(data: any) {
    const payload = {
        invmC_Id: data.invmC_Id,
        invmC_CustomerName: data.invmC_CustomerName,
        invmC_CustomerContactPerson: data.invmC_CustomerContactPerson,
        invmC_CustomerContactNo: Number(data.invmC_CustomerContactNo),
        invmC_CustomerAddress: data.invmC_CustomerAddress,
        invmC_ActiveFlg: data.invmC_ActiveFlg ?? true
    };

    const url = `/INV_MasterCustomerFacade/savedetails`;
    return await api.post<any>('inventory', url, payload);
}

export async function deactivateInvMasterCustomer(data: IInvMasterCustomer) {
    const url = `/INV_MasterCustomerFacade/deactive?id=${data.invmC_Id}`;
    return await api.get<any>('inventory', url);
}
