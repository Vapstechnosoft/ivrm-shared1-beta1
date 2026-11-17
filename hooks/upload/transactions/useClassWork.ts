import { PORTAL_QUERY_KEYS } from '@/constants/query-keys';
import { GetClassWorkUploadedList } from '@/server/upload/transactions/ivrm-classwork/server-action';
import type { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const ClassWorkUploadedList = (payload: any, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PORTAL_QUERY_KEYS.CLASS_WORK_UPLOADED, searchParams ?? {}],
            queryFn: async () => GetClassWorkUploadedList(payload, searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PORTAL_QUERY_KEYS.CLASS_WORK_UPLOADED]
            });
        }
    };
};
