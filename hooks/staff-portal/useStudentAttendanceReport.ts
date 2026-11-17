
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getInitialReportData,
    getReportClasses,
    getReportSections,
    getReportStudents,
    getReportDetails,
    sendAbsentNotice
} from '@/server/staff-portal/student-attendance-report';
import { IReportFilterRequest } from '@/types/staff-portal/student-attendance-report';

export const useStudentAttendanceReport = () => {
    const queryClient = useQueryClient();

    // Initial Data
    const initialData = useQuery({
        queryKey: ['student-report-initial'],
        queryFn: () => getInitialReportData(),
    });

    // Mutations
    const fetchClasses = useMutation({
        mutationFn: ({ asmaY_Id, amC_Id }: { asmaY_Id: number, amC_Id: number }) =>
            getReportClasses(asmaY_Id, amC_Id),
    });

    const fetchSections = useMutation({
        mutationFn: ({ asmaY_Id, classList }: { asmaY_Id: number, classList: { ASMCL_Id: number }[] }) =>
            getReportSections(asmaY_Id, classList),
    });

    const fetchStudents = useMutation({
        mutationFn: (data: any) => getReportStudents(data),
    });

    const fetchReport = useMutation({
        mutationFn: (data: IReportFilterRequest) => getReportDetails(data),
    });

    const noticeMutation = useMutation({
        mutationFn: ({ students, template }: { students: any[], template: string }) =>
            sendAbsentNotice(students, template),
    });

    return {
        initialData,
        fetchClasses,
        fetchSections,
        fetchStudents,
        fetchReport,
        noticeMutation
    };
};
