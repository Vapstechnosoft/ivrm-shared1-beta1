'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterVehicle } from '@/types/transport/transport-module/masters';

export async function getMasterVehicle(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/master_vehicle/vehicle_grid_list?${urlParams}`;
    const res = await api.get<IMasterVehicle[]>('transport', url);
    return res;
}

export async function activeDeactiveVehicle(id: number) {
    const url = `/master_vehicle/active_deactive_vehicle/${id}`;
    return await api.put('transport', url);
}

export async function saveMasterVehicle(data: any) {
    const url = '/MasterVehicle/savedata';
    return await api.post<any>('transport', url, data);
}

export async function checkVehicleDuplicate(data: any) {
    const url = '/MasterVehicle/validaevehicleno/';
    return await api.post<any>('transport', url, data);
}

export async function uploadVehicleFile(formData: FormData) {
    const url = '/MasterVehicle/uploadUserFile'; // Assumed endpoint, adjusted to typical pattern
    return await api.postMultipart<any>('transport', url, formData);
}
