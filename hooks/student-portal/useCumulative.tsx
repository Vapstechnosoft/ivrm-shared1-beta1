import { PORTAL_QUERY_KEYS } from '@/constants/query-keys';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getCumulativeFeeAnalysisGrid, getstudentfeedetailsGrid } from '@/server/student-portal/masters/cumulative-fee-analysis';

export const useStudentFeeDetailsGrid = (asmaY_Id: number, asmcL_Id: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PORTAL_QUERY_KEYS.STUDENT_FEE_DETAILS2, asmaY_Id, asmcL_Id],
            queryFn: async () => getstudentfeedetailsGrid(asmaY_Id, asmcL_Id)
        }),

        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [PORTAL_QUERY_KEYS.STUDENT_FEE_DETAILS2]
            })
    };
};

export const useCumulativeFeeAnalysisGrid = (amst_Id: number, asmaY_Id: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PORTAL_QUERY_KEYS.CUMULATIVE_FEE_ANALYSIS, asmaY_Id, asmaY_Id],
            queryFn: async () => getCumulativeFeeAnalysisGrid(amst_Id, asmaY_Id)
        }),

        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [PORTAL_QUERY_KEYS.STUDENT_FEE_DETAILS2]
            })
    };
};
