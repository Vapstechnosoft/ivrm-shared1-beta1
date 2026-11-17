'use server';

import { api } from '@/lib/apiService';
import type { IOnlinePaymentStudenyInformationList } from '@/types/student-portal/masters/fee_online_payment';

export async function geStudentInformation(): Promise<IOnlinePaymentStudenyInformationList> {
    const url = '/OnlinePayment/student-information';

    const res = await api.get<any>('portal', url);

    return res.data || ({} as IOnlinePaymentStudenyInformationList);
}

export async function getGroupList() {
    const url = '/OnlinePayment/group-list';
    const response = await api.get<any>('portal', url);
    return response.data?.data || [];
}
