'use server';

import { api } from '@/lib/apiService';

export async function getFeeOnlinePaymentLoadData(data: any) {
    try {
        return await api.post('portal', '/OnlinePayment/getdetails', data);
    } catch (error) {
        console.error('Error fetching fee online payment data:', error);

        return {
            success: true
        };
    }
}
