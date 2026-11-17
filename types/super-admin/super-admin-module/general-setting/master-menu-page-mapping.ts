export interface IMasterMenuPageMapping {
    ivrmmmpM_Id: number;
    menuname: string;
    submenuname: string;
    modulename: string;
    pagename: string;
}

// Alias for DTO used in page.tsx
export type IMasterMenuPageMappingDTO = IMasterMenuPageMapping;

export interface IModuleDropdownItem {
    ivrmM_Id: number;
    ivrmM_ModuleName: string;
}

export interface IMainMenuDropdownItem {
    ivrmmM_Id: number;
    ivrmmM_MenuName: string;
    ivrmM_Id?: number; // For filtering
}

export interface ISubMenuDropdownItem {
    ivrmmS_Id: number;
    ivrmmS_SubMenuName: string;
    ivrmmM_Id: number;
}

export interface IMasterPageItem {
    ivrmP_Id: number;
    pagename: string;
}

export interface MasterMenuPageMappingResponse {
    success: boolean;
    message: string;
    data: {
        records: IMasterMenuPageMapping[];
    };
    total: number;
    page: number;
    page_size: number;
}
