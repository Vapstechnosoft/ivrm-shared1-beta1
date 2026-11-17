import {
    getCLGTransactionCountReportInitialData,
    getCLGTransactionCountReportSearch
} from '@/server/library/reports/clg-transaction-count-report';
import type { ICLGTransactionCountReportRequest } from '@/types/library/reports/clg-transaction-count-report';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCLGTransactionCountReportInitialData = () => {
    return useQuery({
        queryKey: ['clg-transaction-count-report-initial'],
        queryFn: async () => {
            const data = await getCLGTransactionCountReportInitialData();
            return data;
        }
    });
};

export const useCLGTransactionCountReportSearch = () => {
    return useMutation({
        mutationFn: (data: ICLGTransactionCountReportRequest) => getCLGTransactionCountReportSearch(data),
        onError: (error) => {
            console.error('Error fetching report:', error);
            toast.error('Failed to fetch report data');
        }
    });
};
