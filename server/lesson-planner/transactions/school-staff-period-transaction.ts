'use server';

import { api } from '@/lib/apiService';
import { auth } from '@/lib/auth';

const baseUrl = 'lessonplanner';

// Get initial details (masteryear, employeedetails) for the transaction form
export async function getStaffPeriodTransactionInitialData() {
    const session = await auth();
    const username = session?.user?.name || '';
    const roleId = session?.user?.roleId || 0;
    const url = `/SchoolStaffperiodmapping/Getdetailstransaction?username=${username}&roleId=${roleId}`;
    return await api.get<any>(baseUrl, url);
}

// Get classes based on employee and year (triggered on Year or Employee change)
export async function getTransactionEmployeeClasses(ASMAY_Id: number, HRME_Id: number) {
    const url = `/SchoolStaffperiodmapping/getemployeedetails?ASMAY_Id=${ASMAY_Id}&HRME_Id=${HRME_Id}`;
    return await api.get<any>(baseUrl, url);
}

// Get sections based on year, employee, class
export async function getTransactionEmployeeSections(ASMAY_Id: number, HRME_Id: number, ASMCL_Id: number) {
    const url = `/SchoolStaffperiodmapping/onchange_class?ASMAY_Id=${ASMAY_Id}&HRME_Id=${HRME_Id}&ASMCL_Id=${ASMCL_Id}`;
    return await api.get<any>(baseUrl, url);
}

// Get subjects based on year, employee, class, section
export async function getTransactionEmployeeSubjects(ASMAY_Id: number, HRME_Id: number, ASMCL_Id: number, ASMS_Id: number) {
    const url = `/SchoolStaffperiodmapping/onchange_section?ASMAY_Id=${ASMAY_Id}&HRME_Id=${HRME_Id}&ASMCL_Id=${ASMCL_Id}&ASMS_Id=${ASMS_Id}`;
    return await api.get<any>(baseUrl, url);
}

// Get search details (dates and topics) for the transaction grid
export async function getSearchDetailsTransaction(ASMAY_Id: number, HRME_Id: number, ASMCL_Id: number, ASMS_Id: number, ISMS_Id: number) {
    const url = `/SchoolStaffperiodmapping/getsearchdetailstransaction?ASMAY_Id=${ASMAY_Id}&HRME_Id=${HRME_Id}&ASMCL_Id=${ASMCL_Id}&ASMS_Id=${ASMS_Id}&ISMS_Id=${ISMS_Id}`;
    return await api.get<any>(baseUrl, url);
}

// Save transaction data
export async function saveStaffPeriodTransaction(data: any) {
    return await api.post<any>(baseUrl, '/SchoolStaffperiodmapping/savedata_transaction', data);
}
