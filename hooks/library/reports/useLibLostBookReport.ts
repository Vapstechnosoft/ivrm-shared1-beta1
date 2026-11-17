import { getLibLostBookReportInitialData, getLibLostBookReportSearch } from '@/server/library/reports/lib-lost-book-report';
import type { ILibLostBookReportRequest } from '@/types/library/reports/lib-lost-book-report';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useLibLostBookReportInitialData = () => {
    return useQuery({
        queryKey: ['lib-lost-book-report-initial'],
        queryFn: async () => {
            const data = await getLibLostBookReportInitialData();
            return data;
        }
    });
};

export const useLibLostBookReportSearch = () => {
    return useMutation({
        mutationFn: (data: ILibLostBookReportRequest) => getLibLostBookReportSearch(data),
        onError: (error) => {
            console.error('Error fetching report:', error);
            toast.error('Failed to fetch report data');
        }
    });
};
