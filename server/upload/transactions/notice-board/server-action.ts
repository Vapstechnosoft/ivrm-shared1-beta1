'use server';
import { api } from '@/lib/apiService';
import type { IMasterFeeBusRoutingMappingList } from '@/types/fees/masters/masters';
// Mock data store
// const noticeBoardData: INoticeBoard[] = [
//     {
//         intB_Id: 1,
//         asmaY_Id: 1,
//         ntB_TTSylabusFlg: 'O', // Other
//         intB_Title: 'Holiday Notice',
//         intB_Description: 'School remains closed on 26th Jan.',
//         intB_StartDate: new Date('2024-01-20'),
//         intB_EndDate: new Date('2024-01-26'),
//         intB_DisplayDate: new Date('2024-01-20'),
//         intB_DispalyDisableFlg: true,
//         intB_ActiveFlag: true,
//         intB_FilePath_Array: [],
//         check_student: true,
//         check_staff: false,
//         createdDate: '2024-01-19',
//         displayDate: '2024-01-20',
//         asmcL_Id: [],
//         asmS_Id: [],
//         amsT_Id: [],
//         hrmd_Id: [],
//         hrmdeS_Id: [],
//         hrmE_Id: [],
//         ismS_Id: [],
//         fee_def: false,
//         select_route: false,
//         routeList: [],
//         feeGroupList: []
//     }
// ];
export async function fetchInitialData() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const subjectList = [
        { ismS_Id: 1, ismS_IVRSSubjectName: 'Mathematics', asmcL_Id: 1, asmS_Id: 1 },
        { ismS_Id: 2, ismS_IVRSSubjectName: 'Science', asmcL_Id: 1, asmS_Id: 1 },
        { ismS_Id: 3, ismS_IVRSSubjectName: 'English', asmcL_Id: 1, asmS_Id: 2 },
        { ismS_Id: 4, ismS_IVRSSubjectName: 'History', asmcL_Id: 2, asmS_Id: 3 }
    ];
    return {
        yearlist: [
            { asmaY_Id: 1, asmaY_Year: '2023-2024', asmaY_To_Date: '2024-03-31' },
            { asmaY_Id: 2, asmaY_Year: '2024-2025', asmaY_To_Date: '2025-03-31' }
        ],
        // noticeList: noticeBoardData,
        classlist: [
            { asmcL_Id: 1, asmcL_ClassName: 'Class I' },
            { asmcL_Id: 2, asmcL_ClassName: 'Class II' },
            { asmcL_Id: 3, asmcL_ClassName: 'Class X' }
        ],
        sectionlist: [
            { asmS_Id: 1, asmC_SectionName: 'A', asmcL_Id: 1 },
            { asmS_Id: 2, asmC_SectionName: 'B', asmcL_Id: 1 }
        ],
        departmentList: [
            { hrmd_Id: 1, hrmd_DepartmentName: 'Science' },
            { hrmd_Id: 2, hrmd_DepartmentName: 'Maths' }
        ],
        designationList: [
            { hrmdeS_Id: 1, hrmdes_DesignationName: 'HOD' },
            { hrmdeS_Id: 2, hrmdes_DesignationName: 'Teacher' }
        ],
        staffList: [
            // Mock staff
            { hrmE_Id: 1, hrmE_EmployeeName: 'John Doe', hrmd_Id: 1, hrmdeS_Id: 1 },
            { hrmE_Id: 2, hrmE_EmployeeName: 'Jane Smith', hrmd_Id: 2, hrmdeS_Id: 2 }
        ],
        studentList: [
            { amsT_Id: 1, amsT_FirstName: 'Alice', asmcL_Id: 1, asmS_Id: 1 },
            { amsT_Id: 2, amsT_FirstName: 'Bob', asmcL_Id: 1, asmS_Id: 2 },
            { amsT_Id: 3, amsT_FirstName: 'Charlie', asmcL_Id: 2, asmS_Id: 1 }
        ],
        feeTerms: [
            { fmfT_Id: 1, fmfT_TermName: 'Term 1' },
            { fmfT_Id: 2, fmfT_TermName: 'Term 2' }
        ],
        feeGroups: [
            { fmg_Id: 1, fmg_GroupName: 'Tuition Fee' },
            { fmg_Id: 2, fmg_GroupName: 'Transport Fee' }
        ],
        routes: [
            { trmR_Id: 1, trmR_RouteName: 'Route A' },
            { trmR_Id: 2, trmR_RouteName: 'Route B' }
        ],
        subjectList
    };
}
// export async function saveNoticeBoard(data: INoticeBoard) {
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     try {
//         if (data.intB_Id) {
//             const index = noticeBoardData.findIndex((t) => t.intB_Id === data.intB_Id);
//             if (index !== -1) {
//                 noticeBoardData[index] = { ...noticeBoardData[index], ...data };
//                 revalidatePath('/upload/transactions/notice-board');
//                 return { success: true, message: 'Notice updated successfully', duplicate: false };
//             }
//             return { success: false, message: 'Record not found', duplicate: false };
//         } else {
//             const newId = (noticeBoardData.length > 0 ? Math.max(...noticeBoardData.map(t => t.intB_Id || 0)) : 0) + 1;
//             noticeBoardData.push({ ...data, intB_Id: newId, intB_ActiveFlag: true });
//             revalidatePath('/upload/transactions/notice-board');
//             return { success: true, message: 'Notice saved successfully', duplicate: false };
//         }
//     } catch (error) {
//         return { success: false, message: 'Failed to save notice', duplicate: false };
//     }
// }
// export async function deleteNoticeBoard(id: number) {
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     const index = noticeBoardData.findIndex((t) => t.intB_Id === id);
//     if (index !== -1) {
//         noticeBoardData[index].intB_ActiveFlag = !noticeBoardData[index].intB_ActiveFlag;
//         revalidatePath('/upload/transactions/notice-board');
//         return { success: true, message: `Record ${noticeBoardData[index].intB_ActiveFlag ? 'activated' : 'deactivated'} successfully` };
//     }
//     return { success: false, message: 'Record not found' };
// }

export async function getDepartmentforNoticeBoard() {
    const url = '/api/MasterDropDown/GetDepartments';
    console.info(url);
    return await api.get<any>('hrms', url);
}

export async function getDesignationforNoticeBoard() {
    const url = '/api/MasterDropDown/GetDesignation';
    console.info(url);
    return await api.get<any>('hrms', url);
}

export async function getEmployeesforNoticeBoard() {
    const url = '/api/MasterDropDown/GetEmployees';
    console.info(url);
    return await api.get<any>('hrms', url);
}

export async function getBusRoutingforNoticeBoard() {
    const url = '/StudentFeeGroupMappingFacade/getBusRoutes';
    return await api.get<IMasterFeeBusRoutingMappingList[]>('fees', url);
}

export async function getGroupforNoticeBoard() {
    const url = '/FeesCommon/fee-group-details';
    return await api.get<any[]>('fees', url);
}

export async function getTermforNoticeBoard() {
    const url = '/FeesCommon/fee-term-details';
    return await api.get<any[]>('fees', url);
}

export async function saveNoticeBoard(payload: any) {
    const url = '/FeesCommon/fee-term-details';
    return await api.post<any[]>('portal', url, payload);
}
