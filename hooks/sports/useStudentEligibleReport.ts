import { useQuery, useMutation } from '@tanstack/react-query';
import {
    getStudentEligibleReportLoadData,
    getClassesForStudentEligible,
    getSectionsForStudentEligible,
    getStudentsForStudentEligible,
    getStudentEligibleReport
} from '@/server/sports/reports/student-eligible-report';
import { IStudentEligibleReportRequest } from '@/types/sports/reports/student-eligible-report';

export const useStudentEligibleReport = () => {
    const loadGrid = useQuery({
        queryKey: ['student-eligible-report-load'],
        queryFn: getStudentEligibleReportLoadData,
    });

    const getClasses = useMutation({
        mutationFn: (data: { ASMAY_Id: number }) => getClassesForStudentEligible(data.ASMAY_Id),
    });

    const getSections = useMutation({
        mutationFn: (data: { ASMAY_Id: number; ASMCL_Id: number }) => getSectionsForStudentEligible(data.ASMAY_Id, data.ASMCL_Id),
    });

    const getStudents = useMutation({
        mutationFn: (data: { ASMAY_Id: number; ASMCL_Id: number; ASMS_Id: number }) => getStudentsForStudentEligible(data.ASMAY_Id, data.ASMCL_Id, data.ASMS_Id),
    });

    const showDetails = useMutation({
        mutationFn: (data: IStudentEligibleReportRequest) => getStudentEligibleReport(data),
    });

    return {
        ...loadGrid,
        getClasses,
        getSections,
        getStudents,
        showDetails
    };
};
