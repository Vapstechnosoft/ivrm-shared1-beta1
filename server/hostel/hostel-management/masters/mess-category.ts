'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import { ApiSearchparams } from '@/types';

export async function getMessCategoryList(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    return await api.get<any>('hostel', `/MasterMessCategory/get_mess_category_list?${urlParams}`);
}

export async function saveMessCategory(data: any) {
    const url = '/MasterMessCategory/add_or_update_mess_category';
    return await api.post<any>('hostel', url, data);
}

export async function deactivateMessCategory(id: number) {
    const url = `/MasterMessCategory/deactivate_mess_category/${id}`;
    return await api.put<any>('hostel', url);
}
