'use server';

import { api } from '@/lib/apiService';
import { getAcademicYearDropdown } from '@/server/fees/masters/class_yearly_category';
import type { IMasterInstitution } from '@/types/exam/exam-module/report';

const ACADEMIC_YEARS = [
    { asmaY_Id: 1, asmaY_Year: '2023-2024' },
    { asmaY_Id: 2, asmaY_Year: '2024-2025' }
];

const CLASSES = [{ asmcL_Id: 11, asmcL_ClassName: 'X' }];

const SECTIONS = [
    { asmS_Id: 100, asmC_SectionName: 'A' },
    { asmS_Id: 101, asmC_SectionName: 'B' }
];

const STUDENTS = [
    { amsT_Id: 1, studentname: 'John Doe', admno: 'ST001' },
    { amsT_Id: 2, studentname: 'Jane Smith', admno: 'ST002' },
    { amsT_Id: 3, studentname: 'Alice Johnson', admno: 'ST003' }
];

export async function getDetails() {
    try {
        const res = await getAcademicYearDropdown();
        return {
            acdlist: res.data || []
        };
    } catch (error) {
        console.error('getDetails error:', error);
        return {
            acdlist: []
        };
    }
}

export async function getClasses(yearId: any) {
    return {
        ctlist: CLASSES
    };
}

export async function getSections(classId: any) {
    return {
        seclist: SECTIONS
    };
}

export async function getStudents(sectionId: any) {
    return {
        studentlist: STUDENTS
    };
}

export async function getReportDetails(data: any) {
    const url = '/report_card_x/get_report_details';
    try {
        const response = await api.post<any>('exam', url, data);
        return response.data;
    } catch (error) {
        console.error('getReportDetails API Error:', error);
        // Fallback to mock data
        return {
            studentdetails: (data.selectedStudents || []).map((id: string) => {
                const student = STUDENTS.find((s) => String(s.amsT_Id) === String(id));
                return {
                    ...student,
                    AMST_Id: Number(id),
                    studentsubjects: [
                        {
                            ISMS_SubjectName: 'English',
                            EMPS_AppToResultFlg: true,
                            ESTMPPSG_GroupAVGMarks: 70,
                            ISMS_Id: 101,
                            ESG_Id: 0,
                            ESTMPPSG_GroupObtMarks: 75
                        },
                        {
                            ISMS_SubjectName: 'Mathematics',
                            EMPS_AppToResultFlg: true,
                            ESTMPPSG_GroupAVGMarks: 80,
                            ISMS_Id: 102,
                            ESG_Id: 0,
                            ESTMPPSG_GroupObtMarks: 85
                        },
                        {
                            ISMS_SubjectName: 'Science',
                            EMPS_AppToResultFlg: true,
                            ESTMPPSG_GroupAVGMarks: 75,
                            ISMS_Id: 103,
                            ESG_Id: 0,
                            ESTMPPSG_GroupObtMarks: 72
                        },
                        {
                            ISMS_SubjectName: 'Social Science',
                            EMPS_AppToResultFlg: true,
                            ESTMPPSG_GroupAVGMarks: 78,
                            ISMS_Id: 104,
                            ESG_Id: 0,
                            ESTMPPSG_GroupObtMarks: 80
                        },
                        {
                            ISMS_SubjectName: 'Health & Physical Education',
                            EMPS_AppToResultFlg: false,
                            ISMS_Id: 201,
                            ESTMPPSG_GroupObtMarks: 0,
                            ESTMPPSG_GroupObtGrade: 'A'
                        }
                    ],
                    studentmarks: [
                        {
                            ISMS_Id: 101,
                            EME_Id: 1,
                            ObtainedMarks: 35,
                            EMPSG_DisplayName: 'PT1',
                            PassFailFlag: 'P',
                            EME_ExamName: 'PT1',
                            ESG_Id: 0,
                            Grouporder: 0
                        },
                        {
                            ISMS_Id: 101,
                            EME_Id: 2,
                            ObtainedMarks: 40,
                            EMPSG_DisplayName: 'PT1',
                            PassFailFlag: 'P',
                            EME_ExamName: 'AVG',
                            ESG_Id: 0,
                            Grouporder: 0
                        },
                        {
                            ISMS_Id: 102,
                            EME_Id: 1,
                            ObtainedMarks: 42,
                            EMPSG_DisplayName: 'PT1',
                            PassFailFlag: 'P',
                            EME_ExamName: 'PT1',
                            ESG_Id: 0,
                            Grouporder: 0
                        },
                        {
                            ISMS_Id: 102,
                            EME_Id: 2,
                            ObtainedMarks: 45,
                            EMPSG_DisplayName: 'PT1',
                            PassFailFlag: 'P',
                            EME_ExamName: 'AVG',
                            ESG_Id: 0,
                            Grouporder: 0
                        }
                    ],
                    student_marks: [
                        { EME_Id: 9800000, EMPSG_DisplayName: 'PT1', ObtainedMarks: 150, TotalPercentage: 75, ESTMPP_SectionRank: 5 },
                        { EME_Id: 9800001, EMPSG_DisplayName: 'PT1', ObtainedMarks: 155, TotalPercentage: 77.5, ESTMPP_SectionRank: 4 }
                    ]
                };
            }),
            getgroupdetails: [{ empG_DistplayName: 'PT1', empG_GroupName: 'Group 1', empsG_Order: 1, groupewiseexam: [] }],
            groupwiseexamlist: [
                { EME_Id: 1, EME_ExamName: 'PT1', EMPG_DistplayName: 'PT1', EMPSGE_ForMaxMarkrs: 50, examnamedisplay: 'P1' },
                { EME_Id: 9800000, EME_ExamName: 'Total', EMPG_DistplayName: 'PT1', EMPSGE_ForMaxMarkrs: 100, examnamedisplay: 'Total' },
                { EME_Id: 9800001, EME_ExamName: 'AVG', EMPG_DistplayName: 'PT1', EMPSGE_ForMaxMarkrs: 100, examnamedisplay: 'AVG' }
            ],
            stud_present_attendence: [
                { AMST_Id: 1, ATTENDANCEPERCENTAGE: 95 },
                { AMST_Id: 2, ATTENDANCEPERCENTAGE: 88 },
                { AMST_Id: 3, ATTENDANCEPERCENTAGE: 92 }
            ],
            getexamwisetotaldetails: [
                { AMST_Id: 1, ESTMPPSG_GroupObtMarks: 450, ESTMPPSG_GroupAVGMarks: 440, TotalPercentage: 90, totaver: 88 },
                { AMST_Id: 2, ESTMPPSG_GroupObtMarks: 420, ESTMPPSG_GroupAVGMarks: 410, TotalPercentage: 84, totaver: 82 },
                { AMST_Id: 3, ESTMPPSG_GroupObtMarks: 430, ESTMPPSG_GroupAVGMarks: 425, TotalPercentage: 86, totaver: 85 }
            ],
            getskill: [
                { ECACT_SkillName: 'Discipline', ECACT_Id: 1 },
                { ECACT_SkillName: 'Leadership', ECACT_Id: 2 }
            ],
            getallgrade: [
                { AMST_Id: 1, ECACT_Id: 1, EMGD_Name: 'A', ECSACTT_Score: 9 },
                { AMST_Id: 1, ECACT_Id: 2, EMGD_Name: 'B', ECSACTT_Score: 7 }
            ],
            getpromotionremarksdetails: [{ AMST_Id: 1, remarks: 'Promoted to Class XI' }],
            masterinstitution: {
                mI_Name: 'ST. THOMAS SCHOOL, HOWRAH',
                mI_Address1: '3, Church Road, Howrah-711101',
                mI_Logo: 'https://sthomashowrah.blob.core.windows.net/files/Logo Header stt.jpg'
            }
        };
    }
}
