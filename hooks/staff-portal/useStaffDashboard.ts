import { STAFF_PORTAL_QUERY_KEYS } from '@/constants/query-keys';
import {
    getDashboardDetails,
    getNoticeBoard,
    getEvents,
    getAssetList,
    getMedicalRecords,
    getNoticeAttachments,
    changeProfile
} from '@/server/staff-portal/dashboard';
import type {
    INoticeFilterRequest,
    IAssetFilterRequest,
    IMedicalRecordRequest,
    IEmployeeDashboardResponse
} from '@/types/staff-portal/dashboard';
import { useQuery } from '@tanstack/react-query';

export const useStaffDashboard = () => {
    return useQuery({
        queryKey: [STAFF_PORTAL_QUERY_KEYS.STAFF_DASHBOARD],
        queryFn: async () => {
            const resp = await getDashboardDetails();
            return resp.data;
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useStaffNoticeBoard = (params: INoticeFilterRequest) => {
    return useQuery({
        queryKey: [STAFF_PORTAL_QUERY_KEYS.STAFF_NOTICE_BOARD, params],
        queryFn: async () => {
            const resp = await getNoticeBoard(params);
            return resp.data;
        },
        enabled: !!params,
    });
};

export const useStaffEvents = (params: { flag: string; OnClickOrOnChange: string }) => {
    return useQuery({
        queryKey: [STAFF_PORTAL_QUERY_KEYS.STAFF_EVENTS, params],
        queryFn: async () => {
            const resp = await getEvents(params);
            return resp.data;
        },
        enabled: !!params,
    });
};

export const useStaffAssets = (params: IAssetFilterRequest) => {
    return useQuery({
        queryKey: [STAFF_PORTAL_QUERY_KEYS.STAFF_ASSETS, params],
        queryFn: async () => {
            const resp = await getAssetList(params);
            return resp.data;
        },
        enabled: !!params,
    });
};

export const useStaffMedicalRecords = (params: IMedicalRecordRequest) => {
    return useQuery({
        queryKey: [STAFF_PORTAL_QUERY_KEYS.STAFF_MEDICAL_RECORDS, params],
        queryFn: async () => {
            const resp = await getMedicalRecords(params);
            return resp.data;
        },
        enabled: !!params.HRME_Id,
    });
};

export const useStaffNoticeAttachments = (INTB_Id: number) => {
    return useQuery({
        queryKey: [STAFF_PORTAL_QUERY_KEYS.STAFF_NOTICE_ATTACHMENTS, INTB_Id],
        queryFn: async () => {
            const resp = await getNoticeAttachments(INTB_Id);
            return resp.data;
        },
        enabled: !!INTB_Id,
    });
};

export { changeProfile };
