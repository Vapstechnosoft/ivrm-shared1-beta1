export interface AcademicYear {
    ASMAY_Id: number;
    ASMAY_Year: string;
    ASMCL_ClassName?: string;
    ASMC_SectionName?: string;
}

export interface FeeHeadData {
    fmH_FeeName: string;
    ftI_Name: string;
    fsS_CurrentYrCharges: number;
    fsS_ToBePaid: number;
    fsS_PaidAmount: number;
    fsS_ConcessionAmount: number;
}

// Legacy API response structure often uses PascalCase or mixed case, matching the user's provided code
export interface FeeDetailsOverallData {
    asmaY_Id: number;
    asmaY_Year: string;
    receivable: number;
    concession: number;
    collection: number;
    adjusted: number;
    balance: number;
    netReceivable: number;
    netBalance: number;
}

export interface FeeDetailsLoadData {
    yearclsList: AcademicYear[];
    feecurrentyear: AcademicYear[];
}

export interface FeeDetailsRequest {
    ASMAY_Id: number;
    type: 'overall' | 'detailed';
}

export interface FeeDetailsResponse {
    getfeedetails: (FeeHeadData & FeeDetailsOverallData)[]; // The API seems to return a mixed object or different objects based on type
}
