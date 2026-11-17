export interface ILostBookGrid {
    slno: number;
    fmI_Id: number;
    amsT_Id: number;
    studentName: string;
    amsT_AdmNo: number;
    asmcL_ClassName: string;
    asmaY_Year: string;
    fmG_GroupName: string;
    fmH_FeeName: string;
    ftI_Name: string;
    fmcC_ConcessionName: string;
    fsC_ConcessionAmount: number;
    fsC_Id: number;
    asmaY_Id: number;
    fscI_ID: number;
}

// types/lost-book.ts
export interface ILostBookList {
    lmB_Id: number;
    lmB_BookTitle: string;
    lmbanO_Id: number;
    lmbanO_AccessionNo: string;
    lmbanO_AvialableStatus: string;
    lbtR_Id?: number;
    std?: string;
    lmbanO_AmountCollected?: number;
    lmbanO_ModeOfPayment?: string;
    lmbanO_LostDamagedReason?: string;
    lmbanO_LostDamagedDate?: string;
    lmB_ActiveFlag?: boolean;
    staff?: string;
    dept?: string;
}

export interface BookOption {
    lmB_Id: number;
    mI_Id: number;
    lmB_BookTitle: string;
    lmC_Id: number;
    lmbanO_Id: number;
    lmbanO_AccessionNo: string;
}

export interface AuthorOption {
    lmB_Id: number;
    lmbanO_Id: number;
    authorName: string;
}

export interface APIResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    total?: number;
    page?: number;
    page_size?: number;
}

export interface LostBookFormData {
    lmbanO_Id: number | null;
    lmbanO_LostDamagedDate: string;
    lmbanO_LostDamagedReason: string;
    lmbanO_AmountCollected: string;
    lmbanO_ModeOfPayment: string;
    lmbanO_AvialableStatus: string;
    lmB_Id?: number;
    LMAU_Id?: number;
}

export interface IBookRegisterList {
    // Main fields from API response
    lmB_Id: number; // Book ID
    lmbanO_Id: number; // Accession ID
    lmB_BookTitle: string; // Book Title
    lmbanO_AccessionNo: string; // Accession Number
    purchase_Date: string | null; // Purchase Date
    lmD_DepartmentName: string; // Department Name
    lmL_LanguageName: string; // Language Name
    lmbanO_AvialableStatus: string; // Availability Status
    lmB_Price: number; // Book Price
    lmB_BookType: string; // Book Type
    lmS_SubjectName: string; // Subject Name
    source_Type: string; // Source Type (Purchased/Donated)
    lmP_PublisherName: string; // Publisher Name
    mB_ActiveFlag: boolean; // Active Flag
    lmrA_RackName: string; // Rack Name
    lmrA_Id: number | null; // Rack ID
    authoR_FullName: string; // Author Full Name
    lmaU_AuthorFirstName: string; // Author First Name
    lmB_FirstSummary?: string;
    lmB_SecondSummary?: string;
    lmB_ThirdSummary?: string | number;

    lmB_PublishedYear?: number | null; // Published Year
    lmaU_AuthorMiddleName?: string | null; // Author Middle Name
    lmaU_AuthorLastName?: string | null; // Author Last Name
    LMB_ActiveFlag?: boolean; // Alternative active flag (if different from mB_ActiveFlag)

    [key: string]: any; // For any additional fields
}

// You might also want a response interface
export interface IBookRegisterResponse {
    success: boolean;
    message: string;
    data: IBookRegisterList[];
    total?: number;
    page?: number;
    page_size?: number;
}

// If you need a form interface for creating/updating
export interface IBookRegisterForm {
    lmB_BookTitle: string;
    lmbanO_AccessionNo: string;
    lmD_DepartmentName: string;
    lmL_LanguageName: string;
    lmS_SubjectName: string;
    lmP_PublisherName: string;
    lmrA_RackName: string;
    authoR_FullName: string;
    lmB_Price: number;
    lmB_BookType: string;
    source_Type: string;
    purchase_Date?: string;
    lmB_PublishedYear?: number;
    mB_ActiveFlag?: boolean;
    lmaU_AuthorFirstName?: string;
    lmaU_AuthorMiddleName?: string;
    lmaU_AuthorLastName?: string;
}

// For API request parameters
export interface IBookRegisterParams {
    page?: number;
    page_size?: number;
    search_column?: string;
    search_query?: string;
    sort_column?: string;
    sort_direction?: string;
}
