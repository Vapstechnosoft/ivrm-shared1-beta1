
import { useMutation, useQuery } from '@tanstack/react-query';
import { getInvVendorPaymentReport, getInvVendorDetails } from '@/server/inventory/reports/inv-r-vendor-payment';
import { toast } from 'sonner';
import { IInvVendorPaymentReportPayload, IInvVendorPaymentDetailsPayload } from '@/types/inventory/reports/inv-r-vendor-payment';

export const useInvVendorPaymentReport = () => {
    return useMutation({
        mutationFn: (payload: IInvVendorPaymentReportPayload) => getInvVendorPaymentReport(payload),
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

export const useInvVendorDetails = () => {
    return useMutation({
        mutationFn: (payload: IInvVendorPaymentDetailsPayload) => getInvVendorDetails(payload),
        onError: (error) => {
            toast.error('An error occurred while fetching details');
            console.error(error);
        }
    });
};

export const useInvVendorPaymentReportQuery = (payload: IInvVendorPaymentReportPayload | null, searchParams: any) => {
    return useQuery({
        queryKey: ['invVendorPaymentReport', payload, searchParams],
        queryFn: () => {
            if (!payload) return { success: true, data: [], total: 0, message: '', page: 1, page_size: 10 };
            return getInvVendorPaymentReport(payload, searchParams);
        },
        enabled: !!payload
    });
};
