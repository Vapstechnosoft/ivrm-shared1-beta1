'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterBankList } from '@/types/hrms/hrms-config/master';

export async function getMasterBank(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(
        searchParams ?? {},
        'hrmbD_BankName,hrmbD_BranchName,hrmbD_BankAccountNo,hrmbD_IFSCCode,hrmbD_BankAddress'
    );
    const url = `/api/MasterBank/master_bank_onload_get_details?${urlParams}`;
    return await api.get<IMasterBankList[]>('hrms', url);
}

export async function addOrUpdateMasterBank(data: any) {
    const url = '/api/MasterBank/master_bank_save_update';
    return await api.post<any>('hrms', url, data);
}

export async function toggleMasterBank(id: number) {
    const url = `/api/MasterBank/master_bank_toggle/${id}`;
    return await api.put('hrms', url);
}

export async function getMasterBankById(id: number) {
    const url = `/api/MasterBank/master_bank_get_record_byid/${id}`;
    return await api.get<IMasterBankList>('hrms', url);
}
