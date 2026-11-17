import { PORTAL_QUERY_KEYS } from '@/constants/query-keys';
import {
    fetchInitialData,
    getBusRoutingforNoticeBoard,
    getDepartmentforNoticeBoard,
    getDesignationforNoticeBoard,
    getEmployeesforNoticeBoard,
    getGroupforNoticeBoard,
    getTermforNoticeBoard
} from '@/server/upload/transactions/notice-board/server-action';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const useNoticeBoard = () => {
    const [data, setData] = useState<{
        yearlist: any[];
        noticeList: any[];
        classlist: any[];
        sectionlist: any[];
        departmentList: any[];
        designationList: any[];
        staffList: any[];
        studentList: any[];
        feeTerms: any[];
        feeGroups: any[];
        routes: any[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await fetchInitialData();
            // setData(result);
        } catch (err) {
            setError(err);
            toast.error('Failed to load notice board data');
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

export const useDepartmentsForNoticeBoard = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PORTAL_QUERY_KEYS.GET_DEPARTMENT_FOR_NOTICE_BOARD],
            queryFn: async () => getDepartmentforNoticeBoard(),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PORTAL_QUERY_KEYS.GET_DEPARTMENT_FOR_NOTICE_BOARD]
            });
        }
    };
};

export const useDesignationForNoticeBoard = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PORTAL_QUERY_KEYS.GET_DESIGNATION_FOR_NOTICE_BOARD],
            queryFn: async () => getDesignationforNoticeBoard(),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PORTAL_QUERY_KEYS.GET_DESIGNATION_FOR_NOTICE_BOARD]
            });
        }
    };
};

export const useEmployeesForNoticeBoard = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PORTAL_QUERY_KEYS.GET_EMPLOYEES_FOR_NOTICE_BOARD],
            queryFn: async () => getEmployeesforNoticeBoard(),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PORTAL_QUERY_KEYS.GET_EMPLOYEES_FOR_NOTICE_BOARD]
            });
        }
    };
};

export const useBusRoutingForNoticeBoard = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PORTAL_QUERY_KEYS.GET_ROUTES_FOR_NOTICE_BOARD],
            queryFn: async () => getBusRoutingforNoticeBoard(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PORTAL_QUERY_KEYS.GET_ROUTES_FOR_NOTICE_BOARD]
            });
        }
    };
};

export const useGroupForNoticeBoard = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PORTAL_QUERY_KEYS.GET_GROUPS_FOR_NOTICE_BOARD],
            queryFn: async () => getGroupforNoticeBoard(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PORTAL_QUERY_KEYS.GET_GROUPS_FOR_NOTICE_BOARD]
            });
        }
    };
};

export const useTermForNoticeBoard = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PORTAL_QUERY_KEYS.GET_TERMS_FOR_NOTICE_BOARD],
            queryFn: async () => getTermforNoticeBoard(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PORTAL_QUERY_KEYS.GET_TERMS_FOR_NOTICE_BOARD]
            });
        }
    };
};
