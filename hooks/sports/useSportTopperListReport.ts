import { useMutation, useQuery } from '@tanstack/react-query';
import {
    getClassesHousesEvents,
    getSections,
    getTopperListLoadData,
    getTopperListReport
} from '@/server/sports/reports/sport-topper-list-report';
import { toast } from 'sonner';

export const useSportTopperListReport = () => {

    // Initial Data (Year & Sports)
    const initialData = useQuery({
        queryKey: ['sportTopperListReportInitial'],
        queryFn: () => getTopperListLoadData(),
        staleTime: Infinity,
    });

    // Fetch Classes, Houses, Events
    const classHouseEventMutation = useMutation({
        mutationFn: ({ asmaY_Id }: { asmaY_Id: number }) => getClassesHousesEvents(asmaY_Id),
        onError: (error) => {
            toast.error(error.message || 'Failed to fetch classes, houses and events');
        },
    });

    // Fetch Sections
    const sectionMutation = useMutation({
        mutationFn: ({ asmaY_Id, asmcL_Id }: { asmaY_Id: number; asmcL_Id: number }) => getSections(asmaY_Id, asmcL_Id),
        onError: (error) => {
            toast.error(error.message || 'Failed to fetch sections');
        },
    });

    // Generate Report
    const reportMutation = useMutation({
        mutationFn: getTopperListReport,
        onSuccess: (data) => {
            if (data && data.length > 0) {
                toast.success('Report generated successfully');
            } else {
                toast.info('No records found');
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to generate report');
        },
    });

    return {
        initialData,
        classHouseEventMutation,
        sectionMutation,
        reportMutation,
    };
};
