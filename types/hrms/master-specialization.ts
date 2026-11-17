export interface MasterSpecializationResponse {
    success?: boolean;
    message?: string;
    data?: SpecializationItem[] | {
        alldata: SpecializationItem[];
    };
    alldata?: SpecializationItem[];
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

export interface SpecializationItem {
    HRMSPL_Id: number;
    MI_Id: number;
    HRMSPL_SpecialisationName: string;
    HRMSPL_ActiveFlg: boolean;
    HRMSPL_CreatedDate: string;
    HRMSPL_UpdatedDate: string;
}

export interface MasterSpecializationInput {
    HRMSPL_Id?: number;
    MI_Id: number;
    HRMSPL_SpecialisationName: string;
    HRMSPL_ActiveFlg: boolean;
}
