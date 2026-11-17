'use server';

import { api } from '@/lib/apiService';
import type { IHomeWork, IHomeWorkMarksSearch } from '@/schemas/upload/transactions/ivrm-homework.schema';

import { revalidatePath } from 'next/cache';

// Mock data store
const homeWorkData: any[] = [
    {
        ihW_Id: 1,
        asmaY_Id: 1,
        asmcL_Id: 1,
        hm_section_list: [{ asmS_Id: 1 }],
        ismS_Id: 1,
        ihW_Topic: 'Quadratic Equations',
        ihW_Date: new Date().toISOString(),
        ihW_Assignment: 'Solve Exercises 4.1 to 4.3',
        ihW_AssignmentNo: '01',
        ihW_ActiveFlag: true,
        ihW_FilePath_Array: [],
        asmcL_ClassName: 'Class X',
        asmC_SectionName: 'A',
        ismS_SubjectName: 'Maths',
        createdDate: '26-10-2023',
        createdTime: '10:30 AM',
        filesCount: 0
    }
];
export async function toggleUploadHomeWork(id: number) {
    const url = `/employee_student_home_work/active_deactive_home_work/${id}`;
    return await api.put('portal', url);
}

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
        classwork: homeWorkData,
        academicyear: [{ asmaY_Id: 1 }]
    };
}

export async function fetchClasses(yearId: number) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
        classlist: [
            { asmcL_Id: 1, asmcL_ClassName: 'Class I' },
            { asmcL_Id: 2, asmcL_ClassName: 'Class II' },
            { asmcL_Id: 3, asmcL_ClassName: 'Class X' }
        ],
        class_gridlist: homeWorkData.filter((h) => h.asmaY_Id === yearId)
    };
}

export async function fetchSections(classId: number, yearId: number) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const sections = [
        { asmS_Id: 1, asmC_SectionName: 'A', asmcL_Id: classId },
        { asmS_Id: 2, asmC_SectionName: 'B', asmcL_Id: classId }
    ];
    return { sectionlist: sections };
}

export async function fetchSubjects(classId: number, yearId: number, sectionList: any[]) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const subjects = [
        { ismS_Id: 1, ismS_SubjectName: 'Maths' },
        { ismS_Id: 2, ismS_SubjectName: 'Science' }
    ];
    return { subjectlist: subjects };
}

export async function saveHomeWork(data: IHomeWork) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
        if (data.ihW_Id) {
            const index = homeWorkData.findIndex((t) => t.ihW_Id === data.ihW_Id);
            if (index !== -1) {
                homeWorkData[index] = { ...homeWorkData[index], ...data };
                revalidatePath('/upload/transactions/ivrm-homework');
                return { success: true, message: 'Homework updated successfully', dulicate: false };
            }
            return { success: false, message: 'Record not found', dulicate: false };
        } else {
            const newId = (homeWorkData.length > 0 ? Math.max(...homeWorkData.map((t) => t.ihW_Id || 0)) : 0) + 1;
            homeWorkData.push({ ...data, ihW_Id: newId, ihW_ActiveFlag: true, filesCount: data.ihW_FilePath_Array?.length || 0 });
            revalidatePath('/upload/transactions/ivrm-homework');
            return { success: true, message: 'Homework saved successfully', dulicate: false };
        }
    } catch (error) {
        return { success: false, message: 'Failed to save homework', dulicate: false };
    }
}

export async function deleteHomeWork(id: number) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = homeWorkData.findIndex((t) => t.ihW_Id === id);
    if (index !== -1) {
        homeWorkData[index].ihW_ActiveFlag = !homeWorkData[index].ihW_ActiveFlag;
        revalidatePath('/upload/transactions/ivrm-homework');
        return { success: true, message: `Record ${homeWorkData[index].ihW_ActiveFlag ? 'activated' : 'deactivated'} successfully` };
    }
    return { success: false, message: 'Record not found' };
}

// Marks Entry Actions
export async function fetchHomeWorkMarksList(params: IHomeWorkMarksSearch) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const students = Array.from({ length: 10 }).map((_, i) => ({
        AMST_Id: 100 + i,
        studentname: `Student ${i + 1}`,
        rollyo: `${i + 1}`,
        admNo: `ADM00${i + 1}`,
        IHWUPL_Id: i % 2 === 0 ? 500 + i : undefined,
        IHWUPL_Marks: i % 2 === 0 ? (80 + i).toString() : '',
        IHWUPL_StaffRemarks: i % 2 === 0 ? 'Good progress' : '',
        IHWUPL_StaffUpload: '',
        FileName: '',
        checkedvalue: i % 2 === 0,
        studentUploads:
            i % 3 === 0
                ? [
                      {
                          ihwupl_Id: 700 + i,
                          ihwupl_FileName: 'hw_solution.png',
                          ihwupl_Attachment: 'https://example.com/hw_solution.png',
                          ihwupl_Date: '2023-10-26'
                      }
                  ]
                : []
    }));
    return { gethomework_list: students };
}

export async function saveHomeWorkMarks(data: any) {
    console.log('Saving HomeWork Marks:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: 'Marks saved successfully' };
}

export async function fetchStudentUploads(AMST_Id: number, ihW_Id: number, IHWUPL_Id: number) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
        viewstudentupload: [
            {
                ihwupL_Id: IHWUPL_Id,
                ihwuplatT_StaffUpload: '',
                ihwuplatT_StaffRemarks: '',
                ihwuplatT_FileName: '',
                student_attachment_list: [
                    {
                        ihwuplatT_Attachment: 'https://example.com/file1.pdf',
                        ihwuplatT_FileName: 'homework_part1.pdf'
                    }
                ]
            }
        ]
    };
}
