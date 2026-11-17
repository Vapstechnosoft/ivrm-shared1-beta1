'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IAlumniNoticeBoard } from '@/types/alumni/alumni-notice-board';

export interface IAlumniNoticeBoardResponse {
    success: boolean;
    message: string;
    data: IAlumniNoticeBoard[];
    alumninoticeboardlist?: IAlumniNoticeBoard[]; // Legacy support
    total?: number;
    page?: number;
    page_size?: number;
    asmaY_Id?: number;
    mI_Id?: number;
}

export async function getAlumniNoticeBoardData(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'alntB_Title,alntB_StartDate,alntB_EndDate');
    const url = `/Alumni_NoticeBoard/load_data?${urlParams}`;

    return await api.get<IAlumniNoticeBoardResponse>('alumni', url);
}

export async function saveAlumniNoticeBoard(data: IAlumniNoticeBoard) {
    const url = '/Alumni_NoticeBoard/AddOrUpdateAlumniNoticeBoard';
    return await api.post('alumni', url, data);
}

export async function deactivateAlumniNoticeBoard(id: number) {
    const url = `/Alumni_NoticeBoard/toggle_alumni_notice?alntb_Id=${id}`;
    return await api.post('alumni', url, {});
}

export async function editAlumniNoticeBoard(id: number) {
    const url = `/Alumni_NoticeBoard/alumni_notice_editdetails/${id}`;
    return await api.post<{ editdetails: IAlumniNoticeBoard[]; editdetailsfiles: any[] }>('alumni', url, {});
}

export async function viewAlumniNoticeBoard(id: number) {
    const url = `/SchoolALUDASH/viewnotice?ALNTB_Id=${id}`;
    return await api.get<{ attachementlist: any[] }>('alumni', url);
}
