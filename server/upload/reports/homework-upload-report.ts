'use server';

import { api } from '@/lib/apiService';

// Initial Data
export async function getHomeWorkInitialData(_pageId: number) {
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
                { asmcL_Id: 3, asmcL_ClassName: 'Grade 3', asmcL_ActiveFlag: true, mI_Id: 30 }
            ]
        }
    } as any;
}

export async function getHomeWorkReport(_data: any) {
    const url = '/HomeworkUploadFacade/home_work_report';
    return await api.post<any>('portal', url, _data);
}
// Get Report Data
export async function getHomeWorkReportData(_data: any) {
    // const url = `/HomeworkUpload/getreport_home`;
    // return await api.post<IHomeWorkReportResponse>('preadmission', url, data);

    // Static Data
    return {
        success: true,
        message: 'Static report data fetched',
        data: {
            homeworkreportlist: [
                {
                    icW_Id: 1,
                    icW_Topic: 'Homework 1',
                    asmcL_ClassName: 'Grade 1',
                    asmC_SectionName: 'Section A',
                    ismS_SubjectName: 'English',
                    icwupl_FileName: 'hw1.pdf',
                    icwupl_Date: '2026-01-13',
                    employeename: 'Teacher A',
                    userName: 'teacher_a',
                    icW_Attachment: 'att1',
                    FilesCount: 1
                },
                {
                    icW_Id: 2,
                    icW_Topic: 'Homework 2',
                    asmcL_ClassName: 'Grade 2',
                    asmC_SectionName: 'Section B',
                    ismS_SubjectName: 'History',
                    icwupl_FileName: 'hw2.pdf',
                    icwupl_Date: '2026-01-12',
                    employeename: 'Teacher B',
                    userName: 'teacher_b',
                    icW_Attachment: 'att2',
                    FilesCount: 2
                },
                {
                    icW_Id: 3,
                    icW_Topic: 'Math Exercises',
                    asmcL_ClassName: 'Grade 3',
                    asmC_SectionName: 'Section C',
                    ismS_SubjectName: 'Mathematics',
                    icwupl_FileName: 'math3.pdf',
                    icwupl_Date: '2026-01-11',
                    employeename: 'Teacher C',
                    userName: 'teacher_c',
                    icW_Attachment: 'att3',
                    FilesCount: 1
                },
                {
                    icW_Id: 4,
                    icW_Topic: 'Science Observations',
                    asmcL_ClassName: 'Grade 1',
                    asmC_SectionName: 'Section A',
                    ismS_SubjectName: 'Science',
                    icwupl_FileName: 'sci4.pdf',
                    icwupl_Date: '2026-01-10',
                    employeename: 'Teacher D',
                    userName: 'teacher_d',
                    icW_Attachment: null,
                    FilesCount: 0
                },
                {
                    icW_Id: 5,
                    icW_Topic: 'Social Studies Project',
                    asmcL_ClassName: 'Grade 2',
                    asmC_SectionName: 'Section B',
                    ismS_SubjectName: 'Social Studies',
                    icwupl_FileName: 'soc5.pdf',
                    icwupl_Date: '2026-01-09',
                    employeename: 'Teacher E',
                    userName: 'teacher_e',
                    icW_Attachment: 'att5',
                    FilesCount: 3
                },
                {
                    icW_Id: 6,
                    icW_Topic: 'Literature Review',
                    asmcL_ClassName: 'Grade 3',
                    asmC_SectionName: 'Section C',
                    ismS_SubjectName: 'Literature',
                    icwupl_FileName: 'lit6.pdf',
                    icwupl_Date: '2026-01-08',
                    employeename: 'Teacher F',
                    userName: 'teacher_f',
                    icW_Attachment: 'att6',
                    FilesCount: 1
                }
            ]
        }
    } as any;
}

// View Attachment Data
export async function viewHomeWorkAttachmentData(_data: any) {
    // const url = `/HomeworkUpload/viewData`;
    // return await api.post<IHomeWorkAttachmentResponse>('preadmission', url, data);

    // Static Data
    return {
        success: true,
        message: 'Static attachment data fetched',
        data: {
            attachementlist: [
                {
                    icwatT_FileName: 'hw_attachment.pdf',
                    icwatT_Attachment: 'https://example.com/hw_file.pdf',
                    icW_Attachment: 'att1'
                }
            ]
        }
    } as any;
}
