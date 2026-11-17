'use server';

import { api } from '@/lib/apiService';
import type { ITransactionCategory, ITransactionClass } from '@/types/timetable/Transaction/transactions';

/* ============================= */
/* CATEGORY DROPDOWN */
/* ============================= */
export async function getTransactionCategoryDropdown() {
    const url = '/TimeTableCommon/GetCategoryDetails';
    console.info('Transaction Category URL:', url);

    return await api.get<ITransactionCategory[]>('timetable', url);
}

/* ============================= */
/* CLASS DROPDOWN */
/* ============================= */
export async function getTransactionClassDropdown() {
    const url = '/TimeTableCommon/GetClassData';
    console.info('Transaction Class URL:', url);

    return await api.get<ITransactionClass[]>('timetable', url);
}
