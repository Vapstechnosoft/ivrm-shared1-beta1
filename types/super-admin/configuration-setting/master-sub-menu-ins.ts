export interface InstitutionDTO {
    mI_Id: number;
    mI_Name: string;
}

// DTO for the Sub Menu List (fetched on Main Menu change)
export interface SubMenuOnChangeDTO {
    ivrmmM_Id: number;
    ivrmmmI_MenuName: string;
    modulename: string;
    ivrmmmI_MenuOrder: number;
    checked?: boolean; // For frontend selection
}

export interface SelectedMasterMenuDetail {
    ivrmmM_Id: number;
    ivrmmmI_MenuName: string;
}

export interface SaveSubMenuINSRequest {
    ivrmmmI_Id: number;
    ivrmM_Id: number;
    mI_Id: number;
    ivrmmmI_MenuName: string;
    ivrmmmI_MenuOrder: number;
    selectedMasterMenuDetails: SelectedMasterMenuDetail[];
}

export interface SetOrderRequest {
    menuList: {
        ivrmmmI_Id: number;
        ivrmmmI_MenuName: string;
        ivrmmmI_MenuOrder: number;
    }[];
}

export interface MasterSubMenuINSDTO {
    ivrmmmI_Id: number;
    mI_Id: number;
    ivrmM_Id: number;
    ivrmmM_Id: number;
    ivrmmmI_MenuName: string;
    ivrmmmI_MenuOrder: number;
    ivrmmmI_ParentId: number;
    ivrmmmI_ActiveFlag: boolean;
    // ... possibly other fields, check response structure if needed
    mI_Name: string;
    modulename: string;
}
// ... existing exports
export interface ModuleDTO {
    ivrmM_Id: number;
    ivrmM_ModuleName: string;
}

export interface MainMenuDTO {
    ivrmmM_Id: number;
    ivrmmmI_MenuName: string;
}
