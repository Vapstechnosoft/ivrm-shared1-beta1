'use server';

import { api } from '@/lib/apiService';
import type { IApproveRejectPayload } from '@/types/transport/transport-module/transaction/transport-approve';

// Initial Data: Academic Years, Classes, Routes
export async function getTransportApprovedInitialData() {
    const res = await api.get<any>('transport', 'TransportApproved/getdata/2');
    return res;
}

// Search Students
// export async function searchTransportApprovedDetails(payload: any) {
//     const res = await api.post<any>('transport', 'TransportApproved/searchdetails', payload);
//     return res;
// }

export async function searchTransportApprovedDetails(data: any) {
    const url = '/transport_approved/search_transport_approved_deatils';
    return await api.post<any>('transport', url, data);
}

// Approve or Reject Students
export async function saveTransportApprovedList(payload: IApproveRejectPayload) {
    const res = await api.post<any>('transport', 'TransportApproved/savelist', payload);
    return res;
}

// Edit/Approve (Specific endpoint mentioned in legacy code, preserving for safety)
export async function editTransportApproved(payload: any) {
    const res = await api.post<any>('transport', 'TransportApproved/editapprove', payload);
    return res;
}

// Cancel Rejection (Specific endpoint mentioned in legacy code)
export async function cancelTransportRejection(payload: any) {
    const res = await api.post<any>('transport', 'TransportApproved/CancelRejection', payload);
    return res;
}

// Grid on Change (For Approved/Rejected History list)
// export async function getTransportApprovedHistory(data: { ASMAY_Id: number }) {
//     const res = await api.post<any>('transport', 'TransportApproved/gridaconchange', data);
//     return res;
// }

export async function getTransportApprovedHistory(ASMAY_Id: number) {
    const url = `/transport_approved/aprrove_reject_grid_list/${ASMAY_Id}`;
    return await api.get<any>('transport', url);
}
