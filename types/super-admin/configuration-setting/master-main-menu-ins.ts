export interface MasterMainMenuINSDTO {
    ivrmmmI_Id: number;
    mI_Name: string;
    modulename: string; // Changed from ivrmM_ModuleName to match API
    ivrmmmI_MenuName: string;
    ivrmmmI_MenuOrder?: number;
    ivrmmmI_Color?: string;
    ivrmmmI_Icon?: string;
}

export interface InstitutionDTO {
    mI_Id: number;
    mI_Name: string;
}

export interface ModuleDTO {
    ivrmM_Id: number;
    ivrmM_ModuleName: string;
}

export interface MainMenuModuleDTO {
    ivrmmM_Id: number;
    modulename: string;
    ivrmmmI_MenuName: string;
    // Client-side fields for selection/editing
    checked?: boolean;
    selectedIcon?: string;
    selectedColor?: string;
    customMenuName?: string;
}

export interface SaveMainMenuINSRequest {
    ivrmmmI_Id: number;
    ivrmM_Id: number;
    mI_Id: number;
    ivrmmmI_MenuName: string;
    ivrmmmI_Icon: string;
    ivrmmmI_Color: string;
    selectedMasterMenuDetails: {
        ivrmmM_Id: number;
        ivrmmmI_MenuName: string;
    }[];
}
