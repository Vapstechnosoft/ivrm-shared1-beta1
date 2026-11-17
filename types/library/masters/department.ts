export interface IMasterDepartment {
    lmD_Id: number;
    mI_Id: number;
    lmD_DepartmentName: string;
    lmD_DepartmentCode: string;
    lmD_ActiveFlg: boolean;
    lmD_CreatedBy?: number;
    lmD_UpdatedBy?: number;
    createdDate?: string;
    updatedDate?: string;
}
