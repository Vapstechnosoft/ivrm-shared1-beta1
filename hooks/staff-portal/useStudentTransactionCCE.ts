
'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import {
    getInitialStudentTransactionData,
    getClasses,
    getSections,
    getTermsOrExams,
    getSkillsOrActivities,
    getActivitiesAreas,
    getSkillsAreas,
    getStudentList,
    saveStudentTransaction
} from '@/server/staff-portal/student-transaction-cce';

export const useStudentTransactionCCE = () => {
    const initialDataQuery = useQuery({
        queryKey: ['student-transaction-initial'],
        queryFn: () => getInitialStudentTransactionData(),
    });

    const getClassesMutation = useMutation({
        mutationFn: (params: { asmaY_Id: number, flag: string }) => getClasses(params.asmaY_Id, params.flag),
    });

    const getSectionsMutation = useMutation({
        mutationFn: (params: { asmaY_Id: number, asmcL_Id: number, flag: string }) => getSections(params.asmaY_Id, params.asmcL_Id, params.flag),
    });

    const getTermsOrExamsMutation = useMutation({
        mutationFn: (params: { asmaY_Id: number, asmcL_Id: number, asmS_Id: number, flag: string }) => getTermsOrExams(params.asmaY_Id, params.asmcL_Id, params.asmS_Id, params.flag),
    });

    const getSkillsOrActivitiesMutation = useMutation({
        mutationFn: (params: { skills: string, asmaY_Id: number, asmcL_Id: number, asmS_Id: number, flag: string }) => getSkillsOrActivities(params.skills, params.asmaY_Id, params.asmcL_Id, params.asmS_Id, params.flag),
    });

    const getActivitiesAreasMutation = useMutation({
        mutationFn: getActivitiesAreas,
    });

    const getSkillsAreasMutation = useMutation({
        mutationFn: getSkillsAreas,
    });

    const searchMutation = useMutation({
        mutationFn: getStudentList,
    });

    const saveMutation = useMutation({
        mutationFn: saveStudentTransaction,
    });

    return {
        initialData: initialDataQuery.data?.data,
        isLoadingInitial: initialDataQuery.isLoading,
        getClasses: getClassesMutation,
        getSections: getSectionsMutation,
        getTermsOrExams: getTermsOrExamsMutation,
        getSkillsOrActivities: getSkillsOrActivitiesMutation,
        getActivitiesAreas: getActivitiesAreasMutation,
        getSkillsAreas: getSkillsAreasMutation,
        search: searchMutation,
        save: saveMutation,
    };
};
