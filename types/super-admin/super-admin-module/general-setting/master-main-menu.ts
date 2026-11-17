
export interface IMasterMainMenu {
    ivrmmM_Id: number;
    ivrmM_Id?: number;
    ivrmmM_MenuName: string;
    modulename: string; // For display in grid
}

export interface IMasterMainMenuResponse {
    success: boolean;
    message: string;
    data: {
        totalRecords: number;
        page: number;
        pageSize: number;
        records: IMasterMainMenu[];
    };
    total: number | null;
    page_size: number | null;
}

export interface IModuleDropdownItem {
    ivrmM_Id: number;
    ivrmM_ModuleName: string;
    ivrmM_ModuleDesc: string;
}
