export interface ITransportApproveSearch {
    asmaY_Id: number;
    asmcL_Id: number;
    trmR_Id: number;
    newreg: 'New' | 'Regular' | 'Both';
}

export interface IStudentData {
    amsT_Id: number;
    estudaeeid?: number;
    studentname: string;
    applicationno: string;
    amsT_AdmNo: string;
    asmcL_ClassName: string;
    amsT_Photoname: string;
    pickuproute?: string;
    pickuplocation?: string;
    drouproute?: string;
    drouplocation?: string;
    PickUp_Session?: number;
    Drop_Session?: number;
    neworreguular?: string;
    astA_ApplStatus?: string;
    remarks1?: string;
    studentremarkemail1?: string;
    chksms?: boolean;
    chkemail?: boolean;
    selected?: boolean;
    // For dropdowns in grid
    sesslist_list_p?: any[];
    sesslist_list_d?: any[];
}

export interface IApproveRejectPayload {
    data_array: IStudentData[];
    ASMAY_Id: number;
    ASMCL_Id: number;
    Flag: 'A' | 'R'; // A for Approve, R for Reject
    smsclick?: any[];
    emailclick?: any[];
}
