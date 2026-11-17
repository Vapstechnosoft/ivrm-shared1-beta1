export interface InstitutionDTO {
    mI_Id: number;
    mI_Name: string;
    Selected?: boolean;
}

export interface ModuleDTO {
    ivrmM_Id: number;
    ivrmM_ModuleName: string;
    Selected?: boolean;
}

export interface MainMenuDTO {
    ivrmmM_Id: number;
    ivrmmmI_MenuName: string;
    Selected?: boolean;
}

export interface SubMenuDTO {
    ivrmmmI_Id: number;
    submenuname: string;
    Selected?: boolean;
}

export interface MasterPageDTO {
    ivrmP_Id: number;
    pagename: string;
    displayname: string;
    ivrmmmI_Id: number;
    checked?: boolean;
}

export interface SaveMasterMenuPageMappingRequest {
    ivrmmmI_Id: number;
    saveTmpData: {
        ivrmmmI_Id: number;
        ivrmP_Id: number;
        displayname: string;
    }[];
    returnVal: string;
}

export interface SavedMappingDTO {
    menuname?: string;
    submenuname: string;
    modulename: string;
    pagename: string;
    displayname: string;
    ivrmP_Id: number;
    ivrmmmI_Id: number;
    ivrmmmpmI_Id?: number;
}

export interface SetOrderDTO {
    menuname?: string;
    submenuname: string;
    modulename: string;
    pagename: string;
    displayname: string;
    ivrmP_Id: number;
    ivrmmmI_Id: number;
    ivrmimP_Id: number;
    pageorder: number;
    ivrmmmpmI_Id: number;
    mI_Name?: string;
}

export interface SetOrderRequest {
    pages: {
        ivrmimP_Id: number;
        ivrmmmpmI_Id: number;
        ivrmimP_PageOrder: number;
        displayTitle: string;
    }[];
}

export interface GridDetailDTO {
    ivrmmmpmI_Id: number;
    mI_Id?: number;
    mI_Name: string;
    ivrmM_Id?: number;
    modulename: string;
    ivrmmM_Id?: number;
    menuname?: string;
    submenuname: string;
    ivrmmP_Id?: number;
    pagename: string;
    checked?: boolean;
}

export interface MasterMenuPageMappingInstitutionwiseDTO {
    ivrmmM_Id: number;
    ivrmmP_Id: number;
    mi_Id: number;
    ivrmmP_PageName: string;
    ivrmmM_MenuName: string;
    modulename: string;
}

export interface SaveMasterMenuPageMappingInstitutionwiseRequest {
    mi_id: number;
    ivrmmmI_Id: number;
    selectedPages: {
        ivrmmP_Id: number;
    }[];
}
