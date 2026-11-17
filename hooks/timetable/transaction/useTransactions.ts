'use client';

import { TIMETABLE_QUERY_KEYS } from '@/constants/Timetable-query-keys';
import { getTransactionCategoryDropdown, getTransactionClassDropdown } from '@/server/timetable/transactions/classSectionActions';
import { useQuery, useQueryClient } from '@tanstack/react-query';

/* ================= CATEGORY DROPDOWN ================= */
export const useTransactionCategoryDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery<any[]>({
            queryKey: [TIMETABLE_QUERY_KEYS.TT_CLASS_SECTION_REPORT, TIMETABLE_QUERY_KEYS.TT_TXN_CATEGORY_DROPDOWN],
            queryFn: async () => {
                const res = await getTransactionCategoryDropdown();
                return Array.isArray(res) ? res : (res?.data ?? []);
            },
            initialData: []
        }),

        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.TT_CLASS_SECTION_REPORT, TIMETABLE_QUERY_KEYS.TT_TXN_CATEGORY_DROPDOWN]
            })
    };
};

/* ================= CLASS DROPDOWN ================= */
export const useTransactionClassDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery<any[]>({
            queryKey: [TIMETABLE_QUERY_KEYS.TT_CLASS_SECTION_REPORT, TIMETABLE_QUERY_KEYS.TT_TXN_CLASS_DROPDOWN],
            queryFn: async () => {
                const res = await getTransactionClassDropdown();
                return Array.isArray(res) ? res : (res?.data ?? []);
            },
            initialData: []
        }),

        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.TT_CLASS_SECTION_REPORT, TIMETABLE_QUERY_KEYS.TT_TXN_CLASS_DROPDOWN]
            })
    };
};
