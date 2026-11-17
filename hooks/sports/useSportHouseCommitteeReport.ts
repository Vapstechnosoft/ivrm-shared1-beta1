import { useMutation, useQuery } from '@tanstack/react-query';
import {
    getSportHouseCommitteeReportLoadData,
    getHousesByYear,
    getSportHouseCommitteeReport
} from '@/server/sports/reports/sport-house-committee-report';
import { toast } from 'sonner';

export const useSportHouseCommitteeReport = () => {
    const initialData = useQuery({
        queryKey: ['sportHouseCommitteeReportInitial'],
        queryFn: () => getSportHouseCommitteeReportLoadData(),
    });

    const houseMutation = useMutation({
        mutationFn: (asmaY_Id: number) => getHousesByYear(asmaY_Id),
    });

    const reportMutation = useMutation({
        mutationFn: getSportHouseCommitteeReport,
        onSuccess: (data) => {
            if (data && data.length > 0) {
                toast.success("Report generated successfully");
            } else {
                toast.info("No records found");
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to generate report");
        },
    });

    return {
        initialData,
        houseMutation,
        reportMutation,
    };
};
