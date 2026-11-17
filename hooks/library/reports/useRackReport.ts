import { getRackReportData, getRackReportInitialData, getRackReportLibraries } from '@/server/library/reports/rack-report';
import type { IRackReportRequest } from '@/types/library/reports/rack-report';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useRackReportLibraries = () => {
    return useQuery({
        queryKey: ['rack-report-libraries'],
        queryFn: () => getRackReportLibraries(),
        refetchOnWindowFocus: false
    });
};

export const useRackReportInitialData = () => {
    return useQuery({
        queryKey: ['rack-report-initial'],
        queryFn: () => getRackReportInitialData(),
        refetchOnWindowFocus: false,
        enabled: true
    });
};

export const useRackReportSearch = () => {
    return useMutation({
        mutationFn: (data: IRackReportRequest) => getRackReportData(data),
        onError: (error) => {
            console.error('Error fetching report data:', error);
            toast.error('Failed to fetch report data');
        }
    });
};
