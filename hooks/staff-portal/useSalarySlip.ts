
'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { getInitialSalarySlipData, generateSalarySlip } from '@/server/staff-portal/salary-slip';

export const useSalarySlip = () => {
    // Fetch initial data (Month/Year dropdowns)
    const initialDataQuery = useQuery({
        queryKey: ['staff-salary-slip-initial'],
        queryFn: () => getInitialSalarySlipData(),
    });

    // Mutation to generate salary slip
    const generateSlipMutation = useMutation({
        mutationFn: generateSalarySlip,
    });

    return {
        initialData: initialDataQuery.data?.data,
        isLoadingInitial: initialDataQuery.isLoading,
        generateSlip: generateSlipMutation,
    };
};
