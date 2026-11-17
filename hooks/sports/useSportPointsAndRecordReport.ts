import { useMutation, useQuery } from '@tanstack/react-query';
import { getPointsRecordReport, getPointsRecordReportDropdowns } from '@/server/sports/reports/points-record-report';
import { SportPointsAndRecordReportFormSchema } from '@/types/sports/reports/points-record-report';

export const useSportPointsAndRecordReport = () => {
    const loadData = useQuery({
        queryKey: ['pointsRecordReportValues'],
        queryFn: async () => {
            const response = await getPointsRecordReportDropdowns();
            return response.data;
        },
    });

    const generateReport = useMutation({
        mutationFn: async (data: SportPointsAndRecordReportFormSchema) => {
            const response = await getPointsRecordReport(data);
            return response.data;
        },
    });

    return {
        loadData,
        generateReport,
    };
};
