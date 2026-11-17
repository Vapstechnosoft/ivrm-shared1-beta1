'use client';
import { LIBRARY_QUERY_KEYS } from '@/constants/query-keys';
import { getConcessionAcademicDropdownData } from '@/server/library/transactions/FeeConcession';
import { getBookTransactionDetails } from '@/server/library/transactions/book-return';
import { getLostBookList } from '@/server/library/transactions/lost-book';
import type { ApiSearchparams } from '@/types';
import type { ILostBookList } from '@/types/library/transactions/transactions';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useBookReturn = (searchParams: ApiSearchparams = {}) => {
    return useQuery({
        queryKey: ['book-return', searchParams],
        queryFn: async () => {
            try {
                // Convert searchParams to the format expected by getBookTransactionDetails
                const response = await getBookTransactionDetails({
                    booktype: 'issue',
                    issuertype: 'std',
                    bookcat_type: 'book'
                });
                return response;
            } catch (error) {
                console.error('Error fetching transactions:', error);
                throw error;
            }
        },
        enabled: true
    });
};

// export const useFeeConcessionStudentConcessionGrid = (searchParams: ApiSearchparams = {}) => {
//     return useQuery({
//         queryKey: ['book-return', searchParams],
//         queryFn: async () => {
//             try {
//                 // Convert searchParams to the format expected by getBookTransactionDetails
//                 const response = await getBookTransactionDetails({
//                     booktype: 'issue',
//                     issuertype: 'std',
//                     bookcat_type: 'book'
//                 });
//                 return response;
//             } catch (error) {
//                 console.error('Error fetching transactions:', error);
//                 throw error;
//             }
//         },
//         enabled: true
//     });
// };

export const useLostBookList = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [LIBRARY_QUERY_KEYS.LIBRARY_LOST_BOOK_GRID, searchParams ?? {}],
            queryFn: async () => {
                try {
                    const response = await getLostBookList(searchParams);

                    // Robust data extraction
                    let extractedData: ILostBookList[] = [];

                    if (response && response.success) {
                        // The user's response has data as an array in 'data' field
                        const rawData = response.data;

                        if (Array.isArray(rawData)) {
                            extractedData = rawData;
                        } else if (rawData && typeof rawData === 'object') {
                            // Check for $values (OData)
                            if (rawData.$values && Array.isArray(rawData.$values)) {
                                extractedData = rawData.$values;
                            }
                            // Check for module-specific keys
                            else if (rawData.lostBookList && Array.isArray(rawData.lostBookList)) {
                                extractedData = rawData.lostBookList;
                            } else if (rawData.gridListData && Array.isArray(rawData.gridListData)) {
                                extractedData = rawData.gridListData;
                            }
                        }
                        // Check if the response itself has the array (if data field is missing or empty)
                        if (extractedData.length === 0) {
                            const rootArrayKey = Object.keys(response).find(
                                (key) => Array.isArray((response as any)[key]) && key !== 'data'
                            );
                            if (rootArrayKey) {
                                extractedData = (response as any)[rootArrayKey];
                            }
                        }
                    }

                    return {
                        ...response,
                        data: extractedData
                    };
                } catch (error) {
                    console.error('useLostBookList error:', error);
                    throw error;
                }
            },
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [LIBRARY_QUERY_KEYS.LIBRARY_LOST_BOOK_GRID],
                exact: false
            });
        }
    };
};

export const useLibraryacademicyerdropdowndatafee = (mi_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [LIBRARY_QUERY_KEYS.LIBRARY_ACADEMIC_YEAR_DROPDOWN, searchParams ?? {}],
            queryFn: async () => getConcessionAcademicDropdownData(mi_Id),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [LIBRARY_QUERY_KEYS.LIBRARY_ACADEMIC_YEAR_DROPDOWN]
            });
        }
    };
};
