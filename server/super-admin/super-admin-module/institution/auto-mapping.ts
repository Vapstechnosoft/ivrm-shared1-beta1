'use server';

import { api } from '@/lib/apiService';
import { autoMappingSchema } from '@/schemas/super-admin/super-admin-module/institution/auto-mapping';
import { z } from 'zod';

export async function saveAutoMapping(data: z.infer<typeof autoMappingSchema.addOrUpdate>) {
    const url = 'InstitutionFacade/add_or_update_auto_mapping';
    const payload = {
        pervious_MI_Id: data.Pervious_MI_Id,
        current_MI_Id: data.Current_MI_Id,
        user_Name: data.User_Name,
        returnval: ''
    };
    return await api.post('sadmin', url, payload);
}
