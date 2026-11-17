export interface AcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface Category {
    ttmC_Id: number;
    ttmC_CategoryName: string;
}

export interface TotalNoOfPeriods {
    asmcL_Id: number;
    asmcL_TotalNoOfPeriods: string;
}

export interface TotalNoOfPeriodsAllotted {
    asms_Id: number;
    asms_TotalNoOfPeriodsAllotted: string;
}

export interface TotalNoOfperiodNotallotted {
    hrmE_Id: number;
    TotalNoofperiodallotted: string;
}

export interface GenerationMasters {
    years: AcademicYear[];
    categories: Category[];
    TotalNoOfPeriods: TotalNoOfPeriods[];
    TotalNoOfPeriodsAllotted: TotalNoOfPeriodsAllotted[];
    TotalNoOfperiodNotallotted: TotalNoOfperiodNotallotted[];
}
