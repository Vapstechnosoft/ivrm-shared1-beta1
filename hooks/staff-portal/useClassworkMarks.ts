import { useQuery, useMutation } from '@tanstack/react-query';
import {
    getInitialData,
    getTopicList,
    getStudentList,
    saveMarks,
    viewStudentUpload
} from '@/server/staff-portal/classwork-marks';
import {
    getClasses,
    getSections,
    getSubjects
} from '@/server/staff-portal/classwork';
import { toast } from 'sonner';

export const useClassWorkMarks = () => {
    const initialDataQuery = useQuery({
        queryKey: ['classwork-marks-initial'],
        queryFn: () => getInitialData(1), // default id
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

    const getTopicListMutation = useMutation({
        mutationFn: getTopicList,
        onError: (error) => toast.error('Failed to load topics'),
    });

    const getStudentListMutation = useMutation({
        mutationFn: getStudentList,
        onError: (error) => toast.error('Failed to load students'),
    });

    const saveMarksMutation = useMutation({
        mutationFn: saveMarks,
        onSuccess: (response) => {
            if (response.data?.returnval) {
                toast.success('Marks updated successfully');
            } else {
                toast.error('Failed to update marks');
            }
        },
        onError: (error) => toast.error('Failed to save marks'),
    });

    const viewStudentUploadMutation = useMutation({
        mutationFn: viewStudentUpload,
        onError: (error) => toast.error('Failed to load student upload details'),
    });

    return {
        initialData: initialDataQuery.data?.data,
        isLoadingInitial: initialDataQuery.isLoading,
        getClasses: getClassesMutation,
        getSections: getSectionsMutation,
        getSubjects: getSubjectsMutation,
        getTopicList: getTopicListMutation,
        getStudentList: getStudentListMutation,
        saveMarks: saveMarksMutation,
        viewStudentUpload: viewStudentUploadMutation
    };
};
