
export interface InvTItemConsumption {
    invmiC_Id: number;
    invmsT_Id: number;
    invmS_StoreName?: string;
    invmiC_ICNo: string;
    invmiC_ICDate: string;
    invmiC_Remarks?: string;
    invmiC_StuOtherFlg: 'Staff' | 'Department' | 'Student';
    invmiC_ActiveFlg: boolean;
    createdDate?: string;
    updatedDate?: string;

    // For Department
    hrmD_Id?: number;
    hrmD_DepartmentName?: string;

    // For Student
    amsT_Id?: number;
    studentName?: string;
    amsT_AdmNo?: string;

    // Details for viewing/editing
    itemConsumptionDetails?: InvTItemConsumptionDetail[];
    itemConsumptionStaff?: InvTItemConsumptionStaff[];
}

export interface InvTItemConsumptionDetail {
    invtiC_Id: number;
    invmiC_Id: number;
    invmI_Id: number;
    invmI_ItemName?: string;
    invtiC_ICPrice: number;
    invmuoM_Id: number;
    invmuoM_UOMName?: string;
    invmP_Id?: number;
    invmP_ProductName?: string;
    invtiC_BatchNo: string;
    invtiC_ICQty: number;
    invtiC_Naration?: string;
    invtiC_ActiveFlg: boolean;
}

export interface InvTItemConsumptionStaff {
    invticS_Id: number; // Assumptions on PK name
    invmiC_Id: number;
    hrmE_Id: number;
    hrmE_EmployeeName?: string;
    hrmE_EmployeeCode?: string;
    invticS_ActiveFlg: boolean;
}

// Initial state / Form Data
export interface InvTItemConsumptionInput {
    invmiC_Id: number;
    invmsT_Id: number;
    invmiC_ICNo: string;
    invmiC_ICDate: Date;
    invmiC_Remarks?: string;
    invmiC_StuOtherFlg: 'Staff' | 'Department' | 'Student';
    hrmD_Id?: number;
    amsT_Id?: number;
    arrayStaff: { hrmE_Id: number }[];
    arrayIC: {
        invtiC_Id: number;
        invmI_Id: number;
        invtiC_ICPrice: number;
        invmuoM_Id: number;
        invmP_Id?: number;
        invtiC_BatchNo: string;
        invtiC_ICQty: number;
        invtiC_Naration?: string;
    }[];
}
