'use client';

import {
    deleteAttendance,
    deleteRecordWise,
    getBatchList,
    getDateWiseAttendance,
    getInitialData,
    getMonthClassHeld,
    getStdListPeriod,
    getStudentData,
    saveStudentAttendance,
    viewAttendanceHistory
} from '@/server/staff-portal/attendance-entry';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useAttendanceEntry = (asmaY_Id: number) => {
    const queryClient = useQueryClient();

    // Fetch initial data (years, classes, etc.)
    const initialDataQuery = useQuery({
        queryKey: ['staff-attendance-entry-initial', asmaY_Id],
        queryFn: () => getInitialData(asmaY_Id),
        enabled: asmaY_Id !== undefined && asmaY_Id !== null
    });

    // Mutation to get student data (initial settings for class/year)
    const getStudentDataMutation = useMutation({
        mutationFn: getStudentData
    });

    // Mutation to get month class held
    const getMonthClassHeldMutation = useMutation({
        mutationFn: getMonthClassHeld
    });

    // Mutation for date-wise attendance
    const getDateWiseAttendanceMutation = useMutation({
        mutationFn: getDateWiseAttendance
    });

    // Mutation for batch list
    const getBatchListMutation = useMutation({
        mutationFn: getBatchList
    });

    // Mutation for period-wise student list
    const getStdListPeriodMutation = useMutation({
        mutationFn: getStdListPeriod
    });

    // Mutation to save/update attendance
    const saveMutation = useMutation({
        mutationFn: saveStudentAttendance,
        onSuccess: (data) => {
            if (data.returnval) {
                toast.success('Record Saved Successfully!');
                // We might need to refresh or reset depending on the flow
            } else {
                toast.error(data.message || 'Record Not Saved Successfully!');
            }
        }
    });

    // Mutation to delete attendance
    const deleteMutation = useMutation({
        mutationFn: deleteAttendance,
        onSuccess: (data) => {
            if (data.returnval) {
                toast.success('Record Deleted Successfully');
            } else {
                toast.error('Failed To Delete Record');
            }
        }
    });

    // Mutation to view history
    const viewHistoryMutation = useMutation({
        mutationFn: viewAttendanceHistory
    });

    // Mutation to delete from history
    const deleteRecordMutation = useMutation({
        mutationFn: deleteRecordWise,
        onSuccess: (data) => {
            if (data.returnval) {
                toast.success('Record Deleted Successfully');
            } else {
                toast.error('Failed To Delete Record');
            }
        }
    });

    return {
        initialData: initialDataQuery.data,
        isLoadingInitial: initialDataQuery.isLoading,
        getStudentData: getStudentDataMutation,
        getMonthClassHeld: getMonthClassHeldMutation,
        getDateWiseAttendance: getDateWiseAttendanceMutation,
        getBatchList: getBatchListMutation,
        getStdListPeriod: getStdListPeriodMutation,
        saveAttendance: saveMutation,
        deleteAttendance: deleteMutation,
        viewHistory: viewHistoryMutation,
        deleteRecordWise: deleteRecordMutation,
        queryClient
    };
};
