import { PORTAL_QUERY_KEYS } from '@/constants/query-keys';
import {
    generateOnlinePaymentOrder,
    getOnlinePaymentAmountDetails,
    getOnlinePaymentDetails,
    processOnlineRazorpayPayment
} from '@/server/student-portal/fee-online-payment';
import type {
    FeeStructure,
    GroupTermMapping,
    PaymentOrderResponse,
    PaymentStatusResponse,
    RazorpayResponse,
    StudentInfo
} from '@/server/student-portal/fee-online-payment';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useOnlinePaymentDetails = (amstId?: number, configset?: string, selectedList?: GroupTermMapping[]) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PORTAL_QUERY_KEYS.FEE_ONLINE_PAYMENT_DETAILS, amstId, configset, selectedList],
            queryFn: async () => getOnlinePaymentDetails(amstId, configset, selectedList)
        }),

        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [PORTAL_QUERY_KEYS.FEE_ONLINE_PAYMENT_DETAILS]
            })
    };
};

export const useOnlinePaymentAmountDetails = (
    selectedList: GroupTermMapping[],
    academicYearId?: number,
    classId?: number,
    userId?: number,
    headFlag?: string
) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PORTAL_QUERY_KEYS.FEE_ONLINE_PAYMENT_AMOUNT_DETAILS, selectedList, academicYearId, classId, userId, headFlag],
            queryFn: async () => {
                if (!selectedList.length) {
                    return {
                        feeStructures: [],
                        paymentGateways: [],
                        totalRebate: 0,
                        feeConfig: null
                    };
                }
                return getOnlinePaymentAmountDetails(selectedList, academicYearId, classId, userId, headFlag);
            },
            enabled: selectedList.length > 0
        }),

        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [PORTAL_QUERY_KEYS.FEE_ONLINE_PAYMENT_AMOUNT_DETAILS]
            })
    };
};

export const useOnlinePaymentOrder = () => {
    const queryClient = useQueryClient();

    const generateOrder = async (
        feeStructures: FeeStructure[],
        totalAmount: number,
        studentInfo: StudentInfo,
        selectedList: GroupTermMapping[],
        paymentGateway: string,
        academicYearId: number,
        classId: number
    ): Promise<PaymentOrderResponse> => {
        const result = await generateOnlinePaymentOrder(
            feeStructures,
            totalAmount,
            studentInfo,
            selectedList,
            paymentGateway,
            academicYearId,
            classId
        );

        // Invalidate related queries
        queryClient.invalidateQueries({
            queryKey: [PORTAL_QUERY_KEYS.FEE_ONLINE_PAYMENT_AMOUNT_DETAILS]
        });

        return result;
    };

    return {
        generateOrder,
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [PORTAL_QUERY_KEYS.FEE_ONLINE_PAYMENT_ORDER]
            })
    };
};

export const useOnlineRazorpayPayment = () => {
    const queryClient = useQueryClient();

    const processPayment = async (
        paymentData: PaymentOrderResponse,
        razorpayResponse: RazorpayResponse
    ): Promise<PaymentStatusResponse> => {
        const result = await processOnlineRazorpayPayment(paymentData, razorpayResponse);

        // Invalidate related queries after successful payment
        if (result.success) {
            queryClient.invalidateQueries({
                queryKey: [PORTAL_QUERY_KEYS.FEE_ONLINE_PAYMENT_DETAILS]
            });
            queryClient.invalidateQueries({
                queryKey: [PORTAL_QUERY_KEYS.FEE_ONLINE_PAYMENT_AMOUNT_DETAILS]
            });
        }

        return result;
    };

    return {
        processPayment,
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [PORTAL_QUERY_KEYS.FEE_ONLINE_RAZORPAY_PAYMENT]
            })
    };
};
