'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import {
    getInitialData,
    getClasses,
    getSections,
    getExams,
    getReport
} from '@/server/staff-portal/cumulative-report';

export const useCumulativeReport = () => {
    // Initial data with year list
    const initialDataQuery = useQuery({
        queryKey: ['cumulative-report-initial'],
        queryFn: getInitialData,
    });

    // Cascading dropdown mutations
    const getClassesMutation = useMutation({
        mutationFn: getClasses,
    });

    const getSectionsMutation = useMutation({
        mutationFn: (params: { asmaY_Id: number, asmcL_Id: number }) =>
            getSections(params.asmaY_Id, params.asmcL_Id),
    });

    // Fetches both exams and student list based on section selection
    const getExamsMutation = useMutation({
        mutationFn: (params: {
            ASMAY_Id: number,
            ASMCL_Id: number,
            ASMS_Id: number,
            Left_Flag: boolean,
            Deactive_Flag: boolean
        }) => getExams(params),
    });

    // Report generation
    const getReportMutation = useMutation({
        mutationFn: getReport,
    });

    return {
        initialData: initialDataQuery.data?.data,
        isLoadingInitial: initialDataQuery.isLoading,
        getClasses: getClassesMutation,
        getSections: getSectionsMutation,
        getExams: getExamsMutation,
        getReport: getReportMutation,
    };
};
