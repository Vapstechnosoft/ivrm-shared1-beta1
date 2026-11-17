'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';

import type { ApiSearchparams } from '@/types';
import type { IClassWorkDetails, ISubjectDetails } from '@/types/upload/reports/classwork-upload-report';
import { revalidatePath } from 'next/cache';

const classWorkData: any[] = [
    {
        icW_Id: 1,
        asmaY_Id: 1,
        asmcL_Id: 1,
        hm_section_list: [{ asmS_Id: 1 }],
        ismS_Id: 1,
        icW_Topic: 'Algebra Basics',
        icW_SubTopic: 'Linear Equations',
        icW_Content: 'Introduction to variables and constants.',
        icW_FromDate: new Date().toISOString(),
        icW_ToDate: new Date().toISOString(),
        icW_Assignment: true,
        icW_TeachingAid: false,
        icW_Evaluation: true,
        icW_ActiveFlag: true,
        ICW_FilePath_Array: [],
        asmcL_ClassName: 'Class I',
        asmC_SectionName: 'A',
        ismS_SubjectName: 'Maths'
    }
];

export async function fetchInitialData() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
        yearlist: [
            { asmaY_Id: 1, asmaY_Year: '2023-2024' },
            { asmaY_Id: 2, asmaY_Year: '2024-2025' }
        ],
        classlist: [
            { asmcL_Id: 1, asmcL_ClassName: 'Class I' },
            { asmcL_Id: 2, asmcL_ClassName: 'Class II' },
            { asmcL_Id: 3, asmcL_ClassName: 'Class X' }
        ],
        classwork: classWorkData
    };
}

export async function fetchSections(classId: number) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const sections = [
        { asmS_Id: 1, asmC_SectionName: 'A', asmcL_Id: classId },
        { asmS_Id: 2, asmC_SectionName: 'B', asmcL_Id: classId },
        { asmS_Id: 3, asmC_SectionName: 'C', asmcL_Id: classId }
    ];
    return { sectionlist: sections };
}

export async function fetchSubjects(classId: number, sectionList: any[]) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const subjects = [
        { ismS_Id: 1, ismS_SubjectName: 'Maths' },
        { ismS_Id: 2, ismS_SubjectName: 'Science' },
        { ismS_Id: 3, ismS_SubjectName: 'English' },
        { ismS_Id: 4, ismS_SubjectName: 'Kannada' }
    ];
    return { subjectlist: subjects };
}

export async function GetClassWorkUploadedList(data: any, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = '/ivrm_class_work/class_work_grid_details';
    return await api.post<IClassWorkDetails[]>('portal', url, data);
}

export async function getSubjectsDropDownByAcademicYearandClassandSectionlist(data: any) {
    const url = '/ivrm_class_work/subject_list_by_class_section';
    return await api.post<ISubjectDetails>('portal', url, data);
}

export async function uploadClassWork(payload: any) {
    const url = '/ivrm_class_work/upload_classwork';
    return await api.post<any>('portal', url, payload);
}
export async function toggleUploadClassWork(id: number) {
    const url = `/ivrm_class_work/active_deactive_class_work/${id}`;
    return await api.put('portal', url);
}

export async function GetHomeWorkUploadedList(data: any, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = '/ivrm_class_work/home_work_grid_details';
    return await api.post<IClassWorkDetails[]>('portal', url, data);
}

// Class work verify using based on  privileges
export async function SubjectsDropDownByAcademicYearandClassandSection(data: any) {
    const url = '/ivrm_class_work/subjects_by_class_work_verify';
    return await api.post<ISubjectDetails>('portal', url, data);
}

export const fetchClassWorkStudents = async (icW_Id: number): Promise<any[]> => {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            const students = Array.from({ length: 10 }).map((_, i) => ({
                amst_Id: 100 + i,
                studentName: `Student ${i + 1}`,
                rollNo: `${i + 1}`,
                admNo: `ADM00${i + 1}`,
                icwupl_Id: i % 2 === 0 ? 500 + i : undefined,
                icwupl_Marks: i % 2 === 0 ? (80 + i).toString() : '',
                icwupl_StaffRemarks: i % 2 === 0 ? 'Good' : '',
                icwupl_StaffUpload: '',
                icwupl_FileName: '',
                checked: i % 2 === 0,
                studentUploads:
                    i % 3 === 0
                        ? [
                              {
                                  icwupl_Id: 700 + i,
                                  icwupl_FileName: 'assignment.pdf',
                                  icwupl_Attachment: 'https://example.com/assignment.pdf',
                                  icwupl_Date: '2023-10-26'
                              }
                          ]
                        : []
            }));
            resolve(students);
        }, 500);
    });
};

export const saveClassWorkMarks = async (data: any) => {
    console.log('Saving Marks:', data);
    return new Promise<{ success: boolean; message: string }>((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: 'Marks saved successfully' });
        }, 1000);
    });
};

export async function deleteClassWork(id: number) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = classWorkData.findIndex((t) => t.icW_Id === id);
    if (index !== -1) {
        classWorkData[index].icW_ActiveFlag = !classWorkData[index].icW_ActiveFlag;
        revalidatePath('/upload/transactions/ivrm-classwork');
        const status = classWorkData[index].icW_ActiveFlag ? 'activated' : 'deactivated';
        return { success: true, message: `Record ${status} successfully` };
    }
    return { success: false, message: 'Record not found' };
}
