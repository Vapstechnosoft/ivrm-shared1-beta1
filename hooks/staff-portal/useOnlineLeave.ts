
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getInitialLeaveData,
    getLeaveHistory,
    applyLeave,
    cancelLeave
} from '@/server/staff-portal/online-leave';
import { ILeaveBalance, ILeaveApplicationRequest } from '@/types/staff-portal/online-leave';
import { toast } from 'sonner';
import { useState, useMemo } from 'react';
import { format, differenceInDays } from 'date-fns';

export function useOnlineLeave() {
    const queryClient = useQueryClient();

    // 1. Queries
    const { data: initialData, isLoading: isInitLoading } = useQuery({
        queryKey: ['online-leave-initial'],
        queryFn: () => getInitialLeaveData(),
    });

    const { data: historyData, isLoading: isHistoryLoading } = useQuery({
        queryKey: ['online-leave-history'],
        queryFn: () => getLeaveHistory(),
    });

    // 2. Mutations
    const applyMutation = useMutation({
        mutationFn: (payload: ILeaveApplicationRequest) => applyLeave(payload),
        onSuccess: (res: any) => {
            if (res.returnval) {
                toast.success('Leave applied successfully');
                queryClient.invalidateQueries({ queryKey: ['online-leave-history'] });
            } else {
                toast.error(res.message || 'Failed to apply leave');
            }
        },
        onError: () => toast.error('An error occurred while applying leave'),
    });

    const cancelMutation = useMutation({
        mutationFn: (id: number) => cancelLeave(id),
        onSuccess: (res: any) => {
            if (res.retrunMsg === 'updated') {
                toast.success('Leave cancelled successfully');
                queryClient.invalidateQueries({ queryKey: ['online-leave-history'] });
            } else {
                toast.error('Failed to cancel leave');
            }
        },
        onError: () => toast.error('An error occurred while cancelling leave'),
    });

    // 3. Grid State Management (Inline date selection for leave types)
    const [selectedLeaves, setSelectedLeaves] = useState<Record<number, Partial<ILeaveBalance>>>({});

    const updateLeaveRow = (hrelS_Id: number, field: keyof ILeaveBalance, value: any) => {
        setSelectedLeaves(prev => {
            const current = prev[hrelS_Id] || {};
            const updated = { ...current, [field]: value };

            // Recalculate days if fromDate or toDate changes
            if (field === 'fromDate' || field === 'toDate' || field === 'cklop') {
                const fd = field === 'fromDate' ? value : current.fromDate;
                const td = field === 'toDate' ? value : current.toDate;
                const isHalf = field === 'cklop' ? value : current.cklop;

                if (fd && td) {
                    let days = differenceInDays(td, fd) + 1;
                    if (isHalf) days -= 0.5;
                    updated.hrelaP_TotalDays = days;
                }
            }

            return { ...prev, [hrelS_Id]: updated };
        });
    };

    return {
        initialData,
        historyData,
        isLoading: isInitLoading || isHistoryLoading,
        applyMutation,
        cancelMutation,
        selectedLeaves,
        updateLeaveRow,
        setSelectedLeaves
    };
}
