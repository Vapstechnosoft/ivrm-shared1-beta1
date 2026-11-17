'use server';

//import { api, getSearchParamsUrl } from '@/lib/apiService';
//import type { ApiSearchparams } from '@/types';
//import type { IMasterCasteCategoryList } from '@/types/admission/preadmission/masters';
//import type { IMasterLibraryList, IMasterVendorList } from '@/types/library/masters/masters';

// export async function getMasterPublisherList(searchParams?: ApiSearchparams) {
//     const urlParams = getSearchParamsUrl(searchParams ?? {}, 'lmV_MobileNo');
//     const url = `/MasterPublisher/get-master-publisher-list?${urlParams}`;
//     return await api.get<IMasterpublisherList[]>('library', url);
// }
// export async function addOrUpdateMasterVendor(data: any) {
//     const url = '/MasterVendor/add-or-update/';
//     return await api.post<any>('library', url, data);
// }

// export async function toggleMasterVendor(id: number) {
//     const url = `/MasterVendor/deactivate/${id}`;
//     return await api.put('library', url);
// }

// export async function deleteMasterLVendor(id: number) {
//     const url = `/MasterVendor/delete/${id}`;
//     return await api.delete('library', url);
// }
