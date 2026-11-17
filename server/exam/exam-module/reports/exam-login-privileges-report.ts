'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';

// 🔹 Exam Login Privileges Report Submit

export async function getExamLoginPrivilagesReport(
    data: {
        ASMAY_Id: number;
        EMCA_Id: number;
        ASMCL_Id?: number | null;
        ASMS_Id?: number | null;
        HRME_Id?: number | null;
        report_type: string;
        check_type: string;
    },
    apiSearchParams?: ApiSearchparams
) {
    const urlParams = getSearchParamsUrl(apiSearchParams ?? {});
    const url = `/exam_login_privilages_report?${urlParams}`;

    // 🔹 POST request (MI_Id comes from token at backend)
    const response = await api.post<any>('exam', url, data);

    return response;
}
