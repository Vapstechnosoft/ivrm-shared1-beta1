import { useMutation, useQuery } from '@tanstack/react-query';
import { getSRKVSSportsReportRecord, getSRKVSSportsReportRecordDropdowns } from '@/server/sports/reports/srkvs-sports-report-record';
import { SRKVSSportsReportRecordFormSchema } from '@/types/sports/reports/srkvs-sports-report-record';

export const useSRKVSSportsReportRecord = () => {
    const loadData = useQuery({
        queryKey: ['srkvsSportsReportRecordDropdowns'],
        queryFn: async () => {
            const response = await getSRKVSSportsReportRecordDropdowns();
            return response.data;
        },
    });

    const generateReport = useMutation({
        mutationFn: async (data: SRKVSSportsReportRecordFormSchema) => {
            const response = await getSRKVSSportsReportRecord(data);
            return response.data;
        },
    });

    return {
        loadData,
        generateReport,
    };
};
