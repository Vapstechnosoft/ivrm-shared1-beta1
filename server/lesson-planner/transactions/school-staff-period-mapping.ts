'use server';

import { api } from '@/lib/apiService';

const baseUrl = 'lessonplanner';

// Get initial details (masteryear, employeedetails)
export async function getInitialDetails() {
    return await api.get<any>(baseUrl, '/SchoolStaffperiodmapping/Get_Details');
}

// Get classes based on employee and year
export async function getEmployeeClasses(hrmE_Id: number, asmaY_Id: number) {
    return await api.get<any>(baseUrl, `/SchoolStaffperiodmapping/getemployeedetails?ASMAY_Id=${asmaY_Id}&HRME_Id=${hrmE_Id}`);
}

// Get sections based on year, employee, class
export async function getEmployeeSections(asmaY_Id: number, hrmE_Id: number, asmcL_Id: number) {
    return await api.get<any>(
        baseUrl,
        `/SchoolStaffperiodmapping/onchange_class?ASMAY_Id=${asmaY_Id}&HRME_Id=${hrmE_Id}&ASMCL_Id=${asmcL_Id}`
    );
}

// Get subjects based on year, employee, class, section
export async function getEmployeeSubjects(asmaY_Id: number, hrmE_Id: number, asmcL_Id: number, asmS_Id: number) {
    return await api.get<any>(
        baseUrl,
        `/SchoolStaffperiodmapping/onchange_section?ASMAY_Id=${asmaY_Id}&HRME_Id=${hrmE_Id}&ASMCL_Id=${asmcL_Id}&ASMS_Id=${asmS_Id}`
    );
}

// Get search details (dates and topics)
export async function getStaffPeriodSearchDetails(asmaY_Id: number, hrmE_Id: number, asmcL_Id: number, asmS_Id: number, ismS_Id: number) {
    return await api.get<any>(
        baseUrl,
        `/SchoolStaffperiodmapping/getsearchdetails?ASMAY_Id=${asmaY_Id}&HRME_Id=${hrmE_Id}&ASMCL_Id=${asmcL_Id}&ASMS_Id=${asmS_Id}&ISMS_Id=${ismS_Id}`
    );
}

// Save mapping data
export async function saveStaffPeriodMapping(data: any) {
    return await api.post<any>(baseUrl, '/SchoolStaffperiodmapping/savedata', data);
}

// Deactivate logic (legacy code references CollegeSubjetMasterTopicMapping/deactivate)
export async function deactivateTopicMapping(data: any) {
    return await api.post<any>(baseUrl, '/CollegeSubjetMasterTopicMapping/deactivate', data);
}

// Order logic (legacy code references CollegeSubjetMasterTopicMapping/validateordernumber)
export async function saveTopicMappingOrder(data: any) {
    return await api.post<any>(baseUrl, '/CollegeSubjetMasterTopicMapping/validateordernumber', data);
}
