import { getBookRegisterReportInitialData, getBookRegisterReportSearch } from '@/server/library/reports/book-register-report';
import type { IBookRegisterReportRequest } from '@/types/library/reports/book-register-report';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useBookRegisterReportInitialData = () => {
    return useQuery({
        queryKey: ['book-register-report-initial'],
        queryFn: async () => {
            const data = await getBookRegisterReportInitialData();
            return data;
        }
    });
};

export const useBookRegisterReportSearch = () => {
    return useMutation({
        mutationFn: (data: IBookRegisterReportRequest) => getBookRegisterReportSearch(data),
        onError: (error) => {
            console.error('Error fetching report:', error);
            toast.error('Failed to fetch report data');
        }
    });
};
