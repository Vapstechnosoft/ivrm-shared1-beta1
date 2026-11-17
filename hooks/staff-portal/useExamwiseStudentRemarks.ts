import { useQuery, useMutation } from '@tanstack/react-query';
import {
    studentDataLoad,
    onChangeYear,
    onChangeClass,
    onChangeSection,
    searchData,
    saveMapping,
    viewSubjectWiseRemarks,
    editMappingDetails
} from '@/server/staff-portal/examwise-student-remarks';
import { toast } from 'sonner';

export const useExamwiseStudentRemarks = () => {
    const initialDataQuery = useQuery({
        queryKey: ['examwise-remarks-initial'],
        queryFn: () => studentDataLoad(),
    });

    const getClassesMutation = useMutation({
        mutationFn: onChangeYear,
        onError: (error) => toast.error('Failed to load classes'),
    });

    const getSectionsMutation = useMutation({
        mutationFn: onChangeClass,
        onError: (error) => toast.error('Failed to load sections'),
    });

    const getExamsMutation = useMutation({
        mutationFn: onChangeSection,
        onError: (error) => toast.error('Failed to load exams'),
    });

    const searchDataMutation = useMutation({
        mutationFn: searchData,
        onError: (error) => toast.error('Failed to search student data'),
    });

    const saveMappingMutation = useMutation({
        mutationFn: saveMapping,
        onSuccess: (response) => {
            if (response.data?.returnval) {
                toast.success('Record Saved/Updated Successfully');
            } else {
                toast.error('Failed to Save/Update Record');
            }
        },
        onError: (error) => toast.error('Failed to save record'),
    });

    const viewSubjectWiseRemarksMutation = useMutation({
        mutationFn: viewSubjectWiseRemarks,
        onError: (error) => toast.error('Failed to load subject wise remarks'),
    });

    const editMappingDetailsMutation = useMutation({
        mutationFn: editMappingDetails,
        onError: (error) => toast.error('Failed to load edit details'),
    });

    return {
        initialData: initialDataQuery.data?.data,
        isLoadingInitial: initialDataQuery.isLoading,
        getClasses: getClassesMutation,
        getSections: getSectionsMutation,
        getExams: getExamsMutation,
        searchData: searchDataMutation,
        saveMapping: saveMappingMutation,
        viewSubjectWiseRemarks: viewSubjectWiseRemarksMutation,
        editMappingDetails: editMappingDetailsMutation
    };
};
