'use server';

import { api } from '@/lib/apiService';
import type { IMasterTransactionNumberingList } from '@/types/admission/preadmission/configaration';

export async function getRegistrationNumbering() {
    const url = '/transaction_numbering/Registration';
    return await api.get<IMasterTransactionNumberingList[]>('preadmission', url);
}

export async function getPreRegistrationNumbering() {
    const url = '/transaction_numbering/PreRegistration';
    return await api.get<IMasterTransactionNumberingList[]>('preadmission', url);
}

export async function addOrUpdateTransactionNumbering(data: any) {
    const url = 'transaction_numbering';
    return await api.post<any>('preadmission', url, data);
}
