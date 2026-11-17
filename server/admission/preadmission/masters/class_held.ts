'use server';

import { api } from '@/lib/apiService';

export async function addOrUpdateMasterClassHeld(data: any) {
    const url = '/master_class_held';
    return await api.post<any>('admission', url, data);
}

export async function getMasterSectionHeld(asmcl_id: number) {
    const url = `/master_class_held/class_section_drop_down_list/${asmcl_id}`;
    return await api.get('admission', url);
}

export async function getMasterMonthDropDownList() {
    const url = '/master_class_held/month_drop_down_list';
    return await api.get('admission', url);
}
