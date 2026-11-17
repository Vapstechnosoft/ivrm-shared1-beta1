export interface MasterLoanResponse {
    success?: boolean;
    message?: string;
    data?: MasterLoanDetail[] | {
        gmasterloanList: MasterLoanDetail[];
    };
    gmasterloanList?: MasterLoanDetail[];
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

export interface MasterLoanDetail {
    HRMLN_Id: number;
    MI_Id: number;
    HRML_LoanType: string;
    HRML_Max: number;
    HRMLN_ActiveFlag: boolean;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface MasterLoanInput {
    HRMLN_Id?: number;
    MI_Id: number;
    HRML_LoanType: string;
    HRML_Max: number;
    HRMLN_ActiveFlag: boolean;
}
