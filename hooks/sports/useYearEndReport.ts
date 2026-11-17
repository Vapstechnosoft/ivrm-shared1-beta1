import { useMutation, useQuery } from '@tanstack/react-query';
import { getYearEndReport, getYearEndReportDropdowns } from '@/server/sports/reports/year-end-report';
import { YearEndReportFormSchema } from '@/types/sports/reports/year-end-report';

export const useYearEndReport = () => {
    const loadData = useQuery({
        queryKey: ['yearEndReportValues'],
        queryFn: async () => {
            const response = await getYearEndReportDropdowns();
            return response.data;
        },
    });

    const generateReport = useMutation({
        mutationFn: async (data: YearEndReportFormSchema) => {
            const response = await getYearEndReport(data);
            return response.data;
        },
    });

    return {
        loadData,
        generateReport,
    };
};
