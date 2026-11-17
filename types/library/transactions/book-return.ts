export interface IBookReturnData {
    book_Trans_Id: number;
    LMBANO_Id: number;
    LMB_Id: number;
    LMB_BookTitle: string;
    LMB_Price: number;
    issue_Date: string;
    due_Date: string;
    return_Date: string;
    book_Trans_Status: string;
    AMST_Id?: number; // Student ID
    HRME_Id?: number; // Staff ID
    HRMD_Id?: number; // Dept ID
    booktype: string; // 'issue', 'ref'
    issuertype: string; // 'std', 'stf', 'dep', 'gst'
    maxitem: number;
    bookcat_type: string; // 'book', 'nonbook'
    ASMAY_Id: number;
    // Guest fields
    LBTR_GuestName?: string;
    LBTR_GuestContactNo?: string;
    LBTR_GuestEmailId?: string;
}

export interface IBookReturnList {
    book_Trans_Id: number;
    lmB_BookTitle: string;
    lmbanO_AccessionNo: string;
    issue_Date: string;
    due_Date: string;
    return_Date: string;
    book_Trans_Status: string;
    lbtR_GuestName?: string;
    amsT_FirstName?: string; // Student Name
    hrmE_EmployeeFirstName?: string; // Staff Name
    hrmD_DepartmentName?: string; // Dept Name
    lbtR_Renewalcounter: number;
    fine_Amount: number;
}

export interface IStudentDetails {
    amsT_Id: number;
    amsT_FirstName: string;
    amsT_AdmNo: string;
    amsT_RegistrationNo: string;
    amaY_RollNo: number;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    amsT_Photoname: string;
    asmS_Id: number;
    asmcL_Id: number;
}

// For dropdowns
export interface IBookList {
    lmB_Id: number;
    lmbanO_Id: number;
    lmbanO_AccessionNo: string;
    lmB_BookTitle: string;
    lmB_Price: number;
    lmB_EntryDate: string;
}

export interface IBookReturnInitialState {
    alldata: IBookReturnList[];
    yearlist: { asmaY_Id: number; asmaY_Year: string; asmaY_Order: number }[];
    classlist: { asmcL_Id: number; asmcL_ClassName: string }[];
    sectionlist: { asmS_Id: number; asmC_SectionName: string }[];
    deptlist: { hrmD_Id: number; hrmD_DepartmentName: string }[];
    deslist: { hrmDeS_Id: number; hrmDeS_DesignationName: string }[];
    stafftlist: { hrmE_Id: number; hrmE_EmployeeFirstName: string }[];
    plibrary: { lm_Id: number; lm_LibraryName: string }[];
}
