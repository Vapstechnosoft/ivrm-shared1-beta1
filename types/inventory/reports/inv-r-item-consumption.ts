
export interface IInvRItemConsumptionLoadData {
    // Entities
    items?: IInvRItemConsumptionEntity[];
    staff?: IInvRItemConsumptionEntity[];
    departments?: IInvRItemConsumptionEntity[];
    students?: IInvRItemConsumptionEntity[];
}

export interface IInvRItemConsumptionEntity {
    // Common ID/Name or specific ones
    id: number;
    name: string;

    // Item
    invmI_Id?: number;
    invmI_ItemName?: string;
    invmI_ItemCode?: string;

    // Staff
    hrmE_Id?: number;
    employeename?: string;
    hrmE_EmployeeCode?: string;
    checked?: boolean; // For multi-select

    // Department
    hrmD_Id?: number; // Check API actual casing, likely HRMD_Id
    hrmD_DepartmentName?: string;

    // Student
    amsT_Id?: number;
    studentname?: string;
    amsT_AdmNo?: string;
}

export interface IInvRItemConsumptionReportData {
    sno?: number;
    invmI_ItemName?: string;
    invmI_ItemCode?: string;
    invmUOM_UOMName?: string;
    invmiC_ICDate?: string;
    invtiC_ICQty?: number;
    invtiC_Naration?: string;

    // Summary/Other fields
    icQty?: number;
    membername?: string;
    hrmE_EmployeeCode?: string;
    amsT_AdmNo?: string;
}

export interface IInvRItemConsumptionPayload {
    typeflag: string; // All, Overall, Detailed
    optionflag?: string; // Item, Staff, Department, Student
    startdate?: string;
    enddate?: string;
    bw_dates: boolean;

    // IDs
    invmI_Id?: number;
    hrmE_Id?: number;
    hrmD_Id?: number;
    amsT_Id?: number;

    // Arrays
    staffarray?: IInvRItemConsumptionEntity[];
}
