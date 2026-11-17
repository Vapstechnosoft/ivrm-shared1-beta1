'use server';

import { api } from '@/lib/apiService';
import { LeaveApplyPayload, LeaveLoadData, OnlineLeaveApp_DTO } from './types';

const CONTROLLER = 'OnlineLeaveApp';

export async function getLeaveLoadData(): Promise<LeaveLoadData> {
    try {
        const response = await api.get<any>('portal', `/${CONTROLLER}/get-leave-details`);

        // Debug logs
        if (response.data) {
            console.log("DEBUG: Raw API Data:", JSON.stringify(response.data).substring(0, 500));
        }

        const data = response.data;

        // Handle case sensitivity issues by checking for variations
        const studentdetails = data?.studentdetails || data?.studentDetails || data?.StudentDetails || [];
        const allstuddata = data?.allstuddata || data?.allStudData || data?.Allstuddata || data?.AllStudData || [];
        const roletype = data?.roletype || data?.roleType || data?.RoleType || "";

        return {
            roletype: roletype,
            studentdetails: studentdetails,
            allstuddata: allstuddata
        };
    } catch (error) {
        console.error("Error fetching Leave load data:", error);
        // Return empty structure to prevent crash
        return {
            roletype: "",
            studentdetails: [],
            allstuddata: []
        };
    }
}

export async function applyLeave(data: LeaveApplyPayload) {
    try {
        const payload: OnlineLeaveApp_DTO = {
            aslA_Id: data.ASLA_Id,
            aslA_ApplyDate: data.ASLA_ApplyDate,
            aslA_FromDate: data.ASLA_FromDate,
            aslA_ToDate: data.ASLA_ToDate,
            aslA_Flag: data.ASLA_Flag,
            aslA_LeaveId: data.ASLA_LeaveId,
            aslA_Reason: data.ASLA_Reason
        };

        const response = await api.post<OnlineLeaveApp_DTO>('portal', `/${CONTROLLER}/get-leave-apply-details`, payload);
        return {
            returnval: response.data?.returnval ?? false,
            // duplicate: false // API doesn't seem to return duplicate flag in DTO, assuming returnval handles success
        };
    } catch (error) {
        console.error("Error applying Leave:", error);
        return {
            returnval: false
        };
    }
}

export async function cancelLeave(leaveId: number) {
    try {
        const payload: OnlineLeaveApp_DTO = {
            aslA_Id: leaveId
        };
        const response = await api.post<OnlineLeaveApp_DTO>('portal', `/${CONTROLLER}/cancel-leave`, payload);
        return {
            returnval: response.data?.returnval ?? false
        };
    } catch (error) {
        console.error("Error cancelling Leave:", error);
        return {
            returnval: false
        };
    }
}

export async function deactiveLeave(leaveId: number) {
    try {
        const payload: OnlineLeaveApp_DTO = {
            aslA_Id: leaveId
        };
        const response = await api.post<OnlineLeaveApp_DTO>('portal', `/${CONTROLLER}/deactive-leave`, payload);
        return {
            returnval: response.data?.returnval ?? false
        };
    } catch (error) {
        console.error("Error deactivating Leave:", error);
        return {
            returnval: false
        };
    }
}
