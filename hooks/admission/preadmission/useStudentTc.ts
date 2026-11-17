import { getStudentsByAcademicYear, getTCCancelDetails } from '@/server/admission/preadmission/transactions/student_tc';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useStudentsByAcademicYear = (asmayId: number) => {
    return useQuery({
        queryKey: ['student_tc_student_list', asmayId],
        queryFn: () => getStudentsByAcademicYear(asmayId),
        enabled: !!asmayId && asmayId > 0,
        staleTime: 0
    });
};

export const useTCCancelDetails = () => {
    return useMutation({
        mutationFn: (params: { asmayId: number; amstId: number; reason?: string }) =>
            getTCCancelDetails(params.asmayId, params.amstId, params.reason),
        mutationKey: ['student_tc_cancel_details']
    });
};
