'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { ILifeSkill, ILifeSkillArea, IMasterLifeSkillMapping } from '@/types/exam/exam-module/masters';

// fetch all life skills
export async function getMasterLifeSkills(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/MasterLifeSkillFacade?${urlParams}`;
    return await api.get<ILifeSkill>('exam', url);
}

export async function getMasterLifeSkillDrpdownList() {
    const url = '/MasterLifeSkillFacade/get_master_life_skill_dropdown_list';
    return await api.get<ILifeSkill>('exam', url);
}

// fetch edit details of a life skill
export async function getMasterLifeSkillEditDetails(ecs_id: number) {
    const url = `/MasterLifeSkillFacade/get_master_life_skill_edit_details/${ecs_id}`;
    return await api.get<IMasterLifeSkillMapping>('exam', url);
}

// add a new life skill
export async function addOrUpdateMasterLifeSkill(data: any) {
    const url = '/MasterLifeSkillFacade';
    return await api.post<any>('exam', url, data);
}

// activate or deactivate a life skill
export async function toggleMasterLifeSkill(ecS_Id: number) {
    const url = `/MasterLifeSkillFacade/activate_deactivate_master_life_skill/${ecS_Id}`;
    return await api.put('exam', url);
}

// add or update a life skill area
export async function addOrUpdateMasterLifeSkillArea(data: any) {
    const url = '/MasterLifeSkillFacade/add_or_update_master_life_skill_Area';
    return await api.post<any>('exam', url, data);
}

// fetch all life skill areas
export async function getMasterLifeSkillAreas(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/MasterLifeSkillFacade/get_master_life_skill_Area_details?${urlParams}`;
    return await api.get<ILifeSkillArea>('exam', url);
}

export async function getMasterLifeSkillAreaOrderList() {
    const url = '/MasterLifeSkillFacade/get_master_life_skill_Area_Order_List';
    return await api.get<ILifeSkillArea>('exam', url);
}
export async function setMasterLifeSkillAreaOrderList(data: any) {
    const url = '/MasterLifeSkillFacade/set_order_master_life_skill_areas';
    return await api.post<any>('exam', url, data);
}

// fetch edit details of a life skill area
export async function getMasterLifeSkillAreaEditDetails(ecsa_id: number) {
    const url = `/MasterLifeSkillFacade/get_master_life_skill_area_edit_details/${ecsa_id}`;
    return await api.get<IMasterLifeSkillMapping>('exam', url);
}

// activate or deactivate a life skill area
export async function toggleMasterLifeSkillArea(id: number) {
    const url = `/MasterLifeSkillFacade/activate_deactivate_master_life_skill_area/${id}`;
    return await api.put('exam', url);
}

// add or update life skill area mapping
export async function addOrUpdateMasterLifeSkillMapping(data: any) {
    const url = '/MasterLifeSkillFacade/add_or_update_master_life_skill_Area_mapping';
    return await api.post<any>('exam', url, data);
}

// fetch all life skill area mappings
export async function getMasterLifeSkillMappings(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/MasterLifeSkillFacade/get_skill_area_mapping_details?${urlParams}`;
    return await api.get<IMasterLifeSkillMapping>('exam', url);
}

// fetch edit details of a life skill area mapping
export async function getMasterLifeSkillMappingEditDetails(ecsam_id: number) {
    const url = `/MasterLifeSkillFacade/get_skill_area_mapping_edit_details/${ecsam_id}`;
    return await api.get<IMasterLifeSkillMapping>('exam', url);
}

// activate or deactivate a life skill area mapping
export async function toggleLifeSkillAreaMapping(id: number) {
    const url = `/MasterLifeSkillFacade/activate_deactivate_life_skill_area_mapping/${id}`;
    return await api.put('exam', url);
}
