import { useQuery, useMutation } from '@tanstack/react-query';
import {
    getInitialData,
    getClasses,
    getSections,
    getAttendanceReport
} from '@/server/staff-portal/attendance-report';
import { toast } from 'sonner';

export const useAttendanceReport = () => {
    const initialDataQuery = useQuery({
        queryKey: ['attendance-report-initial'],
        queryFn: getInitialData,
    });

    const getClassesMutation = useMutation({
        mutationFn: getClasses,
        onError: (error) => {
            console.error('Error fetching classes:', error);
            toast.error('Failed to load classes');
        }
    });

    const getSectionsMutation = useMutation({
        mutationFn: getSections,
        onError: (error) => {
            console.error('Error fetching sections:', error);
            toast.error('Failed to load sections');
        }
    });

    const getReportMutation = useMutation({
        mutationFn: getAttendanceReport,
        onError: (error) => {
            console.error('Error fetching report:', error);
            toast.error('Failed to generate report');
        }
    });

    return {
        initialData: initialDataQuery.data?.data,
        isLoadingInitial: initialDataQuery.isLoading,
        getClasses: getClassesMutation,
        getSections: getSectionsMutation,
        getReport: getReportMutation,
    };
};
