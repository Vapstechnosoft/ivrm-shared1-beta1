import { getLibTransactionReportInitialData, getLibTransactionReportSearch } from '@/server/library/reports/lib-transaction-report';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useLibTransactionReportInitialData = () => {
    return useQuery({
        queryKey: ['lib-transaction-report-initial'],
        queryFn: () => getLibTransactionReportInitialData(),
        refetchOnWindowFocus: false
    });
};

export const useLibTransactionReportSearch = () => {
    return useMutation({
        mutationFn: getLibTransactionReportSearch,
        onError: (error) => {
            console.error('Error fetching report data:', error);
            toast.error('Failed to fetch report data');
        }
    });
};
