'use server';

import { api } from '@/lib/apiService';

// Mock Data for Toppers List Report

const ACADEMIC_YEARS = [
    { asmaY_Id: 2024, asmaY_Year: '2023-2024' },
    { asmaY_Id: 2025, asmaY_Year: '2024-2025' }
];

const CLASSES = [
    { asmcL_Id: 10, asmcL_ClassName: 'I' },
    { asmcL_Id: 11, asmcL_ClassName: 'II' },
    { asmcL_Id: 12, asmcL_ClassName: 'X' },
    { asmcL_Id: 13, asmcL_ClassName: 'XII' }
];

const SECTIONS = [
    { asmS_Id: 20, asmC_SectionName: 'A' },
    { asmS_Id: 21, asmC_SectionName: 'B' },
    { asmS_Id: 22, asmC_SectionName: 'C' }
];

const EXAMS = [
    { emE_Id: 100, emE_ExamName: 'Unit Test 1' },
    { emE_Id: 101, emE_ExamName: 'Mid Term' },
    { emE_Id: 102, emE_ExamName: 'Annual Exam' }
];

const SUBJECTS = [
    { ismS_Id: 501, ismS_SubjectName: 'English' },
    { ismS_Id: 502, ismS_SubjectName: 'Mathematics' },
    { ismS_Id: 503, ismS_SubjectName: 'Science' },
    { ismS_Id: 504, ismS_SubjectName: 'Social Studies' }
];

// Mock Student Data Generator
const generateToppers = (count: number, subjectwise: boolean) => {
    const list = [];
    const names = [
        'JOYABRATA PAUL',
        'ADRITO DAS',
        'AISHANYA SHOW',
        'ADRIJA CHHAULEY',
        'AHMAD AMIN',
        'PRACHURYA PANJA',
        'RANAJAY SAHA',
        'ALMAAN ALI KHAN'
    ];
    const sections = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D'];

    for (let i = 0; i < Math.min(count, names.length); i++) {
        if (subjectwise) {
            list.push({
                amsT_FirstName: names[i],
                amsT_AdmNo: 19860 + i,
                ASMCL_ClassName: 'II',
                ASMC_SectionName: sections[i],
                estmpS_MaxMarks: 80,
                estmpS_ObtainedMarks: 80 - Math.floor(Math.random() * 5),
                estmpS_SectionHighest: 80
            });
        } else {
            list.push({
                amsT_FirstName: names[i],
                amsT_AdmNo: 19860 + i,
                asmcL_ClassName: 'II',
                asmC_SectionName: sections[i],
                estmP_TotalMaxMarks: 500,
                estmP_TotalObtMarks: 480 - i * 5,
                estmP_Percentage: (96 - i).toFixed(2),
                estmP_SectionRank: i + 1
            });
        }
    }
    return list;
};

export async function getDetails() {
    return {
        acdlist: ACADEMIC_YEARS,
        catlist: [],
        ctlist: [] // Initially empty, fetched after year selection usually, or we can return all? Angular code does onselectAcdYear but bindData returns ctlist. Let's return classes here for simplicity matching the 'bindData' logic which returned everything.
        // usage: $scope.acdlist = promise.acdlist; ... $scope.ctlist = promise.ctlist;
        // So we should return all lists if possible or empty and let dependents fetch.
        // Grade Slab pattern used separate calls. Let's assume standard flow.
        // But wait, the JS `BindData` gets everything? `getDATA("ToppersListReport/getdetails")`.
        // Let's mimic that.
        // " ctlist = promise.ctlist "
    };
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
export async function getClasses(yearId: any) {
    // Return classes for the year
    return {
        ctlist: CLASSES
    };
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
export async function getSectionsAndExams(classId: any) {
    return {
        seclist: SECTIONS,
        examlist: EXAMS
    };
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
export async function getSubjects(data: any) {
    return {
        sublist: SUBJECTS
    };
}

export async function getReportDetails(data: any) {
    // Generate mock report based on parameters

    // Mimic the processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const isSubjectwise = data.subjectwise === true || data.subjectwise === 'true';
    const limit = Number.parseInt(data.topper) || 10;

    const reportData = generateToppers(limit, isSubjectwise);

    return {
        datareport: reportData,
        masterinstitution: [
            {
                mI_Name: "St. Thomas' Church School",
                mI_Address1: '3, Church Road, Howrah-711101 West Bengal, India',
                mI_Logo: '' // Use default in UI
            }
        ] // Mock Institution
    };
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
export async function getToppersReportDetails(data: any) {
    const url = '/toppers_list_report/toppers_list_report';
    const response = await api.post('exam', url,data);
    return response;
}
