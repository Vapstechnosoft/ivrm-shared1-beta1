'use server';

import { api } from '@/lib/apiService';
import type { FeeClassCategoryReportList } from '@/types/fees/reports/reports';

export async function getFeeClassCategory(asmayId: number, type: number) {
    const url = `/ClassCategoryReportFacade/get-class-category-report?asmay_id=${asmayId}&type=${type}`;
    return await api.get<FeeClassCategoryReportList[]>('fees', url);
}
