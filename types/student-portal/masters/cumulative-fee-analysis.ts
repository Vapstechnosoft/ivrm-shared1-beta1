export interface IAcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
    selected?: boolean;
}

export interface IFeeAnalysisData {
    asmaY_Year: string;
    receivable: number; // RECEIVABLE
    concession: number; // CONCESSION
    collection: number; // COLLECTION
    adjusted: number; // ADJUSTED
    balance: number; // BALANCE
    fmH_Id: number; // FMH_Id
}

export interface IFeeDetailsData {
    fsS_CurrentYrCharges: number;
    fsS_ToBePaid: number;
    fsS_PaidAmount: number;
    fsS_ConcessionAmount: number;
    ftI_Name: string;
    fmH_FeeName: string;
}

export interface ICumulativeFeeAnalysisData {
    acdlist: IAcademicYear[];
    feeAnalysisList: IFeeAnalysisData[];
    studentfeedetails: IFeeDetailsData[];
}

export interface IApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    total: number | null;
    page: number | null;
    page_size: number | null;
}
