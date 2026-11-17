export interface IInvMasterSupplier {
    invmS_Id: number;
    invmS_SupplierName: string;
    invmS_SupplierCode?: string;
    invmS_SupplierConatctPerson?: string;
    invmS_SupplierConatctNo: string;
    invmS_EmailId: string;
    invmS_GSTNo?: string;
    invmS_SupplierAddress?: string;
    invmS_ActiveFlg: boolean;
}

export interface IInvMasterSupplierDTO {
    invmS_Id: number;
    invmS_SupplierName: string;
    invmS_SupplierCode?: string;
    invmS_SupplierConatctPerson?: string;
    invmS_SupplierConatctNo: string;
    invmS_EmailId: string;
    invmS_GSTNo?: string;
    invmS_SupplierAddress?: string;
}
