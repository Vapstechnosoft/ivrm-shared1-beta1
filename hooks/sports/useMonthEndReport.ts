import { useMutation, useQuery } from '@tanstack/react-query';
import { getMonthEndReport, getMonthEndReportDropdowns } from '@/server/sports/reports/month-end-report';
import { MonthEndReportFormSchema } from '@/types/sports/reports/month-end-report';

export const useMonthEndReport = () => {
    const loadData = useQuery({
        queryKey: ['monthEndReportValues'],
        queryFn: async () => {
            const response = await getMonthEndReportDropdowns();
            return response.data;
        },
    });

    const generateReport = useMutation({
        mutationFn: async (data: MonthEndReportFormSchema) => {
            const response = await getMonthEndReport(data);
            return response.data;
        },
    });

    return {
        loadData,
        generateReport,
    };
};
