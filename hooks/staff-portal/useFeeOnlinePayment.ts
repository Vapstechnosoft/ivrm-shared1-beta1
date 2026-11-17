import { STAFF_PORTAL_QUERY_KEYS } from '@/constants/query-keys';
import {
    generatePaymentOrder,
    getAcademicYears,
    getFeeDetails,
    getPaymentCharges,
    getStudentInformation,
    getStudentPortalInformation,
    processRazorpayPayment
} from '@/server/staff-portal/fee-online-payment';
import type {
    FeeStructure,
    GroupTermMapping,
    PaymentOrderResponse,
    PaymentStatusResponse,
    RazorpayResponse,
    StudentInfo
} from '@/types/staff-portal/fee-online-payment';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useAcademicYears = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [STAFF_PORTAL_QUERY_KEYS.FEE_ACADEMIC_YEARS],
            queryFn: async () => getAcademicYears()
        }),

        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [STAFF_PORTAL_QUERY_KEYS.FEE_ACADEMIC_YEARS]
            })
    };
};

export const useStudentInformation = (academicYearId: number | null) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [STAFF_PORTAL_QUERY_KEYS.FEE_STUDENT_INFORMATION, academicYearId],
            queryFn: async () => {
                if (!academicYearId) return null;
                return getStudentInformation(academicYearId);
            },
            enabled: !!academicYearId
        }),

        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [STAFF_PORTAL_QUERY_KEYS.FEE_STUDENT_INFORMATION]
            })
    };
};

export const useStudentPortalInformation = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [STAFF_PORTAL_QUERY_KEYS.FEE_PORTAL_STUDENT_INFORMATION],
            queryFn: async () => {
                return getStudentPortalInformation();
            }
        }),

        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [STAFF_PORTAL_QUERY_KEYS.FEE_PORTAL_STUDENT_INFORMATION]
            })
    };
};

export const useFeeDetails = (selectedList: GroupTermMapping[], academicYearId: number | null, classId: number | null) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [STAFF_PORTAL_QUERY_KEYS.FEE_DETAILS, selectedList, academicYearId, classId],
            queryFn: async () => {
                if (!selectedList.length || !academicYearId || !classId) {
                    return {
                        feeStructures: [],
                        paymentGateways: [],
                        totalRebate: 0,
                        feeConfig: null
                    };
                }
                return getFeeDetails(selectedList, academicYearId, classId);
            },
            enabled: selectedList.length > 0 && !!academicYearId && !!classId
        }),

        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [STAFF_PORTAL_QUERY_KEYS.FEE_DETAILS]
            })
    };
};

export const usePaymentOrder = () => {
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
        const result = await generatePaymentOrder(
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
            queryKey: [STAFF_PORTAL_QUERY_KEYS.FEE_DETAILS]
        });

        return result;
    };

    return {
        generateOrder,
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [STAFF_PORTAL_QUERY_KEYS.FEE_PAYMENT_ORDER]
            })
    };
};

export const useRazorpayPayment = () => {
    const queryClient = useQueryClient();

    const processPayment = async (
        paymentData: PaymentOrderResponse,
        razorpayResponse: RazorpayResponse
    ): Promise<PaymentStatusResponse> => {
        const result = await processRazorpayPayment(paymentData, razorpayResponse);

        // Invalidate related queries after successful payment
        if (result.success) {
            queryClient.invalidateQueries({
                queryKey: [STAFF_PORTAL_QUERY_KEYS.FEE_STUDENT_INFORMATION]
            });
            queryClient.invalidateQueries({
                queryKey: [STAFF_PORTAL_QUERY_KEYS.FEE_DETAILS]
            });
        }

        return result;
    };

    return {
        processPayment,
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [STAFF_PORTAL_QUERY_KEYS.FEE_RAZORPAY_PAYMENT]
            })
    };
};

export const usePaymentCharges = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [STAFF_PORTAL_QUERY_KEYS.FEE_PAYMENT_CHARGES],
            queryFn: async () => getPaymentCharges()
        }),

        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [STAFF_PORTAL_QUERY_KEYS.FEE_PAYMENT_CHARGES]
            })
    };
};
