import { useMutation, useQuery } from '@tanstack/react-query';
import { getPointsRecordReport, getPointsRecordReportDropdowns } from '@/server/sports/reports/points-record-report';
import { PointsRecordReportFormSchema } from '@/types/sports/reports/points-record-report';

export const usePointsRecordReport = () => {
    const loadData = useQuery({
        queryKey: ['pointsRecordReportValues'],
        queryFn: async () => {
            const response = await getPointsRecordReportDropdowns();
            return response.data;
        },
    });

    const generateReport = useMutation({
        mutationFn: async (data: PointsRecordReportFormSchema) => {
            const response = await getPointsRecordReport(data);
            return response.data;
        },
    });

    return {
        loadData,
        generateReport,
    };
};
