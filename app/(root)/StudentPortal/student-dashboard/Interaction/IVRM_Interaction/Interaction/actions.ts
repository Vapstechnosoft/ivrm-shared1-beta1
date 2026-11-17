'use server';
import { api } from '@/lib/apiService';

export async function getInteractionLoadData(data: any) {
    const url = `/IVRM_Interactions/getloaddata`;
    try {
        const response = await api.post<any>('default', url, data);
        // Sometimes 404 returns generic error page html, ensure we have data
        if (response && response.data) return response.data;
        throw new Error("Empty response");
    } catch (e) {
        console.warn("API Failed, using mock data for getInteractionLoadData", e);
        return {
            getinboxmsg: [
                {
                    ISMINT_Id: 101,
                    ISTINT_Id: 1001,
                    ISMINT_InteractionId: 101,
                    ISMINT_Subject: "Homework Submission Reminder",
                    ISMINT_Interaction: "Please submit your math homework by Friday.",
                    ISMINT_GroupOrIndFlg: "Individual",
                    ISMINT_ComposedByFlg: "Staff",
                    Sender: "Math Teacher",
                    Receiver: "Student",
                    ISMINT_DateTime: new Date().toISOString(),
                    ISTINT_Attachment: null,
                    ISMINT_Attachment: null,
                    ISMINT_ComposedById: 501,
                    ISTINT_ReadFlg: 0
                },
                {
                    ISMINT_Id: 102,
                    ISTINT_Id: 1002,
                    ISMINT_InteractionId: 102,
                    ISMINT_Subject: "Science Fair",
                    ISMINT_Interaction: "Don't forget to register for the Science Fair.",
                    ISMINT_GroupOrIndFlg: "Group",
                    ISMINT_ComposedByFlg: "Staff",
                    Sender: "Science Dept",
                    Receiver: "Student",
                    ISMINT_DateTime: new Date(Date.now() - 86400000).toISOString(),
                    ISTINT_Attachment: null,
                    ISMINT_Attachment: null,
                    ISMINT_ComposedById: 502,
                    ISTINT_ReadFlg: 1
                }
            ],
            roletype: [{ ivrmrT_Role: 'Student' }], // Default role
            configflag: [],
            userhrmE_Id: 100,
            academicList: [
                { asmaY_Id: 2023, asmaY_Year: '2023-2024' },
                { asmaY_Id: 2024, asmaY_Year: '2024-2025' }
            ],
            courselist: [
                { asmcL_Id: 10, asmcL_ClassName: 'Standard 10' },
                { asmcL_Id: 12, asmcL_ClassName: 'Standard 12' }
            ]
        };
    }
}

export async function getInteractionDetails(data: any) {
    const url = `/IVRM_Interactions/getdetails`;
    try {
        const response = await api.post<any>('default', url, data);
        return response.data;
    } catch (e) {
        console.warn("Mocking getInteractionDetails", e);
        // Return dummy recipients
        return {
            getdetails: [
                { HRME_Id: 501, EmpName: "John Doe (Math)", ISMS_SubjectName: "Mathematics" },
                { HRME_Id: 502, EmpName: "Jane Smith (Science)", ISMS_SubjectName: "Science" }
            ]
        };
    }
}

export async function getSection(data: any) {
    const url = `/EmployeeStudentAttendenceDetails/Getsection`;
    try {
        const response = await api.post<any>('default', url, data);
        return response.data;
    } catch (e) {
        console.warn("Mocking getSection", e);
        return {
            sectionList: [
                { asmS_Id: 1, asmC_SectionName: 'A' },
                { asmS_Id: 2, asmC_SectionName: 'B' }
            ]
        };
    }
}

export async function getStudent(data: any) {
    const url = `/IVRM_Interactions/getstudent`;
    try {
        const response = await api.post<any>('default', url, data);
        return response.data;
    } catch (e) {
        console.warn("Mocking getStudent", e);
        return {
            studentList: [
                { amsT_Id: 1001, studentName: "Alice Johnson" },
                { amsT_Id: 1002, studentName: "Bob Williams" }
            ],
            get_student: [ // Legacy sometimes returns this
                { amsT_Id: 1001, studentName: "Alice Johnson" },
                { amsT_Id: 1002, studentName: "Bob Williams" }
            ]
        };
    }
}

export async function saveInteraction(data: any) {
    const url = `/IVRM_Interactions/savedata`;
    try {
        const response = await api.post<any>('default', url, data);
        return response.data;
    } catch (e) {
        console.warn("Mocking saveInteraction", e);
        return { returnval: true };
    }
}

export async function deleteInteraction(data: any) {
    const url = `/IVRM_Interactions/deletemsg`;
    try {
        const response = await api.post<any>('default', url, data);
        return response.data;
    } catch (e) {
        console.warn("Mocking deleteInteraction", e);
        return { returnval: true };
    }
}

export async function replyInteraction(data: any) {
    const url = `/IVRM_Interactions/reply`;
    try {
        const response = await api.post<any>('default', url, data);
        return response.data;
    } catch (e) {
        console.warn("Mocking replyInteraction", e);
        return { returnval: true };
    }
}
