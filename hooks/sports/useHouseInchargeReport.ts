import { useMutation, useQuery } from '@tanstack/react-query';
import { getHouseInchargeReport, getHouseInchargeReportLoadData, getHousesByYear } from '@/server/sports/reports/house-incharge-report';
import { toast } from 'sonner';

export const useHouseInchargeReport = () => {

    // Initial Data (Academic Years)
    const initialData = useQuery({
        queryKey: ['houseInchargeReportInitial'],
        queryFn: () => getHouseInchargeReportLoadData(),
        staleTime: Infinity,
    });

    // Fetch Houses
    const houseMutation = useMutation({
        mutationFn: getHousesByYear,
        onError: (error) => {
            toast.error(error.message || 'Failed to fetch houses');
        },
    });

    // Generate Report
    const reportMutation = useMutation({
        mutationFn: getHouseInchargeReport,
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
        houseMutation,
        reportMutation,
    };
};
