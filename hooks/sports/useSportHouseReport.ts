import { useMutation, useQuery } from '@tanstack/react-query';
import {
    getClassesAndHouses,
    getSections,
    getSportHouseReport,
    getSportHouseReportLoadData
} from '@/server/sports/reports/sport-house-report';
import { toast } from 'sonner';

export const useSportHouseReport = () => {

    // Initial Data (Academic Years)
    const initialData = useQuery({
        queryKey: ['sportHouseReportInitial'],
        queryFn: () => getSportHouseReportLoadData(),
        staleTime: Infinity,
    });

    // Fetch Classes and Houses
    const classHouseMutation = useMutation({
        mutationFn: ({ asmaY_Id }: { asmaY_Id: number }) => getClassesAndHouses(asmaY_Id),
        onError: (error) => {
            toast.error(error.message || 'Failed to fetch classes and houses');
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
        mutationFn: getSportHouseReport,
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
        classHouseMutation,
        sectionMutation,
        reportMutation,
    };
};
