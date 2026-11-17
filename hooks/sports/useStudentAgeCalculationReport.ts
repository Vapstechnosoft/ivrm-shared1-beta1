import { useMutation, useQuery } from '@tanstack/react-query';
import {
    getStudentAgeReportLoadData,
    getClassesForYear,
    getSectionsForClass,
    getStudentAgeReport
} from '@/server/sports/reports/student-age-calculation';
import type { IReportRequest } from '@/types/sports/reports/student-age-calculation';

export const useStudentAgeCalculationReport = () => {
    const initialData = useQuery({
        queryKey: ['studentAgeCalculationReportInitial'],
        queryFn: () => getStudentAgeReportLoadData(),
    });

    const generateReport = useMutation({
        mutationFn: (data: IReportRequest) => getStudentAgeReport(data),
    });

    return {
        initialData,
        generateReport
    };
};
