'use server';

import { getAcademicYearDropdown } from '@/server/fees/masters/class_yearly_category';

const ACADEMIC_YEARS = [{ asmaY_Id: 2023, asmaY_Year: '2023-2024' }];

const CLASSES = [
    { asmcL_Id: 10, asmcL_ClassName: 'I' },
    { asmcL_Id: 11, asmcL_ClassName: 'II' }
];

const SECTIONS = [
    { asmS_Id: 100, asmC_SectionName: 'A' },
    { asmS_Id: 101, asmC_SectionName: 'B' }
];

const TERMS = [{ empG_GroupName: 'Term 1' }, { empG_GroupName: 'Term 2' }];

const STUDENTS = [
    { amsT_Id: 1, studentname: 'John Doe', amsT_AdmNo: 'A001' },
    { amsT_Id: 2, studentname: 'Jane Smith', amsT_AdmNo: 'A002' },
    { amsT_Id: 3, studentname: 'Bob Johnson', amsT_AdmNo: 'A003' }
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

export async function getTermsAndStudents(sectionId: any) {
    return {
        termlist: TERMS,
        studentlist: STUDENTS
    };
}

export async function getReportDetails(data: any) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const isSuperAverage = data.superAverage === true || data.superAverage === 'true';

    const common = {
        YearName: '2023-2024',
        stream: 'I',
        section: 'A',
        empG_GroupName: isSuperAverage ? 'Super Average' : data.EMPG_GroupName || 'Term 1'
    };

    if (isSuperAverage) {
        // Structure for Super Average table
        return {
            ...common,
            getstudentwisesubjectlist: [{ ISMS_SubjectName: 'English' }, { ISMS_SubjectName: 'Maths' }],
            getstudentmarksdetails_temp: [
                {
                    AMST_AdmNo: 'A001',
                    studentname: 'John Doe',
                    AMST_Id: 1,
                    English: 85,
                    Maths: 90
                }
            ],
            St_ThomosTotal: [{ AMST_Id: 1, ESTMPPSG_GroupObtMarks: 175, TotalPercentage: 87.5 }]
        };
    } else {
        // Structure for Normal Report
        return {
            ...common,
            piotsubjets: [
                { ISMS_SubjectName: 'English (100)', SubjectName: 'English', Flag: 0, ISMS_Id: 1 },
                { ISMS_SubjectName: 'Maths (100)', SubjectName: 'Maths', Flag: 0, ISMS_Id: 2 }
            ],
            getskill: [{ ECACT_SkillName: 'Discipline' }],
            getstudentmarksdetails_temp: [
                {
                    AMST_AdmNo: 'A001',
                    studentname: 'John Doe',
                    AMST_Id: 1,
                    English: 85,
                    Maths: 90,
                    TotalMarks: 175,
                    TotalPercentage: 87.5
                }
            ],
            getallgrade: [{ AMST_Id: 1, ECACT_SkillName: 'Discipline', EMGD_Name: 'A' }]
        };
    }
}
