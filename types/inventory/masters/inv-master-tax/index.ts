export interface IInvMasterTax {
    invmT_Id: number;
    invmT_TaxName: string;
    invmT_TaxAliasName: string;
    invmT_ActiveFlg: boolean;
    mI_Id?: number;
    createdDate?: string;
    updatedDate?: string;
}

export interface IInvMasterTaxLedger {
    invmtleD_Id: number;
    INVMT_Id: number;
    famcomP_Id: number;
    famleD_Id: number;
    famgrP_Id: number;
    invmtleD_TaxName: string;
    INVMT_TaxName: string;
    famcomP_CompanyName: string;
    famleD_LedgerName: string;
    famgrP_GroupName: string;
}

export interface IInvMasterTaxLedgerDTO {
    INVMT_Id: number;
    invmtleD_TaxName: string;
    famcomP_Id: number;
    famleD_Id: number;
    ledgerunderids: number[];
}
