// Book Transaction Types

export type MemberType = 'std' | 'stf' | 'dep' | 'gst';
export type BookType = 'issue' | 'ref';
export type BookCategory = 'book' | 'nonbook';
export type TransactionStatus = 'Issue' | 'Return';

// Circular Parameters
export interface ICircularParameters {
    max_Issue_Days: number;
    max_No_Renewals: number;
    max_Issue_Items: number;
}

// Book Details
export interface IBookDetails {
    lmB_Id: number;
    lmbanO_Id: number;
    lmB_BookTitle: string;
    lmbanO_AccessionNo: string;
    lmB_VolNo: string;
    lmB_Price: number;
    lmB_ClassNo: string;
    lmB_CallNo: string;
    lmB_EntryDate: string;
    LMC_CategoryName: string;
    authorname: string;
    LMBANO_QRCode?: string;
}

// Book for Selection
export interface IBookOption {
    lmB_Id: number;
    lmbanO_Id: number;
    lmB_BookTitle: string;
    lmbanO_AccessionNo: string;
    Selected?: boolean;
}

// Student Details
export interface IStudentDetails {
    amsT_Id: number;
    amsT_FirstName: string;
    amsT_RegistrationNo: string;
    amsT_AdmNo: string;
    amaY_RollNo: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    amsT_Photoname: string;
    amsT_FatherMobleNo: string;
    asmcL_Id: number;
    asmS_Id: number;
}

// Staff Details
export interface IStaffDetails {
    hrmE_Id: number;
    hrmE_EmployeeCode: string;
    hrmE_EmployeeFirstName: string;
    hrmD_DepartmentName: string;
    hrmE_MobileNo: string;
    hrmdeS_DesignationName: string;
    hrmE_Photo: string;
    hrmD_Id: number;
    hrmdeS_Id: number;
}

// Transaction Base
interface IBookTransactionBase {
    book_Trans_Id: number;
    lmbanO_Id: number;
    lmB_Id: number;
    lmB_BookTitle: string;
    lmbanO_AccessionNo: string;
    issue_Date: string;
    due_Date: string;
    return_Date: string | null;
    book_Trans_Status: TransactionStatus;
    fine_Amount: number;
    lbtR_Renewalcounter: number;
    lbtR_FineCollected: number;
    LMBANO_QRCode?: string;
}

// Student Transaction
export interface IBookTransactionStudent extends IBookTransactionBase {
    amsT_Id: number;
    amsT_FirstName: string;
    AMST_AdmNo: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    asmcL_Id: number;
    asmS_Id: number;
}

// Staff Transaction
export interface IBookTransactionStaff extends IBookTransactionBase {
    hrmE_Id: number;
    hrmE_EmployeeFirstName: string;
    hrmE_EmployeeCode: string;
    hrmD_DepartmentName: string;
    hrmD_Id: number;
    hrmdeS_Id: number;
}

// Department Transaction
export interface IBookTransactionDepartment extends IBookTransactionBase {
    hrmD_Id: number;
    hrmD_DepartmentName: string;
}

// Guest Transaction
export interface IBookTransactionGuest extends IBookTransactionBase {
    lbtR_GuestName: string;
    lbtR_GuestContactNo: string;
    lbtR_GuestEmailId: string;
}

// Union type for all transaction types
export type IBookTransaction = IBookTransactionStudent | IBookTransactionStaff | IBookTransactionDepartment | IBookTransactionGuest;

// Initial Data Load Response
export interface IBookTransactionInitialData {
    yearlist: Array<{ asmaY_Id: number; asmaY_Year: string }>;
    classlist: Array<{ asmcL_Id: number; asmcL_ClassName: string }>;
    sectionlist: Array<{ asmS_Id: number; asmC_SectionName: string }>;
    studentlist: Array<{
        amsT_Id: number;
        amsT_FirstName: string;
        amsT_AdmNo: string;
    }>;
    booktitle: IBookOption[];
    stafftlist: Array<{
        hrmE_Id: number;
        hrmE_EmployeeFirstName: string;
    }>;
    departmentlist: Array<{ hrmD_Id: number; hrmD_DepartmentName: string }>;
    filldepartment: Array<{ hrmD_Id: number; hrmD_DepartmentName: string }>;
    filldesignation: Array<{ hrmdeS_Id: number; hrmdeS_DesignationName: string }>;
    msterliblist: Array<{ lmaL_Id: number; lmaL_LibraryName: string }>;
    configdata: ICircularParameters[];
    lmaL_Id?: number;
    asmcL_Id?: number;
    asmS_Id?: number;
}

// Issue Book Request
export interface IIssueBookRequest {
    Book_Trans_Id?: number;
    LMBANO_Id: number;
    LMB_Id: number;
    LMB_BookTitle: string;
    LMB_Price: number;
    Issue_Date: Date;
    Due_Date: Date;
    Return_Date: Date;
    Book_Trans_Status: TransactionStatus;
    booktype: BookType;
    issuertype: MemberType;
    maxitem: number;
    bookcat_type: BookCategory;
    FODM_Id?: number;
    // Student specific
    AMST_Id?: number;
    ASMCL_Id?: number;
    // Staff specific
    HRME_Id?: number;
    // Department specific
    HRMD_Id?: number;
    // Guest specific
    LBTR_GuestName?: string;
    LBTR_GuestContactNo?: string;
    LBTR_GuestEmailId?: string;
    // Optional
    pushnotification?: boolean;
    pushnotficationimsg?: string;
}

// Return Book Request
export interface IReturnBookRequest {
    Book_Trans_Id: number;
    LMBANO_Id: number;
    LMB_Id: number;
    Due_Date: string | Date;
    Return_Date: string | Date;
    booktype: BookType;
    issuertype: MemberType;
    bookcat_type: BookCategory;
    LBTR_FineCollected: number;
    FODM_Id?: number;
}

// Renewal Book Request
export interface IRenewalBookRequest {
    Book_Trans_Id: number;
    LMBANO_Id: number;
    LMB_Id: number;
    Issue_Date: string;
    Due_Date: string;
    Return_Date: string;
    Max_No_Renewals: number;
    issuertype: MemberType;
    bookcat_type: BookCategory;
    LBTR_FineCollected: number;
    FODM_Id?: number;
}

// Fine Details
export interface IFineDetails {
    lmB_BookTitle: string;
    lmbanO_AccessionNo: string;
    issue_Date: string;
    due_Date: string;
    finamt: number;
    coll: number;
}

// Book Availability
export interface IBookAvailability {
    TYPENAME: 'STD' | 'STF' | 'DEP' | 'GST' | 'BOOK';
    LMBANO_AvialableStatus?: string;
    // Student fields
    AMST_FirstName?: string;
    AMST_AdmNo?: string;
    ASMCL_ClassName?: string;
    ASMC_SectionName?: string;
    // Staff fields
    HRME_EmployeeFirstName?: string;
    // Department fields
    HRMD_DepartmentName?: string;
    // Guest fields
    LBTR_GuestName?: string;
    LBTR_GuestContactNo?: string;
    LBTR_GuestEmailId?: string;
    // Book fields
    LMB_BookTitle: string;
    LMBANO_AccessionNo: string;
    LMB_BookType: string;
    LBTR_IssuedDate?: string;
    LBTR_DueDate?: string;
    LBTR_ReturnedDate?: string;
    LBTR_Renewalcounter?: number;
}
