
'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import {
    getInitialFeeDefaulterData,
    getStaffWiseClasses,
    getStaffTerms,
    getSections,
    getGroupsByCustom,
    getReportData,
    saveRemark
} from '@/server/staff-portal/fee-defaulter-report';
import type { IFeeDefaulterSearchRequest, ISaveRemarkRequest } from '@/types/staff-portal/fee-defaulter-report';

export const useStaffFeeDefaulterReport = () => {
    const initialDataQuery = useQuery({
        queryKey: ['fee-defaulter-initial'],
        queryFn: () => getInitialFeeDefaulterData(),
    });

    const getClassesMutation = useMutation({
        mutationFn: (asmaY_Id: number) => getStaffWiseClasses(asmaY_Id),
    });

    const getTermsMutation = useMutation({
        mutationFn: (params: { asmaY_Id: number, reportType: string }) => getStaffTerms(params.asmaY_Id, params.reportType),
    });

    const getSectionsMutation = useMutation({
        mutationFn: (params: { asmaY_Id: number, asmcL_Id: number }) => getSections(params.asmaY_Id, params.asmcL_Id),
    });

    const getGroupsMutation = useMutation({
        mutationFn: (params: { customIds: number[], reportType: string }) => getGroupsByCustom(params.customIds, params.reportType),
    });

    const searchMutation = useMutation({
        mutationFn: (data: IFeeDefaulterSearchRequest) => getReportData(data),
    });

    const saveRemarkMutation = useMutation({
        mutationFn: (data: ISaveRemarkRequest) => saveRemark(data),
    });

    return {
        initialData: initialDataQuery.data?.data,
        isLoadingInitial: initialDataQuery.isLoading,
        getClasses: getClassesMutation,
        getTerms: getTermsMutation,
        getSections: getSectionsMutation,
        getGroups: getGroupsMutation,
        search: searchMutation,
        saveRemark: saveRemarkMutation,
    };
};
