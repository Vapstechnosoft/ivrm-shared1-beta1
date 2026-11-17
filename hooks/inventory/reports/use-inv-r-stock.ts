
import { useMutation, useQuery } from '@tanstack/react-query';
import { getInvRStockDetails, getInvRStockReport } from '@/server/inventory/reports/inv-r-stock';
import { toast } from 'sonner';
import { IInvRStockPayload } from '@/types/inventory/reports/inv-r-stock';

export const useInvRStockDetails = (optionflag: string) => {
    return useQuery({
        queryKey: ['invRStockDetails', optionflag],
        queryFn: () => getInvRStockDetails(optionflag),
        enabled: optionflag !== 'All', // Don't fetch if All (or maybe fetch empty?)
    });
};

export const useInvRStockReport = () => {
    return useMutation({
        mutationFn: (payload: IInvRStockPayload) => getInvRStockReport(payload),
        onSuccess: (data) => {
            if (data.success) {
                toast.success('Report generated successfully');
            } else {
                toast.error(data.message || 'Failed to generate report');
            }
        },
        onError: (error) => {
            toast.error('An error occurred while generating the report');
            console.error(error);
        }
    });
};

export const useInvRStockReportQuery = (payload: IInvRStockPayload | null, searchParams: any) => {
    return useQuery({
        queryKey: ['invRStockReport', payload, searchParams],
        queryFn: () => {
            if (!payload) return { success: true, data: { get_StockReport: [] }, total: 0, message: '', page: 1, page_size: 10 };
            return getInvRStockReport(payload, searchParams);
        },
        enabled: !!payload
    });
};
