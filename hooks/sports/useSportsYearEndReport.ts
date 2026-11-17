import { useMutation, useQuery } from '@tanstack/react-query';
import {
    getClasses,
    getSections,
    getYearEndReportLoadData
} from '@/server/sports/reports/sports-year-end-report';
import { toast } from 'sonner';

export const useSportsYearEndReport = () => {

    // Initial Data
    const initialData = useQuery({
        queryKey: ['sportsYearEndReportInitial'],
        queryFn: () => getYearEndReportLoadData(),
        staleTime: Infinity,
    });

    // Fetch Classes
    const classMutation = useMutation({
        mutationFn: ({ asmaY_Id }: { asmaY_Id: number }) => getClasses(asmaY_Id),
        onError: (error) => {
            toast.error(error.message || 'Failed to fetch classes');
        },
    });

    // Fetch Sections
    const sectionMutation = useMutation({
        mutationFn: ({ asmaY_Id, asmcL_Id }: { asmaY_Id: number; asmcL_Id: number }) => getSections(asmaY_Id, asmcL_Id),
        onError: (error) => {
            toast.error(error.message || 'Failed to fetch sections');
        },
    });

    return {
        initialData,
        classMutation,
        sectionMutation,
    };
};
