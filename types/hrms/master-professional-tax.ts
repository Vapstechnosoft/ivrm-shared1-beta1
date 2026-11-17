export interface MasterProfessionalTaxResponse {
    success?: boolean;
    message?: string;
    data?: ProfessionalTaxDetail[] | {
        pTaxrList: ProfessionalTaxDetail[];
    };
    pTaxrList?: ProfessionalTaxDetail[];
    retrunMsg?: string;
    total?: number;
    page?: number;
    page_size?: number;
}

export interface ProfessionalTaxDetail {
    HRMPT_Id: number;
    MI_Id: number;
    HRMPT_SalaryFrom: number;
    HRMPT_SalaryTo: number;
    HRMPT_PTax: number;
    HRMPT_ActiveFlag: boolean;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface MasterProfessionalTaxInput {
    HRMPT_Id?: number;
    MI_Id: number;
    HRMPT_SalaryFrom: number;
    HRMPT_SalaryTo: number;
    HRMPT_PTax: number;
    HRMPT_ActiveFlag: boolean;
}
