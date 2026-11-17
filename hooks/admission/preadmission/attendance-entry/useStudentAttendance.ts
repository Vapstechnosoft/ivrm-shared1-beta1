import { ADMISSION_QUERY_KEYS } from '@/constants/query-keys';
import {
    type StudentAttendanceSearchParams,
    getStudentAttendanceData
} from '@/server/admission/preadmission/attendance-entry/student_attendance';
import { useMutation } from '@tanstack/react-query';

export const useStudentAttendanceSearch = () => {
    return useMutation({
        mutationFn: (params: StudentAttendanceSearchParams) => getStudentAttendanceData(params),
        mutationKey: [ADMISSION_QUERY_KEYS.STUDENT_ATTENDANCE_SEARCH]
    });
};

export const useViewAttendanceDetails = () => {
    return useMutation({
        mutationFn: (params: any) =>
            import('@/server/admission/preadmission/attendance-entry/student_attendance').then((mod) =>
                mod.viewAttendanceDetailsStaffwise(params)
            ),
        mutationKey: ['view-attendance-details']
    });
};

export const useDeleteAttendance = () => {
    return useMutation({
        mutationFn: (asaId: number) =>
            import('@/server/admission/preadmission/attendance-entry/student_attendance').then((mod) => mod.deleteAttendanceRecord(asaId)),
        mutationKey: ['delete-attendance']
    });
};

export const useSaveStudentAttendance = () => {
    return useMutation({
        mutationFn: (payload: any) =>
            import('@/server/admission/preadmission/attendance-entry/student_attendance').then((mod) => mod.saveStudentAttendance(payload)),
        mutationKey: ['save-student-attendance']
    });
};
