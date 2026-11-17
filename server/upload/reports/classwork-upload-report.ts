'use server';

import { api } from '@/lib/apiService';

import type { IInitialData, IReportResponse, IAttachmentResponse, IClassWorkUploadReport } from '@/types/upload/reports/classwork-upload-report';

// Initial Data
export async function getInitialData(_pageId: number) {
    // const url = `/HomeworkUpload/Getdata_class/${pageId}`;
    // return await api.get<IInitialData>('preadmission', url);

    // Static Data
    return {
        success: true,
        message: 'Static data fetched',
        data: {
            classlist: [
                { asmcL_Id: 1, asmcL_ClassName: 'Grade 1', asmcL_ActiveFlag: true, mI_Id: 30 },
                { asmcL_Id: 2, asmcL_ClassName: 'Grade 2', asmcL_ActiveFlag: true, mI_Id: 30 },
                { asmcL_Id: 3, asmcL_ClassName: 'Grade 3', asmcL_ActiveFlag: true, mI_Id: 30 },
            ]
        }
    } as any;
}

// Get Report Data
export async function getReportData(_data: any) {
    const url = '/HomeworkUploadFacade/class_work_report';
     return await api.post<any>('portal', url, _data); 
}

// View Attachment Data
export async function viewAttachmentData(_data: any) {
    // const url = `/HomeworkUpload/viewData`;
    // return await api.post<IAttachmentResponse>('preadmission', url, data);

    // Static Data
    return {
        success: true,
        message: 'Static attachment data fetched',
        data: {
            attachementlist: [
                {
                    icwatT_FileName: 'attachment_v1.pdf',
                    icwatT_Attachment: 'https://example.com/file1.pdf',
                    icW_Attachment: 'att1'
                },
                {
                    icwatT_FileName: 'attachment_v2.jpg',
                    icwatT_Attachment: 'https://example.com/file2.jpg',
                    icW_Attachment: 'att1'
                }
            ]
        }
    } as any;
}

