import { useMutation, useQuery } from '@tanstack/react-query';
import { getBMIReportLoadData, getClassesForBMI, getSectionsForBMI, getBMIReport } from '@/server/sports/reports/bmi-report';
import { IBMIReportRequest } from '@/types/sports/reports/bmi-report';

export const useBMIReport = () => {
    const loadData = useQuery({
        queryKey: ['bmiReportLoadData'],
        queryFn: () => getBMIReportLoadData(),
    });

    const getClasses = useMutation({
        mutationFn: (asMAY_Id: number) => getClassesForBMI(asMAY_Id),
    });

    const getSections = useMutation({
        mutationFn: ({ asMAY_Id, asmcL_Id }: { asMAY_Id: number; asmcL_Id: number }) => getSectionsForBMI(asMAY_Id, asmcL_Id),
    });

    const generateReport = useMutation({
        mutationFn: (data: IBMIReportRequest) => getBMIReport(data),
    });

    return {
        loadData,
        getClasses,
        getSections,
        generateReport,
    };
};
