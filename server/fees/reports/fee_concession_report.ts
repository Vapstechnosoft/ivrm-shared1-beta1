'use server';
import { api } from '@/lib/apiService';

export async function getFeesconcessionOnLoadReport() {
    const url = '/FeeConcessionReport/GroupTermCustomGrouDetails';
    return await api.get<any[]>('fees', url);
}
export async function getFeesconcessionOnChangeofCustomGroup(payload: any) {
    const url = '/FeeConcessionReport/GetGroupsbasedoncustomGrp';
    return await api.post<any[]>('fees', url, payload);
}

export async function saveFeesconcessionReport(payload: any) {
    const url = '/FeeConcessionReport/concession-report';
    return await api.post<any[]>('fees', url, payload);
}
