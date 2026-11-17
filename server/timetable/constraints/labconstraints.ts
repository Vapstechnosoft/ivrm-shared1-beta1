'use server';

import { api } from '@/lib/apiService';

// Load initial data (Grid and Dropdowns)
export async function getLabConstraintsDetails() {
    const url = '/Lab/LabConstraintsGridData';
    return await api.get<any>('timetable', url);
}

// Get Class details based on Academic Year and Category
export async function getClassDetails(data: { ASMAY_Id: number; TTMC_Id: number }) {
    const url = '/Lab/getClassdetails';
    return await api.post<any>('timetable', url, data);
}

// Get Section details based on Class
export async function getSectionDetails(data: { ASMAY_Id: number; ASMCL_Id: number; TTMC_Id: number }) {
    const url = '/Lab/getSectiondetails';
    return await api.post<any>('timetable', url, data);
}

// Get Lab (Subject?) details based on Class/Section
export async function getLabDetails(data: { ASMAY_Id: number; ASMCL_Id: number; ASMS_Id: number; TTMC_Id: number }) {
    const url = '/Lab/getLabdetails';
    return await api.post<any>('timetable', url, data);
}

// Save Lab Constraints
export async function saveLabConstraintsDetail(data: any) {
    const url = '/Lab/savedetail';
    return await api.post<any>('timetable', url, data);
}

// Get Details for Edit
export async function getLabConstraintsEditDetails(id: number) {
    const url = `/Lab/getdetails/${id}`;
    return await api.get<any>('timetable', url);
}

// Delete/Deactivate Record
export async function deleteLabConstraintsDetail(id: number) {
    const url = `/Lab/deletedetails/${id}`;
    return await api.delete<any>('timetable', url);
}
