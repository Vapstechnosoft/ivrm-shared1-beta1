
export interface IHouseInchargeReportLoadData {
    asmay_list: IYear[];
}

export interface IYear {
    asmaY_Id: number;
    asmaY_Year: string;
    // Add other fields if needed
}

export interface IHouseInchargeReportHouses {
    houseList: IHouse[];
}

export interface IHouse {
    spccmH_Id: number;
    spccmH_HouseName: string;
}

export interface IHouseInchargeReportRequest {
    asmaY_Id: number;
    selectedhouselist: { spccmH_Id: number }[];
}

export interface IHouseInchargeReportData {
    id: number;
    SPCCMH_HouseName: string;
    ASMAY_Year: string;
    EmpName: string;
    HRME_MobileNo: string;
    HRME_EmployeeCode: string;
    HRME_EmailId: string;
    HRMDES_DesignationName: string;
    HRMD_DepartmentName: string;
}
