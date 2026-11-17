'use server';

import { api } from '@/lib/apiService';

// Load initial data (Grid and Dropdowns)
export async function getConsecutiveConstraintsDetails() {
    const url = '/TT_ConsecutiveFacade/ConsecutiveConstraintsGridData';
    return await api.get<any>('timetable', url);
}

// Get Class details based on Academic Year and Category (Consecutive/getclass_catg)
export async function getClassByCategory(data: { ASMAY_Id: number; TTMC_Id: number }) {
    const url = '/Consecutive/getclass_catg';
    return await api.post<any>('timetable', url, data);
}

// Get Staff based on Class and Section (Fixing/getstaff_section - Reused endpoint)
export async function getStaffByClassSection(data: { ASMAY_Id: number; TTMC_Id: number; ASMCL_Id: number; ASMS_Id: number }) {
    const url = '/Fixing/getstaff_section';
    return await api.post<any>('timetable', url, data);
}

// Get Subject based on Staff (Fixing/getsubject_staff - Reused endpoint)
export async function getSubjectByStaff(data: { ASMAY_Id: number; TTMC_Id: number; ASMCL_Id: number; ASMS_Id: number; HRME_Id: number }) {
    const url = '/Fixing/getsubject_staff';
    return await api.post<any>('timetable', url, data);
}

// Save Consecutive Constraints
export async function saveConsecutiveConstraintsDetail(data: any) {
    const url = '/Consecutive/savedetail';
    return await api.post<any>('timetable', url, data);
}

// Get Details for Edit
export async function getConsecutiveConstraintsEditDetails(id: number) {
    const url = `/Consecutive/getdetails/${id}`; // Note: Legacy used Query string? Checking controller `getURI("Consecutive/getdetails", pageid)` - usually becomes path param in new arch if adapted.
    // If standard REST in apiService: api.getURI usually appends ID.
    // Assuming backend accepts /Consecutive/getdetails/123
    return await api.get<any>('timetable', url);
}

// Delete Record
export async function deleteConsecutiveConstraints(id: number) {
    const url = `/Consecutive/deletepages/${id}`;
    return await api.delete<any>('timetable', url);
}

// Deactivate/Activate Record
export async function deactivateConsecutiveConstraints(data: any) {
    const url = '/Consecutive/deactivate';
    return await api.post<any>('timetable', url, data);
}
