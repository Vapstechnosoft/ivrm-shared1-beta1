'use server';

import { api } from '@/lib/apiService';

// Get student list based on selections
export async function getStudentList(params: any) {
    return await api.post<any>('exam', '/student_transaction/get_student_details', params);
}

// Save CCE student marks
export async function saveCCEStudentMarks(params: any) {
    return await api.post<any>('exam', '/student_transaction/add_cce_student_marks', params);
}
// Load skills/activities based on selection
export async function onchangeSkillActivityFlag(params: any) {
    return await api.post<any>('exam', '/student_transaction/onchangeactivitesskillflag', params);
}

// Load activities areas when activity is selected
export async function onchangeActivities(params: any) {
    return await api.get<any>('exam', `/student_transaction/onchange_activities/${params.ASMAY_Id}/${params.ECACT_Id}`);
}

// Load skill areas when skill is selected
export async function onchangeSkills(params: any) {
    return await api.get<any>('exam', `/student_transaction/onchange_skills/${params.ASMAY_Id}/${params.ECS_Id}`);
}

// Get term and exam names
export async function getTermOrExams(params: any) {
    return await api.get<any>(
        'exam',
        `/student_transaction/get_term_or_exams/${params.ASMAY_Id}/${params.ASMCL_Id}/${params.ASMS_Id}/${params.EXAM_TERMWISE_FLAG}`
    );
}
