'use server';

import { api } from '@/lib/apiService';

// Initial Data
export async function getNoticeBoardInitialData(_pageId: number) {
    // const url = `/HomeworkUpload/Getdata_class/${pageId}`;
    // return await api.get<INoticeBoardInitialData>('preadmission', url);

    // Static Data
    return {
        success: true,
        message: 'Static data fetched',
        data: {
            classlist: [
                { asmcL_Id: 1, asmcL_ClassName: 'Grade 1', asmcL_ActiveFlag: true, mI_Id: 30 },
                { asmcL_Id: 2, asmcL_ClassName: 'Grade 2', asmcL_ActiveFlag: true, mI_Id: 30 }
            ],
            acayear: [
                { asmaY_Id: 1, asmaY_Year: '2024-2025', asmaY_From_Date: '2024-06-01', asmaY_To_Date: '2025-05-31' },
                { asmaY_Id: 2, asmaY_Year: '2025-2026', asmaY_From_Date: '2025-06-01', asmaY_To_Date: '2026-05-31' }
            ]
        }
    } as any;
}
export async function getNoticeBoardReport(_data: any) {
    const url = '/HomeworkUploadFacade/notice_board_report';
    return await api.post<any>('portal', url, _data);
}

// Get Report Data
export async function getNoticeBoardReportData(_data: any) {
    // const url = `/HomeworkUpload/getreport_notice`;
    // return await api.post<INoticeBoardReportResponse>('preadmission', url, data);

    // Static Data
    return {
        success: true,
        message: 'Static report data fetched',
        data: {
            noticereportlist: [
                {
                    intB_Id: 1,
                    intB_Title: 'School Reopening',
                    intB_Description: 'School will reopen on June 1st.',
                    intB_StartDate: '2026-06-01',
                    intB_EndDate: '2026-06-15',
                    intB_DisplayDate: '2026-05-25',
                    intbupl_Date: '2026-05-25',
                    asmcL_ClassName: 'Grade 1',
                    asmC_SectionName: 'Section A',
                    intB_Attachment: 'notice1',
                    employeename: 'Principal',
                    userName: 'principal',
                    filecount: 1
                },
                {
                    intB_Id: 2,
                    intB_Title: 'Annual Day',
                    intB_Description: 'Annual day celebrations on Dec 20.',
                    intB_StartDate: '2026-12-20',
                    intB_EndDate: '2026-12-20',
                    intB_DisplayDate: '2026-12-10',
                    intbupl_Date: '2026-12-10',
                    asmcL_ClassName: 'Grade 2',
                    asmC_SectionName: 'Section B',
                    intB_Attachment: 'notice2',
                    employeename: 'Coordinator',
                    userName: 'coordinator',
                    filecount: 0
                },
                {
                    intB_Id: 3,
                    intB_Title: 'PTA Meeting',
                    intB_Description: 'Parent-Teacher Meeting next Saturday.',
                    intB_StartDate: '2026-02-15',
                    intB_EndDate: '2026-02-15',
                    intB_DisplayDate: '2026-02-08',
                    intbupl_Date: '2026-02-08',
                    asmcL_ClassName: 'Grade 3',
                    asmC_SectionName: 'Section C',
                    intB_Attachment: 'notice3',
                    employeename: 'Teacher A',
                    userName: 'teacher_a',
                    filecount: 1
                },
                {
                    intB_Id: 4,
                    intB_Title: 'Sports Day Schedule',
                    intB_Description: 'Schedule for the upcoming sports meet.',
                    intB_StartDate: '2026-03-10',
                    intB_EndDate: '2026-03-12',
                    intB_DisplayDate: '2026-03-01',
                    intbupl_Date: '2026-03-01',
                    asmcL_ClassName: 'Grade 1',
                    asmC_SectionName: 'Section B',
                    intB_Attachment: 'notice4',
                    employeename: 'Sports Dept',
                    userName: 'sports_dept',
                    filecount: 2
                },
                {
                    intB_Id: 5,
                    intB_Title: 'Health Checkup',
                    intB_Description: 'Mandatory health checkup for all students.',
                    intB_StartDate: '2026-04-05',
                    intB_EndDate: '2026-04-07',
                    intB_DisplayDate: '2026-03-25',
                    intbupl_Date: '2026-03-25',
                    asmcL_ClassName: 'Grade 2',
                    asmC_SectionName: 'Section A',
                    intB_Attachment: null,
                    employeename: 'Nurse',
                    userName: 'nurse',
                    filecount: 0
                },
                {
                    intB_Id: 6,
                    intB_Title: 'Summer Camp',
                    intB_Description: 'Enroll for the summer camp programs.',
                    intB_StartDate: '2026-05-01',
                    intB_EndDate: '2026-05-30',
                    intB_DisplayDate: '2025-04-15',
                    intbupl_Date: '2026-04-15',
                    asmcL_ClassName: 'Grade 3',
                    asmC_SectionName: 'Section B',
                    intB_Attachment: 'notice6',
                    employeename: 'Coordinator',
                    userName: 'coordinator',
                    filecount: 1
                }
            ]
        }
    } as any;
}

// View Attachment Data
export async function viewNoticeBoardAttachmentData(_data: { INTB_Id: number }) {
    // const url = `/StudentDashboard/viewnotice`;
    // return await api.post<INoticeBoardAttachmentResponse>('preadmission', url, data);

    // Static Data
    return {
        success: true,
        message: 'Static attachment data fetched',
        data: {
            attachementlist: [
                {
                    intB_Id: 1,
                    intB_File_Path: 'https://example.com/notice_file.pdf',
                    intB_File_Name: 'notice_details.pdf'
                }
            ]
        }
    } as any;
}
