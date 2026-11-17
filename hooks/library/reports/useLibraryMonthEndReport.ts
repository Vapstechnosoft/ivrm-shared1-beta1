import { getLibraryMonthEndReportInitialData, getLibraryMonthEndReportSearch } from '@/server/library/reports/library-month-end-report';
import type { ILibraryMonthEndReportRequest } from '@/types/library/reports/library-month-end-report';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useLibraryMonthEndReportInitialData = () => {
    return useQuery({
        queryKey: ['library-month-end-report-initial'],
        queryFn: async () => {
            const data = await getLibraryMonthEndReportInitialData();
            return data;
        }
    });
};

export const useLibraryMonthEndReportSearch = () => {
    return useMutation({
        mutationFn: (data: ILibraryMonthEndReportRequest) => getLibraryMonthEndReportSearch(data),
        onError: (error) => {
            console.error('Error fetching report:', error);
            toast.error('Failed to fetch report data');
        }
    });
};
