import { useMutation, useQuery } from '@tanstack/react-query';
import { getInitialData, getStudentParticipationReportData } from '@/server/sports/reports/student-participation-report';
import { toast } from 'sonner';

export const useStudentParticipationReport = () => {
    const initialData = useQuery({
        queryKey: ['studentParticipationReportInitial'],
        queryFn: () => getInitialData(),
    });

    const reportData = useMutation({
        mutationFn: getStudentParticipationReportData,
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return {
        initialData,
        reportData,
    };
};
