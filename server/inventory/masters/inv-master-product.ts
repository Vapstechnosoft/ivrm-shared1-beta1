'use server';

import { api } from '@/lib/apiService';
import { unstable_noStore as noStore } from 'next/cache';
import { headers } from 'next/headers';

// Matches: apiService.getURI("INV_MasterProduct/getloaddata", pageid)
export async function getInvMasterProductLoadData(searchParams: any) {
    noStore();
    headers(); // Opt into dynamic rendering to ensure token availability
    let url = `/INV_MasterProductFacade/GetProductList`;
    if (searchParams) {
        const queryString = new URLSearchParams(searchParams).toString();
        url += `?${queryString}`;
    }

    try {
        const loadDataResponse = await api.get<any>('inventory', url);
        return loadDataResponse || {};
    } catch (error) {
        console.error("Error loading product data", error);
        return {};
    }
}

export async function getInvMasterProductList() {
    noStore();
    headers();
    try {
        const url = `/INV_MasterProductFacade/LoadProductList?t=${Date.now()}`;
        const res = await api.get<any>('inventory', url);
        return res;
    } catch (error) {
        console.error("Error fetching product list:", error);
        return {};
    }
}

export async function getInvMasterItemList() {
    noStore();
    headers();
    try {
        const url = `/INV_MasterProductFacade/LoadItemList?t=${Date.now()}`;
        const res = await api.get<any>('inventory', url);
        return res;
    } catch (error) {
        console.error("Error fetching item list:", error);
        return {};
    }
}

export async function getInvMasterProductItemList(searchParams: any) {
    noStore();
    let url = `/INV_MasterProductFacade/GetProductItemList`;
    if (searchParams) {
        const queryString = new URLSearchParams(searchParams).toString();
        url += `?${queryString}`;
    }
    return await api.get<any>('inventory', url);
}

export async function saveInvMasterProduct(data: any) {
    const url = `/INV_MasterProductFacade/SaveProductDetails`;
    return await api.post<any>('inventory', url, data);
}

export async function saveInvMasterProductQty(data: any) {
    const url = `/INV_MasterProductFacade/SaveProductItemQtyDetails`;
    return await api.post<any>('inventory', url, data);
}

export async function deactiveInvMasterProduct(data: any) {
    const url = `/INV_MasterProductFacade/deactive`;
    return await api.post<any>('inventory', url, data);
}

export async function deactiveInvMasterProductQty(data: any) {
    const url = `/INV_MasterProductFacade/deactiveQty`;
    return await api.post<any>('inventory', url, data);
}

export async function getInvMasterProductTax(data: { INVMP_Id: number }) {
    const url = `/INV_MasterProductFacade/productTax?INVMP_Id=${data.INVMP_Id}`;
    return await api.get<any>('inventory', url);
}

export async function deactiveInvMasterProductTax(data: any) {
    const url = `/INV_MasterProductFacade/deactiveptax`;
    return await api.post<any>('inventory', url, data);
}

export async function getInvMasterTaxList() {
    const url = `/INV_MasterItemFacade/get_taxlist`;
    return await api.post<any>('inventory', url, {});
}
