export interface AcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
    Selected?: boolean;
}

export interface COEReport {
    coemE_EventName: string;
    coemE_EventDesc: string;
    coeE_EStartDate: string;
    coeE_EEndDate: string;
    FMH_Id: number;
}

export interface COELoadData {
    coeyearlist: AcademicYear[];
    currentyear: AcademicYear[];
}

export interface COEDataPayload {
    ASMAY_Id: number;
    month: string;
}

export interface COEDataResponse {
    coereportlist: COEReport[];
}
