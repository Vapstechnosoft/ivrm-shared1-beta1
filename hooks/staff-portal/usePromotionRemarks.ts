import { useQuery, useMutation } from '@tanstack/react-query';
import {
    getInitialData,
    getClasses,
    getSections,
    searchStudent,
    saveDetails
} from '@/server/staff-portal/promotion-remarks';
import { toast } from 'sonner';

export const usePromotionRemarks = () => {
    const initialDataQuery = useQuery({
        queryKey: ['promotion-remarks-initial'],
        queryFn: () => getInitialData(1),
    });

    const getClassesMutation = useMutation({
        mutationFn: getClasses,
        onError: (error) => toast.error('Failed to load classes'),
    });

    const getSectionsMutation = useMutation({
        mutationFn: getSections,
        onError: (error) => toast.error('Failed to load sections'),
    });

    const searchStudentMutation = useMutation({
        mutationFn: searchStudent,
        onError: (error) => toast.error('Failed to search students'),
    });

    const saveDetailsMutation = useMutation({
        mutationFn: saveDetails,
        onSuccess: (response) => {
            if (response.data?.returnval) {
                toast.success(response.data.message === 'Add' ? 'Record Saved Successfully' : 'Record Updated Successfully');
            } else {
                toast.error('Failed to Save/Update Record');
            }
        },
        onError: (error) => toast.error('Failed to save details'),
    });

    return {
        initialData: initialDataQuery.data?.data,
        isLoadingInitial: initialDataQuery.isLoading,
        getClasses: getClassesMutation,
        getSections: getSectionsMutation,
        searchStudent: searchStudentMutation,
        saveDetails: saveDetailsMutation
    };
};
