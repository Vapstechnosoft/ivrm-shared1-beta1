
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getInitialInteractions,
    getRecipientsByRole,
    getSectionsForInteraction,
    getStudentsForInteraction,
    saveInteraction,
    saveInteractionReply,
    deleteInteraction,
    getFeedbackQuestions,
    saveFeedbackResponse
} from '@/server/staff-portal/interactions';
import type { ISaveInteractionRequest, ISaveReplyRequest } from '@/types/staff-portal/interactions';

export const useInteractions = () => {
    const queryClient = useQueryClient();

    const initialDataQuery = useQuery({
        queryKey: ['interactions-initial'],
        queryFn: () => getInitialInteractions(),
    });

    const getRecipientsMutation = useMutation({
        mutationFn: (params: { roleflg: string, userflag: string }) => getRecipientsByRole(params.roleflg, params.userflag),
    });

    const getSectionsMutation = useMutation({
        mutationFn: (params: { asmcL_Id: number, asmaY_Id: number, roleflg: string }) => getSectionsForInteraction(params.asmcL_Id, params.asmaY_Id, params.roleflg),
    });

    const getStudentsMutation = useMutation({
        mutationFn: (params: { asmcL_Id: number, asmS_Id: number }) => getStudentsForInteraction(params.asmcL_Id, params.asmS_Id),
    });

    const saveMutation = useMutation({
        mutationFn: (data: ISaveInteractionRequest) => saveInteraction(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interactions-initial'] }),
    });

    const replyMutation = useMutation({
        mutationFn: (data: ISaveReplyRequest) => saveInteractionReply(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interactions-initial'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (data: { ISMINT_Id: number, ISTINT_Id: number }) => deleteInteraction(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interactions-initial'] }),
    });

    const feedbackQuery = useQuery({
        queryKey: ['interactions-feedback'],
        queryFn: () => getFeedbackQuestions(),
    });

    const saveFeedbackMutation = useMutation({
        mutationFn: (data: { savemodulefeedback: any[] }) => saveFeedbackResponse(data),
    });

    return {
        initialData: initialDataQuery.data?.data,
        isLoadingInitial: initialDataQuery.isLoading,
        getRecipients: getRecipientsMutation,
        getSections: getSectionsMutation,
        getStudents: getStudentsMutation,
        save: saveMutation,
        reply: replyMutation,
        deleteMsg: deleteMutation,
        feedback: feedbackQuery.data?.data,
        saveFeedback: saveFeedbackMutation,
        refresh: () => initialDataQuery.refetch(),
    };
};
