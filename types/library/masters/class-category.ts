export interface IMasterClassCategory {
    lmcC_Id: number;
    lmcC_CategoryName: string;
    ivrmuL_Id: number;
    lmcC_ActiveFlag: boolean;
    hrmE_EmployeeFirstName?: string; // For display in list
    createdDate?: string;
    updatedDate?: string;
}

export interface IMasterClassCategoryList {
    alldata: IMasterClassCategory[];
    stafflist: IStaffList[];
}

export interface IStaffList {
    hrmE_Id: number;
    hrmE_EmployeeFirstName: string;
    empName?: string; // Legacy uses 'EmpName' sometimes, need to duplicate or check
}
