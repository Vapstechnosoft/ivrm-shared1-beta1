export interface IPageMappingData {
    ivrmP_Id: number;
    ivrmP_PageName: string;
    ivrmP_PageDisplayName: string;
    ivrmP_PageURL?: string;
    ivrmP_TemplateFlag?: boolean;
    ivrmP_MandatoryFlag?: boolean;
    isChecked?: boolean; // For UI selection
}

export interface IModuleDropdown {
    ivrmM_Id: number;
    ivrmM_ModuleName: string;
    ivrmM_ModuleDesc?: string;
}


export interface ISavedMapping {
    ivrmmP_Id: number; // Mapping ID
    ivrmM_Id: number;
    ivrmP_Id: number;
    ivrmmP_PageName: string;
    ivrmM_ModuleName: string;
    createdDate?: string;
    updatedDate?: string;
    ivrmP_PageName?: string; // Optional if needed for UI
}

export interface ISavedMappingSearchParams {
    page: number;
    pageSize: number;
}
