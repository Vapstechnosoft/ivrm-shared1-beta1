
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    getInvRSalesLoadData,
    getInvRSalesDetails,
    getInvRSalesClassData,
    getInvRSalesStudentList,
    getInvRSalesReport
} from '@/server/inventory/reports/inv-r-sales';
import { toast } from 'sonner';
import { IInvRSalesPayload } from '@/types/inventory/reports/inv-r-sales';

export const useInvRSalesLoadData = () => {
    return useQuery({
        queryKey: ['invRSalesLoadData'],
        queryFn: getInvRSalesLoadData,
    });
};

export const useInvRSalesDetails = (optionflag: string | undefined) => {
    return useQuery({
        queryKey: ['invRSalesDetails', optionflag],
        queryFn: () => getInvRSalesDetails(optionflag!),
        enabled: !!optionflag,
    });
};

export const useInvRSalesClassData = (individualflag: string | undefined) => {
    return useQuery({
        queryKey: ['invRSalesClassData', individualflag],
        queryFn: () => getInvRSalesClassData(),
        enabled: !!individualflag && (individualflag === 'C' || individualflag === 'CS'),
    });
};

export const useInvRSalesSectionList = (asmcL_Id: string | undefined, individualflag: string | undefined) => {
    return useQuery({
        queryKey: ['invRSalesSectionList', asmcL_Id],
        queryFn: () => getInvRSalesStudentList({ ASMCL_Id: Number(asmcL_Id), ASMS_Id: 0, type: 'CS' }),
        enabled: !!asmcL_Id && individualflag === 'CS',
    });
};

export const useInvRSalesStudentList = (
    asmcL_Id: string | undefined,
    asmS_Id: string | undefined,
    individualflag: string | undefined
) => {
    return useQuery({
        queryKey: ['invRSalesStudentList', asmcL_Id, asmS_Id, individualflag],
        queryFn: () => {
            const payload = {
                ASMCL_Id: Number(asmcL_Id),
                ASMS_Id: asmS_Id ? Number(asmS_Id) : 0,
                type: 'C' // Always 'C' for student list, even when section is selected
            };
            return getInvRSalesStudentList(payload);
        },
        enabled: !!asmcL_Id && (individualflag === 'C' || (individualflag === 'CS' && !!asmS_Id)),
    });
};

export const useInvRSalesReport = () => {
    return useMutation({
        mutationFn: (payload: IInvRSalesPayload) => getInvRSalesReport(payload),
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

export const useInvRSalesReportQuery = (payload: IInvRSalesPayload | null, searchParams: any) => {
    return useQuery({
        queryKey: ['invRSalesReport', payload, searchParams],
        queryFn: () => {
            if (!payload) return { success: true, data: { get_SalesReport: [] }, total: 0, message: '', page: 1, page_size: 10 };
            return getInvRSalesReport(payload, searchParams);
        },
        enabled: !!payload
    });
};
