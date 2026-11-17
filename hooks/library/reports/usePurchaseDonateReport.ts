import { getPurchaseDonateReportData } from '@/server/library/reports/purchase-donate-report';
import type { IPurchaseDonateReportRequest } from '@/types/library/reports/purchase-donate-report';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const usePurchaseDonateReportSearch = () => {
    return useMutation({
        mutationFn: (data: IPurchaseDonateReportRequest) => getPurchaseDonateReportData(data),
        onError: (error) => {
            console.error('Error fetching report data:', error);
            toast.error('Failed to fetch report data');
        }
    });
};
