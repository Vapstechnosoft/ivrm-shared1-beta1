'use server';

import { api } from '@/lib/apiService';
import { auth } from '@/lib/auth';
import type { IAlumniDonationLoadResponse, IPaymentGatewayDetails } from '@/types/alumni/alumni-donation';

export async function getAlumniDonationLoadData() {
    const url = '/AlumniDonation/page_load';
    return await api.post<IAlumniDonationLoadResponse>('alumni', url, {});
}

export async function getAlumniDonationData() {
    const url = '/AlumniDonation/getdata_donation';
    return await api.get<IAlumniDonationLoadResponse>('alumni', url);
}

export async function getDonationAmount(data: { almdoN_Id: number }) {
    const url = `/AlumniDonation/get_amount?ALMDON_Id=${data.almdoN_Id}`;
    return await api.get<any>('alumni', url);
}

export async function getPaymentDetails(data: {
    mI_Id?: number;
    fpgD_PGName: string;
    ALMDON_Amount: number;
    ALMST_FirstName: string;
    ALMST_Id: number;
}) {
    const session = await auth();
    const mi_id = data.mI_Id || (session as any)?.mi_id || 0;
    const url = `/AlumniDonation/getpayment_details?MI_Id=${mi_id}&fpgD_PGName=${data.fpgD_PGName}&ALMDON_Amount=${data.ALMDON_Amount}&ALMST_FirstName=${data.ALMST_FirstName}&ALMST_Id=${data.ALMST_Id}`;
    return await api.get<IPaymentGatewayDetails>('alumni', url);
}

export async function saveDonationPayment(data: any) {
    const session = await auth();
    const mi_id = data.MI_Id || (session as any)?.mi_id || 0;
    const url = '/AlumniDonation/paymentsave'; // Legacy endpoint
    return await api.post<any>('alumni', url, { ...data, MI_Id: mi_id });
}

export async function getDonationReport(data: { mI_Id: number; fromdate: string | Date; todate: string | Date }) {
    const url = '/AlumniDonation/getdonationreport';
    return await api.post<any>('alumni', url, data);
}
