import { getBookCirculationReportData, getBookCirculationReportInitialData } from '@/server/library/reports/book-circulation-report';
import type { IBookCirculationReportRequest } from '@/types/library/reports/book-circulation-report';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useBookCirculationReportInitialData = () => {
    return useQuery({
        queryKey: ['book-circulation-report-initial'],
        queryFn: () => getBookCirculationReportInitialData(),
        refetchOnWindowFocus: false
    });
};

export const useBookCirculationReportSearch = () => {
    return useMutation({
        mutationFn: (data: IBookCirculationReportRequest) => getBookCirculationReportData(data),
        onError: (error) => {
            console.error('Error fetching report data:', error);
            toast.error('Failed to fetch report data');
        }
    });
};
