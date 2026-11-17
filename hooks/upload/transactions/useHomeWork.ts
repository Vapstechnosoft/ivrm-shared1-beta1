import { PORTAL_QUERY_KEYS } from '@/constants/query-keys';
import { GetHomeWorkUploadedList } from '@/server/upload/transactions/ivrm-classwork/server-action';
import { fetchInitialData } from '@/server/upload/transactions/ivrm-homework/server-action';
import type { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const HomeWorkUploadedList = (payload: any, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PORTAL_QUERY_KEYS.HOME_WORK_UPLOADED, searchParams ?? {}],
            queryFn: async () => GetHomeWorkUploadedList(payload, searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PORTAL_QUERY_KEYS.HOME_WORK_UPLOADED]
            });
        }
    };
};

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
export const useHomeWork = (params?: any) => {
    const [data, setData] = useState<{
        yearlist: any[];
        classlist: any[];
        classwork: any[];
        academicyear: any[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await fetchInitialData();
            setData(result);
        } catch (err) {
            setError(err);
            toast.error('Failed to load homework data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        data,
        isLoading,
        error,
        refetchAll: loadData
    };
};
