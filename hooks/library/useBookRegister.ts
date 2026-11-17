'use client';

import {
    deactivateBookRegister,
    getBookRegisterList,
    getInitialData,
    saveBookRegister,
    saveBookRegisterTable1,
    saveBookRegisterTable2
} from '@/server/library/masters/bookRegister';
import type { ApiSearchparams } from '@/types';
import type { BookRegisterPayload } from '@/types/library/masters/bookRegister';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const LIBRARY_QUERY_KEYS = {
    BOOK_REGISTER: 'BOOK_REGISTER',
    BOOK_REGISTER_INITIAL: 'BOOK_REGISTER_INITIAL'
};

export function useBookRegister(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [LIBRARY_QUERY_KEYS.BOOK_REGISTER, searchParams ?? {}],
            queryFn: async () => getBookRegisterList({ IVRMUL_Id: 21602, searchParams }),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [LIBRARY_QUERY_KEYS.BOOK_REGISTER]
            });
        },
        saveMutation: useMutation({
            mutationFn: (data: BookRegisterPayload) => saveBookRegister(data),
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [LIBRARY_QUERY_KEYS.BOOK_REGISTER]
                });
            }
        }),
        saveTable1Mutation: useMutation({
            mutationFn: (data: BookRegisterPayload) => saveBookRegisterTable1(data),
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [LIBRARY_QUERY_KEYS.BOOK_REGISTER]
                });
            }
        }),
        saveTable2Mutation: useMutation({
            mutationFn: (data: BookRegisterPayload) => saveBookRegisterTable2(data),
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [LIBRARY_QUERY_KEYS.BOOK_REGISTER]
                });
            }
        }),
        deactivateMutation: useMutation({
            mutationFn: (data: { LMBANO_Id?: number; LMB_Id?: number; LMB_BookTitle?: string }) => deactivateBookRegister(data),
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [LIBRARY_QUERY_KEYS.BOOK_REGISTER]
                });
            }
        })
    };
}

export function useBookRegisterInitialData() {
    return useQuery({
        queryKey: [LIBRARY_QUERY_KEYS.BOOK_REGISTER_INITIAL],
        queryFn: async () => getInitialData(),
        staleTime: 0
    });
}
