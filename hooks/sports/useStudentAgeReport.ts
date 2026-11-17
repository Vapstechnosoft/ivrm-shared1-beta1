import { useMutation, useQuery } from '@tanstack/react-query';
import {
    getStudentAgeReportLoadData,
    getClassesForYear,
    getSectionsForClass,
    getStudentAgeReport
} from '@/server/sports/reports/student-age-calculation';
import { toast } from 'sonner';

export const useStudentAgeReport = () => {
    const loadData = useQuery({
        queryKey: ['studentAgeReportLoadData'],
        queryFn: () => getStudentAgeReportLoadData(),
    });

    const getClasses = useMutation({
        mutationFn: (yearId: number) => getClassesForYear(yearId),
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const getSections = useMutation({
        mutationFn: ({ asmaY_Id, asmcL_Id }: { asmaY_Id: number, asmcL_Id: number }) => getSectionsForClass(asmaY_Id, asmcL_Id),
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const generateReport = useMutation({
        mutationFn: getStudentAgeReport,
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return {
        loadData,
        getClasses,
        getSections,
        generateReport
    };
};
