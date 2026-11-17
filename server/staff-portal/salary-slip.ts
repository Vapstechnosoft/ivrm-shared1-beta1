
'use server';

import { api } from '@/lib/apiService';
import type {
    ISalarySlipInitialData,
    ISalarySlipRequest,
    ISalarySlipResponse
} from '@/types/staff-portal/salary-slip';

/**
 * Get initial details for salary slip (Month/Year dropdowns)
 */
export async function getInitialSalarySlipData() {
    const url = '/SalarySlip/getalldetails/2';
    return await api.get<ISalarySlipInitialData>('portal', url);
}

/**
 * Generate employee salary slip
 */
export async function generateSalarySlip(data: ISalarySlipRequest) {
    const url = '/SalarySlip/GenerateEmployeeSalarySlip';
    return await api.post<ISalarySlipResponse>('portal', url, data);
}
