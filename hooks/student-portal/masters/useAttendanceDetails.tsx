import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { PORTAL_QUERY_KEYS } from '@/constants/query-keys';
import { type AttendanceDetailsSchema, attendanceDetailsSchema } from '@/schemas/student-portal/masters/attendance-details.schema';
import {
    getAttendanceData,
    getAttendanceInitialData,
    getCOEList,
    getStudentFeedbackList
} from '@/server/student-portal/masters/attendance-details';
import type { IApiResponse, IAttendanceYear } from '@/types/student-portal/masters/attendance-details';

import type { ApiSearchparams } from '@/types';

export function useAttendanceDetails() {
    const form = useForm<AttendanceDetailsSchema>({
        resolver: zodResolver(attendanceDetailsSchema),
        defaultValues: {}
    });

    const { data: initialData, isLoading: isInitialLoading } = useQuery<IApiResponse<IAttendanceYear[]>>({
        queryKey: ['attendanceInitialData'],
        queryFn: async () => {
            try {
                const response = await getAttendanceInitialData();
                if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
                    form.setValue('asmaY_Id', response.data[0].asmaY_Id.toString());
                }
                return response;
            } catch (error: any) {
                toast.error(error.message || 'Failed to fetch initial data');
                // Return fallback resembling empty response structure instead of null to avoid type errors
                return { success: false, message: error.message, data: [], total: 0, page: 0, page_size: 0 } as any;
            }
        }
    });

    return {
        form,
        initialData,
        isInitialLoading,
        getAttendanceData
    };
}

export const useFeedBackList = (AMST_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PORTAL_QUERY_KEYS.STUDENT_PORTAL_FEEDBACK, searchParams ?? {}],
            queryFn: async () => getStudentFeedbackList(AMST_Id, searchParams),
            staleTime: 0
        }),
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [PORTAL_QUERY_KEYS.STUDENT_PORTAL_FEEDBACK]
            })
    };
};

export const useCOEList = (amst_id: number, asmay_id: number, asmcl_id: number, month_id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PORTAL_QUERY_KEYS.COE_LIST, searchParams ?? {}],
            queryFn: async () => getCOEList(amst_id, asmay_id, asmcl_id, month_id, searchParams),
            staleTime: 0
        }),
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [PORTAL_QUERY_KEYS.COE_LIST]
            })
    };
};
