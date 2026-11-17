'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterProfessionalTaxList } from '@/types/hrms/hrms-config/master';

export async function getMasterProfessionalTax(searchParams?: ApiSearchparams) {
    const searchableColumns = 'hrmpT_SalaryFrom,hrmpT_SalaryTo,hrmpT_PTax';
    const columnsToSearch = (searchParams as any)?.search_column || (searchParams as any)?.search_columns || searchableColumns;
    const urlParams = getSearchParamsUrl(searchParams ?? {}, columnsToSearch);
    const url = `/api/MasterProfessionalTax?${urlParams}`;
    return await api.get<IMasterProfessionalTaxList[]>('hrms', url);
}

export async function addOrUpdateMasterProfessionalTax(data: any) {
    const url = '/api/MasterProfessionalTax';
    return await api.post<any>('hrms', url, data);
}

export async function getMasterProfessionalTaxById(id: number) {
    const url = `/api/MasterProfessionalTax/get_master_professional_tax_by_id/${id}`;
    return await api.get<IMasterProfessionalTaxList>('hrms', url);
}

export async function toggleMasterProfessionalTax(id: number) {
    const url = `/api/MasterProfessionalTax/toggle_master_professional_tax/${id}`;
    return await api.put('hrms', url);
}
