export interface IInvMasterItem {
    invmI_Id: number;
    invmG_Id: number;
    invmG_GroupName?: string;
    invmuoM_Id: number;
    invmuoM_UOMName?: string;
    invmI_ItemName: string;
    invmI_ItemCode?: string;
    invmI_MaxStock?: number;
    invmI_ReorderStock?: number;
    invmI_HSNCode?: string;
    invmI_TaxAplFlg: boolean;
    invmI_RawMatFlg: boolean;
    invmI_ForSaleFlg: boolean;
    invmI_MaintenanceAplFlg: boolean;
    invmI_ActiveFlg: boolean;
    invmI_GroupItemNo?: number;
    famcomP_Id?: number;
    famleD_Id?: number;
    famcomP_CompanyName?: string;
    famleD_LedgerName?: string;
}

export interface IInvMasterItemTax {
    invmiT_Id: number;
    invmT_Id: number;
    invmT_TaxName: string;
    invmT_TaxAliasName: string;
    invmiT_TaxValue: number;
    invmiT_ActiveFlg: boolean;
    xyz?: boolean; // Selection flag in AngularJS UI
}

export interface IMainGroupDropdown {
    invmG_Id: number;
    invmG_GroupName: string;
}

export interface IUserGroupDropdown {
    invmG_Id: number;
    invmG_GroupName: string;
    invmG_ParentId: number;
}

export interface IItemGroupDropdown {
    invmG_Id: number;
    invmG_GroupName: string;
    invmG_ParentId?: number;
}

export interface IUOMDropdown {
    invmuoM_Id: number;
    invmuoM_UOMName: string;
}

export interface ICompanyDropdown {
    famcomP_Id: number;
    famcomP_CompanyName: string;
}

export interface ILedgerDropdown {
    famleD_Id: number;
    famleD_LedgerName: string;
}

export interface IInvMasterItemLoadResponse {
    success: boolean;
    data: {
        get_tax: IInvMasterItemTax[];
        get_itemgroup: IItemGroupDropdown[];
        get_maingroup?: IMainGroupDropdown[];
        get_usergroup?: IUserGroupDropdown[];
        get_UOM: IUOMDropdown[];
        get_item: IInvMasterItem[];
        companynames: ICompanyDropdown[];
        ledgernames: ILedgerDropdown[];
        companyconfig: any[];
        total: number;
    };
}
