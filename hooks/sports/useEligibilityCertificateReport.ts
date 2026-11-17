import { useMutation, useQuery } from '@tanstack/react-query';
import {
    getEligibilityCertificateReport,
    getStudents,
    getAge,
    generateEligibilityCertificateReport
} from '@/server/sports/reports/eligibility-certificate-report';
import type { IEligibilityCertificateReport } from '@/types/sports/reports/eligibility-certificate-report';

export const useEligibilityCertificateReport = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['eligibilityCertificateReport'],
        queryFn: () => getEligibilityCertificateReport()
    });

    const getStudentsMutation = useMutation({
        mutationFn: (data: any) => getStudents(data)
    });

    const getAgeMutation = useMutation({
        mutationFn: (data: any) => getAge(data)
    });

    const generateReportMutation = useMutation({
        mutationFn: (data: IEligibilityCertificateReport) => generateEligibilityCertificateReport(data)
    });

    return {
        data,
        isLoading,
        error,
        getStudents: getStudentsMutation,
        getAge: getAgeMutation,
        generateReport: generateReportMutation
    };
};
