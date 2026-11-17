
export interface IMasterSubMenu {
    ivrmmM_Id: number; // In grid response this acts as ID
    ivrmmS_Id?: number; // Optional for compatibility
    ivrmM_Id?: number;
    ivrmmM_MenuName: string;
    ivrmmS_SubMenuName?: string;
    subMenuName?: string; // From API response
    ivrmmS_Order?: number;
    ivrmmM_MenuOrder?: number; // From API response
    modulename?: string;
}

export interface IModuleDropdownItem {
    ivrmM_Id: number;
    ivrmM_ModuleName: string;
}

export interface IMainMenuDropdownItem {
    ivrmmM_Id: number;
    ivrmmM_MenuName: string;
    ivrmM_Id: number;
}
