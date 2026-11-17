'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import { auth } from '@/lib/auth';
import type { ApiSearchparams } from '@/types';
import type { IAlumniFriendRequest, IAlumniFriendRequestLoadResponse, IAlumniProfileResponse } from '@/types/alumni/alumni-friend-request';

export async function getAlumniFriendRequestData(searchParams?: ApiSearchparams) {
    const session = await auth();
    const roleFlag = (searchParams as any)?.Role_flag || (session as any)?.role || 'Alumni';
    const ivrmrtId = (searchParams as any)?.IVRMRT_Id || (session as any)?.ivrmrT_Id || 30;
    const almstId = (session as any)?.almsT_Id || 0;
    const asmayId = (session as any)?.asmaY_Id || 0;

    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'searchParams');
    const url = `/Alumni_Student_FriendRequest/getdata?IVRMRT_Id=${ivrmrtId}&ALMST_Id=${almstId}&ASMAY_Id=${asmayId}&Role_flag=${roleFlag}&${urlParams}`;

    return await api.get<IAlumniFriendRequestLoadResponse>('alumni', url);
}

export async function searchAlumniFriendRequest(data: any) {
    const url = '/AlumniSearch';
    return await api.post<IAlumniFriendRequestLoadResponse>('alumni', url, data);
}

export async function viewAlumniProfile(data: { almsT_Id: number }) {
    const url = '/Alumni_Student_FriendRequest/viewprofile';
    const payload = {
        almsT_Id: data.almsT_Id
    };
    return await api.post<IAlumniProfileResponse>('alumni', url, payload);
}

export async function sendFriendRequest(data: {
    requestalumni: { almsT_Id: number }[];
}) {
    const url = '/Alumni_Student_FriendRequest/send_request';
    const payload = {
        requestalumni: data.requestalumni
    };
    return await api.post('alumni', url, payload);
}

export async function getAlumniFriendRequestReceivedData() {
    const url = '/Alumni_Student_FriendRequest/getdata_request';
    return await api.post<IAlumniFriendRequest[]>('alumni', url, { id: 1 });
}

export async function handleFriendRequestAction(data: {
    action: 'Accept' | 'Cancel';
    requestalumniaccept: { ALMST_Id: number; ALSFRND_RequestDate: string }[];
}) {
    const url = '/Alumni_Student_FriendRequest/friend_request_accept';
    const payload = {
        Cancel: data.action,
        requestalumniaccept: data.requestalumniaccept
    };
    return await api.post<any>('alumni', url, payload);
}
