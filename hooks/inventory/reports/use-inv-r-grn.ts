
import { useMutation, useQuery } from '@tanstack/react-query';
import { getInvRGRNLoadData, getInvRGRNReport } from '@/server/inventory/reports/inv-r-grn';
import { toast } from 'sonner';
import { IInvRGRNPayload } from '@/types/inventory/reports/inv-r-grn';

export const useInvRGRNLoadData = (optionflag: string) => {
    return useQuery({
        queryKey: ['invRGRNLoadData', optionflag],
        queryFn: () => getInvRGRNLoadData(optionflag),
        enabled: !!optionflag, // Only run if optionflag is set
    });
};

export const useInvRGRNReport = () => {
    return useMutation({
        mutationFn: ({ payload, searchParams }: { payload: IInvRGRNPayload, searchParams?: any }) => getInvRGRNReport(payload, searchParams),
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

export const useInvRGRNReportQuery = (payload: IInvRGRNPayload | null, searchParams: any) => {
    return useQuery({
        queryKey: ['invRGRNReport', payload, searchParams],
        queryFn: () => {
            if (!payload) return { success: true, data: { get_grnreport: [], get_grn_item_supplier: [] }, total: 0, message: '' };
            return getInvRGRNReport(payload, searchParams);
        },
        enabled: !!payload
    });
};
