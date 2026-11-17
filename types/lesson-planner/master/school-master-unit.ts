export interface IMasterSchoolUnit {
    lpmU_Id: number;
    lpmU_UnitName: string;
    lpmU_UnitDescription: string;
    lpmU_TotalPeriods: number;
    lpmU_TotalHrs: string;
    lpmU_Order: number;
    lpmU_ActiveFlag: boolean;
    mI_Id?: number;
}

export interface IMasterSchoolUnitDataResponse {
    getdetails: IMasterSchoolUnit[];
    geteditdetails?: IMasterSchoolUnit[];
    returnval?: boolean;
    message?: string;
}

export interface IMasterSchoolUnitResponse {
    success: boolean;
    message: string;
    data: IMasterSchoolUnitDataResponse | IMasterSchoolUnit[];
    total?: number;
    page?: number;
    page_size?: number;
    mI_Id?: number;
    userId?: number;
}

export interface IMasterSchoolUnitOrder {
    lpmU_Id: number;
    lpmU_Order: number;
}
