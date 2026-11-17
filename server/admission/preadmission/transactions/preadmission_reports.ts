'use server';

import { api } from '@/lib/apiService';
import type { IPreadmissionStatusCountReport } from '@/types/admission/preadmission/transactions';

export async function getPreadmissionStatusCountReport() {
    const url = '/preadmission_reports/preadmission_status_count_report';

    return await api.get<IPreadmissionStatusCountReport>('preadmission', url);
}
