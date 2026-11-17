import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getInitialData,
    getClasses,
    getSections,
    getSubjects,
    saveClassWork,
    editClassWork,
    deactivateClassWork,
    viewClassWork
} from '@/server/staff-portal/classwork';
import { toast } from 'sonner';
import { IClassWorkSave } from '@/types/staff-portal/classwork';

export const useClassWork = () => {
    const queryClient = useQueryClient();

    const initialDataQuery = useQuery({
        queryKey: ['classwork-initial'],
        queryFn: () => getInitialData(1), // passing default id=1 as per legacy
    });

    const getClassesMutation = useMutation({
        mutationFn: getClasses,
        onError: (error) => toast.error('Failed to load classes'),
    });

    const getSectionsMutation = useMutation({
        mutationFn: getSections,
        onError: (error) => toast.error('Failed to load sections'),
    });

    const getSubjectsMutation = useMutation({
        mutationFn: getSubjects,
        onError: (error) => toast.error('Failed to load subjects'),
    });

    const saveClassWorkMutation = useMutation({
        mutationFn: saveClassWork,
        onSuccess: (response) => {
            if (response.data?.returnval) {
                toast.success('Classwork saved successfully');
                queryClient.invalidateQueries({ queryKey: ['classwork-initial'] });
            } else if (response.data?.dulicate) {
                toast.warning('Record already exists');
            } else {
                toast.error('Failed to save classwork');
            }
        },
        onError: (error) => toast.error('Failed to save classwork'),
    });

    const editClassWorkMutation = useMutation({
        mutationFn: editClassWork,
        onError: (error) => toast.error('Failed to load classwork details'),
    });

    const deactivateClassWorkMutation = useMutation({
        mutationFn: deactivateClassWork,
        onSuccess: (response) => {
            if (response.data?.returnval) {
                toast.success('Status updated successfully');
                queryClient.invalidateQueries({ queryKey: ['classwork-initial'] });
            } else {
                toast.error('Failed to update status');
            }
        },
        onError: (error) => toast.error('Failed to update status'),
    });

    const viewClassWorkMutation = useMutation({
        mutationFn: viewClassWork,
        onError: (error) => toast.error('Failed to load attachments'),
    });

    return {
        initialData: initialDataQuery.data?.data,
        isLoadingInitial: initialDataQuery.isLoading,
        refetchInitial: initialDataQuery.refetch,
        getClasses: getClassesMutation,
        getSections: getSectionsMutation,
        getSubjects: getSubjectsMutation,
        saveClassWork: saveClassWorkMutation,
        editClassWork: editClassWorkMutation,
        deactivateClassWork: deactivateClassWorkMutation,
        viewClassWork: viewClassWorkMutation,
    };
};
