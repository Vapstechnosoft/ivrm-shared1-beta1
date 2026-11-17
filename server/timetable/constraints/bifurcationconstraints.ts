'use server';

import { api } from '@/lib/apiService';

// Load initial data (Grid and Dropdowns)
export async function getBifurcationConstraintsDetails() {
    const url = '/BifurcationFacade/BifurcationConstraintsGridData';
    return await api.get<any>('timetable', url);
}

// Get Class details based on Academic Year and Category
export async function getClassDetails(data: { ASMAY_Id: number; TTMC_Id: number }) {
    const url = '/Bifurcation/getClassdetails';
    return await api.post<any>('timetable', url, data);
}

// Get Staff based on Class and Section (Fixing Controller)
export async function getStaffSection(data: { ASMAY_Id: number; TTMC_Id: number; ASMCL_Id: number; ASMS_Id: number }) {
    const url = '/Fixing/getstaff_section';
    return await api.post<any>('timetable', url, data);
}

// Get Subject based on Staff (Fixing Controller)
export async function getSubjectStaff(data: { ASMAY_Id: number; TTMC_Id: number; ASMCL_Id: number; ASMS_Id: number; HRME_Id: number }) {
    const url = '/Fixing/getsubject_staff';
    return await api.post<any>('timetable', url, data);
}

// Save Bifurcation Constraints
export async function saveBifurcationConstraintsDetail(data: any) {
    const url = '/Bifurcation/savedetail';
    return await api.post<any>('timetable', url, data);
}

// Get Details for Edit
export async function getBifurcationConstraintsEditDetails(id: number) {
    const url = `/Bifurcation/getdetails/${id}`;
    return await api.get<any>('timetable', url);
}

// Delete/Deactivate Record
export async function deleteBifurcationConstraintsDetail(id: number) {
    const url = `/Bifurcation/deletedetails/${id}`;
    return await api.delete<any>('timetable', url); // Assuming DeleteURI uses delete method, though legacy might be GET/POST. Check apiService if unsure. usually DeleteURI is DELETE.
}

// Get View Records for Popup
export async function getBifurcationConstraintsViewRecords(id: number) {
    const url = `/Bifurcation/getalldetailsviewrecords/${id}`;
    return await api.get<any>('timetable', url);
}
